#!/bin/bash

# Show status of all containers
echo "📊 Статус на Docker контейнерите..."
echo ""

cd "$(dirname "$0")/.."

echo "🟢 Frontend контейнери:"
docker-compose ps

echo ""
echo "🔵 Backend контейнери (Laravel Sail):"
cd "../backend"
if [ -f "vendor/bin/sail" ]; then
    ./vendor/bin/sail ps
else
    echo "   Backend не е намерен"
fi

echo ""
echo "🌐 Docker мрежи:"
docker network ls | grep -E "(backend_sail|sail)"

