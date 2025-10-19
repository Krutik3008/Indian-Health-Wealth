# IHWP - Integrated Health and Wellness Platform

A full-stack web application for health and wellness management with user authentication, health assessments, forum discussions, and personalized recommendations.

## 🚀 Features

- **User Authentication** - Secure login/register system with session management
- **Health Assessment** - Interactive health evaluation forms
- **Community Forum** - Discussion platform for health topics
- **Personalized Recommendations** - Health and wellness suggestions
- **Recipe Management** - Healthy recipe collection
- **Assessment History** - Track health progress over time
- **Admin Dashboard** - Administrative controls and user management

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Formik & Yup** - Form handling and validation
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** - Database
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
ihwp/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── context/          # React context providers
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service functions
│   │   ├── styles/           # CSS styles
│   │   └── utils/            # Utility functions
│   └── package.json
├── backend/                  # Node.js backend API
│   ├── models/               # Database models
│   ├── routes/               # API route handlers
│   ├── test_forum.js         # API testing script
│   ├── server.js             # Main server file
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ihwp
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   node server.js
   ```
   Backend will run on `http://localhost:8081`

3. **Frontend Setup** (Open new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend will run on `http://localhost:3000`

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   node server.js
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the Application**
   - Open browser and go to `http://localhost:3000`
   - Register a new account or login with existing credentials

## 🧪 Testing

### API Testing
Test the forum API endpoints:
```bash
cd backend
node test_forum.js
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status

### Forum
- `GET /api/forum` - Get all forum posts
- `POST /api/forum` - Create new forum post

### Assessment
- `POST /api/assessment` - Submit health assessment
- `GET /api/assessment/history` - Get assessment history
  
## 🔧 Configuration

### Backend Configuration
- **Port**: 8081 (configurable in `server.js`)
- **Database**: SQLite (`users.db`)
- **Session Secret**: Update in production

### Frontend Configuration
- **API Base URL**: `http://localhost:8081/api`
- **Development Port**: 3000

## 🗄️ Database

The application uses SQLite database with the following tables:
- **users** - User accounts and profiles
- **assessments** - Health assessment data
- **forum_posts** - Forum discussions
- **admin_users** - Administrative accounts

## 🔐 Security Features

- Password hashing with bcryptjs
- Session-based authentication
- CORS protection
- Input validation
- Protected routes

## 📝 Development Workflow

1. **Backend Development**
   ```bash
   cd backend
   npm run dev  # Uses nodemon for auto-restart
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   npm start    # Hot reload enabled
   ```

3. **Testing Changes**
   - Test API endpoints using `test_forum.js`
   - Use browser dev tools for frontend debugging

## 🚀 Production Deployment

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve the build folder with a static server
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change port in `server.js` or kill existing process

2. **Database connection issues**
   - Ensure SQLite3 is properly installed
   - Check database file permissions

3. **CORS errors**
   - Verify frontend URL in backend CORS configuration
   - Check if both servers are running

4. **Module not found errors**
   - Run `npm install` in respective directories
   - Clear node_modules and reinstall if needed
