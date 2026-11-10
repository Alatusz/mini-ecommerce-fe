# Project Coding Conventions & Architecture Guide

คู่มือมาตรฐานการพัฒนาโค้ดและสถาปัตยกรรมของโปรเจกต์ **Mini E-Commerce**

---

## 1. Project Overview (ภาพรวมโปรเจกต์และ Tech Stack)

* **ชื่อโปรเจกต์:** Mini E-commerce (ระบบจัดการร้านค้าและแดชบอร์ด)
* **Frontend:**
  * Framework: React 19 + TypeScript + Vite
  * Routing: React Router DOM v7
  * Styling: Tailwind CSS v4 (`@tailwindcss/vite`) + Base UI (`@base-ui/react`) + Shadcn UI
  * Icons: Lucide React
  * State & Server Cache: TanStack Query v5 (`@tanstack/react-query`) + TanStack Store Atoms
  * Data Table: TanStack Table v9 (`@tanstack/react-table`) พร้อมระบบ Headless `DataGrid` & URL Sync
  * Form & Validation: React Hook Form + Zod (`@hookform/resolvers`)
  * HTTP Client: Axios (`@/config/axios.config`)
  * Notification: Custom Toast (`@/lib/toast`)
* **Backend:**
  * Runtime: Node.js (ES Modules `"type": "module"`)
  * Framework: Express 5
  * Database & ORM: Prisma ORM v6 (`@prisma/client`) + PostgreSQL / MySQL
  * Authentication: JWT + HttpOnly Cookie / Authorization Header
  * File Upload: Multer

---

## 2. Directory Structure (โครงสร้างโฟลเดอร์จริง)

### Frontend (`/frontend/src`)
```
src/
├── assets/             # รูปภาพ, SVG และ Static Assets
├── components/
│   ├── common/         # Reusable UI (DataGrid, StatCard, PageContent ฯลฯ)
│   │   └── data-grid/  # DataGrid Table V9, useDataGridUrlSync, tableFeatures
│   ├── layout/         # Shell Layout (Navbar, Sidebar ฯลฯ)
│   └── ui/             # Shadcn / Base UI Primitives (Button, Dialog, DropdownMenu ฯลฯ)
├── config/             # Axios instance & Environment configurations
├── context/            # React Contexts
├── hooks/              # Global Shared Custom Hooks
├── lib/                # Utility helpers, Constants (QUERY_KEYS), Toast notifications
├── pages/
│   └── dashboard/      # หน้า Dashboard ทั้งหมด (Category, Product, Order ฯลฯ)
│       └── category/
│           ├── Index.tsx       # View Layer (UI Only)
│           ├── useHooks.tsx    # Logic Layer (State & Query)
│           ├── common/         # Feature components (Table, Dialog, Zod Schema)
│           ├── create/         # หน้าสร้างหมวดหมู่ (Index.tsx + useHooks.tsx)
│           └── edit/           # หน้าแก้ไขหมวดหมู่ (Index.tsx + useHooks.tsx)
├── providers/          # App Providers (QueryClientProvider, AuthProvider ฯลฯ)
├── routes/             # App Routing configuration
└── services/           # API Service Layer (`category.services.ts` ฯลฯ)
```

### Backend (`/backend/src`)
```
backend/src/
├── config/             # Prisma client instance & DB configuration
├── controllers/        # Request handlers (`category.controller.js` ฯลฯ)
├── middlewares/        # Auth, Validation & Error middlewares
├── routes/             # Express API Routes (`category.routes.js` ฯลฯ)
├── services/           # Core Business Logic & Prisma Queries (`category.service.js` ฯลฯ)
└── server.js           # Server Entry Point
```

---

## 3. Core Architectural Rules (กฎเหล็กของสถาปัตยกรรม)

### กฎข้อที่ 1: การแยกหน้าที่ระหว่าง UI และ Logic (Strict Separation of Concerns)
1. **`Index.tsx` (View Layer):**
   * มีหน้าที่เพียง **Render UI, กำหนด Layout, จัดวาง Component** และรับ Props/Handlers มาจาก `useHooks.tsx` เท่านั้น
   * **ห้าม** เรียก `useQuery`, `useMutation`, หรือเขียน Business Logic/คำนวณสูตรยาวๆ ใน `Index.tsx` โดยเด็ดขาด
2. **`useHooks.tsx` (Logic Layer):**
   * มีหน้าที่จัดการ State, URL Search Params, การเรียก React Query (`useQuery`, `useMutation`), การคำนวณ KPI และ Action Handlers ทั้งหมด
   * ส่งค่าและฟังก์ชันที่พร้อมใช้งานออกไปให้ `Index.tsx` ผ่าน Object Return
