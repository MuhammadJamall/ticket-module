from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.auth.deps import oauth2_scheme
from app.schemas.user import UserCreate, UserResponse, LoginResponse
from app.database.db import get_db
from app.services.auth_service import signup_user, login_user, logout_user

router = APIRouter()


@router.post("/signup", response_model=UserResponse, status_code=201)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    return signup_user(db, user.email, user.password, user.name)


@router.post("/login", response_model=LoginResponse)
def login(user: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    return login_user(db, user.username, user.password)


@router.post("/logout")
def logout(token: str = Depends(oauth2_scheme)):
    return logout_user(token)