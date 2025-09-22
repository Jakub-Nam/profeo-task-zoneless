# Posts List Application - Angular 20 Zoneless

> A modern Angular application showcasing posts management with three-level filtering, favorites system, and clean architecture using signals and zoneless design.

---

## Features Implemented

### 🔍 Three-Level Filtering System

1. **Content Filter** - Search in post title and body (client-side filtering)
2. **User Filter** - Filter posts by user via API dropdown (server-side filtering)
3. **Favorites Filter** - Show only favorited posts (client-side filtering)

### ❤️ Favorites System

- Click heart icons (♡/♥) to toggle favorites
- Empty hearts (♡) for non-favorites, filled red hearts (♥) for favorites
- Persistent storage in localStorage via singleton service
- Real-time UI updates with signals

### 🏗️ Architecture

- **Angular 20** with zoneless design pattern
- **Signal-based** state management (no @ngrx/signals complexity)
- **Standalone components** with proper dependency injection
- **Clean separation** between API calls and local filtering

---

## Project Structure

```
src/app/
├── domains/
│   ├── feature-posts-list/           # Main posts feature
│   │   ├── feature-posts-list.ts     # Main component with filtering logic
│   │   ├── feature-posts-list.html   # Template with responsive post grid
│   │   └── internal/
│   │       └── filters/              # Reusable filters component
│   │           ├── filters.ts        # Three filter controls
│   │           └── filters.html      # Responsive filter layout
│   └── shared/                       # Shared resources
│       ├── data/                     # Data access layer
│       │   ├── posts.service.ts      # Posts API service
│       │   └── favorites.service.ts  # Favorites singleton service
│       └── models/                   # TypeScript interfaces
│           ├── post.interface.ts     # IPost interface
│           └── user.interface.ts     # IUser interface
├── tokens/
│   └── api.tokens.ts                 # Injection tokens for API URLs
└── app.routes.ts                     # Application routing
```

---

## Technical Implementation

### 🎯 Filtering Logic

## Architecture Benefits

✅ **Clean Separation of Concerns**

- API calls vs local filtering clearly separated
- Reusable components with proper inputs/outputs
- Singleton services for shared state

✅ **Performance Optimized**

- Computed signals for efficient re-rendering
- OnPush change detection strategy
- Minimal API calls with smart caching

✅ **Developer Experience**

- TypeScript interfaces for type safety
- Reactive patterns with signals
- Clear folder structure and naming conventions

✅ **User Experience**

- Instant feedback on local filters
- Persistent favorites across sessions
- Responsive design for all devices
