from datetime import datetime
import os
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, Integer, String, DateTime
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, sessionmaker, Session

load_dotenv()

ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "demo-admin-token")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

engine = create_engine("sqlite:///./leads.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    phone: Mapped[str] = mapped_column(String(40))
    course: Mapped[str] = mapped_column(String(80))
    message: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


Base.metadata.create_all(bind=engine)


class LeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=5, max_length=40)
    course: str = Field(min_length=2, max_length=80)
    message: Optional[str] = Field(default=None, max_length=500)


class LeadOut(BaseModel):
    id: int
    name: str
    phone: str
    course: str
    message: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


app = FastAPI(title="BizStart Landing API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_admin(authorization: str = Header(default="")):
    expected = f"Bearer {ADMIN_TOKEN}"
    if authorization != expected:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True


@app.get("/")
def health():
    return {"status": "ok", "service": "BizStart Landing API"}


@app.post("/api/leads", response_model=LeadOut)
def create_lead(payload: LeadCreate, db: Session = Depends(get_db)):
    lead = Lead(
        name=payload.name.strip(),
        phone=payload.phone.strip(),
        course=payload.course.strip(),
        message=payload.message.strip() if payload.message else None,
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


@app.get("/api/leads", response_model=list[LeadOut])
def list_leads(_: bool = Depends(check_admin), db: Session = Depends(get_db)):
    return db.query(Lead).order_by(Lead.created_at.desc()).all()
