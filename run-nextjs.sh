#!/bin/bash

echo "Starting Next.js version of MediSage AI..."
echo "-------------------------"
echo "1. Navigating to next-js-conversion directory"
cd next-js-conversion

echo "2. Installing dependencies (this may take a moment)"
npm install

echo "3. Starting Next.js development server"
echo "Once the server starts, your application will be available at the URL shown in the terminal"
echo "-------------------------"
npm run dev