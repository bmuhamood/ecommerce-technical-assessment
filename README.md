# eCommerce Product Listing Module

**Technical Project Manager Assessment - Dream Come True Group**

## 🚀 Project Overview

A full-stack eCommerce product listing module demonstrating modern web development practices, AWS cloud integration, and project management capabilities.

**Live Demo Features:**
- Product listing with real-time updates
- Add new products via intuitive form
- Responsive design (mobile-friendly)
- RESTful API architecture
- AWS deployment-ready

---

## 📋 Table of Contents

1. [Tech Stack](#tech-stack)
2. [Architecture](#architecture)
3. [Installation & Setup](#installation--setup)
4. [API Documentation](#api-documentation)
5. [AWS Deployment Strategy](#aws-deployment-strategy)
6. [Project Management Plan](#project-management-plan)
7. [Future Enhancements](#future-enhancements)

---

## 🛠 Tech Stack

### Frontend
- **React 18** with Hooks - Modern, component-based UI library
- **Axios** - Promise-based HTTP client
- **CSS3** - Custom responsive styling (no heavy dependencies)

**Justification:** React provides excellent component reusability, virtual DOM for performance, and a massive ecosystem. Chosen over Vue/Angular for industry adoption and team familiarity.

### Backend
- **Node.js** with **Express.js** - Fast, lightweight server framework
- **PostgreSQL** - Robust, ACID-compliant relational database
- **JWT** - JSON Web Tokens for authentication (bonus feature)
- **bcrypt** - Password hashing

**Justification:** Node.js enables JavaScript full-stack development (single language), Express is minimalist yet powerful, and PostgreSQL offers better data integrity than MySQL for eCommerce applications.

### DevOps & Cloud
- **AWS EC2** - Application hosting
- **AWS RDS** - Managed PostgreSQL database
- **AWS S3** - Static asset and image storage
- **AWS CloudFront** - CDN for frontend
- **Docker** - Containerization for consistent environments
- **GitHub Actions** - CI/CD pipeline

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CloudFront (CDN)                      │
│              (Static React Frontend Delivery)            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                  S3 Bucket (Frontend)                    │
│              React Build Files (Static)                  │
└──────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                Application Load Balancer                 │
│              (SSL/TLS Termination)                       │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              EC2 Auto Scaling Group                      │
│         (Docker Container - Node.js API)                 │
│                                                           │
│  ┌──────────────────────────────────────┐               │
│  │  Express API Server                  │               │
│  │  - /api/products (GET, POST)         │               │
│  │  - /api/auth (POST) [Bonus]          │               │
│  │  - Middleware: Auth, CORS, Logging   │               │
│  └──────────────────────────────────────┘               │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────────┐    ┌────────▼────────┐
│   RDS PostgreSQL │    │    S3 Bucket    │
│   (Products DB)  │    │ (Product Images)│
│                  │    │                  │
│  Tables:         │    │  /images/        │
│  - products      │    │  /uploads/       │
│  - users (admin) │    │                  │
└──────────────────┘    └──────────────────┘
```

### Data Flow

1. **User Request** → CloudFront → S3 (React App)
2. **API Call** → ALB → EC2 (Express API)
3. **Data Storage** → RDS PostgreSQL
4. **Image Upload** → API → S3 Bucket
5. **Image Retrieval** → Signed S3 URLs

---

## 📦 Installation & Setup

### Prerequisites
```bash
- Node.js v18+ and npm
- PostgreSQL 14+
- Git
```

### Local Development Setup

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/ecommerce-product-module.git
cd ecommerce-product-module
```

#### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run migrate  # Create database tables
npm run seed     # Optional: Add sample data
npm run dev      # Start development server on port 5000
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with API endpoint
npm start        # Start development server on port 3000
```

#### 4. Database Setup
```sql
-- Create database
CREATE DATABASE ecommerce_products;

-- Create products table (handled by migration script)
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock_status VARCHAR(50) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create users table (for admin authentication - bonus)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://api.yourdomain.com/api
```

### Endpoints

#### 1. Get All Products
```http
GET /api/products
```

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `stock` (optional): Filter by stock status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Wireless Mouse",
      "price": 29.99,
      "category": "Electronics",
      "stock_status": "In Stock",
      "description": "Ergonomic wireless mouse",
      "image_url": "https://s3.amazonaws.com/bucket/mouse.jpg",
      "created_at": "2025-11-13T10:00:00Z",
      "updated_at": "2025-11-13T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

#### 2. Add New Product
```http
POST /api/products
Content-Type: application/json
Authorization: Bearer <token>  [For bonus auth feature]
```

**Request Body:**
```json
{
  "name": "Wireless Keyboard",
  "price": 49.99,
  "category": "Electronics",
  "stock_status": "In Stock",
  "description": "Mechanical wireless keyboard",
  "image_url": "https://example.com/keyboard.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 46,
    "name": "Wireless Keyboard",
    "price": 49.99,
    "category": "Electronics",
    "stock_status": "In Stock",
    "description": "Mechanical wireless keyboard",
    "image_url": "https://example.com/keyboard.jpg",
    "created_at": "2025-11-13T12:30:00Z",
    "updated_at": "2025-11-13T12:30:00Z"
  }
}
```

#### 3. Admin Login (Bonus Feature)
```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Error Responses
```json
{
  "success": false,
  "error": "Error message description",
  "code": 400
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## ☁️ AWS Deployment Strategy

### Infrastructure Components

#### 1. **Frontend Hosting (S3 + CloudFront)**
```bash
# Build React app
npm run build

# Deploy to S3
aws s3 sync build/ s3://product-module-frontend --delete

# CloudFront Distribution Configuration
- Origin: S3 bucket
- Viewer Protocol: Redirect HTTP to HTTPS
- Caching: Optimize for performance
- Custom Domain: www.yourdomain.com
```

**Cost Estimate:** ~$5-10/month for moderate traffic

#### 2. **Backend API (EC2 + Docker)**
```dockerfile
# Dockerfile for Node.js API
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

**EC2 Instance:**
- Type: t3.medium (2 vCPU, 4GB RAM)
- AMI: Amazon Linux 2
- Security Group: Allow ports 22 (SSH), 5000 (API), 443 (HTTPS)
- Auto Scaling: Min 1, Max 3 instances

**Deployment Steps:**
```bash
# SSH into EC2
ssh -i keypair.pem ec2-user@ec2-xx-xxx-xxx-xx.compute.amazonaws.com

# Install Docker
sudo yum update -y
sudo yum install docker -y
sudo service docker start

# Pull and run container
docker pull yourusername/ecommerce-api:latest
docker run -d -p 5000:5000 --env-file .env ecommerce-api
```

**Cost Estimate:** ~$30-50/month

#### 3. **Database (RDS PostgreSQL)**
```bash
# RDS Configuration
- Engine: PostgreSQL 14.x
- Instance Class: db.t3.micro (free tier eligible)
- Storage: 20GB SSD
- Multi-AZ: No (for dev), Yes (for prod)
- Backup Retention: 7 days
- Encryption: Enabled
```

**Connection String:**
```env
DATABASE_URL=postgresql://admin:password@dbinstance.xyz.rds.amazonaws.com:5432/ecommerce
```

**Cost Estimate:** ~$15-25/month (or free tier for first year)

#### 4. **Image Storage (S3)**
```bash
# S3 Bucket Configuration
- Bucket Name: product-images-bucket
- Region: us-east-1
- Versioning: Enabled
- Lifecycle Policy: Move to Glacier after 90 days
- Public Access: Blocked (use signed URLs)
- CORS Configuration: Allow API domain
```

**Upload Process:**
```javascript
// Backend code to upload to S3
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const uploadParams = {
  Bucket: 'product-images-bucket',
  Key: `products/${productId}/${filename}`,
  Body: fileBuffer,
  ContentType: 'image/jpeg'
};

const result = await s3.upload(uploadParams).promise();
const imageUrl = result.Location;
```

**Cost Estimate:** ~$1-3/month for moderate usage

#### 5. **CI/CD Pipeline (GitHub Actions)**
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS

on:
  push:
    branches: [ master ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build React App
        run: |
          cd frontend
          npm install
          npm run build
      - name: Deploy to S3
        run: aws s3 sync frontend/build/ s3://product-module-frontend
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker Image
        run: docker build -t ecommerce-api ./backend
      - name: Push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin
          docker tag ecommerce-api:latest xxx.dkr.ecr.us-east-1.amazonaws.com/ecommerce-api:latest
          docker push xxx.dkr.ecr.us-east-1.amazonaws.com/ecommerce-api:latest
      - name: Deploy to EC2
        run: |
          ssh ec2-user@instance "docker pull xxx.dkr.ecr.us-east-1.amazonaws.com/ecommerce-api:latest && docker restart api"
```

### Security Best Practices

1. **Environment Variables** - Use AWS Secrets Manager
2. **HTTPS Only** - SSL certificates via AWS Certificate Manager
3. **API Rate Limiting** - Prevent DDoS attacks
4. **Database Encryption** - At-rest and in-transit
5. **IAM Roles** - Least privilege access
6. **VPC Configuration** - Private subnets for RDS and backend

### Monitoring & Logging

- **CloudWatch** - Application and infrastructure logs
- **CloudWatch Alarms** - CPU, memory, disk usage alerts
- **AWS X-Ray** - Distributed tracing
- **Custom Metrics** - API response times, error rates

### Total Monthly Cost Estimate

| Service | Cost |
|---------|------|
| CloudFront + S3 (Frontend) | $5-10 |
| EC2 (Backend) | $30-50 |
| RDS PostgreSQL | $15-25 |
| S3 (Images) | $1-3 |
| Data Transfer | $10-20 |
| **Total** | **$61-108/month** |

*Note: Costs can be reduced with reserved instances and savings plans*

---

## 📊 Project Management Plan

### Team Structure (3 Developers)

**Developer 1: Frontend Specialist**
- React component development
- UI/UX implementation
- Form validation and error handling
- Integration with backend APIs
- Responsive design testing

**Developer 2: Backend Specialist**
- Express.js API development
- Database schema design and migrations
- Authentication and authorization
- API documentation
- Unit and integration testing

**Developer 3: DevOps Engineer**
- AWS infrastructure setup
- Docker containerization
- CI/CD pipeline configuration
- Monitoring and logging setup
- Security implementation

### Sprint Planning (2-Week Sprint)

#### Week 1: Foundation
**Days 1-2: Setup & Architecture**
- Project structure setup (All team members)
- Database schema design (Dev 2)
- AWS account and resource planning (Dev 3)
- UI wireframes and component planning (Dev 1)

**Days 3-4: Core Development**
- Backend API skeleton (Dev 2)
- Frontend component structure (Dev 1)
- Docker configuration (Dev 3)
- Database migrations (Dev 2)

**Days 5: Integration**
- Connect frontend to backend (Dev 1 + Dev 2)
- Local testing environment (Dev 3)
- Code review and refactoring (All)

#### Week 2: Enhancement & Deployment
**Days 1-2: Feature Development**
- Pagination and filtering (Dev 1 + Dev 2)
- Admin authentication (Dev 2)
- S3 image upload integration (Dev 2 + Dev 3)
- UI polish and validation (Dev 1)

**Days 3-4: AWS Deployment**
- Frontend deployment to S3/CloudFront (Dev 3)
- Backend deployment to EC2 (Dev 3)
- RDS setup and migration (Dev 3 + Dev 2)
- DNS and SSL configuration (Dev 3)

**Day 5: Testing & Launch**
- End-to-end testing (All)
- Performance optimization (All)
- Documentation completion (All)
- Production launch and monitoring (Dev 3)

### Task Breakdown & Timeline

| Task | Assignee | Duration | Dependencies |
|------|----------|----------|--------------|
| Database schema design | Dev 2 | 4 hours | - |
| Backend API structure | Dev 2 | 8 hours | Database schema |
| React component setup | Dev 1 | 6 hours | - |
| Product listing UI | Dev 1 | 8 hours | Components |
| Add product form | Dev 1 | 6 hours | Components |
| GET /products API | Dev 2 | 4 hours | API structure |
| POST /products API | Dev 2 | 4 hours | API structure |
| Authentication system | Dev 2 | 8 hours | API structure |
| Pagination/filtering | Dev 1 + Dev 2 | 6 hours | Core APIs |
| Docker configuration | Dev 3 | 4 hours | - |
| AWS infrastructure | Dev 3 | 12 hours | - |
| CI/CD pipeline | Dev 3 | 6 hours | Infrastructure |
| Frontend deployment | Dev 3 | 4 hours | CI/CD |
| Backend deployment | Dev 3 | 6 hours | CI/CD |
| Testing & QA | All | 8 hours | Deployment |
| Documentation | All | 4 hours | All features |

**Total Estimated Hours:** 98 hours (~12 days with 3 developers)

### Communication & Collaboration

**Daily Standup** (15 minutes)
- What did you complete yesterday?
- What will you work on today?
- Any blockers?

**Tools:**
- **Jira/Trello** - Task management and sprint boards
- **Slack** - Team communication
- **GitHub** - Version control and code reviews
- **Figma** - UI/UX design collaboration
- **Confluence** - Documentation

### Risk Management

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| AWS costs exceed budget | Medium | High | Set billing alarms, use free tier |
| Database performance issues | Low | Medium | Implement caching, optimize queries |
| Deployment delays | Medium | Medium | Automate with CI/CD, test early |
| Security vulnerabilities | Low | High | Code reviews, security scanning |
| Team member availability | Low | Medium | Cross-training, documentation |

---

## 🚀 Future Enhancements

### Phase 1: Core Features (1-2 months)
1. **Product Management**
   - Edit and delete products
   - Bulk upload via CSV
   - Product categories management
   - Product variants (size, color)
   - Inventory tracking

2. **Search & Filtering**
   - Full-text search with Elasticsearch
   - Advanced filters (price range, ratings)
   - Sort by multiple criteria
   - Recently viewed products

3. **User Management**
   - User registration and profiles
   - Role-based access control (Admin, Manager, Viewer)
   - Activity logs and audit trails

### Phase 2: Advanced Features (2-4 months)
1. **Shopping Cart & Checkout**
   - Add to cart functionality
   - Cart persistence
   - Checkout flow
   - Payment gateway integration (Stripe/PayPal)

2. **Order Management**
   - Order creation and tracking
   - Order status updates
   - Email notifications
   - Invoice generation

3. **Analytics Dashboard**
   - Sales reports
   - Product performance metrics
   - User behavior analytics
   - Revenue tracking

### Phase 3: Optimization & Scale (4-6 months)
1. **Performance**
   - Redis caching layer
   - CDN for dynamic content
   - Database query optimization
   - Lazy loading and code splitting

2. **Mobile App**
   - React Native mobile application
   - Push notifications
   - Offline mode

3. **AI/ML Features**
   - Product recommendations
   - Dynamic pricing
   - Inventory prediction
   - Chatbot customer support

4. **Internationalization**
   - Multi-language support
   - Multi-currency pricing
   - Regional tax calculations
   - Localized content

### Technical Debt & Improvements
- **Testing:** Increase code coverage to 90%+
- **Documentation:** Auto-generate API docs with Swagger
- **Monitoring:** Implement APM with New Relic or Datadog
- **Microservices:** Split monolith into services as scale demands
- **GraphQL:** Consider GraphQL API for flexible data fetching
- **Kubernetes:** Migrate from EC2 to EKS for better orchestration

---

## 📝 Development Guidelines

### Code Standards
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Husky** - Pre-commit hooks
- **Conventional Commits** - Commit message standards

### Testing Strategy
```bash
# Backend tests
npm run test          # Unit tests
npm run test:integration  # Integration tests
npm run test:coverage     # Coverage report

# Frontend tests
npm run test          # Jest + React Testing Library
npm run test:e2e      # Cypress end-to-end tests
```

### Git Workflow
```bash
master (production)
  ↓
develop (staging)
  ↓
feature/product-listing
feature/authentication
bugfix/pagination-issue
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

This project is created for assessment purposes for Dream Come True Group.

---

## 📞 Contact

**Candidate Name:** [Your Name]  
**Email:** [Your Email]  
**LinkedIn:** [Your LinkedIn Profile]  
**GitHub:** [Your GitHub Profile]

---

## 🙏 Acknowledgments

Thank you to the HR team at Dream Come True Group for this opportunity to demonstrate technical and project management capabilities.

---

**Built with ❤️ for Dream Come True Group**
