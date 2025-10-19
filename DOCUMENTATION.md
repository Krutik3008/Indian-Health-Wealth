# IHWP - Complete Documentation

## Project Overview
Indian Health and Wealth Wellness Platform - A full-stack web application for Ayurvedic health assessments and wellness management.

## Tech Stack
- **Frontend**: React 18, React Router, Tailwind CSS, Axios, Formik
- **Backend**: Node.js, Express.js, SQLite3, bcryptjs, express-session
- **Database**: SQLite with users, assessments, forum_posts tables

## Quick Start

### Prerequisites
- Node.js v14+
- npm

### Installation
```bash
# Backend
cd backend
npm install
node server.js

# Frontend (new terminal)
cd frontend
npm install
npm start
```

## API Documentation

### Base URL
```
http://localhost:8081/api
```

### Authentication
The API uses session-based authentication. All requests require credentials to be included.

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and create session.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST `/api/auth/logout`
Destroy user session.

#### GET `/api/auth/me`
Check authentication status and get user info.

### Assessment Routes (`/api/assessment`)

#### POST `/api/assessment/submit`
Submit health assessment and get dosha analysis.

**Request Body:**
```json
{
  "responses": {
    "question1": "vata",
    "question2": "pitta",
    "question3": "kapha"
  }
}
```

**Response includes dosha analysis with:**
- Primary and secondary dosha
- Constitution type
- Percentages and scores
- Personalized recommendations for diet, lifestyle, exercise, and mental health

#### GET `/api/assessment/history`
Get user's assessment history (requires authentication).

### Forum Routes (`/api/forum`)

#### GET `/api/forum`
Get all forum posts with author names.

#### POST `/api/forum`
Create a new forum post.

**Request Body:**
```json
{
  "title": "Post Title",
  "content": "Post content",
  "category": "general"
}
```

#### DELETE `/api/forum/:id`
Delete a forum post by ID.

### Error Handling
- `200` - Success
- `201` - Created  
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

### Session Management
- 24-hour session validity
- Session-based authentication
- Automatic session cleanup on logout

## Database Schema

### Database Type
SQLite3 - Lightweight, file-based database (`users.db`)

### users
User account information and profiles.

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Primary key, auto-increment
- `email` - Unique user email address
- `password` - Hashed password (bcryptjs)
- `name` - User's display name
- `created_at` - Account creation timestamp

### assessments
Health assessment data and results.

```sql
CREATE TABLE assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  responses TEXT NOT NULL,
  primary_dosha TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

**Fields:**
- `id` - Primary key, auto-increment
- `user_id` - Foreign key to users table
- `responses` - JSON string of assessment responses
- `primary_dosha` - Calculated primary dosha (vata/pitta/kapha)
- `created_at` - Assessment completion timestamp

### forum_posts
Community forum posts and discussions.

```sql
CREATE TABLE forum_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);
```

**Fields:**
- `id` - Primary key, auto-increment
- `user_id` - Foreign key to users table
- `title` - Post title
- `content` - Post content/body
- `category` - Post category (default: 'general')
- `created_at` - Post creation timestamp

### Relationships
- `users` → `assessments` (One user can have multiple assessments)
- `users` → `forum_posts` (One user can create multiple posts)

### Security Considerations
- Passwords hashed using bcryptjs
- Email uniqueness enforced at database level
- Foreign key constraints prevent orphaned records
- Required fields enforced with NOT NULL constraints

### Database Operations

#### User Management
```sql
-- Create user
INSERT INTO users (email, password, name) VALUES (?, ?, ?);

-- Find user by email
SELECT * FROM users WHERE email = ?;
```

#### Assessment Management
```sql
-- Save assessment
INSERT INTO assessments (user_id, responses, primary_dosha) VALUES (?, ?, ?);

-- Get user assessments
SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC;
```

#### Forum Management
```sql
-- Create post
INSERT INTO forum_posts (user_id, title, content, category) VALUES (?, ?, ?, ?);

-- Get all posts with author names
SELECT p.*, COALESCE(u.name, 'Anonymous') as author_name 
FROM forum_posts p 
LEFT JOIN users u ON p.user_id = u.id 
ORDER BY p.created_at DESC;

