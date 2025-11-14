#!/bin/bash

# Stop all projects (backend + frontend)
echo "🛑 Спиране на всички проекти..."
echo ""

# Stop frontend
echo "📦 Спиране на Frontend..."
cd "$(dirname "$0")/.."
docker-compose down

# Stop backend
echo ""
echo "📦 Спиране на Backend..."
cd "../backend"
if [ -f "vendor/bin/sail" ]; then
    ./vendor/bin/sail down
fi

echo ""
echo "✅ Всички проекти са спрени!"

