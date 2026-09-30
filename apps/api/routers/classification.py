from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from ..models.schemas import ClassificationResponse
from ..services.classification import classify_ewaste_image

router = APIRouter(prefix="/api/classify", tags=["AI Classification"])

class ClassifyRequest(BaseModel):
    image_name_or_hints: str
    confidence_override: Optional[float] = None

@router.post("", response_model=ClassificationResponse)
def classify_image(payload: ClassifyRequest):
    result = classify_ewaste_image(
        filename_or_hints=payload.image_name_or_hints,
        confidence_override=payload.confidence_override
    )
    return result
