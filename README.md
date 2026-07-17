# i-Fikra E-Commerce Platform

A full-stack, multi-tenant e-commerce platform built with a microservices-inspired architecture. The system consists of three independent applications sharing a single backend API.

## Architecture

```
e-commerce-back/     — REST API server (Express 5 + TypeScript)
e-commerce-Dash/     — Admin dashboard (React-Admin 5 + Vite)
e-commerce-Next/     — Public storefront (Next.js 16 + Tailwind CSS 4)
```

### Backend (`e-commerce-back/`)

Express 5 API with MSSQL database, Redis caching, role-based JWT authentication, Google OAuth, Stripe/PayPal payments, Cloudinary file uploads, WhatsApp OTP via Infobip, rate limiting, injection detection, IP blocking, and comprehensive logging with Winston. Fully tested with Jest (unit/integration) and Cypress (E2E, ~106 tests covering all 52 endpoints).

### Admin Dashboard (`e-commerce-Dash/`)

React-Admin v5 SPA for managing categories, subcategories, products, orders, users, and security logs. Built with Vite, MUI, and ECharts. Supports English, French, and Arabic locales.

### Storefront (`e-commerce-Next/`)

Next.js 16 public-facing storefront with Tailwind CSS 4, shadcn/ui components, Stripe checkout, multi-language support (en/fr/ar via next-intl), dark/light themes, and rich animations (Framer Motion, GSAP, Lottie). State management via Zustand and TanStack Query.

## Key Features

- **Internationalization**: English, French, Arabic — full RTL support for Arabic
- **Authentication**: Email/password + Google OAuth, role-based JWT (user/admin/superAdmin)
- **Payments**: Stripe Checkout sessions + Cash on Delivery
- **Product Management**: Categories, subcategories, multi-language fields, image uploads, discounts, stock tracking
- **Cart & Wishlist**: Per-user persistent storage
- **Order Management**: Stock validation, price snapshots, status workflow, Stripe webhook integration
- **Security**: Injection detection (SQL/NoSQL), automatic IP blocking via Redis, rate limiting, Helmet
- **Admin Panel**: Full CRUD for all entities, security log viewer, analytics dashboard
- **Responsive Storefront**: Modern UI with carousels, marquees, toast notifications, and loading animations
