from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from enum import Enum
from typing import Optional

class ticketEnumStatus(str, Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"

class ticketEnumPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Ticket(BaseModel):
    id: int
    title: str=Field(min_length=3,max_length=100)
    description: str =Field(min_length=5,max_length=255)
    status: ticketEnumStatus
    priority: ticketEnumPriority
    created_by: int
    assigned_to: Optional[int] = None
    created_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True) 


class TicketCreate(BaseModel):
    title: str = Field(min_length=10, max_length=100)
    description: str = Field(min_length=10)
    status: ticketEnumStatus = ticketEnumStatus.open  
    priority: ticketEnumPriority = ticketEnumPriority.medium 
    assigned_to: Optional[int] = None 



