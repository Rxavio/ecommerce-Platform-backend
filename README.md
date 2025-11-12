# E-Commerce Platform Backend

A modern REST API for an e-commerce platform built with Express.js, TypeScript, and Prisma ORM. Features include user authentication, product management with image uploads, order processing, and comprehensive API documentation.

## Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** (or compatible database)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rxavio/ecommerce-Platform-backend.git
   cd ecommerce-Platform-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/db"

   # JWT & Auth
   JWT_SECRET="secret-key"
   JWT_EXPIRES_IN="4d"

   # Cloudinary (Image Upload)
   CLOUDINARY_NAME="cloudinary-name"
   CLOUDINARY_KEY="cloudinary-key"
   CLOUDINARY_SECRET="cloudinary-secret"

   # Server
   PORT=3000
   NODE_ENV="development"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

## 📖 API Documentation

Once the server is running, visit:
```
http://localhost:5000/api-docs
```

This opens the **Swagger UI** with interactive API documentation where you can:
- View all endpoints and their details
- See request/response schemas
- Test endpoints directly in the browser
- Authorize with JWT tokens

### Available Scripts

```bash
# Development - Auto-reload on file changes
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

## Technology Stack

### Backend Framework
- **Express.js**  - Fast, minimalist web framework for Node.js
- **TypeScript**  - Type-safe JavaScript for better code quality

### Database & ORM
- **Prisma**  - Type-safe database ORM with auto-generated types
- **PostgreSQL** - Reliable relational database

### Authentication & Security
- **JWT (jsonwebtoken)** - Secure token-based authentication
- **bcrypt**  - Password hashing and verification
- **Helmet**  - Security headers middleware
- **CORS** - Cross-origin resource sharing

### File Upload & Storage
- **Multer** - Middleware for handling file uploads
- **Cloudinary** - Cloud storage for images with automatic optimization

### Validation & Schema
- **Zod** - TypeScript-first schema validation

### API Documentation
- **Swagger UI Express** - Interactive API docs UI
- **Swagger JSDoc** - Auto-generates OpenAPI specs from code comments

### Testing
- **Jest** - Testing framework
- **Supertest**  - HTTP assertions for testing

### Logging
- **Winston** - Flexible logging library with environment-aware log levels

### Development Tools
- **Nodemon** - Auto-restart server during development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky**  - Git hooks for commit message validation
- **Commitlint** - Enforce Conventional Commits

## Project Structure

```bash
├── dist/                           # Compiled output
├──prisma/
    ├── schema.prisma               # Database schema
    └── migrations/                 # Database migrations
src/
├── config/
│   ├── index.ts                    # Config loader
│   ├── prisma.ts                   # Prisma client instance
│   └── swagger.ts                  # Swagger setup function
├── controllers/                    #  Business logic for routes
│   ├── auth.controller.ts
│   ├── product.controller.ts
│   └── order.controller.ts
├── interfaces/                     # Shared interfaces
│   ├── auth.interface.ts
│   ├── response.interface.ts
├── middleware/                     # Express middleware
│   ├── auth.middleware.ts          # JWT verification & role checks
│   ├── error.middleware.ts         # Error handling
│   ├── rateLimit.middleware.ts     # Rate limiting
│   ├── upload.middleware.ts        # File upload with validation
│   └── validate.middleware.ts      # Schema validation with Zod
├── repositories/                         # Data access layer
│   ├── auth.repository.ts
│   ├── product.repository.ts
│   └── order.repository.ts
├── routes/                         # Route definitions
│   ├── auth.routes.ts
│   ├── product.routes.ts
│   ├── order.routes.ts
│   └── index.ts
├── schemas/                        # Zod validation schemas
│   ├── auth.schema.ts
│   ├── product.schema.ts
│   └── order.schema.ts
├── services/                       # Business logic & external integrations
│   ├── auth.service.ts
│   ├── product.service.ts
│   └── order.service.ts
├── swagger/                        # API documentation (JSDoc only)
│   ├── index.ts                    # Swagger config & OpenAPI spec
│   ├── auth.swagger.ts             # Auth endpoint docs
│   ├── product.swagger.ts          # Product endpoint docs
│   └── order.swagger.ts            # Order endpoint docs
├── utils/                          # Utility f
│   ├── AppError.ts                 # Custom error class
│   ├── cache.ts                    # In-memory cache
│   ├── cloudinary.ts               # Cloudinary helper functions
│   ├── generateToken.ts            # JWT token generation
│   ├── hashpassword.ts             # Password hashing
│   └── logger.ts                   # Winston logger setup
├── app.ts                          # Express app setup, Main entry point
├── tests/                        # Test cases only for now
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin only, with image)
- `PUT /api/products/:id` - Update product (Admin only, with image)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get user's orders

For detailed request/response schemas, visit `/api-docs`

### Code Standards
- **Linting:** ESLint enforces code style
- **Formatting:** Prettier auto-formats on save
- **Commits:** Husky + Commitlint enforce [Conventional Commits](https://www.conventionalcommits.org/)

**Conventional Commit Examples:**
```
feat(auth): add password reset endpoint
fix(products): handle image upload errors
docs(readme): update setup instructions
test(orders): add edge case tests
```

### Image Upload Fails
- Set up Cloudinary account and get credentials
- Add `CLOUDINARY_NAME`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET` to `.env`

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Swagger/OpenAPI](https://swagger.io/)
- [JWT Authentication](https://jwt.io/)
- [Zod Validation](https://zod.dev/)

## 📄 License

This project is private/internal use only.

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines and commit message conventions.
