from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON, UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

class Document(Base):
    __tablename__ = "documents"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    filename = Column(String(255))
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    document_type = Column(String(100))
    page_count = Column(Integer)
    jurisdiction = Column(String(100))
    attorney_name = Column(String(100), default="System AI")

class Analysis(Base):
    __tablename__ = "analyses"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"))
    overall_risk_score = Column(Float)
    risk_level = Column(String(20))
    confidence_score = Column(Float)
    summary = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    llm_models_used = Column(JSON)

class ClauseFinding(Base):
    __tablename__ = "clause_findings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("analyses.id"))
    clause_type = Column(String(100))
    clause_text = Column(Text)
    risk_level = Column(String(20))
    explanation = Column(Text)
    recommendation = Column(Text)
    page_number = Column(Integer)
    confidence = Column(Float)

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("analyses.id"))
    finding_id = Column(UUID(as_uuid=True), ForeignKey("clause_findings.id"))
    feedback_type = Column(String(50))
    user_comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
