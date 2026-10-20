# Project Coding Conventions & Architecture Guide

# 1. Project Overview (สรุปภาพรวมโปรเจกต์)

- ชื่อโปรเจกต์: Mini E-commerce (ระบบขายสินค้าออนไลน์)
- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS + Shadcn/ui
- Testing: Vitest + React Testing Library
- State Management: TanStack Query
- Backend: Node.js + Express + MongoDB + JWT

# 2. Architecture Overview (สรุปสถาปัตยกรรม)

## Frontend Architecture (React)

```
src/
├── api/             # Axios configurations & API clients
├── components/      # Reusable components
│   ├── ui/          # Shadcn/ui components
│   ├── layout/      # Layout components (Navbar, Header, Sidebar)
│   ├── common/      # Common UI components
│   └── auth/        # Auth related components
├── contexts/        # React Context providers (Auth, Cart, etc.)
├── hooks/           # Custom React hooks & Shared states
├── pages/           # Page components
│   ├── auth/        # Authentication pages
│       └── components/   # components สำหรับ pages นั้นๆ
├── routes/          # Application routes
├── services/        # Business logic & API services
├── utils/           # Utility functions
├── libs/            # Library functions
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## Backend Architecture (Node.js)

```
src/
├── config/          # Configuration files
├── constants/       # Constants
├── controllers/     # Request handlers
├── middlewares/     # Middleware functions
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
└── server.js        # Entry point
```

# 3 Page & Components Rules

1. แยก index.tsx และ useHooks.เสมอ Index มีหน้าที่ Render UI และส่ง Props และ Call method จาก useHooks เท่านั้น
2. useHooks,useHubs,จัดการ useQuery,useMutation,useState
3. ถ้าใน folder pages/components มีการเรียกใช้ API เส้นเดียวกันให้สร้างสร้าง useHubs.tsx สำหรับ Shares

# 4. Component Naming Conventions (การตั้งชื่อ Components)

## Naming Format (รูปแบบการตั้งชื่อ)

- ไฟล์ Component PascalCase Ex. Index.tsx
- ไฟล์ Logic / Hook camelCase Ex. useHooks.ts
- ไฟล์ Service / Config > camelCase หรือ kebab-case Ex. axios.config.ts, authService.ts
- Event Handler > camelCase Ex. handleClick
- ตัวแปร Boolean > camelCase + is, has, can Ex. isLoading
- API Function > camelCase Ex. getUserData()

# Storage & Auth Policy (การเก็บข้อมูล) 
- Cookie > Token, Refresh Token
- LocalStorage > Cart,Theme,Language

# API & State Management Rules (React Query + Axios)

1. ยิง API ผ่าน Service Layer เสมอ
2. ใช้ React Query จัดการ Server State
3. Query Key ต้องมีระเบียบ เก็บไว้ใน libs/constant.ts
4. invalidate แคชเมื่อแก้ไขข้อมูลสำเร็จ
5. Error Boundary จัดการ Error ทั่วไป

# Code Cleanliness
- ต้องอ่าน @SKILL.md เสมอ
- ต้องอ่าน conventions.md เสมอ

```
components/
├── ui/                  # Shadcn/ui components (sorted alphabetically)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── navbar.tsx
├── layout/              # Layout components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── Header.tsx
├── common/              # Common UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Spinner.tsx
│   └── Table.tsx
└── auth/                # Auth related components
    ├── LoginForm.tsx
    ├── RegisterForm.tsx
    ├── LogoutButton.tsx
    └── ProtectedRoute.tsx
```