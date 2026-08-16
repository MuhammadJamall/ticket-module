from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.routers import tickets, auth
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.exceptions.ticket import DuplicateTicketError
from fastapi.staticfiles import StaticFiles
app = FastAPI(
   docs_url=None if settings.ENVIRONMENT == "production" else "/docs",
    redoc_url=None if settings.ENVIRONMENT == "production" else "/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_headers=['*'],
    allow_methods=['*'],
    allow_credentials=True,
)
@app.get("/health")
def health_check():
    return {"status": "healthy", "message": "Server is running smoothly"}
@app.exception_handler(DuplicateTicketError)
async def duplicate_ticket_exception_handler(request: Request, exc: DuplicateTicketError):
    return JSONResponse(
        status_code=409, 
        content={"detail": str(exc.detail) if hasattr(exc, 'detail') else str(exc)},
    )

app.include_router(tickets.router, prefix='/tickets',tags=["Tickets"])
app.include_router(auth.router, prefix='/auth',tags=["Auth"])


app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="frontend")
