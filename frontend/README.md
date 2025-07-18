# SQLite Task Manager - Full Stack

A complete full-stack task management application with React frontend and Node.js backend connected to SQLite database.

## Features

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling with dark mode support
- **Authentication** with JWT tokens
- **Real-time task management** with CRUD operations
- **Task filtering** by status and priority
- **Responsive design** for all devices
- **Offline detection** and error handling

### Backend
- **Node.js** with Express server
- **SQLite** database with proper schema
- **JWT authentication** with bcrypt password hashing
- **RESTful API** with proper error handling
- **CORS** enabled for frontend communication

## Quick Start

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm run setup

# Or install manually:
npm install
cd backend && npm install
```

### 2. Start Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:frontend  # Frontend on http://localhost:5173
npm run dev:backend   # Backend on http://localhost:3001
```

### 3. Create Account
- Open http://localhost:5173
- Click "Sign up" to create a new account
- Start managing your tasks!

## Project Structure

```
├── src/                    # Frontend React app
│   ├── components/         # React components
│   ├── services/          # API service layer
│   └── App.tsx            # Main app component
├── backend/               # Node.js backend
│   ├── server.js          # Express server
│   ├── tasks.db           # SQLite database (auto-created)
│   └── package.json       # Backend dependencies
└── package.json           # Frontend dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Tasks
- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  user_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## Environment Variables

Create `backend/.env`:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
NODE_ENV=development
```

## Production Deployment

### Backend
1. Set strong JWT_SECRET in production
2. Use process manager like PM2
3. Set up reverse proxy with Nginx
4. Enable HTTPS

### Frontend
1. Build: `npm run build`
2. Deploy `dist/` folder to static hosting
3. Update API_BASE URL in `src/services/api.ts`

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, SQLite3, JWT, bcrypt
- **Development**: ESLint, Concurrently, Nodemon

## License

MIT License - feel free to use this project for learning or production!