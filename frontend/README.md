# AI CV Analyzer Frontend

A modern, responsive frontend application for AI-powered CV analysis and job matching. Built with React Router v7, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **CV Upload & Analysis**: Drag-and-drop file upload with instant analysis
- **Dashboard**: Comprehensive overview of CV performance and statistics
- **Detailed Analysis**: Section-by-section CV scoring and feedback
- **Authentication**: Secure user authentication system
- **Search & Filter**: Easy CV management and discovery
- **Mobile Responsive**: Works seamlessly across all devices

## 🛠️ Tech Stack

- **React Router v7**: Modern routing with SSR support
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server
- **Lucide React**: Beautiful icons
- **React Dropzone**: File upload functionality

## 📁 Project Structure

```
frontend/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── FileUploader.tsx
│   │   ├── CVCard.tsx
│   │   ├── ScoreBadge.tsx
│   │   ├── Accordion.tsx
│   │   ├── DashboardStats.tsx
│   │   └── SearchBar.tsx
│   ├── lib/                 # Utility functions and API client
│   │   ├── utils.ts
│   │   └── api.ts
│   ├── routes/              # Page components
│   │   ├── home.tsx
│   │   ├── upload.tsx
│   │   ├── dashboard.tsx
│   │   ├── cv.tsx
│   │   └── auth.tsx
│   ├── app.css              # Global styles
│   └── root.tsx             # Root component
├── types/                   # TypeScript type definitions
│   └── index.ts
├── public/                  # Static assets
│   ├── icons/
│   └── images/
├── package.json
├── vite.config.ts
├── tsconfig.json
└── react-router.config.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
# or
pnpm build
```

## 🎨 Design System

The application uses a custom design system with:

- **Color Palette**: Blue gradients with gray accents
- **Typography**: Mona Sans font family
- **Components**: Reusable, accessible components
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and micro-interactions

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### API Integration

The frontend is designed to work with a backend API. Update the API endpoints in `app/lib/api.ts` to match your backend configuration.

## 📱 Pages

- **Home**: CV overview and search
- **Upload**: File upload and analysis
- **Dashboard**: Statistics and recent CVs
- **CV Details**: Detailed analysis and feedback
- **Authentication**: Login and registration

## 🧩 Components

### Core Components

- `Navbar`: Main navigation with branding and actions
- `FileUploader`: Drag-and-drop file upload with validation
- `CVCard`: CV preview card with scores and actions
- `ScoreBadge`: Visual score indicator with color coding
- `DashboardStats`: Statistics overview cards
- `SearchBar`: Search functionality with filters
- `Accordion`: Collapsible content sections

## 🔄 State Management

The application uses React's built-in state management with hooks. For more complex state, consider integrating Zustand or Redux Toolkit.

## 🎯 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced filtering options
- [ ] CV comparison features
- [ ] Export functionality
- [ ] Dark mode support
- [ ] PWA capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.
