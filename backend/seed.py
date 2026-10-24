"""Database seeding script for CampusConnect.

Loads the frontend mock data from `frontend/src/data/mockData.ts` into SQLite/PostgreSQL.
Ensures student talent, shopkeeper venues, and job openings match exact frontend schemas.
"""

import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from sqlmodel import Session, select
from app.database import create_db_and_tables, engine
from app.models import Job, Shop, Student

INITIAL_STUDENTS = [
    {
        "id": "std-1",
        "name": "Aarav Sharma",
        "age": 20,
        "college_name": "RV College of Engineering",
        "qualification": "B.Tech/B.E.",
        "area": "Koramangala 4th Block",
        "city": "Bengaluru",
        "state": "Karnataka",
        "skills": [
            "Billing & POS",
            "Inventory Management",
            "Basic Excel",
            "English & Hindi Fluency",
        ],
        "preferred_work_type": "Shop/counter assistance",
        "preferred_time_of_day": ["Evening", "Weekends only"],
        "days_available": ["Fri", "Sat", "Sun"],
        "hours_per_day": 4,
        "total_hours_per_week": 12,
        "phone": "+91 98451 22345",
        "created_at": "2026-08-20T10:30:00Z",
        "avg_rating": 4.9,
        "rating_count": 14,
        "is_top_rated": True,
    },
    {
        "id": "std-2",
        "name": "Priya Nambiar",
        "age": 19,
        "college_name": "St. Stephen's College",
        "qualification": "B.Sc/B.Com/B.A.",
        "area": "Kamla Nagar, North Campus",
        "city": "Delhi",
        "state": "Delhi NCR",
        "skills": [
            "Social Media Reels",
            "Canva Design",
            "Copywriting",
            "Customer Interaction",
        ],
        "preferred_work_type": "Social media/basic design",
        "preferred_time_of_day": ["Afternoon", "Evening"],
        "days_available": ["Mon", "Tue", "Thu", "Sat"],
        "hours_per_day": 3,
        "total_hours_per_week": 12,
        "phone": "+91 98112 33456",
        "created_at": "2026-08-21T14:15:00Z",
        "avg_rating": 4.8,
        "rating_count": 9,
        "is_top_rated": True,
    },
    {
        "id": "std-3",
        "name": "Rohan Deshmukh",
        "age": 21,
        "college_name": "Fergusson College",
        "qualification": "B.Sc/B.Com/B.A.",
        "area": "FC Road, Deccan Gymkhana",
        "city": "Pune",
        "state": "Maharashtra",
        "skills": [
            "Fast Typing (60wpm)",
            "Tally Prime",
            "Invoice Data Entry",
            "Filing",
        ],
        "preferred_work_type": "Data entry/billing",
        "preferred_time_of_day": ["Morning", "Afternoon"],
        "days_available": ["Mon", "Wed", "Fri"],
        "hours_per_day": 4,
        "total_hours_per_week": 12,
        "phone": "+91 97654 88901",
        "created_at": "2026-08-22T09:00:00Z",
        "avg_rating": 4.7,
        "rating_count": 11,
        "is_top_rated": True,
    },
    {
        "id": "std-4",
        "name": "Ananya Iyer",
        "age": 22,
        "college_name": "Madras Christian College",
        "qualification": "M.Tech/M.Sc",
        "area": "Tambaram East",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "skills": [
            "Math & Science Tutoring",
            "Patience with Kids",
            "Exam Prep",
            "English Fluency",
        ],
        "preferred_work_type": "Tutoring",
        "preferred_time_of_day": ["Evening"],
        "days_available": ["Mon", "Tue", "Wed", "Thu", "Fri"],
        "hours_per_day": 2,
        "total_hours_per_week": 10,
        "phone": "+91 94440 12890",
        "created_at": "2026-08-23T16:45:00Z",
        "avg_rating": 4.9,
        "rating_count": 8,
        "is_top_rated": True,
    },
    {
        "id": "std-5",
        "name": "Vikram Joshi",
        "age": 18,
        "college_name": "Government Polytechnic",
        "qualification": "Class 12/Diploma",
        "area": "HSR Layout Sector 1",
        "city": "Bengaluru",
        "state": "Karnataka",
        "skills": [
            "Two-Wheeler Driving",
            "Hyperlocal Route Knowledge",
            "Parcel Handling",
            "Friendly",
        ],
        "preferred_work_type": "Delivery/errands",
        "preferred_time_of_day": ["Evening", "Weekends only"],
        "days_available": ["Sat", "Sun"],
        "hours_per_day": 6,
        "total_hours_per_week": 12,
        "phone": "+91 99001 77654",
        "created_at": "2026-08-24T11:20:00Z",
        "avg_rating": 4.6,
        "rating_count": 6,
        "is_top_rated": False,
    },
]

