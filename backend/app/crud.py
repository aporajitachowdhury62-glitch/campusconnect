"""Reusable database queries for CampusConnect.

Shared by both FastAPI REST endpoints and the MCP server tools to guarantee
identical behavior and business logic across API and AI agent interfaces.
"""

from typing import List, Optional
from sqlmodel import Session, select
from app.models import Job, Shop, Student


def search_jobs(
    session: Session,
    skills: Optional[str] = None,
    location: Optional[str] = None,
    availability: Optional[str] = None,
    limit: Optional[int] = None,
) -> List[Job]:
    """Search and filter jobs with shop information based on skills, location, and availability."""
    statement = select(Job)
    jobs = session.exec(statement).all()

    filtered_jobs: List[Job] = []

    for job in jobs:
        # 1. Skills filter: check against required skills or helpNeeded title
        if skills:
            query_skills = [s.strip().lower() for s in skills.split(",") if s.strip()]
            job_skills = [s.lower() for s in (job.skills_required or [])]
            help_needed = (job.help_needed or "").lower()
            title = (job.title or "").lower()

            matches_skill = any(
                any(qs in js for js in job_skills)
                or qs in help_needed
                or qs in title
                for qs in query_skills
            )
            if not matches_skill:
                continue

        # 2. Location filter: check against shop's city, area, and state
        if location:
            loc_query = location.strip().lower()
            shop = job.shop
            if not shop:
                continue
            city = (shop.city or "").lower()
            area = (shop.area or "").lower()
            state = (shop.state or "").lower()
            if loc_query not in city and loc_query not in area and loc_query not in state:
                continue

        # 3. Availability filter: check against days_needed or weekend keywords
        if availability:
            avail_query = availability.strip().lower()
            job_days = [d.lower() for d in (job.days_needed or [])]

            if "weekend" in avail_query:
                is_avail = "sat" in job_days or "sun" in job_days
            else:
                is_avail = any(avail_query in d or d in avail_query for d in job_days)

            if not is_avail:
                continue

        filtered_jobs.append(job)

    if limit is not None and limit > 0:
        return filtered_jobs[:limit]

    return filtered_jobs


def get_job_by_id(session: Session, job_id: str) -> Optional[Job]:
    """Retrieve a specific job by its ID or associated shop ID."""
    # First search directly by job ID
    job = session.exec(select(Job).where(Job.id == job_id)).first()
    if job:
        return job
    # Fallback to searching by shop_id (frontend sometimes uses shopkeeper ID as job ID)
    return session.exec(select(Job).where(Job.shop_id == job_id)).first()


def get_student_by_id(session: Session, student_id: str) -> Optional[Student]:
    """Retrieve a student profile by their ID."""
    return session.exec(select(Student).where(Student.id == student_id)).first()


def get_shop_by_id(session: Session, shop_id: str) -> Optional[Shop]:
    """Retrieve a shop by its ID."""
    return session.exec(select(Shop).where(Shop.id == shop_id)).first()
