from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from .. import models, crud
from ..database import get_db
from .auth import get_current_user
from ..ai import product_description

router = APIRouter()

class ProductDescriptionRequest(BaseModel):
    product_name: str
    features: List[str]

@router.post("/generate/product-description", response_model=str)
async def generate_description_endpoint(
    request: ProductDescriptionRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Generates a product description based on product name and features.
    Deducts one credit from the user's account.
    """
    if current_user.credits <= 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough credits",
        )

    # Deduct credit
    current_user.credits -= 1
    db.commit()

    # Generate description
    description = product_description.generate_product_description(
        product_name=request.product_name,
        features=request.features
    )

    return description
