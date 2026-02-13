#!/bin/bash

echo "🚀 Setting up Fix On Call Backend..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null
then
    echo "❌ MongoDB is not running. Starting MongoDB..."
    # Try to start MongoDB (adjust for your system)
    sudo systemctl start mongod 2>/dev/null || \
    brew services start mongodb-community 2>/dev/null || \
    echo "⚠️  Please start MongoDB manually"
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📦 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create database collections
echo "🗄️  Setting up database..."
python3 -c "
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
db = client['fix_on_call']

collections = ['users', 'mechanics', 'services', 'bookings', 'payments', 
               'vehicles', 'reviews', 'notifications', 'emergency_alerts']

for collection in collections:
    if collection not in db.list_collection_names():
        db.create_collection(collection)
        print(f'✅ Created collection: {collection}')
    else:
        print(f'✅ Collection exists: {collection}')

print('\\n🚀 Database setup completed!')
"

echo "✅ Setup complete!"
echo ""
echo "To run the application:"
echo "1. source venv/bin/activate"
echo "2. python app.py"
echo "3. Open http://localhost:5000 in your browser"
echo ""
echo "Or use: ./run.sh"