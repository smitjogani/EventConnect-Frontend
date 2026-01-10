# EventConnect - Frontend Documentation

## 🎨 Design Philosophy & Branding

### Brand Identity
**EventConnect** is a premium event booking platform designed to deliver a **bold, modern, and immersive** user experience. The brand embodies:

- **Energy & Excitement**: Vibrant neon green accents evoke the thrill of live events
- **Sophistication**: Deep black backgrounds create an upscale, premium feel
- **Trust & Reliability**: Clean typography and consistent spacing build user confidence
- **Accessibility**: High contrast ratios ensure readability for all users

### Design Psychology
The interface leverages psychological principles to drive user engagement:

1. **Dark Mode First**: Reduces eye strain and creates focus on content
2. **Neon Accents**: Draw attention to CTAs and important information
3. **Generous Whitespace**: Prevents cognitive overload
4. **Micro-animations**: Provide feedback and delight users
5. **Card-based Layouts**: Organize information into digestible chunks

---

## 🎨 Color Palette

### Primary Colors
```css
--primary-black: #050505      /* Main background */
--primary-green: #00E599      /* Brand accent, CTAs */
--pure-white: #FFFFFF         /* Text, highlights */
```

### Secondary Colors
```css
--dark-gray: #111111          /* Card backgrounds */
--medium-gray: #404040        /* Borders, dividers */
--light-gray: #808080         /* Secondary text */
--error-red: #EF4444          /* Errors, destructive actions */
--success-green: #10B981      /* Success states */
```

### Opacity Variants
```css
--white-10: rgba(255, 255, 255, 0.1)   /* Subtle borders */
--white-20: rgba(255, 255, 255, 0.2)   /* Hover states */
--black-80: rgba(0, 0, 0, 0.8)         /* Overlays */
```

---

## 🔤 Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 
             'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Font Weights
- **Regular (400)**: Body text
- **Bold (700)**: Subheadings, labels
- **Black (900)**: Headlines, CTAs

### Type Scale
```css
--text-xs: 0.75rem      /* 12px - Labels, captions */
--text-sm: 0.875rem     /* 14px - Secondary text */
--text-base: 1rem       /* 16px - Body text */
--text-lg: 1.125rem     /* 18px - Large body */
--text-xl: 1.25rem      /* 20px - Small headings */
--text-2xl: 1.5rem      /* 24px - Section headings */
--text-3xl: 1.875rem    /* 30px - Page headings */
--text-4xl: 2.25rem     /* 36px - Hero headings */
--text-5xl: 3rem        /* 48px - Large hero */
```

### Text Styles
- **Uppercase + Letter Spacing**: Used for labels, CTAs, and emphasis
- **Tracking Tight**: Headlines for impact
- **Tracking Wide**: Labels for clarity

---

## 📁 Project Structure

```
Client/
├── public/                    # Static assets
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── layout/          # Layout components
│   │   │   ├── Layout.jsx   # Main layout wrapper
│   │   │   ├── Navbar.jsx   # Navigation bar (responsive)
│   │   │   └── Footer.jsx   # Site footer
│   │   └── ui/              # UI primitives
│   │       ├── Button.jsx   # Button component
│   │       ├── Input.jsx    # Form input
│   │       ├── TicketUI.jsx # Ticket card display
│   │       └── ConfirmModal.jsx # Confirmation dialog
│   │
│   ├── pages/               # Route pages
│   │   ├── Home.jsx         # Landing page
│   │   ├── Events.jsx       # Event listing (search, filter, pagination)
│   │   ├── EventDetail.jsx  # Single event view
│   │   ├── Login.jsx        # User authentication
│   │   ├── Register.jsx     # User registration
│   │   ├── Booking.jsx      # Event booking form
│   │   ├── MyBookings.jsx   # User's booked tickets
│   │   ├── TicketReceipt.jsx # Digital ticket with QR
│   │   └── admin/           # Admin panel
│   │       ├── Dashboard.jsx    # Event management dashboard
│   │       ├── CreateEvent.jsx  # Create new event
│   │       └── EditEvent.jsx    # Edit existing event
│   │
│   ├── context/             # React Context providers
│   │   └── AuthContext.jsx  # Authentication state management
│   │
│   ├── services/            # API & external services
│   │   └── api.js           # Axios instance with interceptors
│   │
│   ├── data/                # Static data & constants
│   │   └── dummy.js         # Fallback/demo data
│   │
│   ├── App.jsx              # Main app component & routing
│   ├── index.css            # Global styles & Tailwind
│   └── main.jsx             # React entry point
│
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
└── tailwind.config.js       # Tailwind CSS configuration
```

