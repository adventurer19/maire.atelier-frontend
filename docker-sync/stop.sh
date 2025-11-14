#!/bin/bash

# Stop the frontend project
echo "🛑 Спиране на Frontend (Next.js)..."
cd "$(dirname "$0")/.."
docker-compose down

echo "✅ Frontend е спрян!"

