#!/bin/bash

# Start all projects (backend + frontend)
echo "🚀 Стартиране на всички проекти..."
echo ""

# Start backend
echo "📦 Стартиране на Backend..."
cd "$(dirname "$0")/../../backend"
if [ -f "vendor/bin/sail" ]; then
    ./vendor/bin/sail up -d
    sleep 2
else
    echo "⚠️  Laravel Sail не е намерен в backend проекта!"
    exit 1
fi

# Start frontend
echo ""
echo "📦 Стартиране на Frontend..."
cd "../frontend"
docker-compose up -d

echo ""
echo "✅ Всички проекти са стартирани!"
echo ""
echo "📝 Полезни линкове:"
echo "   - Backend (Laravel): http://localhost"
echo "   - Frontend (Next.js): http://localhost:3000"
echo "   - phpMyAdmin: http://localhost:8081"

