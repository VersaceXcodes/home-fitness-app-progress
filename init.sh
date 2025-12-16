#!/bin/bash
echo "Starting development servers..."
cd /app && npm install
cd /app && npm run dev &
echo "Development server started"