-- Delete post
DELETE FROM forum_posts WHERE id = ?;
```

## Deployment Guide

### Prerequisites
- Node.js v14 or higher
- npm or yarn package manager
- SQLite3 support
- 2GB RAM minimum
- 1GB disk space

### Local Development Deployment

#### 1. Clone Repository
```bash
git clone <repository-url>
cd Indian-Health-Wealth
```

#### 2. Backend Setup
```bash
cd backend
npm install
node server.js
```
Server runs on `http://localhost:8081`

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Application runs on `http://localhost:3000`

## Production Deployment

#### Backend Deployment

##### 1. Install Dependencies
```bash
cd backend
npm install --production
```

##### 2. Environment Configuration
Create `.env` file:
```env
NODE_ENV=production
PORT=8081
SESSION_SECRET=your-secure-session-secret
DB_PATH=./users.db
CORS_ORIGIN=https://yourdomain.com
```

##### 3. Database Setup
```bash
# Ensure database file permissions
chmod 644 users.db
```

##### 4. Start with PM2
```bash
npm install -g pm2
pm2 start server.js --name "ihwp-backend"
pm2 save
pm2 startup
```

#### Frontend Deployment

##### 1. Build Production Bundle
```bash
cd frontend
npm install
npm run build
```

##### 2. Serve Static Files
Using nginx:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        root /path/to/frontend/build;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Using serve (simple option):
```bash
npm install -g serve
serve -s build -l 3000
```

### Docker Deployment

#### Backend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8081
CMD ["node", "server.js"]
```

#### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

#### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8081:8081"
    volumes:
      - ./backend/users.db:/app/users.db
    environment:
      - NODE_ENV=production
      
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

### Cloud Deployment

#### AWS Deployment

##### EC2 Instance
1. Launch EC2 instance (t3.micro or larger)
2. Install Node.js and npm
3. Clone repository and follow production steps
4. Configure security groups (ports 80, 443, 8081)

##### Elastic Beanstalk
1. Create application
2. Upload deployment package
3. Configure environment variables
4. Set up load balancer and auto-scaling

#### Heroku Deployment

##### Backend
```bash
# Create Heroku app
heroku create ihwp-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your-secret

# Deploy
git push heroku main
```

##### Frontend
```bash
# Create static site app
heroku create ihwp-frontend --buildpack mars/create-react-app

# Deploy
git push heroku main
```

### Environment Variables

#### Backend Variables
```env
NODE_ENV=production
PORT=8081
SESSION_SECRET=secure-random-string
DB_PATH=./users.db
CORS_ORIGIN=https://yourdomain.com
```

#### Frontend Variables
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENV=production
```

### SSL/HTTPS Setup

#### Using Let's Encrypt
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Nginx HTTPS Configuration
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        root /path/to/frontend/build;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Monitoring and Logging

#### PM2 Monitoring
```bash
pm2 monit
pm2 logs ihwp-backend
pm2 restart ihwp-backend
```

#### Log Management
```bash
# Rotate logs
pm2 install pm2-logrotate

# View logs
tail -f ~/.pm2/logs/ihwp-backend-out.log
```

### Database Backup

#### Automated Backup Script
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
cp users.db backups/users_$DATE.db
find backups/ -name "users_*.db" -mtime +7 -delete
```

#### Cron Job
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup-script.sh
```

### Performance Optimization

#### Backend Optimization
- Enable gzip compression
- Implement caching headers
- Use connection pooling
- Monitor memory usage

#### Frontend Optimization
- Enable service worker
- Implement lazy loading
- Optimize bundle size
- Use CDN for static assets

### Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database file permissions set
- [ ] CORS properly configured
- [ ] Session secrets randomized
- [ ] Regular security updates
- [ ] Firewall configured
- [ ] Backup strategy implemented

## Features
- User authentication with session management
- Ayurvedic dosha assessment with personalized recommendations
- Community forum for health discussions
- Assessment history tracking
- Responsive design with Tailwind CSS

## Security
- Password hashing with bcryptjs
- Session-based authentication
- CORS protection
- Parameterized SQL queries
- Input validation

## Testing
```bash
# Backend API testing
cd backend
node test_forum.js

# Frontend testing
cd frontend
npm test
```