3. **การแตก Sub-pages และ Feature Common:**
   * หน้า Create/Edit ให้สร้างโฟลเดอร์ย่อยแยก `Index.tsx` + `useHooks.tsx` ชัดเจน
   * Component หรือ Schema ที่ใช้เฉพาะในฟีเจอร์นั้น (เช่น Table, Delete Dialog, Form Schema) ให้เก็บในโฟลเดอร์ `common/` ของฟีเจอร์นั้น

---

### กฎข้อที่ 2: ใช้ URL เป็น Single Source of Truth สำหรับตารางข้อมูล (DataGrid)
1. **เก็บสถานะบน URL Search Params:**
   * ค่า `page`, `limit`, `search`, และ `status` ต้องถูกจัดเก็บบน URL เสมอ เพื่อให้ Refresh แล้วข้อมูลไม่หาย และสามารถแชร์ลิงก์ได้
2. **การ Reset หน้า (Reset Page Rule):**
   * เมื่อผู้ใช้พิมพ์ค้นหาใหม่ (`search`), เปลี่ยนจำนวนแถว (`limit`), หรือเปลี่ยนตัวกรอง (`status`) **ต้องรีเซ็ต `page = 1` เสมอ**
3. **Search Debounce:**
   * ช่องค้นหาต้องมี Debounce (300–400ms) เสมอ เพื่อไม่ให้ยิง Request ซ้ำซ้อนทุกตัวอักษรที่พิมพ์
4. **TanStack Table Server-Side Mode:**
   * เมื่อทำ Server-side Pagination กับ `<DataGrid />` ต้องส่ง `rowCount={total}`, `manualPagination={true}`, และ `manualFiltering={true}` เข้าไป เพื่อให้ Table ไม่นำข้อมูลไป Slice ซ้ำในเครื่อง

---

### กฎข้อที่ 3: มาตรฐาน API Service & React Query
1. **เรียกผ่าน Service Layer เสมอ:**
   * ทุกการยิง API ต้องผ่านไฟล์ใน `src/services/<entity>.services.ts` ห้ามยิง `axios.get` ตรงๆ ใน Hook
2. **รวมศูนย์ Query Keys ใน `src/lib/constants.ts`:**
   * ทุก Query Key ต้องเรียกจาก `QUERY_KEYS` เท่านั้น ห้าม Hardcode ข้อความ String เอง
3. **Smooth UX (No Flashing):**
   * ใน `useQuery` ที่มีการแบ่งหน้า ต้องใส่ `placeholderData: keepPreviousData` เพื่อคงข้อมูลหน้าเดิมไว้ขณะโหลดหน้าใหม่
4. **Cache Invalidation:**
   * เมื่อทำ Mutation สำเร็จ (`onSuccess`) ต้องสั่ง `queryClient.invalidateQueries(...)` ตาม Query Key ที่เกี่ยวข้อง และแจ้งเตือนผ่าน `showToast.success()`

---

### กฎข้อที่ 4: มาตรฐานการตั้งชื่อและการออกแบบ Type (TypeScript)
1. **แยกประเภท Request Payload และ Response Entity ชัดเจน:**
   * **`*Payload` (ขาเข้า):** สำหรับข้อมูลที่ส่งไป Create / Update (เช่น `CategoryPayload` จะไม่มี `id`, ไม่มี `createdAt`)
   * **`*Item` / `*Entity` (ขาออก):** สำหรับข้อมูลตัวเต็มที่ได้รับจาก Backend (เช่น `CategoryItem` จะมี `id`, `productCount`, `createdAt` ครบ)
2. **โครงสร้าง Response ของ API List:**
   ```typescript
   export interface CategoryListResponse {
     success: boolean
     total: number
     page: number
     limit: number
     totalPages: number
     data: CategoryItem[]
   }
   ```
3. **การตั้งชื่อไฟล์:**
   * React Component $\rightarrow$ PascalCase (เช่น `Index.tsx`, `CategoryTable.tsx`)
   * Custom Hooks $\rightarrow$ camelCase (เช่น `useHooks.tsx`, `useCategory.ts`)
   * Service / Helper $\rightarrow$ camelCase หรือ kebab-case (เช่น `category.services.ts`, `axios.config.ts`)

---

