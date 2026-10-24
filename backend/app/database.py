"""Database configuration and session management for CampusConnect.

Uses SQLModel on SQLite by default, reading the connection string from DATABASE_URL
so it can seamlessly switch to PostgreSQL in production environments.
"""

import os
from contextlib import contextmanager
from typing import Generator
from dotenv import load_dotenv
from sqlmodel import Session, SQLModel, create_engine

# Load environment variables from .env if present
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./campusconnect.db")

# SQLite requires check_same_thread=False for multi-threaded FastAPI workers
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args=connect_args,
)


def create_db_and_tables() -> None:
    """Create all database tables based on registered SQLModel metadata."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """FastAPI dependency for yielding database sessions."""
    with Session(engine) as session:
        yield session


@contextmanager
def get_db_context() -> Generator[Session, None, None]:
    """Standalone context manager for background tasks, scripts, and MCP tools."""
    with Session(engine) as session:
        yield session
