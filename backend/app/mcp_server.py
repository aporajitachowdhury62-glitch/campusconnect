"""Model Context Protocol (MCP) Streamable HTTP Server for CampusConnect.

Provides AI agents with safe, read-only tools to search jobs, get job specifications,
and inspect verified student profiles without exposing sensitive PII (emails, phone numbers).
"""

from typing import Any, Dict, List, Optional
from app.database import get_db_context
from app import crud

# Support both mcp 2.x (MCPServer) and mcp 1.x (FastMCP)
try:
    from mcp.server.mcpserver import MCPServer
except ImportError:
    from mcp.server.fastmcp import FastMCP as MCPServer

# Initialize FastMCP / MCPServer instance
mcp_server = MCPServer(
    name="CampusConnect-MCP",
    instructions=(
        "CampusConnect MCP server provides read-only access to hyperlocal part-time jobs "
        "and student talent across college campus vicinities."
    ),
)


@mcp_server.tool()
def search_jobs(
    skills: Optional[str] = None,
    location: Optional[str] = None,
    availability: Optional[str] = None,
    limit: int = 10,
) -> List[Dict[str, Any]]:
    """Search available part-time student jobs at local shops.

    Args:
        skills: Optional comma-separated skills (e.g. 'Billing & POS', 'Design', 'Tally').
        location: Optional location query matching city, area, or state (e.g. 'Bengaluru', 'Koramangala').
        availability: Optional availability requirement (e.g. 'Weekend', 'Sat', 'Mon').
        limit: Maximum number of jobs to return (default 10).

    Returns:
        Compact list of matching jobs with public shop information. Never returns private contacts or secrets.
    """
    with get_db_context() as session:
        jobs = crud.search_jobs(
            session=session,
            skills=skills,
            location=location,
            availability=availability,
            limit=limit,
        )

        results: List[Dict[str, Any]] = []
        for job in jobs:
            shop = job.shop
            results.append({
                "job_id": job.id,
                "title": job.title,
                "help_needed": job.help_needed,
                "skills_required": job.skills_required or [],
                "days_needed": job.days_needed or [],
                "hours_per_day": job.hours_per_day,
                "total_hours_per_week": job.total_hours_per_week,
                "pay_estimate": job.pay_estimate,
                "shop_name": shop.shop_name if shop else None,
                "category": shop.category if shop else None,
                "area": shop.area if shop else None,
                "city": shop.city if shop else None,
                "state": shop.state if shop else None,
                "avg_rating": shop.avg_rating if shop else None,
                "is_top_rated": shop.is_top_rated if shop else False,
                "qa_status": shop.qa_status if shop else None,
            })
        return results


@mcp_server.tool()
def get_job_details(job_id: str) -> Dict[str, Any]:
    """Retrieve complete specifications for a specific job opening.

    Args:
        job_id: The unique identifier of the job (or associated shopkeeper ID).

    Returns:
        Structured job details with shop profile. Contact phone numbers and secrets are strictly excluded.
    """
    with get_db_context() as session:
        job = crud.get_job_by_id(session=session, job_id=job_id)
        if not job:
            return {"error": f"Job with ID '{job_id}' not found."}

        shop = job.shop
        return {
            "job_id": job.id,
            "title": job.title,
            "help_needed": job.help_needed,
            "custom_help_needed": job.custom_help_needed,
            "skills_required": job.skills_required or [],
            "days_needed": job.days_needed or [],
            "hours_per_day": job.hours_per_day,
            "total_hours_per_week": job.total_hours_per_week,
            "pay_estimate": job.pay_estimate,
            "created_at": job.created_at,
            "shop": {
                "id": shop.id,
                "shop_name": shop.shop_name,
                "owner_name": shop.owner_name,
                "category": shop.category,
                "area": shop.area,
                "city": shop.city,
                "state": shop.state,
                "qa_status": shop.qa_status,
                "qa_verified_at": shop.qa_verified_at,
                "avg_rating": shop.avg_rating,
                "rating_count": shop.rating_count,
                "is_top_rated": shop.is_top_rated,
                "qc_score": shop.qc_score,
            } if shop else None,
        }


@mcp_server.tool()
def get_student_profile(student_id: str) -> Dict[str, Any]:
    """Retrieve public student talent profile and skills for part-time hiring evaluation.

    Args:
        student_id: The unique ID of the student (e.g. 'std-1').

    Returns:
        Student profile including education, skills, availability, and rating.
        Phone numbers, emails, and sensitive personal identifiers are strictly omitted.
    """
    with get_db_context() as session:
        student = crud.get_student_by_id(session=session, student_id=student_id)
        if not student:
            return {"error": f"Student with ID '{student_id}' not found."}

        return {
            "student_id": student.id,
            "name": student.name,
            "age": student.age,
            "college_name": student.college_name,
            "qualification": student.qualification,
            "custom_qualification": student.custom_qualification,
            "area": student.area,
            "city": student.city,
            "state": student.state,
            "skills": student.skills or [],
            "preferred_work_type": student.preferred_work_type,
            "custom_work_type": student.custom_work_type,
            "preferred_time_of_day": student.preferred_time_of_day or [],
            "days_available": student.days_available or [],
            "hours_per_day": student.hours_per_day,
            "total_hours_per_week": student.total_hours_per_week,
            "avg_rating": student.avg_rating,
            "rating_count": student.rating_count,
            "is_top_rated": student.is_top_rated,
            "created_at": student.created_at,
        }


# Construct Streamable HTTP ASGI sub-application in stateless mode
mcp_asgi_app = mcp_server.streamable_http_app(streamable_http_path="/", stateless_http=True)