---

## 🛠️ Tech Stack

### Core
- **React 18**: UI library with hooks
- **Vite**: Lightning-fast build tool
- **React Router DOM**: Client-side routing

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for micro-interactions

### Form Management
- **React Hook Form**: Performant form validation
- **Yup**: Schema validation

### HTTP Client
- **Axios**: Promise-based HTTP client with interceptors

### Icons
- **Lucide React**: Beautiful, consistent icon set

---

## 🎯 Key Features

### User Features
1. **Browse Events**: Search, filter by category, paginate
2. **Event Details**: View comprehensive event information with dynamic map
3. **Secure Booking**: JWT-authenticated ticket purchases
4. **My Tickets**: View all bookings with digital receipts
5. **QR Tickets**: Scannable QR codes for entry

### Admin Features
1. **Event Management Dashboard**: View all events in responsive table
2. **Create Events**: Rich form with live preview
3. **Edit Events**: Update event details with pre-populated data
4. **Delete Events**: Confirmation modal prevents accidental deletion
5. **Role-based Access**: Admin-only routes protected

### Technical Features
1. **Responsive Design**: Mobile-first, works on all screen sizes
2. **Token Refresh**: Automatic JWT refresh prevents logout
3. **Scroll to Top**: Pages always start at top on navigation
4. **Image Fallbacks**: Graceful handling of missing images
5. **Loading States**: Skeleton screens and spinners
6. **Error Handling**: User-friendly error messages

---

## 🔐 Authentication Flow

### Registration
1. User fills registration form (name, email, password)
2. Frontend validates input (Yup schema)
3. POST `/api/v1/auth/register`
4. Backend returns `accessToken`, `refreshToken`, `role`
5. Tokens stored in localStorage
6. User redirected based on role (Admin → `/admin`, User → `/`)

### Login
1. User enters credentials
2. POST `/api/v1/auth/authenticate`
3. Receive tokens + role
4. Store in localStorage
5. Redirect based on role

### Token Refresh
1. API request receives 401/403
2. Axios interceptor catches error
3. Calls POST `/api/v1/auth/refresh-token` with `refreshToken`
4. Updates `accessToken` in localStorage
5. Retries original request
6. If refresh fails → logout and redirect to `/login`

---

## 🎨 Component Design Patterns

### Button Component
```jsx
<Button 
  variant="primary|outline|ghost"
  size="sm|md|lg"
  to="/path"           // For Link buttons
  onClick={handler}    // For action buttons
  isLoading={boolean}  // Shows spinner
>
  Button Text
</Button>
```

### Confirm Modal
```jsx
<ConfirmModal
  isOpen={boolean}
  onClose={handler}
  onConfirm={handler}
  title="Action Title"
  message="Detailed message"
  confirmText="Confirm"
  cancelText="Cancel"
  type="danger|warning|info"
/>
```

### Protected Route
```jsx
<ProtectedRoute requireAdmin={true}>
  <AdminComponent />
</ProtectedRoute>
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large screens */
```

