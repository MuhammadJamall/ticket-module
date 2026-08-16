from app.database.database import Base
from sqlalchemy import Column, DateTime,Text,Enum ,Integer,String,ForeignKey,func
from sqlalchemy.orm import relationship
from app.schemas.ticket import ticketEnumPriority,ticketEnumStatus
class Ticket(Base):
    __tablename__ = 'tickets'

    id = Column(Integer,primary_key=True,index=True)
    title = Column(String(100),nullable=False)
    description = Column(Text, nullable=False)
    status = Column(Enum(ticketEnumStatus),nullable=False,default=ticketEnumStatus.open)
    priority = Column(Enum(ticketEnumPriority), nullable=False, default=ticketEnumPriority.medium)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)

    creator = relationship("User",foreign_keys=[created_by])
    assignee =relationship("User",foreign_keys=[assigned_to])
