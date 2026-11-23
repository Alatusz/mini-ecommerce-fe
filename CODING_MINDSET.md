# 🧠 Coding Mindset & Mental Models (คู่มือวิธีคิดฉบับนักพัฒนา)

รวมเทคนิควิธีคิด การออกแบบ Data Model, State Management และวิธีอ่านโค้ดให้เข้าใจทะลุปรุโปร่ง

---

## 1. การเลือกโครงสร้างข้อมูล (Data Modeling Heuristics)

* **เลือกได้ 1 อย่าง (Single Choice)** $\rightarrow$ เก็บเป็น `string` / `number` / `boolean`
  * *ตัวอย่าง:* `page: number`, `sortOrder: "asc" | "desc"`, `selectedCategoryId: string | null`
* **เลือกได้หลายอย่าง (Multi Choice)** $\rightarrow$ เก็บเป็น `Array` (`string[]`)
  * *ตัวอย่าง:* `status: string[]`, `searchBy: ("name" | "sku")[]`
* **จับคู่ Key $\rightarrow$ Value เพื่อค้นหาไว ($O(1)$)** $\rightarrow$ ใช้ `Record<string, T>` หรือ `Map` แทนการ `.find()` ใน Array ใหญ่ๆ ซ้ำๆ
* **ค่าที่ "มีได้แค่สถานะเดียวจากหลายแบบ"** $\rightarrow$ ใช้ Union Type (`"idle" | "loading" | "success" | "error"`) แทนการสร้าง `isLoading`, `isError`, `isSuccess` แยกกันหลายตัว (ป้องกัน State ขัดแย้งกันเอง)

---

## 2. หลักการคิดเรื่อง Default State & URL Params

* **ความว่างเปล่า (`[]` หรือ `undefined`) = กว้างที่สุด (Show All / No Restriction)**
  * *เหตุผล:* ไม่ต้องยัด ID ทั้งหมดลง State หรือ URL ให้รก, Query Database เร็วกว่า, และรองรับข้อมูลใหม่ในอนาคตได้อัตโนมัติ
* **Sparsity Principle (Clean URL):**
  * ค่าไหนที่ตรงกับ `DEFAULT` $\rightarrow$ **ลบออกจาก URL (`undefined`)**
  * URL ควรเก็บเฉพาะสิ่งที่ผู้ใช้ "เปลี่ยน" ไปจากค่าเริ่มต้นเท่านั้น
* **Single Source of Truth (แหล่งความจริงเดียว):**
  * อย่าเก็บ State เดียวกันซ้ำ 2 ที่ (เช่น เก็บทั้งใน URL และใน `useState` หลัก) ให้ยึด URL เป็นตัวจริง แล้วให้ UI อ่าน/เขียนผ่านตัวกลาง
* **Staging / Draft Pattern (สำหรับ Modal / Drawer):**
  * แยก **Draft State** (พื้นที่ทดลองเลือกใน Drawer) ออกจาก **Committed State** (ค่าจริงใน URL)
  * กด **Apply** = ยืนยันส่ง Draft ขึ้น URL | กด **ปิด (X)** = ทิ้ง Draft ไม่กระทบหน้าหลัก

---

## 3. หลักการคิดเรื่องการแปลงข้อมูล (Codec & Type Safety)

* **Serialization / Deserialization ต้องสมมาตร:**
  * ขาเขียนลง URL แปลงจาก `Array` $\rightarrow$ `string` (`arr.join(",")`)
  * ขาอ่านจาก URL ต้องแปลง `string` $\rightarrow$ `Array` (`raw.split(",")`) เสมอ **ห้ามปล่อยให้ Type กลายพันธุ์กลางทาง**
* **ใช้ Master Options (`as const`) เป็นจุดศูนย์กลาง:**
  * ประกาศตัวเลือกไว้ที่เดียว แล้วใช้ `.map()` สร้าง UI และ `.find()` หา Label แทนการ Hard Code ซ้ำๆ ใน JSX
* **Defensive Programming (กันพังตั้งแต่หน้าด่าน):**
  * ตัวเลขจาก URL (`?page=abc` หรือ `?page=-5`) $\rightarrow$ ครอบด้วย `Math.max(1, Number(val) || 1)` เสมอ
  * ข้อความค้นหา $\rightarrow$ `.trim()` ตัดช่องว่างหัวท้าย และ `.toLowerCase()` ก่อนเทียบ

---

## 4. วิธีอ่านและทำความเข้าใจโค้ด (Code Reading Techniques)

### A. Narrative Flow Walkthrough (เล่า Flow ภาษาคน)
อ่านโค้ดโดยไม่ท่องไวยากรณ์ แต่เล่าเป็นเรื่องราวตามลำดับ **Input $\rightarrow$ Process $\rightarrow$ Output**:
* *รับอะไรเข้ามา?* (เช่น รับ `newParams` เข้ามา)
* *เอาไปทำอะไร/เช็คเงื่อนไขอะไร?* (เช่น โคลนค่าเก่า วนลูปเช็ค ถ้าว่างให้ลบ ถ้ามีค่าให้เขียนทับ)
* *ส่งอะไรออกไป?* (เช่น ส่ง `next` กลับไปอัปเดต URL)

### B. Trace the Data Lifecycle (ไล่สายน้ำของข้อมูล)
เวลาเจอ Bug ให้ไล่ดูข้อมูลตั้งแต่ต้นน้ำยันปลายน้ำทีละจุด:
> `User Click` $\rightarrow$ `Draft State` $\rightarrow$ `URL Params` $\rightarrow$ `React Query Key` $\rightarrow$ `Backend SQL/Prisma` $\rightarrow$ `UI Render`

### C. Question-Driven Thinking (ตั้งคำถาม 4 ข้อก่อนเขียนทุกครั้ง)
1. **Empty Case:** ถ้าไม่มีข้อมูล / Array ว่าง `[]` หน้าตาต้องเป็นยังไง?
2. **Single Case:** ถ้ามี 1 ตัว แสดงผลยังไง?
3. **Many Case:** ถ้ามีหลายตัว (แต่ไม่ครบ) แสดงผลยังไง?
4. **All / Max Case:** ถ้าเลือกครบทุกตัว หรือข้อมูลมี 1,000 ตัว จะพังหรือช้าไหม?

---

## 5. วิธีคิดเวลา Refactor โค้ด

* **Rule of Three:** ถ้าเขียน Logic เดิมซ้ำเกิน 2–3 ที่ ให้ดึงออกมาเป็น Helper Function กลาง
* **Pure Function First:** แยกฟังก์ชันคำนวณ/แปลงข้อมูลที่ไม่มี `useState` หรือ JSX ออกมาเป็นฟังก์ชันธรรมดา จะอ่านง่ายและทดสอบง่ายที่สุด
* **Early Return:** เช็ค Error หรือเงื่อนไขที่ผิดปกติแล้ว `return` ออกไปก่อน เพื่อลดการซ้อน `if / else` หลายชั้น

