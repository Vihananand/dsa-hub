# DSA Hub 🚀

A modern, full-stack web application for Data Structures and Algorithms practice, built with Next.js 13+ and featuring a sleek, animated UI with comprehensive question management and progress tracking.

## 🌟 Features

### 🎯 Question Management
- **Comprehensive Question Library**: Browse through curated coding challenges with detailed information
- **Smart Filtering & Search**: Filter questions by topic, difficulty level, and search by title
- **Difficulty Statistics**: Real-time stats showing Easy, Medium, Hard, and total question counts
- **Dynamic Loading**: Enhanced loading screens with progress indicators and animated transitions

### 📊 Progress Tracking
- **Local Storage Progress**: Track completed and revised questions (browser-based storage)
- **Visual Progress Bars**: Beautiful animated progress bars showing completion percentages
- **Achievement Badges**: Unlock badges for milestones (First 10, Half Century, Centurion, Reviewer)
- **Dual Progress Types**: Separate tracking for "done" and "revised" questions
- **Progress Statistics**: Detailed analytics of your solving journey

### 🎨 Modern UI/UX
- **Glass Morphism Design**: Beautiful glassmorphic cards with glow effects
- **Framer Motion Animations**: Smooth transitions and micro-interactions throughout
- **Responsive Layout**: Perfectly optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Sleek dark theme with gradient backgrounds and particle effects
- **Loading Animations**: Professional skeleton loading with shimmer effects

### 🔐 Admin Dashboard
- **Secure Authentication**: JWT-based admin authentication with HTTP-only cookies
- **User Management**: Create, view, and delete admin users
- **Dashboard Statistics**: Comprehensive stats on questions, users, and system metrics
- **Password Management**: Secure password change functionality
- **Session Management**: Automatic logout and session validation

### 🛠️ Technical Features
- **Next.js 13+ App Router**: Modern React framework with server-side rendering
- **PostgreSQL Database**: Robust database with optimized queries
- **RESTful API**: Well-structured API endpoints with proper error handling
- **Security**: bcrypt password hashing, input validation, CSRF protection
- **Performance**: Optimized loading, code splitting, and image optimization

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📱 Pages & Features

### 🏠 Home Page (`/`)
- Welcome landing page with navigation to main features
- Modern hero section with call-to-action buttons

### 📚 Questions Page (`/questions`)
- Browse all coding questions with advanced filtering
- Search by title, filter by topic and difficulty
- Real-time statistics display
- Responsive grid layout with smooth animations

### 📈 Progress Page (`/progress`)
- Track your solving progress with visual indicators
- Separate tracking for completed and revised questions
- Achievement badge system
- Progress analytics and statistics

### 🔐 Admin Panel (`/admin`)
- Secure login for administrators
- Dashboard with system statistics
- User management (create/delete admin users)
- Password change functionality

## 🛠️ Tech Stack

- **Frontend**: Next.js 13+, React 18+, Framer Motion, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL
- **Authentication**: JWT tokens, bcrypt password hashing
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **Database**: PostgreSQL with connection pooling
- **Deployment Ready**: Optimized for production deployment

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd dsa-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables (create `.env.local`):
   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. Set up the database:
   ```sql
   -- Create questions table
   CREATE TABLE questions (
     id SERIAL PRIMARY KEY,
     serial INTEGER UNIQUE,
     title TEXT NOT NULL,
     difficulty TEXT,
     topic TEXT,
     solved BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Create admin table
   CREATE TABLE admin (
     id SERIAL PRIMARY KEY,
     username VARCHAR(50) UNIQUE NOT NULL,
     password TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## 🎯 Usage

1. **Browse Questions**: Visit `/questions` to explore the question library
2. **Track Progress**: Use `/progress` to monitor your solving journey
3. **Admin Access**: Go to `/admin` for administrative functions
4. **Responsive Design**: Works perfectly on all device sizes

## 🔧 API Endpoints

- `GET /api/questions` - Fetch all questions
- `POST /api/admin` - Admin authentication
- `GET /api/admin/me` - Get current admin profile
- `GET /api/admin/stats` - Dashboard statistics
- `POST /api/admin/users` - Create admin user
- And more...

## 🚀 Performance Features

- **Optimized Loading**: Smart skeleton loading with shimmer effects
- **Efficient Filtering**: Client-side filtering for instant results
- **Smooth Animations**: 60fps animations with Framer Motion
- **Responsive Images**: Next.js image optimization
- **Code Splitting**: Automatic route-based code splitting

## 🎨 Design Philosophy

DSA Hub follows modern design principles:
- **Glassmorphism**: Translucent cards with backdrop blur effects
- **Dark Theme**: Comfortable coding environment
- **Micro-interactions**: Delightful hover and click animations
- **Visual Hierarchy**: Clear information architecture
- **Accessibility**: WCAG compliant design patterns

## 📚 Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Framer Motion](https://www.framer.com/motion/) - Animation library documentation
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [PostgreSQL](https://www.postgresql.org/docs/) - Database documentation

## 🚢 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

**Built with ❤️ for the coding community**
