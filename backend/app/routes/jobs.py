"""Job endpoints for CampusConnect."""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlmodel import Session
from app.database import get_session
from app.models import JobRead
from app import crud

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.get("", response_model=List[JobRead], response_model_exclude_none=False)
def list_jobs(
    skills: Optional[str] = Query(
        default=None,
        description="Filter jobs by skills (e.g. 'Billing & POS', 'Design', comma-separated)",
    ),
    location: Optional[str] = Query(
        default=None,
        description="Filter jobs by location (area, city, or state, e.g. 'Bengaluru', 'Koramangala')",
    ),
    availability: Optional[str] = Query(
        default=None,
        description="Filter jobs by availability or days needed (e.g. 'Mon', 'Weekend', 'Sat')",
    ),
    limit: Optional[int] = Query(
        default=None,
        ge=1,
        le=100,
        description="Maximum number of jobs to return",
    ),
    session: Session = Depends(get_session),
) -> List[JobRead]:
    """Retrieve all part-time job postings with optional skills, location, and availability filters."""
    jobs = crud.search_jobs(
        session=session,
        skills=skills,
        location=location,
        availability=availability,
        limit=limit,
    )
    return jobs


@router.get("/{job_id}", response_model=JobRead)
def get_job(
    job_id: str,
    session: Session = Depends(get_session),
) -> JobRead:
    """Retrieve complete details for a specific job by its ID or shopkeeper ID."""
    job = crud.get_job_by_id(session=session, job_id=job_id)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job with ID '{job_id}' not found",
        )
    return job
