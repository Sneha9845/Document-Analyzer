from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from .database import Base

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://admin:password@postgres:5432/legal_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
