from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.auth.utils import create_access_token, hash_password, verify_password, blacklist_token


def signup_user(db: Session, email: str, password: str, name: str = None):
    existing = db.query(User).filter(User.email == email).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        email=email,
        password_hash=hash_password(password),
        name=name or email.split('@')[0]
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


def login_user(db: Session, username: str, password: str):
    db_user = db.query(User).filter(User.email == username).first()
    
    if not db_user or not verify_password(password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    access_token = create_access_token({
        "sub": db_user.email,    
        "role": db_user.role      
    })
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": db_user.role,         
        "email": db_user.email      
    }


def logout_user(token: str):
    blacklist_token(token)
    return {"message": "Logged out successfully"}