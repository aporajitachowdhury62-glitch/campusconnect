"""API routes package for CampusConnect."""

from fastapi import APIRouter
from app.routes.jobs import router as jobs_router
from app.routes.students import router as students_router
from app.routes.shops import router as shops_router

api_router = APIRouter()
api_router.include_router(jobs_router)
api_router.include_router(students_router)
api_router.include_router(shops_router)

__all__ = ["api_router", "jobs_router", "students_router", "shops_router"]
