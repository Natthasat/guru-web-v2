"""
Tests for authentication module
"""
import pytest
from auth import verify_password, get_password_hash, create_access_token, decode_access_token

def test_password_hashing():
    """Test password hashing and verification"""
    password = "testpassword123"
    hashed = get_password_hash(password)
    
    # Password should hash correctly
    assert hashed != password
    assert verify_password(password, hashed) == True
    assert verify_password("wrongpassword", hashed) == False

def test_access_token():
    """Test JWT token creation and decoding"""
    data = {"sub": "testuser"}
    token = create_access_token(data)
    
    # Token should be created
    assert token is not None
    assert isinstance(token, str)
    
    # Token should decode correctly
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "testuser"
    
    # Invalid token should return None
    invalid_decoded = decode_access_token("invalid.token.here")
    assert invalid_decoded is None

def test_password_hash_uniqueness():
    """Test that same password generates different hashes"""
    password = "samepassword"
    hash1 = get_password_hash(password)
    hash2 = get_password_hash(password)
    
    # Hashes should be different (due to salt)
    assert hash1 != hash2
    
    # But both should verify correctly
    assert verify_password(password, hash1) == True
    assert verify_password(password, hash2) == True
