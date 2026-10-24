"""Shop and shopkeeper endpoints for CampusConnect."""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_session
from app.models import Shop, ShopRead
from app import crud

router = APIRouter(prefix="/shops", tags=["Shops"])


@router.get("", response_model=List[ShopRead])
def list_shops(
    session: Session = Depends(get_session),
) -> List[ShopRead]:
    """Retrieve all local shops and businesses registered on CampusConnect."""
    return session.exec(select(Shop)).all()


@router.get("/{shop_id}", response_model=ShopRead)
def get_shop(
    shop_id: str,
    session: Session = Depends(get_session),
) -> ShopRead:
    """Retrieve shop details for a specific merchant by ID."""
    shop = crud.get_shop_by_id(session=session, shop_id=shop_id)
    if not shop:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Shop with ID '{shop_id}' not found",
        )
    return shop
