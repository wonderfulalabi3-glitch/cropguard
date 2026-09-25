from typing import List, Optional
from pydantic import BaseModel, Field

class TreatmentPlan(BaseModel):
    organic_control: List[str] = Field(
        default_factory=list,
        description="Organic, biological, or cultural management techniques"
    )
    chemical_control: List[str] = Field(
        default_factory=list,
        description="Recommended fungicides, bactericides, or chemical controls where suitable"
    )
    preventative_measures: List[str] = Field(
        default_factory=list,
        description="Preventative agronomic measures to stop future outbreaks"
    )

class CropAnalysisResponse(BaseModel):
    is_plant: bool = Field(
        ...,
        description="True if the provided image shows a plant, crop, or leaf; False otherwise."
    )
    crop_name: Optional[str] = Field(
        None,
        description="Identified crop or plant species (e.g. Tomato, Corn/Maize, Potato, Rice, Wheat, Cotton, Apple)"
    )
    condition: Optional[str] = Field(
        None,
        description="Specific condition name (e.g., Healthy, Early Blight, Late Blight, Powdery Mildew, Rust, Leaf Spot)"
    )
    status: str = Field(
        ...,
        description="Status category: 'healthy', 'diseased', 'pest_damage', or 'invalid_image'"
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Calibrated confidence score between 0.0 and 1.0"
    )
    severity: Optional[str] = Field(
        None,
        description="Estimated disease severity: 'None', 'Mild', 'Moderate', or 'Severe'"
    )
    pathogen_type: Optional[str] = Field(
        None,
        description="Pathogen etiology: 'Fungal', 'Bacterial', 'Viral', 'Pest / Insect', 'Abiotic / Nutrient', or 'None (Healthy)'"
    )
    affected_part: Optional[str] = Field(
        None,
        description="Affected anatomical region: e.g., 'Lower older leaves', 'Leaf margins', 'Interveinal tissue', 'Whole leaf'"
    )
    diagnostic_reasoning: str = Field(
        ...,
        description="Explainable chain-of-thought rationale analyzing morphological cues before final classification"
    )
    visual_symptoms: List[str] = Field(
        default_factory=list,
        description="List of observed symptoms (e.g., 'Target-like brown concentric rings', 'Yellowing of leaf margin')"
    )
    description: str = Field(
        ...,
        description="Clear, accessible explanation of the diagnosis and what is happening to the plant."
    )
    treatment: Optional[TreatmentPlan] = Field(
        None,
        description="Detailed actionable treatment recommendations"
    )
    model_used: Optional[str] = Field(
        None,
        description="The AI model that processed the request"
    )
    is_demo_mock: bool = Field(
        False,
        description="Flag indicating if a simulated mock diagnosis was returned because no API key was supplied"
    )
