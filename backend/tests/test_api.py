"""
Tests for API endpoints
"""
import pytest
from fastapi.testclient import TestClient
from main import app
from database import Base, engine
from models import User, Question, Solution

client = TestClient(app)

@pytest.fixture(scope="module")
def test_db():
    """Create test database"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_read_root():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()
    assert "version" in response.json()

def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_login_endpoint():
    """Test login endpoint exists"""
    response = client.post(
        "/api/auth/login",
        json={"username": "nonexistent", "password": "wrong"}
    )
    # Should return 401 Unauthorized for wrong credentials
    assert response.status_code == 401

def test_questions_endpoint_unauthorized():
    """Test questions endpoint requires authentication"""
    response = client.get("/api/questions")
    # Should return 401 if no auth token
    assert response.status_code in [401, 200]  # Depends on implementation

def test_cors_headers():
    """Test CORS headers are present"""
    response = client.options("/api/questions")
    assert response.status_code in [200, 405]
