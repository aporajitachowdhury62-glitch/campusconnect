"""FastAPI application for CampusConnect hyperlocal jobs platform.

Includes:
- Relational SQLite/PostgreSQL models and read-only REST endpoints
- CORS support for React frontend
- Streamable HTTP MCP (Model Context Protocol) server mounted at /mcp
- Bearer API key protection for the /mcp endpoint
"""

import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import create_db_and_tables
from app.mcp_server import mcp_asgi_app, mcp_server
from app.routes import api_router

# Load environment configuration
load_dotenv()

MCP_API_KEY = os.getenv("MCP_API_KEY", "campusconnect-secret-mcp-key")
CORS_ORIGINS_RAW = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000",
)
CORS_ORIGINS = [orig.strip() for orig in CORS_ORIGINS_RAW.split(",") if orig.strip()]


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan managing database tables and the MCP session manager."""
    # Initialize database tables
    create_db_and_tables()

    # Wire in the FastMCP Streamable HTTP session manager lifespan
    async with mcp_server.session_manager.run():
        yield


app = FastAPI(
    title="CampusConnect API",
    description="Backend API and MCP Server connecting students with hyperlocal part-time jobs at local shopkeepers.",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MCPAuthAndRoutingMiddleware:
    """Intercepts and secures the Streamable HTTP /mcp endpoint with Bearer authentication."""

    def __init__(self, asgi_app, mcp_app, api_key: str):
        self.app = asgi_app
        self.mcp_app = mcp_app
        self.api_key = api_key

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http" and (scope["path"] == "/mcp" or scope["path"].startswith("/mcp/")):
            # Allow OPTIONS preflight for CORS without auth rejection
            if scope["method"] != "OPTIONS":
                headers = dict(scope.get("headers", []))
                auth_val = headers.get(b"authorization", b"").decode("utf-8")
                expected = f"Bearer {self.api_key}"
                if not auth_val or auth_val.strip() != expected:
                    body = b'{"detail": "Unauthorized: Invalid or missing Bearer token for MCP endpoint"}'
                    await send({
                        "type": "http.response.start",
                        "status": 401,
                        "headers": [
                            (b"content-type", b"application/json"),
                            (b"content-length", str(len(body)).encode("ascii")),
                        ],
                    })
                    await send({"type": "http.response.body", "body": body})
                    return

            # Route requests directly to the Streamable HTTP MCP sub-application
            subpath = scope["path"][4:] or "/"
            new_scope = dict(scope)
            new_scope["path"] = subpath
            new_scope["raw_path"] = subpath.encode("ascii")
            return await self.mcp_app(new_scope, receive, send)

        return await self.app(scope, receive, send)


# Add the MCP middleware
app.add_middleware(MCPAuthAndRoutingMiddleware, mcp_app=mcp_asgi_app, api_key=MCP_API_KEY)

# Register REST endpoints (/jobs, /students, /shops)
app.include_router(api_router)


@app.get("/", tags=["Health"])
def root():
    """Welcome and status endpoint."""
    return {
        "name": "CampusConnect Backend API",
        "status": "online",
        "docs_url": "/docs",
        "mcp_url": "/mcp",
    }


@app.get("/health", tags=["Health"])
def health_check():
    """Service health check."""
    return {"status": "ok"}
