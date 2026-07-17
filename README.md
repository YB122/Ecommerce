# E-Commerce Platform

A production-grade, full-stack e-commerce platform engineered with a modular monolith architecture. The system is composed of three independently deployable applications — a backend API server, an admin dashboard, and a public storefront — all sharing a unified data layer and authentication domain.

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Repository Structure](#repository-structure)
- [Technology Stack](#technology-stack)
  - [Backend](#backend)
  - [Admin Dashboard](#admin-dashboard)
  - [Storefront](#storefront)
- [Key Features](#key-features)
- [Local Development](#local-development)
- [Contributing](#contributing)

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                    Client Layer                         │
│  ┌─────────────────────┐  ┌─────────────────────────┐  │
│  │   Next.js 16        │  │   React-Admin 5 (Vite)  │  │
│  │   Public Storefront │  │   Admin Dashboard       │  │
│  │   :3000             │  │   :5173                 │  │
│  └────────┬────────────┘  └──────────┬──────────────┘  │
└───────────┼──────────────────────────┼──────────────────┘
            │ HTTP REST                │ HTTP REST
            ▼                          ▼
┌────────────────────────────────────────────────────────┐
│                   API Gateway Layer                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Express 5 REST API (:3007)               │  │
│  │  Auth Middleware → Rate Limiter → Route Handler  │  │
│  └──────────────────────┬───────────────────────────┘  │
└─────────────────────────┼──────────────────────────────┘
                          │
┌─────────────────────────┼──────────────────────────────┐
│            ┌────────────┴────────────┐                 │
│            ▼                         ▼                 │
│  ┌──────────────┐          ┌──────────────────┐       │
│  │   MSSQL DB   │          │  Redis Cache     │       │
│  │  (Sequelize) │          │  (ioredis)       │       │
│  └──────────────┘          └──────────────────┘       │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  External Services                               │  │
│  │  Stripe · PayPal · Cloudinary · Google OAuth     │  │
│  │  Infobip (WhatsApp) · Nodemailer                │  │
│  └──────────────────────────────────────────────────┘  │
│                    Data & Integration Layer             │
└────────────────────────────────────────────────────────┘
```

---

## Repository Structure

```
e-commerce/
├── e-commerce-back/        # REST API server
│   ├── src/
│   │   ├── common/         # Shared middleware, utils, helpers
│   │   │   ├── middleware/ # Auth, rate limit, injection detection, multer
│   │   │   ├── email/      # Nodemailer transporter
│   │   │   ├── whatsapp/   # Infobip WhatsApp OTP
│   │   │   └── utils/      # Validators, query builder, image validation
│   │   ├── database/       # Sequelize models, associations, Redis connection
│   │   └── module/         # Feature modules (auth, user, product, cart, order, ...)
│   ├── config/             # Environment configuration
│   ├── cypress/            # E2E tests (106 test cases)
│   ├── cypress.config.ts
│   └── generate_module.py  # Module scaffolding script
│
├── e-commerce-Dash/        # Admin dashboard
│   ├── src/
│   │   ├── auth/           # Authentication flows
│   │   ├── categories/     # Category management UI
│   │   ├── products/       # Product management UI
│   │   ├── orders/         # Order management UI
│   │   ├── users/          # User management UI
│   │   ├── dashboard/      # Analytics & charts
│   │   ├── dataProvider/   # REST data provider for react-admin
│   │   ├── i18n/           # Localization (en, fr, ar)
│   │   └── themes/         # MUI theme configuration
│   └── vite.config.ts
│
├── e-commerce-Next/        # Public storefront
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # Shared UI components (shadcn/ui)
│   │   ├── features/       # Feature-based modules
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities, API client, formatters
│   │   ├── modules/        # Domain-specific logic
│   │   ├── i18n/           # Internationalization routing
│   │   └── proxy.ts        # Locale detection middleware
│   ├── messages/           # Translation JSON files (en, fr, ar)
│   └── next.config.ts
│
├── GFS_Didot/              # Font assets
├── Montserrat/             # Font assets
├── installation.tex        # Installation guide (LaTeX)
├── installation.pdf
└── README.md               # This file
```

---

## Technology Stack

### Backend

| Category               | Technology                                                           |
| ---------------------- | -------------------------------------------------------------------- |
| Runtime                | Node.js + TypeScript 6                                                |
| Framework              | Express 5                                                            |
| Database               | MSSQL via Sequelize 6 (ORM) + tedious (driver)                       |
| Cache                  | Redis 6 via ioredis                                                  |
| Authentication         | JWT (role-based signing secrets) + Passport.js (Google OAuth 2.0)    |
| Validation             | Joi with custom injection detection rule                             |
| File Storage           | Cloudinary (via multer-s3-like upload pipeline)                      |
| Payments               | Stripe (Checkout Sessions + Webhooks) · PayPal (SDK)                 |
| Messaging              | Nodemailer (email) · Infobip (WhatsApp OTP)                         |
| Logging                | Winston + daily rotate file + Morgan (HTTP)                          |
| Security               | Helmet · express-rate-limit · Injection detection · IP blocking      |
| Testing                | Jest (unit/integration) · Cypress (E2E, 106 tests across 9 suites)   |
| Background Jobs        | BullMQ (queue infrastructure installed)                              |

### Admin Dashboard

| Category       | Technology                                  |
| -------------- | ------------------------------------------- |
| Framework      | React 19 + React-Admin 5                    |
| Build Tool     | Vite 7                                      |
| UI Library     | MUI (Material UI) 7                         |
| Charts         | ECharts 5                                   |
| Routing        | React Router 7                              |
| i18n           | ra-i18n-polyglot (en, fr, ar)               |
| HTTP           | ra-data-simple-rest                         |
| Testing        | Vitest · MSW · Cypress                      |

### Storefront

| Category         | Technology                                        |
| ---------------- | ------------------------------------------------- |
| Framework        | Next.js 16 (App Router)                           |
| UI               | Tailwind CSS 4 + shadcn/ui + Radix UI primitives |
| Animations       | Framer Motion 12 · GSAP 3 · Lottie                |
| Forms            | react-hook-form + Zod                             |
| State Management | Zustand 5 + TanStack Query 5 + Immer              |
| Payments         | Stripe Elements (react-stripe-js)                 |
| Carousel         | Embla Carousel                                    |
| i18n             | next-intl 4 (en, fr, ar, RTL support)             |
| Auth             | next-auth 4                                       |

---

## Key Features

### Authentication & Authorization
- Email/password registration with email verification
- Google OAuth 2.0 signup and login
- Role-based JWT with distinct signing secrets for `user`, `admin`, and `superAdmin`
- Refresh token rotation with 1-year expiry
- Rate-limited password reset and email resend flows

### Product Management
- Multi-language fields (`en`, `fr`, `ar`) for names, descriptions
- Hierarchical categorization: Categories → Subcategories → Products
- Image uploads to Cloudinary (up to 5 per product) with automatic cleanup on delete
- Soft-delete with cascading deactivation across the hierarchy
- Discount percentage (0–100%), stock tracking, price filtering, and sorting

### Shopping Experience
- Persistent cart with stock validation and quantity limits
- Wishlist with duplicate prevention
- Real-time subtotal and total calculation with discount application
- Cash on Delivery and Stripe Card checkout

### Order Processing
- Stock deduction at order creation with atomic validation
- Price snapshots (product price at time of purchase)
- Shipping cost calculation (fixed amount or percentage of subtotal, configurable)
- Stripe Checkout Session integration with webhook-based payment confirmation
- Order status workflow: `pending → processing → shipped → delivered → cancelled`

### Security
- Injection attack detection across all Joi validation schemas (SQL keywords, NoSQL operators, comment syntax)
- Automatic permanent IP blocking via Redis on detected attacks
- Comprehensive security event logging with Winston
- Rate limiting on sensitive endpoints (OTP, email verification, password reset)
- Helmet security headers

### Internationalization
- Full trilingual support: English, French, Arabic
- RTL layout switching for Arabic locale
- Locale detection via cookie or `Accept-Language` header
- Consistent localization across all three applications

### Admin Panel
- Full CRUD for categories, subcategories, products, orders, and users
- Analytics dashboard with ECharts visualizations
- Role-based access control (admin vs superAdmin)
- Security log viewer for super admins

---

## Local Development

### Prerequisites

- Node.js >= 18
- MSSQL instance (local or remote)
- Redis instance (or Upstash)
- Google OAuth credentials
- Cloudinary account
- Stripe account (test mode)
- Infobiz account (for WhatsApp OTP — optional)

### Quick Start

```bash
# 1. Start the backend
cd e-commerce-back
cp config/.env.example config/.env   # Fill in your credentials
npm install
npm run dev                          # Runs on :3007

# 2. Start the admin dashboard (in a new terminal)
cd e-commerce-Dash
npm install
npm run dev                          # Runs on :5173

# 3. Start the storefront (in a new terminal)
cd e-commerce-Next
npm install
npm run dev                          # Runs on :3000
```

### Testing

```bash
# Backend — Unit & Integration
cd e-commerce-back && npm test

# Backend — E2E (requires server running)
cd e-commerce-back && npx cypress run

# Backend — Lint & Format
npm run lint && npm run format
```

---

## Contributing

This repository follows a trunk-based development workflow. All changes should be submitted via pull request with corresponding test coverage. The backend includes a module scaffolding script (`generate_module.py`) for adding new feature modules with consistent structure.

---

*Built with TypeScript, Express, Next.js, and React-Admin.*
