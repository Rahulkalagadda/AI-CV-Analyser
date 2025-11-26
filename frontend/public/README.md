# AI CV Analyzer Frontend

A modern, responsive frontend for AI-powered CV analysis and job matching.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Features

- 🎨 Modern UI with Tailwind CSS
- 📱 Fully responsive design
- 📄 CV upload and analysis
- 📊 Dashboard with statistics
- 🔍 Search and filtering
- 🔐 Authentication system
- 📈 Detailed analysis reports

## Tech Stack

- React Router v7
- TypeScript
- Tailwind CSS
- Vite
- Lucide React

## Project Structure

```
app/
├── components/     # Reusable UI components
├── lib/           # Utilities and API client
├── routes/        # Page components
└── app.css        # Global styles
```

## API Integration

Configure your backend URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Pages

- `/` - Home dashboard
- `/upload` - CV upload
- `/dashboard` - Statistics overview
- `/cv/:id` - CV details
- `/auth` - Authentication

## Components

- `Navbar` - Main navigation
- `FileUploader` - Drag & drop upload
- `CVCard` - CV preview card
- `ScoreBadge` - Score indicators
- `DashboardStats` - Statistics cards
- `SearchBar` - Search functionality
- `Accordion` - Collapsible sections

Built with ❤️ using modern web technologies.
