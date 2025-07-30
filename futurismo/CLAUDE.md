# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server (port 3000)
npm run dev
# or
npm start

# Build for production
npm run build

# Preview production build
npm run preview

# Clean cache and restart (Linux/Mac)
npm run clean && npm run start:fresh

# Clean cache and restart (Windows)
npm run clean:win && npm run start:fresh

# Linting and formatting (pre-commit hooks enabled)
npm run lint          # Check code with ESLint
npm run lint:fix      # Auto-fix ESLint issues
npm run format        # Format with Prettier
npm run format:check  # Check Prettier formatting

# Fix console.log statements
npm run fix:console-logs
```

## Architecture Overview

This is a B2B tourism management system built with React 18, Vite, and TailwindCSS. The application follows these architectural patterns:

### State Management
- **Zustand stores** for global state management located in `src/stores/`
- Each store manages a specific domain (auth, services, reservations, etc.)
- Stores persist state in localStorage when necessary (e.g., auth tokens)

### API Communication
- **Axios** for HTTP requests with interceptors for auth tokens
- **Socket.io** for real-time WebSocket communication
- API endpoints defined in `src/services/api.js`
- Resilient WebSocket service with auto-reconnection in `src/services/websocketResilient.js`

### Component Structure
- **Lazy loading** with React.lazy() for route-based code splitting
- **Protected routes** based on user roles (admin, agency, guide, freelance)
- Components organized by functionality in `src/components/`
- Pages represent complete views in `src/pages/`
- Mobile-optimized versions available for key pages (DashboardMobile, MonitoringMobile, etc.)

### Key Patterns

1. **Authentication Flow**
   - JWT tokens stored in Zustand authStore
   - Automatic token injection via Axios interceptors
   - Role-based access control with ProtectedRoute component

2. **Real-time Updates**
   - WebSocket connection established upon authentication
   - Automatic reconnection with exponential backoff
   - Event-based messaging for tour updates, emergencies, and notifications

3. **Form Validation**
   - Custom validation system with schemas in `src/utils/validation.js`
   - Input sanitization for security in `src/utils/inputSanitizer.js`
   - useFormValidation hook for form state management
   - Yup schemas for marketplace forms in `src/utils/validationSchemas/`

4. **Performance Optimizations**
   - Custom hooks: useTimer (cleanup), useAbortController (request cancellation), useSmartMemo (memoization)
   - Logger utility that respects environment (no console logs in production)
   - SafeHtml component for secure HTML rendering
   - Multiple map implementations (LiveMap, LiveMapResilient, LiveMapUnified) with different optimization strategies

5. **Internationalization**
   - i18next for multi-language support (ES/EN)
   - Language files in `src/locales/`

6. **Responsive Design**
   - Mobile-first approach with TailwindCSS breakpoints
   - Dedicated mobile versions of key pages
   - Adaptive navigation components (BottomNavigation, DrawerNavigation, etc.)
   - ResponsiveTable component for data tables

## Critical Files to Understand

1. **src/App.jsx** - Main routing and WebSocket setup
2. **src/stores/authStore.js** - Authentication state and login logic
3. **src/services/websocketResilient.js** - Real-time communication
4. **src/utils/validation.js** - Form validation system
5. **src/components/common/Layout.jsx** - Main application layout
6. **src/components/common/ErrorBoundary.jsx** - Global error handling

## User Roles and Access

The system supports four main user roles:

1. **Admin**: Full system access, all features available
2. **Agency**: Reservation management, monitoring, marketplace access
3. **Guide (Planta)**: Employee guides with fixed schedules
4. **Guide (Freelance)**: Independent guides with marketplace profile

## Key Features by Role

### Admin Features
- Complete system management
- User and guide management
- Provider management
- Emergency protocols
- System settings and configuration

### Agency Features
- Reservation creation and management
- Real-time tour monitoring
- Guide marketplace access
- Reports and analytics
- Chat with guides

### Guide Features
- Personal agenda management
- Tour assignments
- Emergency protocols access
- Chat with agencies
- Freelance guides: marketplace profile, availability calendar

## Test Credentials

For development mode:
- Admin: `admin@futurismo.com` / `admin123`
- Agency: `agencia@test.com` / `agencia123`
- Guide: `guia@test.com` / `guia123`
- Freelance: `freelance@test.com` / `freelance123`

## Environment Configuration

Copy `.env.example` to `.env.local` and configure:
- `VITE_API_URL` - Backend API URL
- `VITE_WS_URL` - WebSocket server URL
- `VITE_ENVIRONMENT` - Current environment (development/production)
- `VITE_ENABLE_MOCK_DATA` - Enable mock data for development

## Code Quality Standards

### ESLint Rules
- No console.log in production (use logger utility)
- React hooks rules enforced
- Maximum file length: 500 lines
- Maximum complexity: 15
- No magic numbers (except 0, 1, -1, 2, 100)
- Consistent return statements
- No nested ternary operators

### Git Hooks
- Pre-commit: Runs ESLint and Prettier via lint-staged
- Only staged files are linted and formatted

## Common Development Tasks

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation item in `src/components/common/Sidebar.jsx`
4. Apply role protection if needed with `ProtectedRoute`

### Adding a New Store
1. Create store file in `src/stores/`
2. Follow existing pattern with actions and initial state
3. Add persistence if needed using localStorage

### Working with Forms
1. Use React Hook Form for form management
2. Create validation schema with Yup
3. Apply input sanitization for security
4. Use FormField component for consistent styling

### WebSocket Events
Main events handled:
- `connect` / `disconnect` - Connection status
- `tour:update` - Tour status changes
- `emergency:alert` - Emergency notifications
- `notification:new` - General notifications
- `guide:location` - Real-time location updates

## Important Notes

- The application uses mock data in development mode
- WebSocket connections require authentication token
- All user inputs are sanitized for XSS prevention
- Rate limiting is implemented for WebSocket messages
- The application supports offline mode with data persistence
- Multiple map implementations exist - choose based on performance needs
- Mobile versions of pages should be used for better mobile experience