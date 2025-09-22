# Posts Management Application - Angular 20 Zoneless

> A comprehensive Angular application showcasing posts management with advanced filtering, favorites system, post details view, Gantt timeline visualization, and modern architecture using signals, zoneless design, and input signals.

---

## Features Implemented

### 🔍 Advanced Filtering System

1. **Content Filter** - Search in post title and body (client-side filtering)
2. **User Filter** - Filter posts by user via API dropdown (server-side filtering)
3. **Favorites Filter** - Show only favorited posts (client-side filtering)

### ❤️ Favorites System

- Click heart icons (♡/♥) to toggle favorites
- Empty hearts (♡) for non-favorites, filled red hearts (♥) for favorites
- In-memory favorites management with session-based persistence
- Real-time UI updates with signal-based reactivity

### 📄 Post Details View

- Individual post pages with URL routing using input signals
- Author information with avatar placeholders and initials
- Comments section with full user details
- Optimized user data caching to prevent duplicate API calls
- Modern Angular 19+ input signals instead of ActivatedRoute

### 📊 Gantt Timeline View

- Visual timeline representation of posts as mock projects
- Color-coded categories: Planning, Development, Review, Completed
- Progress indicators and duration calculations
- Date formatting with custom pipe (Polish locale)
- Interactive timeline with responsive design

### 🏗️ Modern Architecture

- **Angular 20** with zoneless design pattern
- **@ngrx/signals** with withState, withMethods, withComputed, withHooks
- **Signal stores** with effects for reactive state management
- **Input signals** for route parameters (Angular 19+ feature)
- **Standalone components** with dependency injection
- **Custom pipes** for date formatting
- **Optimized caching** with separate stores for different concerns

---

## Project Structure

```
src/app/
├── domains/
│   ├── feature-posts-list/              # Main posts listing feature
│   │   ├── feature-posts-list.ts        # Component with store integration
│   │   ├── feature-posts-list.html      # Responsive post grid template
│   │   ├── feature-posts-list.css       # Component styles
│   │   └── internal/
│   │       └── filters/                 # Reusable filters component
│   │           ├── filters.ts           # Three-filter controls logic
│   │           ├── filters.html         # Responsive filter UI
│   │           └── filters.css          # Filter styling
│   │
│   ├── feature-post-details/            # Individual post details feature
│   │   ├── feature-post-details.ts     # Component with input signals
│   │   ├── feature-post-details.html   # Post, author, comments template
│   │   └── feature-post-details.css    # Post details styling
│   │
│   ├── feature-gantt-view/              # Gantt timeline visualization
│   │   ├── feature-gantt-view.ts       # Timeline component logic
│   │   ├── feature-gantt-view.html     # Gantt chart template
│   │   ├── feature-gantt-view.css      # Timeline styling
│   │   ├── data/
│   │   │   └── gantt.service.ts         # Mock data generation service
│   │   └── models/
│   │       └── gantt.interface.ts       # Gantt-specific interfaces
│   │
│   └── shared/                          # Shared resources across features
│       ├── data/                        # Data access layer
│       │   ├── posts.service.ts         # Posts API service
│       │   ├── users.service.ts         # Users API service
│       │   └── favorites.service.ts     # Favorites in-memory service
│       │
│       ├── stores/                      # Signal stores with @ngrx/signals
│       │   ├── posts.store.ts           # Main posts & filters state
│       │   ├── users.store.ts           # Users caching store
│       │   └── post-details.store.ts    # Post details state
│       │
│       ├── models/                      # TypeScript interfaces
│       │   ├── post.interface.ts        # IPost interface
│       │   ├── user.interface.ts        # IUser interface
│       │   ├── comment.interface.ts     # IComment interface
│       │   └── index.ts                 # Barrel exports
│       │
│       ├── pipes/                       # Custom pipes
│       │   └── format-date.pipe.ts      # Date formatting pipe
│       │
│       └── posts.service.ts             # Legacy service (kept for compatibility)
│
├── tokens/
│   └── api.tokens.ts                    # Dependency injection tokens
│
├── app.config.ts                        # App configuration with input binding
├── app.routes.ts                        # Routing configuration
└── app.ts                              # Root component
```

