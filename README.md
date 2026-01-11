# EventConnect - Frontend Documentation

> Event Connect 

---

## 📋 Table of Contents

- [Quick Setup](#quick-setup)
- [Assumptions](#assumptions)
- [Design Notes](#design-notes)
- [JWT Token Management](#jwt-token-management)
- [Design Philosophy](#design-philosophy)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Component Patterns](#component-patterns)

---

## 🚀 Quick Setup

### Prerequisites
- Node.js 16+ and npm 8+
- Backend API running on `http://localhost:8080`

### Installation

```bash
# Navigate to Client directory
cd Client

# Install dependencies
npm install

# Create .env file (optional)
echo "VITE_API_BASE_URL=http://localhost:8080/api/v1" > .env

# Run development server
npm run dev
```

**Access**: http://localhost:5173

### Build for Production

```bash
npm run build
# Output in /dist folder

# Preview production build
npm run preview
```

---

## 🌐 Deployment

### Live Production URL
🔗 **Frontend**: [https://eventconnectbook.netlify.app](https://eventconnectbook.netlify.app)

### Deployment Platform: Netlify

The frontend is deployed on **Netlify** with automatic deployments from GitHub.

#### Environment Configuration

The production API URL is configured in `.env.production`:

```env
VITE_API_URL=https://eventconnect-backend-production.up.railway.app/api/v1
```

This file is committed to the repository and automatically used during Netlify builds.

#### Deployment Steps

1. **Connect GitHub Repository**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and authorize Netlify
   - Select `EventConnect-Frontend` repository

2. **Configure Build Settings**
   ```
   Base directory: (leave empty)
   Build command: npm run build
   Publish directory: dist
   ```

3. **Deploy**
   - Click "Deploy site"
   - Netlify automatically builds and deploys
   - Every push to `main` branch triggers a new deployment

4. **Custom Domain (Optional)**
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Follow DNS configuration instructions

#### Build Configuration

Netlify uses the following configuration (auto-detected from `package.json`):

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

#### Environment Variables (Not Required)

Since `.env.production` is committed, **no environment variables need to be set in Netlify**. The API URL is baked into the build.

If you need to override the API URL:
1. Go to Site settings → Environment variables
2. Add:
   ```
   VITE_API_URL=https://your-backend-url.com/api/v1
   ```

#### CORS Configuration

Ensure the backend allows requests from the Netlify domain. In the backend's `application-prod.properties`:

```properties
cors.allowed-origins=http://localhost:5173,https://eventconnectbook.netlify.app
```

#### Deployment Status

- ✅ **Auto-deploy**: Enabled on `main` branch
- ✅ **Build time**: ~1-2 minutes
- ✅ **CDN**: Global edge network
- ✅ **HTTPS**: Automatic SSL certificate

#### Testing the Deployment

1. **Visit the live URL**: https://eventconnectbook.netlify.app
2. **Test API connection**: Open browser console and check for successful API calls
3. **Test authentication**: Try logging in with admin credentials
4. **Test booking flow**: Browse events and create a booking

#### Rollback

If a deployment fails:
1. Go to Netlify Dashboard → Deploys
2. Find the last successful deployment
3. Click "..." → "Publish deploy"

---

## 📝 Assumptions

### User Behavior
- Users have modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- JavaScript is enabled
- Cookies and localStorage are available
- Users have stable internet connection for API calls

### Data Assumptions
- All events have valid image URLs
- Event dates are in ISO 8601 format
- Prices are in INR (₹)
- QR codes are sufficient for ticket verification
- Users provide valid email addresses

### Technical Assumptions
- Backend API is RESTful and returns JSON
- JWT tokens are used for authentication
- CORS is properly configured on backend
- Backend handles all business logic and validation
- Images are hosted externally (Unsplash, etc.)

### Security Assumptions
- HTTPS is used in production
- Tokens are stored in localStorage (acceptable for this use case)
- Backend validates all requests
- XSS protection via React's built-in escaping
- CSRF protection not needed (JWT in headers, not cookies)

---

## 🎯 Design Notes

### Architecture Decisions

#### **1. React Context over Redux**
**Why**: Simpler state management for small-to-medium apps
- Less boilerplate code
- Easier to understand and maintain
- Sufficient for authentication state
- No need for complex middleware

**Trade-off**: Less powerful for complex state management

#### **2. Vite over Create React App**
**Why**: Faster development experience
- Instant HMR (Hot Module Replacement)
- Faster builds
- Better tree-shaking
- Modern tooling

**Trade-off**: Newer ecosystem, fewer examples

#### **3. Tailwind CSS over Component Libraries**
**Why**: Full design control and customization
- No design constraints
- Smaller bundle size
- Consistent design system
- Easy to customize

**Trade-off**: More manual styling work

#### **4. Axios over Fetch**
**Why**: Better developer experience
- Request/response interceptors
- Automatic JSON transformation
- Better error handling
- Request cancellation

**Trade-off**: Additional dependency

#### **5. React Hook Form over Formik**
**Why**: Better performance
- Less re-renders
- Smaller bundle size
- Better TypeScript support
- Simpler API

**Trade-off**: Less community resources

### UI/UX Decisions

- **Dark Theme First**: Reduces eye strain, modern aesthetic
- **Mobile-First**: Ensures responsive design from the start
- **Lazy Loading**: Improves initial load time
- **Optimistic UI**: Better perceived performance
- **Micro-animations**: Enhances user engagement

---

## 🔐 JWT Token Management

### Token Storage Strategy

EventConnect uses **localStorage** for token storage with automatic refresh mechanism.

#### **Why localStorage?**
- ✅ Persists across browser sessions
- ✅ Accessible from JavaScript
- ✅ Simple implementation
- ✅ Works with SPA architecture

#### **Security Considerations**
- ✅ Not vulnerable to CSRF (tokens in headers, not cookies)
- ✅ Tokens have expiration
- ✅ Refresh token rotation

### Token Flow

```
User Login
    ↓
Backend returns:
  - accessToken (15 min expiry)
  - refreshToken (7 days expiry)
  - user info (name, email, role)
    ↓
Store in localStorage:
  - 'accessToken'
  - 'refreshToken'
  - 'user' (JSON)
    ↓
All API requests include:
  Authorization: Bearer {accessToken}
    ↓
Token expires (401/403)
    ↓
Axios interceptor catches error
    ↓
Call /auth/refresh-token
    ↓
Update accessToken
    ↓
Retry original request
    ↓
If refresh fails → Logout
```

### Implementation Details

#### **1. Storing Tokens (AuthContext.jsx)**

```javascript
const login = async (email, password) => {
  const response = await api.post('/auth/authenticate', { email, password });
  const { accessToken, refreshToken, name, email, role } = response.data;
  
  // Store tokens
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('user', JSON.stringify({ name, email, role }));
  
  // Update context state
  setUser({ name, email, role });
};
```

#### **2. Attaching Tokens to Requests (api.js)**

```javascript
// Axios request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

#### **3. Automatic Token Refresh (api.js)**

```javascript
// Axios response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401/403 and not already retried
    if ((error.response?.status === 401 || error.response?.status === 403) 
        && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          'http://localhost:8080/api/v1/auth/refresh-token',
          { refreshToken }
        );
        
        const { accessToken } = response.data;
        
        // Update stored token
        localStorage.setItem('accessToken', accessToken);
        
        // Update request header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

#### **4. Logout (AuthContext.jsx)**

```javascript
const logout = () => {
  // Clear all stored data
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  
  // Clear context state
  setUser(null);
  
  // Redirect to login
  navigate('/login');
};
```

#### **5. Protected Routes (App.jsx)**

```javascript
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};
```

### Token Lifecycle

| Event | Action | Result |
|-------|--------|--------|
| **Login** | Store tokens in localStorage | User authenticated |
| **API Call** | Attach accessToken to header | Request authorized |
| **Token Expires** | Interceptor catches 401 | Auto-refresh triggered |
| **Refresh Success** | Update accessToken | Request retried |
| **Refresh Fails** | Clear storage | User logged out |
| **Logout** | Clear localStorage | User unauthenticated |

### Security Best Practices

✅ **Implemented**:
- Short-lived access tokens (15 min)
- Long-lived refresh tokens (7 days)
- Automatic token refresh
- Secure token transmission (HTTPS in production)
- Token validation on backend

⚠️ **Considerations**:
- XSS vulnerability (mitigated by React)
- No token encryption in localStorage
- Single device logout only

🔮 **Future Enhancements**:
- HttpOnly cookies for refresh tokens
- Token encryption
- Multi-device logout
- Token revocation list
- Fingerprinting

---

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
