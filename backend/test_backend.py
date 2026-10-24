"""Automated test suite verifying REST endpoints and MCP Streamable HTTP server."""

import asyncio
import json
import os
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

import httpx
from app.main import app, lifespan

MCP_KEY = os.getenv("MCP_API_KEY", "campusconnect-secret-mcp-key")


async def run_tests():
    print("=" * 60)
    print("CampusConnect Backend & MCP Server Verification")
    print("=" * 60)

    async with lifespan(app):
        transport = httpx.ASGITransport(app=app)
        async with httpx.AsyncClient(transport=transport, base_url="http://127.0.0.1:8000") as client:

            # 1. Health check
            resp = await client.get("/health")
            assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
            print("[PASS] GET /health -> 200 OK:", resp.json())

            # 2. GET /jobs (All)
            resp = await client.get("/jobs")
            assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
            jobs = resp.json()
            assert len(jobs) == 8, f"Expected 8 jobs, got {len(jobs)}"
            print(f"[PASS] GET /jobs -> 200 OK ({len(jobs)} jobs loaded)")

            # 3. GET /jobs with skills filter
            resp = await client.get("/jobs?skills=billing")
            assert resp.status_code == 200
            billing_jobs = resp.json()
            assert len(billing_jobs) > 0
            print(f"[PASS] GET /jobs?skills=billing -> 200 OK ({len(billing_jobs)} matching jobs)")

            # 4. GET /jobs with location filter
            resp = await client.get("/jobs?location=Bengaluru")
            assert resp.status_code == 200
            blr_jobs = resp.json()
            assert len(blr_jobs) > 0
            print(f"[PASS] GET /jobs?location=Bengaluru -> 200 OK ({len(blr_jobs)} matching jobs)")

            # 5. GET /jobs with availability filter
            resp = await client.get("/jobs?availability=Weekend")
            assert resp.status_code == 200
            weekend_jobs = resp.json()
            assert len(weekend_jobs) > 0
            print(f"[PASS] GET /jobs?availability=Weekend -> 200 OK ({len(weekend_jobs)} matching jobs)")

            # 6. GET /jobs/{id}
            resp = await client.get("/jobs/shp-1")
            assert resp.status_code == 200
            job1 = resp.json()
            assert job1["id"] == "shp-1"
            assert "shop" in job1 and job1["shop"]["shopName"] == "Sri Venkateshwara Supermarket & Kirana"
            print("[PASS] GET /jobs/shp-1 -> 200 OK:", job1["title"], "at", job1["shop"]["shopName"])

            # 7. GET /students/{id}
            resp = await client.get("/students/std-1")
            assert resp.status_code == 200
            std1 = resp.json()
            assert std1["id"] == "std-1"
            assert std1["name"] == "Aarav Sharma"
            print("[PASS] GET /students/std-1 -> 200 OK:", std1["name"], "from", std1["collegeName"])

            # 8. GET /shops/{id}
            resp = await client.get("/shops/shp-3")
            assert resp.status_code == 200
            shp3 = resp.json()
            assert shp3["id"] == "shp-3"
            assert shp3["shopName"] == "Green Leaf Organic Cafe & Bakery"
            print("[PASS] GET /shops/shp-3 -> 200 OK:", shp3["shopName"])

            # ================= MCP PROTOCOL TESTS =================
            print("\n" + "-" * 40)
            print("Verifying Streamable HTTP MCP Server at /mcp")
            print("-" * 40)

            # 9. MCP Auth: missing token
            init_payload = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "initialize",
                "params": {
                    "protocolVersion": "2024-11-05",
                    "capabilities": {},
                    "clientInfo": {"name": "test-client", "version": "1.0"},
                },
            }
            resp = await client.post("/mcp", json=init_payload)
            assert resp.status_code == 401, f"Expected 401, got {resp.status_code}"
            print("[PASS] POST /mcp without token rejected with 401 Unauthorized")

            # 10. MCP Auth: invalid token
            resp = await client.post(
                "/mcp",
                json=init_payload,
                headers={"Authorization": "Bearer wrong-key"},
            )
            assert resp.status_code == 401, f"Expected 401, got {resp.status_code}"
            print("[PASS] POST /mcp with invalid token rejected with 401 Unauthorized")

            # 11. MCP Auth & Initialize with valid token
            auth_headers = {
                "Authorization": f"Bearer {MCP_KEY}",
                "Accept": "application/json, text/event-stream",
            }
            resp = await client.post("/mcp", json=init_payload, headers=auth_headers)
            assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
            print("[PASS] POST /mcp initialize with Bearer auth -> 200 OK")

            # 12. MCP tools/list
            list_tools_payload = {
                "jsonrpc": "2.0",
                "id": 2,
                "method": "tools/list",
                "params": {},
            }
            resp = await client.post("/mcp", json=list_tools_payload, headers=auth_headers)
            assert resp.status_code == 200
            # Parse SSE or JSON response
            body_text = resp.text
            assert "search_jobs" in body_text
            assert "get_job_details" in body_text
            assert "get_student_profile" in body_text
            print("[PASS] MCP tools/list successfully exposes: search_jobs, get_job_details, get_student_profile")

            # 13. MCP tool call: search_jobs
            call_search_payload = {
                "jsonrpc": "2.0",
                "id": 3,
                "method": "tools/call",
                "params": {
                    "name": "search_jobs",
                    "arguments": {"location": "Bengaluru", "limit": 2},
                },
            }
            resp = await client.post("/mcp", json=call_search_payload, headers=auth_headers)
            assert resp.status_code == 200
            assert "Sri Venkateshwara Supermarket & Kirana" in resp.text
            # STRICT PRIVACY CHECK: NO contact numbers or emails
            assert "+91 98450 99881" not in resp.text
            print("[PASS] MCP tool 'search_jobs' returned jobs without exposing phone numbers or secrets")

            # 14. MCP tool call: get_job_details
            call_job_details_payload = {
                "jsonrpc": "2.0",
                "id": 4,
                "method": "tools/call",
                "params": {
                    "name": "get_job_details",
                    "arguments": {"job_id": "shp-3"},
                },
            }
            resp = await client.post("/mcp", json=call_job_details_payload, headers=auth_headers)
            assert resp.status_code == 200
            assert "Green Leaf Organic Cafe & Bakery" in resp.text
            # STRICT PRIVACY CHECK: NO phone number
            assert "+91 99220 33412" not in resp.text
            print("[PASS] MCP tool 'get_job_details' returned details without private phone numbers")

            # 15. MCP tool call: get_student_profile
            call_student_profile_payload = {
                "jsonrpc": "2.0",
                "id": 5,
                "method": "tools/call",
                "params": {
                    "name": "get_student_profile",
                    "arguments": {"student_id": "std-1"},
                },
            }
            resp = await client.post("/mcp", json=call_student_profile_payload, headers=auth_headers)
            assert resp.status_code == 200
            assert "Aarav Sharma" in resp.text
            # STRICT PRIVACY CHECK: NO phone number
            assert "+91 98451 22345" not in resp.text
            print("[PASS] MCP tool 'get_student_profile' returned profile without student phone number")

    print("\n" + "=" * 60)
    print("ALL TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(run_tests())
