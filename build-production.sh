#!/bin/bash

echo "🚀 Building Manvi application for production..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Backend setup
echo "📦 Setting up backend..."
cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm install --production

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please update .env with your production values"
fi

# Setup production environment
echo "🔧 Setting up production environment..."
npm run setup-production

cd ..

# Frontend setup
echo "📦 Setting up frontend..."
cd frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Copy environment file if it doesn't exist
if [ ! -f .env.production ]; then
    echo "📝 Creating .env.production file..."
    cp env.production .env.production
    echo "⚠️  Please update .env.production with your production values"
fi

# Build for production
echo "🔨 Building frontend for production..."
npm run build

cd ..

echo "✅ Production build completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update environment variables in backend/.env"
echo "2. Update environment variables in frontend/.env.production"
echo "3. Configure your domain and SSL certificate"
echo "4. Start the backend: cd backend && npm run prod"
echo "5. Deploy the frontend build folder to your web server"
echo ""
echo "📚 For detailed deployment instructions, see DEPLOYMENT.md" 