INITIAL_SHOPKEEPERS = [
    {
        "id": "shp-1",
        "shop_name": "Sri Venkateshwara Supermarket & Kirana",
        "owner_name": "Subhash Rao",
        "category": "Kirana/general store",
        "area": "Koramangala 4th Block",
        "city": "Bengaluru",
        "state": "Karnataka",
        "help_needed": "Shop/counter assistance",
        "skills_required": [
            "Billing & POS",
            "Item Barcoding",
            "Customer Service",
            "Kannada or Hindi",
        ],
        "days_needed": ["Fri", "Sat", "Sun"],
        "hours_per_day": 4,
        "total_hours_per_week": 12,
        "contact_number": "+91 98450 99881",
        "pay_estimate": "₹200/hr + evening snacks",
        "created_at": "2026-08-19T08:30:00Z",
        "avg_rating": 4.9,
        "rating_count": 18,
        "is_top_rated": True,
    },
    {
        "id": "shp-2",
        "shop_name": "Modern Stationery, Xerox & Book House",
        "owner_name": "Harish Mehta",
        "category": "Stationery",
        "area": "Kamla Nagar, North Campus",
        "city": "Delhi",
        "state": "Delhi NCR",
        "help_needed": "Data entry/billing",
        "skills_required": [
            "Photocopy / Spiral Binding",
            "Excel Billing",
            "Customer Queue Handling",
        ],
        "days_needed": ["Mon", "Tue", "Wed", "Thu", "Fri"],
        "hours_per_day": 3,
        "total_hours_per_week": 15,
        "contact_number": "+91 98110 55432",
        "pay_estimate": "₹180/hr",
        "created_at": "2026-08-20T12:00:00Z",
        "avg_rating": 4.6,
        "rating_count": 12,
        "is_top_rated": True,
    },
    {
        "id": "shp-3",
        "shop_name": "Green Leaf Organic Cafe & Bakery",
        "owner_name": "Tanvi Saxena",
        "category": "Food/restaurant",
        "area": "FC Road, Deccan Gymkhana",
        "city": "Pune",
        "state": "Maharashtra",
        "help_needed": "Social media/basic design",
        "skills_required": [
            "Instagram Reels",
            "Menu Chalkboard Lettering",
            "Canva Posts",
            "Food Photography",
        ],
        "days_needed": ["Tue", "Thu", "Sat"],
        "hours_per_day": 2,
        "total_hours_per_week": 6,
        "contact_number": "+91 99220 33412",
        "pay_estimate": "₹5,500/month",
        "created_at": "2026-08-21T15:10:00Z",
        "qa_status": "verified",
        "qa_verified_at": "2026-08-20T10:00:00Z",
        "avg_rating": 4.8,
        "rating_count": 24,
        "is_top_rated": True,
        "qc_score": 4.8,
        "qc_review_count": 24,
    },
    {
        "id": "shp-4",
        "shop_name": "MedPlus Pharmacy & Wellness Corner",
        "owner_name": "Dr. Suresh Kumar",
        "category": "Pharmacy",
        "area": "HSR Layout Sector 2",
        "city": "Bengaluru",
        "state": "Karnataka",
        "help_needed": "Delivery/errands",
        "skills_required": [
            "Hyperlocal Delivery",
            "Prescription Verification Handling",
            "Punctuality",
        ],
        "days_needed": ["Mon", "Wed", "Fri", "Sat"],
        "hours_per_day": 3,
        "total_hours_per_week": 12,
        "contact_number": "+91 98800 66719",
        "pay_estimate": "₹220/hr + fuel incentive",
        "created_at": "2026-08-22T10:45:00Z",
        "avg_rating": 4.7,
        "rating_count": 15,
        "is_top_rated": True,
    },
    {
        "id": "shp-5",
        "shop_name": "Threads & Trends Boutique",
        "owner_name": "Meenakshi Sundaram",
        "category": "Clothing",
        "area": "T. Nagar / Pondy Bazaar",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "help_needed": "Event help",
        "skills_required": [
            "Weekend Sale Coordination",
            "Display Styling",
            "Friendly Customer Assist",
        ],
        "days_needed": ["Sat", "Sun"],
        "hours_per_day": 5,
        "total_hours_per_week": 10,
        "contact_number": "+91 94441 77823",
        "pay_estimate": "₹1,200/weekend day",
        "created_at": "2026-08-23T11:00:00Z",
        "avg_rating": 4.5,
        "rating_count": 8,
        "is_top_rated": True,
    },
    {
        "id": "shp-6",
        "shop_name": "Rolls & Bowls Campus Diner",
        "owner_name": "Kunal Kapoor",
        "category": "Food/restaurant",
        "area": "Koramangala 5th Block",
        "city": "Bengaluru",
        "state": "Karnataka",
        "help_needed": "Shop/counter assistance",
        "skills_required": [
            "Fast Billing",
            "Order Packaging",
            "Customer Greeting",
            "Basic Hygiene",
        ],
        "days_needed": ["Wed", "Thu", "Fri", "Sat"],
        "hours_per_day": 3,
        "total_hours_per_week": 12,
        "contact_number": "+91 98452 44901",
        "pay_estimate": "₹190/hr + meal",
        "created_at": "2026-08-24T09:15:00Z",
        "qa_status": "pending",
        "avg_rating": 4.2,
        "rating_count": 14,
        "is_top_rated": False,
        "qc_score": 4.2,
        "qc_review_count": 14,
    },
    {
        "id": "shp-7",
        "shop_name": "Annapurna South Tiffin & Juice Bar",
        "owner_name": "M. Venkatesh",
        "category": "Food/restaurant",
        "area": "Kamla Nagar, North Campus",
        "city": "Delhi",
        "state": "Delhi NCR",
        "help_needed": "Delivery/errands",
        "skills_required": [
            "Quick Campus Delivery",
            "Cash Handling",
            "Polite Manner",
        ],
        "days_needed": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        "hours_per_day": 2,
        "total_hours_per_week": 12,
        "contact_number": "+91 98114 66723",
        "pay_estimate": "₹210/hr",
        "created_at": "2026-08-25T14:30:00Z",
        "qa_status": "verified",
        "qa_verified_at": "2026-08-24T16:00:00Z",
        "avg_rating": 4.6,
        "rating_count": 38,
        "is_top_rated": True,
        "qc_score": 4.6,
        "qc_review_count": 38,
    },
    {
        "id": "shp-8",
        "shop_name": "Midnight Munchies Street Fast Food",
        "owner_name": "Rocky Singh",
        "category": "Food/restaurant",
        "area": "FC Road, Deccan Gymkhana",
        "city": "Pune",
        "state": "Maharashtra",
        "help_needed": "Shop/counter assistance",
        "skills_required": ["Night Shift Availability", "Kitchen Prep"],
        "days_needed": ["Fri", "Sat", "Sun"],
        "hours_per_day": 4,
        "total_hours_per_week": 12,
        "contact_number": "+91 99229 11094",
        "pay_estimate": "₹170/hr",
        "created_at": "2026-08-26T18:00:00Z",
        "qa_status": "rejected",
        "avg_rating": 3.1,
        "rating_count": 7,
        "is_top_rated": False,
        "qc_score": 3.1,
        "qc_review_count": 7,
    },
]