### Responsive Patterns Used
- **Mobile**: Single column, stacked cards, hamburger menu
- **Tablet**: 2-column grids, visible sidebar
- **Desktop**: Multi-column layouts, hover states, larger typography

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js >= 16.x
npm >= 8.x
```

### Installation
```bash
cd Client
npm install
```

### Development
```bash
npm run dev
# Runs on http://localhost:5173
```

### Build
```bash
npm run build
# Output in /dist folder
```

### Preview Production Build
```bash
npm run preview
```

---

## 🔧 Configuration

### Environment Variables
Create `.env` file in `Client/` directory:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### API Configuration (`src/services/api.js`)
```javascript
const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: { 'Content-Type': 'application/json' }
});
```

---

## 🎨 Design System Usage

### Spacing Scale
```css
/* Tailwind spacing (4px base) */
gap-2  = 8px
gap-4  = 16px
gap-6  = 24px
gap-8  = 32px
p-4    = 16px padding
m-6    = 24px margin
```

### Border Radius
```css
rounded-lg  = 0.5rem (8px)   /* Cards */
rounded-xl  = 0.75rem (12px) /* Buttons */
rounded-2xl = 1rem (16px)    /* Modals */
rounded-full = 9999px        /* Pills, avatars */
```

### Shadows
```css
shadow-sm   /* Subtle elevation */
shadow-md   /* Card elevation */
shadow-lg   /* Modal elevation */
shadow-2xl  /* Hero elements */
```

---

## 🧩 State Management

### Global State (Context API)
- **AuthContext**: User authentication, login/logout, role

### Local State (useState)
- Component-specific UI state
- Form data (managed by React Hook Form)
- Loading/error states

### Server State (API calls)
- Events data
- Bookings data
- User data

---

## 🔄 Data Flow

### Fetching Events
```
Events.jsx → api.get('/events') → Backend → Response
  ↓
State Update (setEvents)
  ↓
Re-render with data
```

### Creating Booking
```
Booking.jsx → Form Submit → api.post('/bookings')
  ↓
Success → Navigate to Confirmation
  ↓
User clicks "View Tickets" → Navigate to /my-bookings
```

---

## 🎭 Animation Patterns

### Page Transitions
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
```

### Button Hover
```css
transition-colors duration-200
hover:bg-white hover:text-black
```

### Modal Entry/Exit
```jsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    />
  )}
</AnimatePresence>
```

---

## 🐛 Error Handling

### API Errors
```javascript
try {
  const response = await api.get('/events');
  setData(response.data);
} catch (err) {
  console.error("Error:", err);
  setError("Failed to load events. Please try again.");
}
```

### Form Validation
```javascript
const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(6).required()
});
```

### Image Fallbacks
```jsx
<img 
  src={event.imageUrl} 
  onError={(e) => { 
    e.target.src = 'https://fallback-image-url.jpg' 
  }}
/>
```

---

## 📊 Performance Optimizations

1. **Code Splitting**: React.lazy() for route-based splitting
2. **Image Optimization**: WebP format, lazy loading
3. **Debounced Search**: 300ms delay on search input
4. **Pagination**: Load 10-20 events per page
5. **Memoization**: React.memo for expensive components

---

## ♿ Accessibility

- **Semantic HTML**: Proper heading hierarchy, landmarks
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Tab order, focus states
- **Color Contrast**: WCAG AA compliant (4.5:1 minimum)
- **Focus Indicators**: Visible focus rings on interactive elements

---

## 🧪 Testing Recommendations

### Unit Tests
- Component rendering
- Form validation
- Utility functions

### Integration Tests
- API calls with mocked responses
- Authentication flow
- Booking flow

### E2E Tests
- User registration → Login → Browse → Book → View Ticket
- Admin: Create → Edit → Delete event

---

## 📦 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
```bash
# Connect GitHub repo
# Set build command: npm run build
# Set publish directory: dist
# Add environment variables
```

### Environment Variables (Production)
```
VITE_API_BASE_URL=https://your-backend-api.com/api/v1
```

---

## 🤝 Contributing

### Code Style
- Use functional components with hooks
- Follow Tailwind utility-first approach
- Keep components small and focused
- Use meaningful variable names
- Add comments for complex logic

### Git Workflow
```bash
git checkout -b feature/your-feature
# Make changes
git commit -m "feat: add feature description"
git push origin feature/your-feature
# Create Pull Request
```

---
