from datetime import datetime, timedelta
from typing import Optional
import hashlib
import json
import base64
import hmac
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models import User

# กำหนด secret key สำหรับ JWT (ในการใช้งานจริงควรเก็บใน environment variable)
SECRET_KEY = "your-secret-key-here-change-this-in-production"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# สำหรับการตรวจสอบ Bearer token
security = HTTPBearer()

def verify_password(plain_password, hashed_password):
    """ตรวจสอบรหัสผ่าน"""
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

def get_password_hash(password):
    """เข้ารหัสรหัสผ่าน"""
    return hashlib.sha256(password.encode()).hexdigest()

def get_user(db: Session, username: str):
    """ดึงข้อมูลผู้ใช้จากฐานข้อมูล"""
    return db.query(User).filter(User.username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    """ตรวจสอบ username และ password"""
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """สร้าง JWT access token แบบง่าย"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire.timestamp()})
    
    # สร้าง JWT header
    header = {"alg": "HS256", "typ": "JWT"}
    
    # Encode header และ payload
    header_encoded = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip('=')
    payload_encoded = base64.urlsafe_b64encode(json.dumps(to_encode).encode()).decode().rstrip('=')
    
    # สร้าง signature
    message = f"{header_encoded}.{payload_encoded}"
    signature = hmac.new(
        SECRET_KEY.encode(),
        message.encode(),
        hashlib.sha256
    ).digest()
    signature_encoded = base64.urlsafe_b64encode(signature).decode().rstrip('=')
    
    return f"{message}.{signature_encoded}"

def decode_token(token: str):
    """ถอดรหัส JWT token แบบง่าย"""
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
        
        header, payload, signature = parts
        
        # ตรวจสอบ signature
        message = f"{header}.{payload}"
        expected_signature = hmac.new(
            SECRET_KEY.encode(),
            message.encode(),
            hashlib.sha256
        ).digest()
        expected_signature_encoded = base64.urlsafe_b64encode(expected_signature).decode().rstrip('=')
        
        if signature != expected_signature_encoded:
            return None
        
        # ถอดรหัส payload
        payload_padded = payload + '=' * (4 - len(payload) % 4)
        payload_data = json.loads(base64.urlsafe_b64decode(payload_padded))
        
        # ตรวจสอบว่า token หมดอายุหรือไม่
        if payload_data.get('exp', 0) < datetime.utcnow().timestamp():
            return None
        
        return payload_data
    except:
        return None

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    """ตรวจสอบ JWT token และดึงข้อมูลผู้ใช้ปัจจุบัน"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_token(credentials.credentials)
    if not payload:
        raise credentials_exception
    
    username = payload.get("sub")
    if username is None:
        raise credentials_exception
    
    user = get_user(db, username=username)
    if user is None:
        raise credentials_exception
    return user