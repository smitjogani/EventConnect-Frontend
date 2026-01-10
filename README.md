# Event Connect - Frontend

A modern, responsive, and high-performance event booking interface built with React, Tailwind CSS v4, and Framer Motion.

## Features

- 🎨 **Modern Design**: Glassmorphism aesthetic, dark mode, and smooth animations.
- 📱 **Fully Responsive**: Optimized for Mobile, Tablet, and Desktop.
- ⚡ **Performance**: Lazy loading of pages, memoized components, and optimized assets.
- 🔒 **Clean Architecture**: Modular components (`ui`, `layout`, `features`), separation of concerns.
- ♿ **Accessible**: standardized buttons and inputs.

## Project Structure

```
src/
├── components/
│   ├── layout/       # Navbar, Footer
│   └── ui/           # Reusable atoms (Button, Input, Card)
├── data/             # Mock data (Events)
├── pages/            # Page Views (Home, Detail, Booking, Auth)
├── App.jsx           # Main Router & Layout
└── index.css         # Tailwind & Global Styles
```

## Tech Stack

- **React 19**
- **Tailwind CSS 4**
- **Framer Motion** (Animations)
- **React Router DOM 7**
- **React Hook Form + Yup** (Validation)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) to view the app.

## Design Decisions

- **Visual Style**: We chose a "Nightlife/Cyber" aesthetic (Violet/Pink gradients on Dark Slate) to match the excitement of events.
- **Micro-Interactions**: Buttons scale on click, cards hover upwards, and pages fade in to create a "premium" feel.
- **Component Design**: The `Button` and `Input` components are built to be highly reusable with support for variants and states (loading, disabled).

## Next Steps (Integration)

- Connect to Spring Boot Backend.
- Replace `mockEvents.js` with API calls (`axios`).
- Implement JWT storage in `localStorage` or `cookies`.
