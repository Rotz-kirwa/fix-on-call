import pytest
import json
from app import create_app
from config import Config

class TestConfig(Config):
    TESTING = True
    MONGO_URI = 'mongodb://localhost:27017/fix_on_call_test'

@pytest.fixture
def app():
    app = create_app(TestConfig)
    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_health_check(client):
    response = client.get('/api/health')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'healthy'

def test_register_user(client):
    user_data = {
        'email': 'test@example.com',
        'password': 'Test123!',
        'name': 'Test User',
        'phone': '+254712345678',
        'user_type': 'driver'
    }
    
    response = client.post('/api/auth/register', 
                          json=user_data,
                          content_type='application/json')
    
    assert response.status_code in [201, 409]  # 201 created or 409 if already exists
    
    if response.status_code == 201:
        data = json.loads(response.data)
        assert data['success'] == True
        assert 'token' in data