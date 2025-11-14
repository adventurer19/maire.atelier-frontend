#!/bin/bash

# Show frontend logs
cd "$(dirname "$0")/.."
docker-compose logs -f

