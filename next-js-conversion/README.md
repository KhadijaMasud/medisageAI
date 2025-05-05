# MediSage AI - Next.js Version

This directory contains the Next.js version of the MediSage AI application.

## Running the Application

To run the Next.js version of the application:

1. Navigate to the next-js-conversion directory:
   ```
   cd next-js-conversion
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Project Structure

- `app/` - Next.js App Router pages and layouts
- `components/` - Reusable React components
- `hooks/` - Custom React hooks
- `lib/` - Utility functions and shared code
- `db/` - Database configuration and models
- `public/` - Static assets

## Features

- Medical Chat - Get answers to your medical questions
- Symptom Checker - Analyze your symptoms and get insights
- Medicine Scanner - Upload images of medicines to get information
- Voice Assistant - Interact with the app using voice commands
- User Profiles - Manage your health information

## API Routes

The application connects to the existing Express API server running on port 5000. Make sure the main server is running alongside the Next.js frontend for full functionality.