from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services import service_tickets
from app.schemas.ticket import TicketCreate, Ticket as TicketResponse
from app.database.db import get_db
from app.auth.deps import get_current_user, require_role 
from app.models.user import User 
router = APIRouter()

@router.get("/", response_model=list[TicketResponse])
async def get_all_tickets(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    return service_tickets.get_all_tickets(db)


@router.get("/{ticket_id}", response_model=TicketResponse)
async def get_ticket_by_id(
    ticket_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ticket = service_tickets.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.post("/", response_model=TicketResponse)
async def create_ticket(
    ticketData: TicketCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to Create this ticket")
    
    return service_tickets.create_ticket(db, ticketData, current_user.id)


@router.put("/{ticket_id}", response_model=TicketResponse)
async def update_ticket(
    ticket_id: int, 
    ticketData: TicketCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) 
):
    ticket = service_tickets.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    if current_user.role != "admin" and ticket.assigned_to != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this ticket")
    
    return service_tickets.update_ticket(db, ticket_id, ticketData)


@router.delete("/{ticket_id}")
async def delete_ticket(
    ticket_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")) 
):
    ticket = service_tickets.get_ticket_by_id(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    service_tickets.delete_ticket(db, ticket_id)
    return {"detail": "Ticket deleted successfully"}