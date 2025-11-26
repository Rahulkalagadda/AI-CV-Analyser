# AI CV Analyzer Documentation

This document provides an overview of the AI CV Analyzer project, including its structure, features, and setup instructions.

## Project Overview

The AI CV Analyzer is a web application that helps users improve their CVs by providing an ATS score, rewriting suggestions, and different templates. It consists of a Python-based backend and a React-based frontend.

## Project Structure

### Backend

The backend is a Python application responsible for the core logic of the CV analysis.

```
backend/
├── .env
├── main_backend.py
├── package-lock.json
├── requirements.txt
├── middleware/
│   └── error_handler.py
├── models/
│   ├── response_models.py
│   ├── rewrite_model.py
│   ├── score_model.py
│   └── templates.py
├── services/
│   ├── ats_score.py
│   ├── cv_templates.py
│   ├── rewrite_cv.py
│   └── rewrite.py
├── templates/
├── uploads/
└── utils/
    ├── scoring_model.py
    └── text_extractor.py
```

### Frontend

The frontend is a modern web application that provides the user interface for the CV analyzer.

```
frontend/
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── pnpm-lock.yaml
├── README.md
├── tsconfig.json
├── vite.config.ts
├── app/
│   ├── app.css
│   ├── root.tsx
│   ├── components/
│   │   ├── Accordion.tsx
│   │   ├── CVCard.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── FileUploader.tsx
│   │   ├── Navbar.tsx
│   │   ├── ScoreBadge.tsx
│   │   └── SearchBar.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   └── pages/
│       ├── auth.tsx
│       ├── cv.tsx
│       ├── dashboard.tsx
│       ├── home.tsx
│       └── upload.tsx
├── build/
├── constants/
│   └── index.ts
├── public/
│   ├── index.html
│   ├── README.md
│   ├── icons/
│   └── images/
└── types/
    └── index.ts
```

## Features

*   **ATS Score:** Calculates an Applicant Tracking System (ATS) score for the uploaded CV.
*   **CV Rewriting:** Provides suggestions to improve the CV content.
*   **CV Templates:** Offers different templates to format the CV.

## API Endpoints

The backend provides the following API endpoints:

*   `GET /`: A simple endpoint to check if the server is running.
*   `POST /upload`: Uploads a CV file (PDF or DOCX) and extracts the text.
*   `POST /score`: Calculates the ATS score for a CV based on a job description.
*   `POST /rewrite`: Rewrites a CV to better match a job description.
*   `GET /templates`: Lists the available CV templates.
*   `POST /templates/apply`: Applies a template to a CV.
*   `GET /api/cvs`: Retrieves a list of all uploaded CVs.
*   `GET /api/cvs/{cv_id}`: Retrieves a specific CV by its ID.
*   `DELETE /api/cvs/{cv_id}`: Deletes a specific CV by its ID.

## Setup and Installation

### Backend

1.  Navigate to the `backend` directory.
2.  Install the required dependencies: `pip install -r requirements.txt`
3.  Run the application: `python main_backend.py`

### Frontend

The frontend is a single-page application (SPA) built with React. It uses a simple state-based routing system to navigate between different views.

**Key Components:**

*   `root.tsx`: The main entry point of the application, which handles routing and renders the current view.
*   `pages/`: This directory contains the different pages of the application:
    *   `home.tsx`: The landing page.
    *   `upload.tsx`: The page for uploading CVs.
    *   `auth.tsx`: The page for user authentication.
    *   `dashboard.tsx`: The user dashboard, which displays a list of uploaded CVs.
    *   `cv.tsx`: The page that displays the details of a specific CV, including the ATS score and rewritten content.
*   `components/`: This directory contains reusable UI components used throughout the application.
*   `lib/`: This directory contains utility functions and the API client for communicating with the backend.

**Installation and Setup:**

1.  Navigate to the `frontend` directory.
2.  Install the required dependencies: `npm install`
3.  Run the application: `npm run dev`
