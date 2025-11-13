# API DOCUMENTATION
## eCommerce Product Listing Module API

**Version:** 1.0  
**Base URL:** `http://localhost:5000/api`  
**Authentication:** JWT Bearer Token

---

## Table of Contents
1. [Authentication](#authentication)
2. [Products](#products)
3. [Error Handling](#error-handling)
4. [Rate Limiting](#rate-limiting)
5. [Status Codes](#status-codes)

---

## Authentication

### POST /auth/login
Authenticate admin user and receive JWT token.

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@dreamcometrue.ai",
  "password": "Admin123!"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@dreamcometrue.ai",
      "role": "admin"
    }
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

**Status Codes:**
- `200 OK` - Successfully authenticated
- `401 Unauthorized` - Invalid credentials
- `400 Bad Request` - Missing email or password

---

### POST /auth/register
Register a new admin user (protected - requires existing admin token).

**Request:**
```http
POST /api/auth/register
Content-Type: application/json
Authorization: Bearer <admin-token>

{
  "email": "newadmin@dreamcometrue.ai",
  "password": "SecurePass123!",
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "email": "newadmin@dreamcometrue.ai",
    "role": "admin"
  }
}
```

---

## Products

### GET /products
Retrieve paginated list of products with optional filtering.

**Request:**
```http
GET /api/products?page=1&limit=10&category=Electronics&inStock=true
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number (1-based) |
| limit | integer | 10 | Items per page (max: 100) |
| category | string | - | Filter by category |
| inStock | boolean | - | Filter by stock status |
| search | string | - | Search in product name |
| sortBy | string | createdAt | Sort field (name, price, createdAt) |
| order | string | desc | Sort order (asc, desc) |

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Wireless Mouse",
        "price": 29.99,
        "category": "Electronics",
        "stockStatus": "In Stock",
        "description": "Ergonomic wireless mouse",
        "imageUrl": "https://s3.amazonaws.com/...",
        "createdAt": "2025-11-13T10:00:00.000Z",
        "updatedAt": "2025-11-13T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

**Status Codes:**
- `200 OK` - Products retrieved successfully
- `400 Bad Request` - Invalid query parameters

---

### GET /products/:id
Retrieve a single product by ID.

**Request:**
```http
GET /api/products/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Wireless Mouse",
    "price": 29.99,
    "category": "Electronics",
    "stockStatus": "In Stock",
    "description": "Ergonomic wireless mouse",
    "imageUrl": "https://s3.amazonaws.com/...",
    "createdAt": "2025-11-13T10:00:00.000Z",
    "updatedAt": "2025-11-13T10:00:00.000Z"
  }
}
```

**Status Codes:**
- `200 OK` - Product found
- `404 Not Found` - Product doesn't exist

---

### POST /products
Create a new product (requires authentication).

**Request:**
```http
POST /api/products
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Wireless Keyboard",
  "price": 79.99,
  "category": "Electronics",
  "stockStatus": "In Stock",
  "description": "Mechanical keyboard with RGB lighting",
  "imageUrl": "https://s3.amazonaws.com/products/keyboard.jpg"
}
```

**Field Validation:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| name | string | Yes | 3-100 characters |
| price | number | Yes | > 0, max 2 decimals |
| category | string | Yes | Electronics, Clothing, Home, Sports, Books |
| stockStatus | string | Yes | "In Stock" or "Out of Stock" |
| description | string | No | Max 500 characters |
| imageUrl | string | No | Valid URL format |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 51,
    "name": "Wireless Keyboard",
    "price": 79.99,
    "category": "Electronics",
    "stockStatus": "In Stock",
    "description": "Mechanical keyboard with RGB lighting",
    "imageUrl": "https://s3.amazonaws.com/products/keyboard.jpg",
    "createdAt": "2025-11-13T11:00:00.000Z",
    "updatedAt": "2025-11-13T11:00:00.000Z"
  }
}
```

**Status Codes:**
- `201 Created` - Product created successfully
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions

---

### PUT /products/:id
Update an existing product (requires authentication).

**Request:**
```http
PUT /api/products/1
Content-Type: application/json
Authorization: Bearer <token>

{
  "price": 24.99,
  "stockStatus": "Out of Stock"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Wireless Mouse",
    "price": 24.99,
    "category": "Electronics",
    "stockStatus": "Out of Stock",
    "updatedAt": "2025-11-13T12:00:00.000Z"
  }
}
```

**Status Codes:**
- `200 OK` - Product updated
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Product doesn't exist

---

### DELETE /products/:id
Delete a product (requires authentication).

**Request:**
```http
DELETE /api/products/1
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Status Codes:**
- `200 OK` - Product deleted
- `401 Unauthorized` - Missing or invalid token
- `404 Not Found` - Product doesn't exist

---

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "error": "Error message description",
  "details": {
    "field": "Specific field error"
  }
}
```

### Validation Errors (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "name": "Name must be at least 3 characters",
    "price": "Price must be a positive number"
  }
}
```

### Authentication Errors (401)
```json
{
  "success": false,
  "error": "Authentication required",
  "details": {
    "message": "No token provided"
  }
}
```

### Not Found Errors (404)
```json
{
  "success": false,
  "error": "Resource not found",
  "details": {
    "resource": "Product",
    "id": 999
  }
}
```

### Server Errors (500)
```json
{
  "success": false,
  "error": "Internal server error",
  "details": {
    "message": "An unexpected error occurred"
  }
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **General endpoints:** 100 requests per 15 minutes
- **Authentication:** 5 requests per 15 minutes
- **Headers included in response:**
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets (Unix timestamp)

**Rate Limit Exceeded Response:**
```json
{
  "success": false,
  "error": "Too many requests",
  "details": {
    "retryAfter": 900
  }
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## CORS Configuration

The API supports CORS for the following origins:
- `http://localhost:3000` (Development)
- `https://ecommerce.dreamcometrue.ai` (Production)

**Allowed Methods:** GET, POST, PUT, DELETE, OPTIONS  
**Allowed Headers:** Content-Type, Authorization

---

## Postman Collection

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "eCommerce Product API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@dreamcometrue.ai\",\n  \"password\": \"Admin123!\"\n}"
            },
            "url": {
              "raw": "http://localhost:5000/api/auth/login",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Products",
      "item": [
        {
          "name": "Get All Products",
          "request": {
            "method": "GET",
            "url": {
              "raw": "http://localhost:5000/api/products?page=1&limit=10",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "products"],
              "query": [
                {"key": "page", "value": "1"},
                {"key": "limit", "value": "10"}
              ]
            }
          }
        },
        {
          "name": "Create Product",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              },
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test Product\",\n  \"price\": 99.99,\n  \"category\": \"Electronics\",\n  \"stockStatus\": \"In Stock\"\n}"
            },
            "url": {
              "raw": "http://localhost:5000/api/products",
              "protocol": "http",
              "host": ["localhost"],
              "port": "5000",
              "path": ["api", "products"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## cURL Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dreamcometrue.ai","password":"Admin123!"}'
```

### Get Products with Pagination
```bash
curl "http://localhost:5000/api/products?page=1&limit=10"
```

### Filter by Category
```bash
curl "http://localhost:5000/api/products?category=Electronics"
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Gaming Mouse",
    "price": 59.99,
    "category": "Electronics",
    "stockStatus": "In Stock",
    "description": "RGB gaming mouse with 16000 DPI"
  }'
```

### Update Product
```bash
curl -X PUT http://localhost:5000/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"price": 49.99, "stockStatus": "In Stock"}'
```

### Delete Product
```bash
curl -X DELETE http://localhost:5000/api/products/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## JavaScript/Fetch Examples

### Login
```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@dreamcometrue.ai',
    password: 'Admin123!'
  })
});

const data = await response.json();
const token = data.data.token;
localStorage.setItem('token', token);
```

### Get Products
```javascript
const response = await fetch('http://localhost:5000/api/products?page=1&limit=10');
const data = await response.json();
console.log(data.data.products);
```

### Create Product
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:5000/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Wireless Headphones',
    price: 129.99,
    category: 'Electronics',
    stockStatus: 'In Stock'
  })
});

const data = await response.json();
console.log(data.data);
```

---

## WebSocket Support (Future Enhancement)

Real-time product updates will be available via WebSocket:

```javascript
const socket = new WebSocket('ws://localhost:5000');

socket.on('product:created', (product) => {
  console.log('New product:', product);
});

socket.on('product:updated', (product) => {
  console.log('Product updated:', product);
});
```

---

## API Versioning

The API uses URL versioning. Current version: `v1`

- Base URL: `/api` (redirects to latest version)
- Version 1: `/api/v1`
- Future versions: `/api/v2`, `/api/v3`

---

## Support

For API support, contact:
- **Email:** api-support@dreamcometrue.ai
- **Documentation:** https://docs.dreamcometrue.ai
- **Status Page:** https://status.dreamcometrue.ai

---

**Last Updated:** November 13, 2025  
**Maintained By:** [Your Name]  
**API Version:** 1.0.0