### กฎข้อที่ 5: มาตรฐาน Backend (Express + Prisma)
1. **Controller Layer:**
   * สกัดค่าจาก `req.query`, `req.params`, หรือ `req.body`
   * ไม่ใส่ Business Logic ลงใน Controller แต่ส่งต่อไปยัง Service Layer
2. **Service Layer & Pagination Math:**
   * ป้องกัน Database Overload ด้วยการจำกัดขนาด `limit`: `Math.min(100, limit)`
   * คำนวณ Database Offset: `skip = (page - 1) * limit` และ `take = limit`
   * Query ข้อมูลและนับจำนวนทั้งหมดพร้อมกันด้วย `Promise.all([prisma.<model>.findMany(...), prisma.<model>.count(...)])`
3. **Clean Explicit Response:**
   * จัดเรียงลำดับ Field ใน Response Object ให้ชัดเจน (`id` ขึ้นก่อนเสมอ ตามด้วยข้อมูลสำคัญ และปิดท้ายด้วย Timestamps)

---

## 4. Git Commit Conventions (ข้อตกลงการ Commit)

กำหนดรูปแบบ Commit Message ให้เป็นระเบียบ อ่านประวัติการทำงานได้เข้าใจทันที และตรวจสอบย้อนหลังได้ชัดเจน

### โครงสร้าง Commit Message
```
<TYPE> : <หัวข้อสรุปสั้นๆ กระชับ ได้ใจความ>

- อธิบายรายละเอียดสิ่งที่ทำ (Bullet points)
- ไฟล์หรือฟังก์ชันที่ได้รับผลกระทบ
```

> **กฎสำคัญ:** ต้องมีข้อความอธิบายสิ่งที่ทำต่อท้ายเสมอทุกครั้ง (ห้ามพิมพ์แค่ Type ลอยๆ)

### ตารางประเภท Commit (Types)

| Type | ความหมาย | ตัวอย่างสถานการณ์ที่ใช้ |
| :--- | :--- | :--- |
| **`ADD :`** | เพิ่มฟีเจอร์ใหม่ / ไฟล์ใหม่ | เพิ่มหน้าใหม่, สร้าง Component ใหม่, เพิ่ม API endpoint หรือ Hook ใหม่ |
| **`FIX :`** | แก้ไขบั๊ก / แก้ไขข้อผิดพลาด | แก้ไข logic คำนวณผิด, แก้ไข ReferenceError, แก้ไข UI แสดงผลเพี้ยน |
| **`REMOVE :`** | ลบโค้ดหรือสิ่งที่ไม่ใช้ออก | ลบ unused code, ลบฟิลด์ที่ไม่ได้ใช้ (เช่น `itemCount`), ลบ mock data |
| **`PATCH :`** | ปรับปรุงย่อย / Refactor / Types | Refactor โค้ดให้อ่านง่าย, อัปเดต TypeScript Interface, ปรับแต่ง Styling |

### ตัวอย่าง Commit จริงในโปรเจกต์
```bash
# ตัวอย่าง ADD :
git commit -m "ADD : ระบบ Multi-Select Status Filter ใน Category Table

- เพิ่ม DropdownMenuCheckboxItem ให้เลือกได้หลายสถานะพร้อมกัน
- รองรับการส่ง query param status เป็น array/comma string
- วางตำแหน่งปุ่ม Filter ไว้ข้างหน้าปุ่ม Columns ใน DataGrid Toolbar"

# ตัวอย่าง FIX :
git commit -m "FIX : แก้ไข ReferenceError ตัวแปร q ใน category controller

- ปรับ getAllCategories ให้ส่งเฉพาะ search และ limit ตามที่ destructure ไว้
- ป้องกัน runtime error เมื่อผู้ใช้เรียกดูรายการ category"

# ตัวอย่าง REMOVE :
git commit -m "REMOVE : ลบการใช้งานฟิลด์ itemCount ออกจากระบบ

- ตัด itemCount ออกจาก category.service.js ทั้งหมด
- อัปเดต CategoryTable และ CategoryDeleteDialog ให้ใช้ productCount ตัวเดียวจบ
- ปรับ mockCategory และ useHooks ให้ตัด fallback ที่ซ้ำซ้อนออก"

# ตัวอย่าง PATCH :
git commit -m "PATCH : Refactor Category Service & ปรับปรุง CategoryListResponse Type

- เปลี่ยน data ใน CategoryListResponse จาก CategoryPayload[] เป็น CategoryItem[]
- จัดลำดับ key response ใน category.service.js ให้อ่านง่าย
- เพิ่ม comment อธิบายขั้นตอนการ query และ pagination math"
```