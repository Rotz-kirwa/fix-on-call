#!/bin/bash

echo "🚗 Fix On Call - PostgreSQL Setup Script"
echo "=========================================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed!"
    echo "Please install PostgreSQL first:"
    echo "  macOS: brew install postgresql@15"
    echo "  Ubuntu: sudo apt install postgresql postgresql-contrib"
    exit 1
fi

echo "✅ PostgreSQL is installed"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -q -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your database credentials"
fi

# Initialize database
echo "🗄️  Initializing database..."
python init_db.py

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the server:"
echo "   python app.py"
echo ""
echo "📖 For more information, see POSTGRESQL_MIGRATION.md"
