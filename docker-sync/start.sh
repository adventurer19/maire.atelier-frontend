#!/bin/bash

# Start the frontend project
echo "🚀 Стартиране на Frontend (Next.js)..."
cd "$(dirname "$0")/.."

# Check if backend network exists
if ! docker network inspect backend_sail >/dev/null 2>&1; then
    echo "⚠️  Backend мрежата 'backend_sail' не съществува!"
    echo "💡 Моля, стартирайте първо backend проекта:"
    echo "   cd ../backend && ./vendor/bin/sail up -d"
    exit 1
fi

docker-compose up -d

echo "✅ Frontend е стартиран!"
echo "📝 Frontend е достъпен на: http://localhost:3000"
echo ""
echo "💡 За да видите логовете: docker-compose logs -f"

