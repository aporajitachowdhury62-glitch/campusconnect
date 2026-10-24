"""Student endpoints for CampusConnect."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from app.models import Student
from app import crud

router = APIRouter(prefix="/students", tags=["Students"])


@router.get("", response_model=List[Student])
def list_students(
    session: Session = Depends(get_session),
) -> List[Student]:
    """Retrieve all student profiles registered on CampusConnect."""
    return session.exec(select(Student)).all()


@router.get("/{student_id}", response_model=Student)
def get_student(
    student_id: str,
    session: Session = Depends(get_session),
) -> Student:
    """Retrieve full profile details for a student by their ID."""
    student = crud.get_student_by_id(session=session, student_id=student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Student with ID '{student_id}' not found",
        )
    return student
