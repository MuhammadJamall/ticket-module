from sqlalchemy.orm import Session
from app.models.ticket import Ticket as TicketModel
from app.exceptions.ticket import DuplicateTicketError 

def get_all_tickets(db: Session):
    return db.query(TicketModel).all()

def get_ticket_by_id(db: Session, ticket_id: int):
    return db.query(TicketModel).filter(TicketModel.id == ticket_id).first()

def create_ticket(db: Session, ticket_data, user_id: int): 
    existing_ticket = db.query(TicketModel).filter(
        TicketModel.title == ticket_data.title
    ).first() 
    
    if existing_ticket:
        raise DuplicateTicketError("Ticket Already Exist")
    
    ticket_dict = ticket_data.model_dump()
    ticket_dict['created_by'] = user_id 
    
    new_ticket = TicketModel(**ticket_dict)
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return new_ticket

def update_ticket(db: Session, ticket_id: int, ticket_data):
    ticket = get_ticket_by_id(db, ticket_id)
    if not ticket:
        return None
    for key, value in ticket_data.model_dump(exclude_unset=True).items():
        setattr(ticket, key, value)

    db.commit()
    db.refresh(ticket)
    return ticket

def delete_ticket(db: Session, ticket_id: int):
    ticket = get_ticket_by_id(db, ticket_id)
    if not ticket:
        return None
    db.delete(ticket)
    db.commit()
    return True