---

## Component & Service Architecture

### 🎯 Components

**FeaturePostsList**

- Main posts listing with integrated filtering
- Uses PostsStore for state management
- Delegates filter operations to store methods
- Responsive grid layout with infinite scroll potential

**Filters** (Internal Component)

- Reusable three-filter system (content, user, favorites)
- Input/Output pattern for parent communication
- Reactive form controls with signal integration
- Real-time filter state synchronization

**FeaturePostDetails**

- Individual post view with input signals (Angular 19+)
- Author resolution via UsersStore caching
- Comments display with user information
- URL routing with modern input binding

**FeatureGanttView**

- Timeline visualization of posts as projects
- Mock data generation with realistic project phases
- Interactive Gantt chart with progress indicators
- Custom date formatting with pipe integration

### 🏪 Signal Stores (@ngrx/signals)

**PostsStore**

- Core posts and filtering state management
- Reactive state updates for favorites
- Computed filtered posts with reactive dependencies
- API-level user filtering optimization
- Simplified data flow without persistence

**UsersStore**

- Dedicated users data caching
- Eliminates duplicate API calls across components
- Automatic loading via withHooks lifecycle
- ShareReplay pattern for efficient data sharing

**PostDetailsStore**

- Individual post, comments, and author state
- Uses UsersStore for optimized author resolution
- Loading states and error handling
- Reactive author computation from cached users

### 🔧 Services

**PostsService** (Data Layer)

- RESTful API communication with JSONPlaceholder
- Supports query parameters for user filtering
- Centralized HTTP client usage
- Type-safe API responses

**UsersService** (Data Layer)

- Users API endpoint communication
- Shared across stores for consistent data access
- Optimized for caching strategies

**FavoritesService** (In-Memory)

- In-memory favorites management
- Signal-based reactive state
- Session-scoped favorites (reset on refresh)
- Cross-component state sharing

**GanttService** (Mock Data)

- Generates realistic project timeline data
- Mock date ranges based on post IDs
- Progress and category assignment logic
- Timeline boundary calculations

### 🔄 Custom Pipes

**FormatDatePipe**

- Polish locale date formatting
- Full and short format options
- Centralized date display logic
- Replaces scattered formatting functions
  │ └── api.tokens.ts # Injection tokens for API URLs
  └── app.routes.ts # Application routing

```

---

## Technical Implementation

### 🎯 Key Technical Highlights

**Modern Angular Patterns**
- Input signals for route parameters (`readonly id = input<string>()`)
- Effect-based reactive logic in constructors
- WithComponentInputBinding() in router configuration
- Zoneless change detection for better performance

**State Management**
- @ngrx/signals with withState, withMethods, withComputed
- Signal-based reactive state management
- Computed signals for reactive filtered data
- Simplified data flow without persistence overhead

**Performance Optimizations**
- Separate stores for different concerns (posts, users, post-details)
- API-level filtering for users to reduce client-side processing
- Clean HTTP service layer without caching complexity
- Direct API calls for fresh data on each request

**Developer Experience**
- Comprehensive TypeScript interfaces
- Dependency injection with tokens for configuration
- Custom pipes for reusable formatting logic
- Clean separation of concerns with domain-driven structure

---

## Architecture Benefits

✅ **Modern Angular 19+ Features**

- Input signals replace traditional ActivatedRoute usage
- Effect() for reactive route parameter handling
- WithComponentInputBinding for automatic parameter binding
- Zoneless design for improved performance

✅ **Scalable State Management**

- @ngrx/signals with comprehensive store features
- Signal-based reactive state management
- Computed signals for efficient re-rendering
- Separate stores prevent data coupling issues

✅ **Performance Optimized**

- API-level filtering reduces client-side computation
- Users caching eliminates duplicate API calls
- OnPush change detection strategy throughout
- Smart caching with expiration and validation

✅ **Developer & User Experience**

- Type-safe APIs with comprehensive interfaces
- Reactive patterns with signal-based architecture
- Persistent user preferences across sessions
- Responsive design with TailwindCSS utility classes
- Intuitive navigation between list, details, and timeline views
```
