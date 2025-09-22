# Frontend Angular — Project Documentation (Template)

> Short description: a simple frontend built with Angular 20 (OnPush, zoneless), Tailwind v4, state management powered by Signal Store.

---

## Table of Contents

1. [Overview](#overview)
2. [Requirements](#requirements)
3. [Features](#features)
4. [Example Folder Structure](#example-folder-structure)
5. [Architecture — Services & State Management (Signal Store)](#architecture)
6. [Injection Token for API URL](#injection-token-for-api-url)
7. [Example Signal Store — posts & favorites](#example-signal-store)
8. [Singleton Cache Service](#singleton-cache)
9. [Components — OnPush & Zoneless Guidelines](#components)
10. [Tailwind v4 — Theme Variables & Example Config](#tailwind-v4)
11. [Gantt View Tab — Implementation Notes](#gantt)
12. [Checklist for Project Adaptation](#checklist)

---

## Overview

The project is a frontend blog/posts application with the following views:

- Posts list
- Post details
- Filtering (search / tags)
- Favorites list (add/remove)
- Gantt view tab (timeline/schedule)

Application state is managed with **Signal Store** (based on Angular signals) — fetching posts and handling favorites.

The API base URL is provided via an **Injection Token**.

The app targets Angular 20, with components using `ChangeDetectionStrategy.OnPush`. The architecture is **zoneless** — relying on signals and effects instead of Zone.js for UI updates.

Styling: **Tailwind v4**, theme variables (CSS custom properties + Tailwind config). Layouts are based on Flexbox.

---

## Requirements

- Node.js LTS
- Angular CLI (optional) or `bootstrapApplication` (preferred for zoneless)
- Angular 20
- Tailwind v4

---

## Features

- Posts list (with optional pagination / virtual scroll)
- Post details
- Filtering (by text, tags)
- Favorites: add/remove with localStorage persistence
- Singleton cache service for API responses
- Gantt view tab for timeline/scheduling

---

## Example Folder Structure

You can adapt this folder structure to your needs — this is just a template.

src/
├─ app/
│ ├─ core/ # singletons, tokens, global services
│ │ ├─ tokens.ts
│ │ ├─ api/ # backend communication services
│ │ │ └─ posts.service.ts
│ │ └─ cache.service.ts # singleton cache
│ ├─ features/
│ │ ├─ posts/ # posts list and details
│ │ │ ├─ components/
│ │ │ │ ├─ posts-list/
│ │ │ │ └─ post-details/
│ │ │ ├─ stores/
│ │ │ │ └─ posts.store.ts
│ │ │ └─ posts.module.ts
│ │ └─ gantt/ # gantt view tab
│ │ └─ gantt.component.ts
│ ├─ shared/ # shared components/pipes/directives
│ └─ app.component.ts
├─ assets/
└─ styles/
└─ tailwind.css

---

## Architecture

- **Services**: HttpClient wrappers (e.g., posts API). Provided as singletons in `core`.
- **Injection Token**: used for base API URL (environment-dependent).
- **Signal Store**: one per feature (e.g., posts), using `signal`, `computed`, `effect` and action methods (`fetch`, `addFavorite`, `removeFavorite`).
- **Cache**: singleton cache service (`core/cache.service.ts`) prevents redundant API calls.

---
