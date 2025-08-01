#!/bin/bash

# Yo Compro Acacías - Installation Script
# This script helps set up the development environment

echo "🚀 Yo Compro Acacías - Installation Script"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js first:"
    echo ""
    echo "Option 1 - Using Homebrew (recommended for macOS):"
    echo "  brew install node"
    echo ""
    echo "Option 2 - Download from official website:"
    echo "  https://nodejs.org/"
    echo ""
    echo "Option 3 - Using Node Version Manager (nvm):"
    echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "  nvm install node"
    echo ""
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available"
    echo "npm should come with Node.js. Please reinstall Node.js."
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm version: $NPM_VERSION"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if MongoDB is running
echo ""
echo "🔍 Checking MongoDB..."
if command -v mongosh &> /dev/null; then
    echo "✅ MongoDB CLI (mongosh) is available"
elif command -v mongo &> /dev/null; then
    echo "✅ MongoDB CLI (mongo) is available"
else
    echo "⚠️  MongoDB CLI not found"
    echo "Please install MongoDB:"
    echo ""
    echo "macOS (Homebrew):"
    echo "  brew tap mongodb/brew"
    echo "  brew install mongodb-community"
    echo "  brew services start mongodb-community"
    echo ""
    echo "Ubuntu/Debian:"
    echo "  sudo apt-get install mongodb"
    echo "  sudo systemctl start mongod"
    echo ""
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created from .env.example"
    echo "⚠️  Please edit .env file with your configuration"
else
    echo "✅ .env file already exists"
fi

# Create assets directory structure
echo ""
echo "📁 Setting up assets directory..."
mkdir -p public/assets
echo "✅ Assets directory created"

echo ""
echo "🎉 Installation completed!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your Google Business Profile API credentials"
echo "2. Add required assets to public/assets/ directory (see public/assets/README.md)"
echo "3. Start MongoDB service"
echo "4. Run the application:"
echo "   npm run dev    # Development mode"
echo "   npm start      # Production mode"
echo ""
echo "5. Optional: Run initial sync"
echo "   npm run sync   # Manual synchronization"
echo ""
echo "📚 See README.md for detailed setup instructions"