def seed_database() -> None:
    """Create tables and insert initial mock data if not already present."""
    print("Creating tables in database...")
    create_db_and_tables()

    with Session(engine) as session:
        # 1. Seed Students
        existing_students = session.exec(select(Student)).all()
        existing_student_ids = {s.id for s in existing_students}

        added_students = 0
        for s_data in INITIAL_STUDENTS:
            if s_data["id"] not in existing_student_ids:
                student = Student(**s_data)
                session.add(student)
                added_students += 1

        # 2. Seed Shops and Jobs
        existing_shops = session.exec(select(Shop)).all()
        existing_shop_ids = {s.id for s in existing_shops}

        existing_jobs = session.exec(select(Job)).all()
        existing_job_ids = {j.id for j in existing_jobs}

        added_shops = 0
        added_jobs = 0

        for shp_data in INITIAL_SHOPKEEPERS:
            shop_id = shp_data["id"]

            # Separate Shop attributes from Job attributes
            if shop_id not in existing_shop_ids:
                shop = Shop(
                    id=shop_id,
                    shop_name=shp_data["shop_name"],
                    owner_name=shp_data["owner_name"],
                    category=shp_data["category"],
                    custom_category=shp_data.get("custom_category"),
                    area=shp_data["area"],
                    city=shp_data["city"],
                    state=shp_data["state"],
                    contact_number=shp_data["contact_number"],
                    created_at=shp_data["created_at"],
                    qa_status=shp_data.get("qa_status"),
                    qa_verified_at=shp_data.get("qa_verified_at"),
                    avg_rating=shp_data.get("avg_rating"),
                    rating_count=shp_data.get("rating_count"),
                    is_top_rated=shp_data.get("is_top_rated", False),
                    qc_score=shp_data.get("qc_score"),
                    qc_review_count=shp_data.get("qc_review_count"),
                )
                session.add(shop)
                added_shops += 1

            # Seed the corresponding Job opening
            job_id = shop_id  # In frontend mock data, job_id maps directly to shop id
            if job_id not in existing_job_ids:
                job = Job(
                    id=job_id,
                    shop_id=shop_id,
                    title=shp_data["help_needed"],
                    help_needed=shp_data["help_needed"],
                    custom_help_needed=shp_data.get("custom_help_needed"),
                    skills_required=shp_data["skills_required"],
                    days_needed=shp_data["days_needed"],
                    hours_per_day=shp_data["hours_per_day"],
                    total_hours_per_week=shp_data["total_hours_per_week"],
                    pay_estimate=shp_data.get("pay_estimate"),
                    created_at=shp_data["created_at"],
                )
                session.add(job)
                added_jobs += 1

        session.commit()

        print(f"Seed completed successfully:")
        print(f"  - Students added: {added_students} (Total in DB: {len(session.exec(select(Student)).all())})")
        print(f"  - Shops added:    {added_shops} (Total in DB: {len(session.exec(select(Shop)).all())})")
        print(f"  - Jobs added:     {added_jobs} (Total in DB: {len(session.exec(select(Job)).all())})")


if __name__ == "__main__":
    seed_database()
