# Portfolio Server API

A robust backend API for portfolio websites built with Express.js, TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Blog Management**: Create, read, update, and delete blog posts
- **Project Management**: Manage portfolio projects with detailed information
- **Role-Based Access**: Public and private routes with middleware protection
- **Pagination**: Built-in pagination for all list endpoints
- **Search Functionality**: Search blogs and projects
- **TypeScript**: Full type safety throughout the application
- **Prisma ORM**: Modern database toolkit with type-safe queries

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn package manager

## 🔧 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Arifulit/portfolio-server.git
cd portfolio-server
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and update with your configuration:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Step 4: Database Setup

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

### Step 5: Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@portfolio.com",
  "password": "admin123456"
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

### Blog Endpoints

#### Get All Blogs (Public)
```http
GET /api/blogs?page=1&limit=10&search=nextjs
```

#### Get Single Blog
```http
GET /api/blogs/:id
```

#### Get All Blogs for Dashboard (Private)
```http
GET /api/blogs/dashboard/all?status=all
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Create Blog (Private)
```http
POST /api/blogs
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "My Blog Post",
  "description": "Short description",
  "content": "Full blog content here...",
  "image": "https://example.com/image.jpg",
  "published": true
}
```

#### Update Blog (Private)
```http
PUT /api/blogs/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Updated Title",
  "published": true
}
```

#### Toggle Publish Status (Private)
```http
PATCH /api/blogs/:id/publish
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Delete Blog (Private)
```http
DELETE /api/blogs/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

### Project Endpoints

#### Get All Projects (Public)
```http
GET /api/projects?page=1&limit=10&search=ecommerce
```

#### Get Single Project
```http
GET /api/projects/:id
```

#### Get Project Statistics (Private)
```http
GET /api/projects/dashboard/stats
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Create Project (Private)
```http
POST /api/projects
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "E-commerce Platform",
  "description": "A full-stack e-commerce solution",
  "thumbnail": "https://example.com/thumb.jpg",
  "liveUrl": "https://example.com",
  "githubUrl": "https://github.com/user/repo",
  "features": [
    "User authentication",
    "Shopping cart",
    "Payment integration"
  ],
  "technologies": [
    "Next.js",
    "TypeScript",
    "Prisma"
  ]
}
```

#### Update Project (Private)
```http
PUT /api/projects/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Updated Project Name"
}
```

#### Delete Project (Private)
```http
DELETE /api/projects/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Blog Model
```prisma
model Blog {
  id          String   @id @default(cuid())
  title       String
  content     String   @db.Text
  description String
  image       String?
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Project Model
```prisma
model Project {
  id           String   @id @default(cuid())
  title        String
  description  String   @db.Text
  thumbnail    String?
  liveUrl      String?
  githubUrl    String?
  features     String[]
  technologies String[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Production
npm run build            # Build TypeScript to JavaScript
npm start                # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio GUI
npm run prisma:seed      # Seed database with sample data
npm run prisma:reset     # Reset database (WARNING: deletes all data)
```

## 🔐 Default Admin Credentials

After seeding the database:
- **Email**: admin@portfolio.com
- **Password**: admin123456

⚠️ **Important**: Change these credentials in production!

## 📦 Project Structure

```
portfolio-server/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeding script
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── authController.ts
│   │   ├── blogController.ts
│   │   └── projectController.ts
│   ├── middleware/         # Custom middleware
│   │   └── authMiddleware.ts
│   ├── routes/             # API routes
│   │   ├── authRoutes.ts
│   │   ├── blogRoutes.ts
│   │   └── projectRoutes.ts
│   ├── utils/              # Utility functions
│   │   └── prisma.ts
│   └── index.ts            # Application entry point
├── .env                    # Environment variables (not in git)
├── .env.example            # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🚨 Common Issues & Solutions

### Issue: Prisma Client Not Generated
```bash
npm run prisma:generate
```

### Issue: Database Connection Failed
- Check your DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify database credentials

### Issue: Port Already in Use
- Change PORT in .env file
- Or kill the process using the port

### Issue: JWT Token Invalid
- Check JWT_SECRET in .env
- Ensure token is properly formatted: `Bearer YOUR_TOKEN`

## 🧪 Testing the API

### Using cURL

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@portfolio.com","password":"admin123456"}'

# Get all blogs
curl http://localhost:5000/api/blogs
```

### Using Postman

Import the Postman collection from `PostmanCollection.json` (if available) or manually create requests based on the API documentation above.

## 🌐 Deployment

### Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Run migrations
heroku run npm run prisma:migrate
```

### Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Set up environment variables in Vercel dashboard
4. Deploy: `vercel --prod`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Ariful Islam**
- GitHub: [@Arifulit](https://github.com/Arifulit)

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- Prisma team for the excellent ORM
- TypeScript team for type safety