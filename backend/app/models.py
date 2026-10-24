"""SQLModel models and Pydantic schemas for CampusConnect.

These models accurately reflect the frontend TypeScript entities from:
- frontend/src/types/index.ts
- frontend/src/data/mockData.ts
"""

from typing import List, Optional
from pydantic import ConfigDict
from sqlmodel import Field, Relationship, SQLModel, Column, JSON


class StudentBase(SQLModel):
    name: str
    age: int
    college_name: str = Field(alias="collegeName")
    qualification: str
    custom_qualification: Optional[str] = Field(default=None, alias="customQualification")
    area: str
    city: str
    state: str
    skills: List[str] = Field(default_factory=list, sa_type=JSON)
    preferred_work_type: str = Field(alias="preferredWorkType")
    custom_work_type: Optional[str] = Field(default=None, alias="customWorkType")
    preferred_time_of_day: List[str] = Field(default_factory=list, alias="preferredTimeOfDay", sa_type=JSON)
    days_available: List[str] = Field(default_factory=list, alias="daysAvailable", sa_type=JSON)
    hours_per_day: int = Field(alias="hoursPerDay")
    total_hours_per_week: int = Field(alias="totalHoursPerWeek")
    phone: Optional[str] = None
    created_at: str = Field(alias="createdAt")
    avg_rating: Optional[float] = None
    rating_count: Optional[int] = None
    is_top_rated: Optional[bool] = None

    model_config = ConfigDict(populate_by_name=True)


class Student(StudentBase, table=True):
    __tablename__ = "students"

    id: str = Field(primary_key=True)


class StudentPublicRead(SQLModel):
    """Safe student profile representation excluding sensitive phone numbers."""
    id: str
    name: str
    age: int
    college_name: str = Field(alias="collegeName")
    qualification: str
    custom_qualification: Optional[str] = Field(default=None, alias="customQualification")
    area: str
    city: str
    state: str
    skills: List[str]
    preferred_work_type: str = Field(alias="preferredWorkType")
    custom_work_type: Optional[str] = Field(default=None, alias="customWorkType")
    preferred_time_of_day: List[str] = Field(alias="preferredTimeOfDay")
    days_available: List[str] = Field(alias="daysAvailable")
    hours_per_day: int = Field(alias="hoursPerDay")
    total_hours_per_week: int = Field(alias="totalHoursPerWeek")
    created_at: str = Field(alias="createdAt")
    avg_rating: Optional[float] = None
    rating_count: Optional[int] = None
    is_top_rated: Optional[bool] = None

    model_config = ConfigDict(populate_by_name=True)


class ShopBase(SQLModel):
    shop_name: str = Field(alias="shopName")
    owner_name: str = Field(alias="ownerName")
    category: str
    custom_category: Optional[str] = Field(default=None, alias="customCategory")
    area: str
    city: str
    state: str
    contact_number: str = Field(alias="contactNumber")
    created_at: str = Field(alias="createdAt")
    qa_status: Optional[str] = None
    qa_verified_at: Optional[str] = None
    avg_rating: Optional[float] = None
    rating_count: Optional[int] = None
    is_top_rated: Optional[bool] = None
    qc_score: Optional[float] = None
    qc_review_count: Optional[int] = None

    model_config = ConfigDict(populate_by_name=True)


class Shop(ShopBase, table=True):
    __tablename__ = "shops"

    id: str = Field(primary_key=True)

    # Relationship to jobs posted by this shop
    jobs: List["Job"] = Relationship(back_populates="shop")


class ShopRead(ShopBase):
    id: str


class ShopPublicRead(SQLModel):
    """Public shop profile excluding private contact numbers."""
    id: str
    shop_name: str = Field(alias="shopName")
    owner_name: str = Field(alias="ownerName")
    category: str
    custom_category: Optional[str] = Field(default=None, alias="customCategory")
    area: str
    city: str
    state: str
    created_at: str = Field(alias="createdAt")
    qa_status: Optional[str] = None
    qa_verified_at: Optional[str] = None
    avg_rating: Optional[float] = None
    rating_count: Optional[int] = None
    is_top_rated: Optional[bool] = None
    qc_score: Optional[float] = None
    qc_review_count: Optional[int] = None

    model_config = ConfigDict(populate_by_name=True)


class JobBase(SQLModel):
    shop_id: str = Field(foreign_key="shops.id", alias="shopId")
    title: str
    help_needed: str = Field(alias="helpNeeded")
    custom_help_needed: Optional[str] = Field(default=None, alias="customHelpNeeded")
    skills_required: List[str] = Field(default_factory=list, alias="skillsRequired", sa_type=JSON)
    days_needed: List[str] = Field(default_factory=list, alias="daysNeeded", sa_type=JSON)
    hours_per_day: int = Field(alias="hoursPerDay")
    total_hours_per_week: int = Field(alias="totalHoursPerWeek")
    pay_estimate: Optional[str] = Field(default=None, alias="payEstimate")
    created_at: str = Field(alias="createdAt")

    model_config = ConfigDict(populate_by_name=True)


class Job(JobBase, table=True):
    __tablename__ = "jobs"

    id: str = Field(primary_key=True)

    # Relationship to Shop
    shop: Optional[Shop] = Relationship(back_populates="jobs")


class JobRead(JobBase):
    id: str
    shop: Optional[ShopRead] = None


class JobPublicRead(SQLModel):
    """Enriched Job response without sensitive shopkeeper contact number."""
    id: str
    shop_id: str = Field(alias="shopId")
    title: str
    help_needed: str = Field(alias="helpNeeded")
    custom_help_needed: Optional[str] = Field(default=None, alias="customHelpNeeded")
    skills_required: List[str] = Field(alias="skillsRequired")
    days_needed: List[str] = Field(alias="daysNeeded")
    hours_per_day: int = Field(alias="hoursPerDay")
    total_hours_per_week: int = Field(alias="totalHoursPerWeek")
    pay_estimate: Optional[str] = Field(default=None, alias="payEstimate")
    created_at: str = Field(alias="createdAt")
    shop: Optional[ShopPublicRead] = None

    model_config = ConfigDict(populate_by_name=True)
