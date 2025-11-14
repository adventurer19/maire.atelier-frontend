#!/bin/bash

# Restart the frontend project
echo "🔄 Рестартиране на Frontend (Next.js)..."
cd "$(dirname "$0")/.."
docker-compose restart

echo "✅ Frontend е рестартиран!"

