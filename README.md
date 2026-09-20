# 🛒 GoCart — Full-Stack Multi-Vendor E-Commerce Platform

<div align="center">

**A modern, scalable multi-vendor marketplace connecting customers, independent vendors, and platform administrators.**  
*Built with Next.js 15, React 19, Prisma ORM, Neon PostgreSQL, Clerk Auth, Stripe Payments, Inngest Workflows, and Google Gemini AI.*

[![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-7.4.1-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk)](https://clerk.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Inngest](https://img.shields.io/badge/Inngest-Event_Driven-000000?style=for-the-badge&logo=inngest)](https://www.inngest.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-AI_Assistant-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-State_Management-764ABC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Overview](#-overview) • [Core Portals](#-core-portals--features) • [AI Features](#-ai-powered-product-listing) • [Tech Stack](#-tech-stack) • [Test Credentials](#-test-credentials) • [Getting Started](#-getting-started) • [Environment Variables](#-environment-variables) • [Project Structure](#-project-structure)

</div>

---

## 🌟 Overview

**GoCart** is a complete, production-ready multi-vendor e-commerce platform designed to support multi-tenant commerce. It enables independent sellers to establish their own digital storefronts, empowers customers to shop across multiple vendors with unified cart and checkout flows, and provides platform administrators with centralized governance, store approval, and coupon management.

GoCart also integrates **Google Gemini AI** for automated, image-based product metadata generation, **Inngest** for resilient asynchronous background tasks, and **ImageKit** for optimized media CDN delivery.

---

## 🚀 Core Portals & Features

### 🛍️ 1. Customer-Facing Storefront (`/`)
- **Dynamic Homepage:** Interactive hero promotions, continuous category marquee, latest arrivals, and best-selling product showcases.
- **Product Discovery & Reviews:** Detailed product pages with multi-angle image galleries, stock indicators, category tags, customer review submissions, and star ratings.
- **Cart & Discount Engine:** Client-side and server-synced cart powered by Redux Toolkit with coupon code redemption and instant discount calculation.
- **Address Book Management:** Interactive address modal (`AddressModal.jsx`) allowing users to store multiple shipping destinations.
- **Dual Payment Methods:** Support for **Cash on Delivery (COD)** and **Stripe Checkout** with automated webhook-based cart clearance and order status confirmation.
- **Order Tracking:** Detailed order history (`/orders`) showing line items, pricing, delivery status, and payment verification.

### 🏪 2. Vendor / Store Owner Portal (`/store`)
- **Vendor Onboarding:** Streamlined store registration flow (`/create-store`) with automated logo upload to ImageKit CDN.
- **Store Approval Workflow:** Stores submit in `pending` status and transition to `approved` following admin review.
- **Sales Analytics Dashboard:** Visualized revenue metrics, total orders, and sales trends powered by Recharts (`OrdersAreaChart.jsx`).
- **AI-Assisted Product Listing (`/store/add-product`):** Automatically analyzes uploaded product photos with Google Gemini AI to draft SEO-friendly product titles and marketing descriptions.
- **Inventory & Product Management (`/store/manage-product`):** Real-time stock status toggling (`inStock`), MRP vs. Sale pricing adjustments, and product deletion.
- **Order Fulfillment Pipeline (`/store/orders`):** Update order states across the fulfillment lifecycle:
  $$\text{ORDER\_PLACED} \longrightarrow \text{PROCESSING} \longrightarrow \text{SHIPPED} \longrightarrow \text{DELIVERED}$$

### 👑 3. Admin Management Dashboard (`/admin`)
- **Platform Analytics:** Real-time visibility into overall platform revenue, active stores, total products, and system orders.
- **Store Moderation (`/admin/approve` & `/admin/stores`):** Inspect submitted vendor applications, review store details, and approve or reject prospective sellers.
- **Coupon Lifecycle Engine (`/admin/coupons`):** Create public, member-only, or new-user discount coupons with automated expiration tracking.

---

## 🤖 AI-Powered Product Listing

GoCart utilizes **Google Gemini** (`@google/generative-ai`) to streamline the vendor onboarding process.

1. A vendor uploads a photo of their product.
2. The image is passed via base64 payload to the backend route (`/api/store/ai`).
3. Google Gemini analyzes the visual features of the product and returns a structured JSON payload:
   ```json
   {
     "name": "Minimalist Wireless Noise-Cancelling Headphones",
     "description": "Ergonomic over-ear wireless headphones engineered with premium matte finish, active noise cancellation, and all-day battery life."
   }
   ```
4. The title and marketing description automatically populate the product creation form, reducing seller friction to seconds.

---

## ⚡ Event-Driven Architecture (Inngest)

GoCart uses **Inngest** to decouple long-running and event-driven background workflows from the core HTTP request-response cycle:

- **Clerk User Synchronization:**
  - `clerk/user.created` $\rightarrow$ Automatically provisions a new database record in PostgreSQL via Prisma.
  - `clerk/user.updated` $\rightarrow$ Synchronizes user avatar, name, and email modifications.
  - `clerk/user.deleted` $\rightarrow$ Cleans up user profiles and linked sessions.
- **Automated Coupon Expiration:**
  - `app/coupon.expired` triggers an Inngest delayed step using `step.sleepUntil("wait-for-expiry", expiryDate)`.
  - Automatically purges expired promotional coupons from the database without requiring manual cron maintenance.

---

## 💳 Payment & Webhook Architecture

- **Stripe Checkout Integration:** Secure payment sessions created with multi-order metadata mapping.
- **Stripe Webhook Listener (`/api/stripe`):**
  - Verifies cryptographic signatures with `STRIPE_WEBHOOK_SECRET`.
  - On `payment_intent.succeeded`: Sets `isPaid: true` across all order IDs in the transaction and flushes the buyer's active cart.
  - On `payment_intent.cancelled`: Cleans up unfulfilled draft orders.

---

## 🔑 Test Credentials

For evaluation and testing, you can use the pre-configured accounts directly in the Clerk login interface:

| Role | Email | Password | Access / Permissions |
| :--- | :--- | :--- | :--- |
| 👑 **Platform Admin** | `testeradmin+clerk_test@example.com` | `Admin@36912#` | Access to `/admin` dashboard, store approvals & coupons |
| 🏪 **Store Owner / Seller** | `store+clerk_test@example.com` | `Store36912` | Access to `/store` dashboard, product creation & orders |
| 👤 **Standard Customer** | `user+clerk_test@example.com` | `User36912` | Customer storefront shopping, checkout, cart & orders |

---

## 🛠️ Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) | Server & Client Components, Turbopack, API Routes |
| **UI Library** | [React 19](https://react.dev/) | Component lifecycle and interactive UI rendering |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first styling with `@tailwindcss/postcss` |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) + `react-redux` | Centralized cart, address, product, and rating state |
| **Database & ORM** | [Prisma ORM 7](https://www.prisma.io/) + [Neon PostgreSQL](https://neon.tech/) | Serverless relational database with connection pooling |
| **Authentication** | [Clerk](https://clerk.com/) | Secure multi-role authentication & user session management |
| **Payments** | [Stripe](https://stripe.com/) | Hosted checkout sessions and webhook payment reconciliation |
| **Background Jobs** | [Inngest 4](https://www.inngest.com/) | Event-driven background tasks, user sync & delayed jobs |
| **AI Vision & NLP** | [Google Gemini AI](https://ai.google.dev/) (`@google/generative-ai`) | Vision-to-text product metadata generation |
| **Media CDN** | [ImageKit](https://imagekit.io/) (`@imagekit/nodejs`) | Image optimization, transformations, and asset hosting |
| **Data Visualization** | [Recharts 3](https://recharts.org/) | Vendor dashboard revenue and sales area charts |
| **Notifications** | [React Hot Toast](https://react-hot-toast.com/) | Real-time feedback alerts and toasts |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean and modern vector icon set |

---

## 📂 Project Structure

```text
gocart/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/    # Clerk sign-in page with test credentials
│   │   └── sign-up/[[...sign-up]]/    # Clerk sign-up page
│   ├── (public)/                      # Customer storefront routes
│   │   ├── cart/                      # Shopping cart, discounts & checkout
│   │   ├── create-store/              # Vendor store registration
│   │   ├── orders/                    # Customer order history & tracking
│   │   ├── pricing/                   # Pricing & membership plans
│   │   ├── product/[id]/              # Product details, reviews & ratings
│   │   ├── shop/                      # Category & vendor shop listings
│   │   └── page.jsx                   # Main storefront landing page
│   ├── admin/                         # Admin Control Center
│   │   ├── approve/                   # Pending vendor store approvals
│   │   ├── coupons/                   # Coupon generation & management
│   │   ├── stores/                    # All registered store records
│   │   └── page.jsx                   # Admin overview metrics
│   ├── store/                         # Vendor / Seller Portal
│   │   ├── add-product/               # Product creation with Gemini AI
│   │   ├── manage-product/            # Stock & pricing management
│   │   ├── orders/                    # Vendor order fulfillment pipeline
│   │   └── page.jsx                   # Vendor sales dashboard & analytics
│   ├── api/                           # Next.js API route handlers
│   │   ├── admin/                     # Store approval & platform actions
│   │   ├── inngest/                   # Inngest webhook entry point
│   │   ├── orders/                    # Order placement (COD & Stripe)
│   │   ├── store/                     # Store creation & AI route
│   │   └── stripe/                    # Stripe signature verification webhook
│   ├── StoreProvider.js               # Redux Toolkit global provider
│   ├── globals.css                    # Tailwind CSS v4 directives
│   └── layout.jsx                     # Root application layout
├── components/                        # Modular UI components
│   ├── admin/                         # AdminLayout, AdminNavbar, AdminSidebar
│   ├── store/                         # StoreLayout, StoreNavbar, StoreSidebar
│   ├── AddressModal.jsx               # Multi-address shipping modal
│   ├── Hero.jsx                       # Storefront hero banner
│   ├── OrdersAreaChart.jsx            # Recharts analytics component
│   └── RatingModal.jsx                # Star rating & review dialog
├── configs/
│   ├── gemini.js                      # Google Generative AI client initialization
│   └── imageKit.js                    # ImageKit Node.js client initialization
├── inngest/
│   ├── client.js                      # Inngest client configuration
│   └── functions.js                   # Event handlers (User sync & Coupon expiry)
├── lib/
│   ├── features/                      # Redux slices (cart, product, address, rating)
│   ├── prisma.js                      # Prisma client singleton
│   └── store.js                       # Redux store configuration
├── middlewares/
│   ├── authAdmin.js                   # Admin email verification middleware
│   └── authSeller.js                  # Approved store status verification middleware
├── prisma/
│   ├── schema.prisma                  # Relational database schema
│   └── prisma.config.ts               # Prisma connection configuration
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (`v18+` or `v20+` recommended)
- [PostgreSQL Database](https://neon.tech/) (Neon Serverless Postgres recommended)
- Accounts for [Clerk](https://clerk.com/), [Stripe](https://stripe.com/), [Inngest](https://www.inngest.com/), [ImageKit](https://imagekit.io/), and [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/Dhananjoy333/gocart.git
cd gocart
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (refer to the [Environment Variables](#-environment-variables) section):
```bash
cp .env.example .env
```

### 4. Initialize Database & Generate Prisma Client
```bash
npx prisma generate
npx prisma db push
```

### 5. Start the Development Server
```bash
npm run dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

---

## 🔐 Environment Variables

Create a `.env` file in the root directory and specify the following variables:

```env
# Currency Configuration
NEXT_PUBLIC_CURRENCY_SYMBOL="$"

# Admin Configuration (Comma-separated admin emails)
ADMIN_EMAIL="testeradmin+clerk_test@example.com,your-email@example.com"

# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Database Configuration (Neon PostgreSQL)
DATABASE_URL="postgresql://<user>:<password>@<neon-pooler-host>/neondb?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://<user>:<password>@<neon-host>/neondb?sslmode=require&channel_binding=require"

# Inngest Background Workflows
INNGEST_EVENT_KEY="your-inngest-event-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"

# ImageKit CDN & Storage
IMAGEKIT_PUBLIC_KEY="public_..."
IMAGEKIT_PRIVATE_KEY="private_..."
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_endpoint"

# Stripe Payment Gateway
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Google Gemini AI Assistant
GEMINI_API_MODEL="gemini-1.5-flash"
GEMINI_API_KEY="AIzaSy..."
```

---

## 📄 License

This project is licensed under the MIT License — feel free to explore, clone, and build upon it!
