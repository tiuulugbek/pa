# POWER AUTOMATION — MASTER PLAN
> Bu faylni o'qib, loyihani oxirigacha mustaqil qurib chiq. Har bir qadam tugagach PROGRESS.md ni yangilab bor. Savol so'rama — TZ da yozilgani bo'yicha qabul qil va davom et.

---

## LOYIHA HAQIDA

**Kompaniya:** Power Automation MCHJ — O'zbekiston (Toshkent)  
**Faoliyat:** Neft-gaz, kimyo, tog'-kon, energetika sanoati uchun uskuna va o'lchov vositalarini yetkazib berish  
**Sayt maqsadi:** B2B korporativ sayt — mahsulotlar katalogi (ko'rish + Telegram zapros), onlayn savdo YO'Q  
**Asosiy konversiya kanali:** Telegram (`@power_automation_bot`)

---

## TEXNIK STACK

```
Monorepo: Turborepo
├── apps/web        → Next.js 14 (App Router), port 3000
├── apps/api        → NestJS, port 3001  
├── apps/bot        → Telegraf (Telegram bot), port 3002
└── apps/admin      → Next.js 14 (admin panel), port 3003

Shared:
├── packages/db     → Prisma + PostgreSQL
├── packages/ui     → Shared components
└── packages/types  → Shared TypeScript types

Infra: Docker Compose, Nginx, PM2, Ubuntu VPS
Search: Meilisearch (mahsulot qidirish uchun)
```

---

## DATABASE SCHEMA (Prisma)

```prisma
model Category {
  id        Int        @id @default(autoincrement())
  nameUz    String
  nameRu    String
  slug      String     @unique
  icon      String?    // SVG string yoki icon name
  parentId  Int?
  parent    Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children  Category[] @relation("CategoryTree")
  products  Product[]
  order     Int        @default(0)
  createdAt DateTime   @default(now())
}

model Brand {
  id             Int       @id @default(autoincrement())
  name           String    @unique
  logo           String?   // /uploads/brands/logo.png
  country        String?
  website        String?
  products       Product[]
  createdAt      DateTime  @default(now())
}

model Product {
  id              Int        @id @default(autoincrement())
  nameUz          String
  nameRu          String
  slug            String     @unique
  descriptionUz   String?    @db.Text
  descriptionRu   String?    @db.Text
  categoryId      Int
  category        Category   @relation(fields: [categoryId], references: [id])
  brandId         Int?
  brand           Brand?     @relation(fields: [brandId], references: [id])
  images          String[]   // ["/uploads/products/img1.jpg"]
  documents       Json?      // [{name: "Datasheet", url: "/uploads/docs/x.pdf"}]
  specifications  Json?      // [{label: "Bosim diapazoni", value: "0-100 bar"}]
  certificates    String[]   // ["ATEX", "IECEx", "GOST"]
  industries      String[]   // ["oil_gas", "chemical", "mining"]
  badge           String?    // "Yangi" | "Ko'p buyurilgan" | "Sertifikatlangan"
  isActive        Boolean    @default(true)
  isFeatured      Boolean    @default(false)
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  inquiries       Inquiry[]
}

model Inquiry {
  id              Int       @id @default(autoincrement())
  productId       Int?
  product         Product?  @relation(fields: [productId], references: [id])
  telegramUserId  String?
  telegramUsername String?
  name            String?
  phone           String?
  company         String?
  message         String    @db.Text
  status          InquiryStatus @default(NEW)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model NewsPost {
  id          Int      @id @default(autoincrement())
  titleUz     String
  titleRu     String
  slug        String   @unique
  bodyUz      String   @db.Text
  bodyRu      String   @db.Text
  thumbnail   String?
  category    String?  // "Yangilik" | "Texnik maqola" | "Loyiha"
  isPublished Boolean  @default(false)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
}

model Project {
  id           Int      @id @default(autoincrement())
  titleUz      String
  titleRu      String
  slug         String   @unique
  descUz       String   @db.Text
  descRu       String   @db.Text
  industry     String   // "oil_gas" | "chemical" | "mining" | "energy"
  location     String?
  year         Int?
  images       String[]
  isPublished  Boolean  @default(true)
  createdAt    DateTime @default(now())
}

enum InquiryStatus {
  NEW
  SEEN
  REPLIED
}
```

**Seed data (boshlang'ich):**
- 6 kategoriya: KIP (O'lchov asboblari), Klapanlar va pnevmatika, Avtomatlashtirish tizimlari, Xavfsizlik tizimlari, Dasturiy ta'minot, Elektr uskunalar
- Har kategoriyada 2-3 subcategory
- 5 brend: Emerson, Yokogawa, ABB, Endress+Hauser, Honeywell
- 10 ta namuna mahsulot (real texnik specs bilan)
- 2 ta yangilik posti
- 2 ta loyiha

---

## WEB SAYT SAHIFALARI (apps/web)

### Umumiy komponentlar
- `Header` — sticky, backdrop-blur scroll effekti, mega-menu (Mahsulotlar hover da), til almashtirish (UZ/RU), mobil hamburger
- `Footer` — 4 ustun: logo+tavsif, tez havolalar, kategoriyalar, aloqa. Pastda copyright
- `TelegramCTA` — floating button (desktop: o'ng tomonda sticky; mobil: pastda FAB). Telegram ko'k (#229ED9), pulse animatsiya har 8 sekund
- `Breadcrumb` — barcha ichki sahifalarda

### `/` — Bosh sahifa
1. **Hero** — to'liq ekran, industrial fon rasm (public/hero-bg.jpg, agar yo'q bo'lsa gradient overlay ishlatilsin), 60% qoraytirilgan overlay, oq matn. H1: "Sanoat uchun ishonchli yechimlar", sub: "Neft-gaz, kimyo, tog'-kon sanoati uchun uskuna va o'lchov tizimlari". 2 tugma: "Mahsulotlar katalogi" (solid ko'k) + "Telegram orqali murojaat" (outline oq). Matn fade-in-up animatsiya.
2. **Trust stats** — 4 raqam counter animatsiya: "15+ Yil tajriba", "500+ Loyiha", "30+ Brend", "O'zbekiston bo'ylab". Ko'k-oq fon.
3. **Sohalar** — 6 ta karta grid (2x3): Neft va gaz, Kimyo sanoati, Tog'-kon, Energetika, Oziq-ovqat, Suv ta'minoti. Har birida SVG ikonka + nom + 1 qator tavsif. Hover: lift + gradient overlay.
4. **Featured mahsulotlar** — DB dan `isFeatured: true` bo'lganlar, 4 ta karta.
5. **Ish jarayoni** — 4 bosqich gorizontal: So'rov → Tahlil → Yetkazib berish → Texnik yordam. Nuqtali chiziq bilan ulangan.
6. **Brendlar karuseli** — CSS infinite scroll, grayscale → hover da rangli.
7. **So'nggi yangiliklar** — NewsPost dan oxirgi 3 ta.
8. **Footer CTA blok** — "Savollaringiz bormi?" + Telegram tugmasi.

### `/mahsulotlar` — Katalog
- **Chap sidebar** (desktop: 280px sticky, mobil: collapsible drawer):
  - Kategoriya daraxti (accordion, DB dan dinamik)
  - Brend filtri (checkbox)
  - Soha filtri (checkbox): Neft-gaz / Kimyo / Tog'-kon / Energetika
  - Sertifikat filtri: ATEX / IECEx / GOST
- **O'ng qism**:
  - Qidiruv (Meilisearch, real-time)
  - Sort: Yangi / Alifbo / Ko'p ko'rilgan
  - Grid (3 ustun desktop, 2 tablet, 1 mobil)
  - Pagination (20 ta per page)
- **Mahsulot kartasi**: rasm, brend logo, model nomi, qisqa tavsif (2 qator), badge, "Batafsil" + "So'rov" tugmalari

### `/mahsulotlar/[slug]` — Mahsulot detail
- Chap: rasm gallery (asosiy + thumbnails)
- O'ng: nom, brend logo, breadcrumb, texnik specs jadval (specifications JSON dan), sertifikatlar badge'lari, hujjatlar yuklab olish (documents JSON dan), **TO'LIQ KENGLIKDAGI "Telegram orqali so'rov" tugmasi** (Telegram ko'k, ikonka bilan)
- Past: "O'xshash mahsulotlar" karuseli, "Qo'llanilgan sohalar" bo'limi

### `/sohalar` — Sohalar ro'yxati
- 6 soha karta (kattalroq, icon + nom + tavsif + "Ko'rish" havolasi)

### `/sohalar/[slug]` — Soha detail
Sluglar: `neft-gaz`, `kimyo`, `togkon`, `energetika`, `oziq-ovqat`, `suv`
- Hero banner soha uchun
- "Muammolar va yechimlar" bo'limi
- Ushbu soha uchun filtrlanган mahsulotlar
- Agar loyihalar bo'lsa, qisqa ko'rinishi

### `/haqimizda`
- Kompaniya tarixi (timeline, 2010 dan hozirga)
- Missiya va qadriyatlar
- Sertifikatlar (karta grid, modal bilan PDF ko'rish)
- Hamkor brendlar (logo wall)
- Statistika (yuqoridagi 4 raqam yana)

### `/loyihalar`
- Grid (2 ustun): har bir loyiha karta — rasm, soha badge, nom, joylashuv, yil
- Soha bo'yicha filter

### `/loyihalar/[slug]`
- To'liq loyiha tavsifi, rasm gallery, ishlatilgan mahsulotlar

### `/yangiliklar`
- Blog grid (3 ustun), category filter, pagination

### `/yangiliklar/[slug]`
- To'liq maqola, teglar, o'xshash maqolalar

### `/aloqa`
- Yandex.Maps embed (Toshkent, kompaniya manzili)
- Aloqa ma'lumotlari: tel, telegram, email, ish vaqti
- So'rov formasi: Ism, Kompaniya, Telefon, Soha (select), Xabar — NestJS `/api/contact` ga POST

---

## DIZAYN TIZIMI

### Ranglar
```css
--blue-dark:    #0A4DB8   /* header, asosiy tugmalar */
--blue-mid:     #1A7FE8   /* hover, ikonkalar */
--blue-accent:  #3BBFFF   /* gradient, divider */
--blue-bg:      #EBF4FF   /* karta fonlari */
--neutral-bg:   #F5F7FA   /* sahifa foni */
--text-dark:    #0D1B3E   /* asosiy matn */
--text-mid:     #334E7B   /* ikkilamchi matn */
--telegram:     #229ED9   /* telegram tugmasi */
```

### Tipografiya
- Font: Inter (Google Fonts), barcha og'irliklar
- Texnik specs uchun: IBM Plex Mono
- Hero H1: 56px/700, Heading H2: 36px/600, H3: 24px/600, Body: 16px/400

### Animatsiyalar
- Scroll enter: `fade-in-up` (opacity 0→1, translateY 20px→0, 0.5s ease)
- Stagger: ketma-ket elementlar 100ms farq bilan
- Counter: `CountUp` effect (IntersectionObserver bilan)
- Brendlar karuseli: CSS `@keyframes scroll` cheksiz
- Telegram FAB: `@keyframes pulse` har 8 sekund
- Karta hover: `translateY(-4px)` + `box-shadow` chuqurlashadi

---

## API ENDPOINTLAR (apps/api — NestJS)

```
GET  /api/categories              → kategoriya daraxti
GET  /api/products                → list (filter: categoryId, brandId, industry, search, page, limit)
GET  /api/products/:slug          → detail
GET  /api/products/featured       → featured mahsulotlar (bosh sahifa uchun)
GET  /api/brands                  → barcha brendlar
GET  /api/news                    → yangiliklar (page, limit, category)
GET  /api/news/:slug              → yangilik detail
GET  /api/projects                → loyihalar (industry filter)
GET  /api/projects/:slug          → loyiha detail
POST /api/contact                 → aloqa formasi → Telegram ga yuboradi
POST /api/inquiry                 → mahsulot so'rovi → Telegram ga yuboradi

# Admin (JWT himoyalangan)
POST   /api/admin/login
CRUD   /api/admin/products
CRUD   /api/admin/categories
CRUD   /api/admin/brands
CRUD   /api/admin/news
CRUD   /api/admin/projects
GET    /api/admin/inquiries
PATCH  /api/admin/inquiries/:id/status
POST   /api/admin/upload           → rasm/hujjat yuklash (Multer, /public/uploads/)
```

---

## TELEGRAM BOT (apps/bot)

**Bot username:** `@power_automation_bot`

**Xususiyatlar:**
1. Mahsulot sahifasidan zapros kelganda (productId, foydalanuvchi ma'lumotlari) → Admin guruhiga (`ADMIN_CHAT_ID`) quyidagi format bilan yuboradi:
```
🔔 Yangi so'rov!
📦 Mahsulot: [mahsulot nomi]
👤 Foydalanuvchi: @username
📱 Telegram ID: 123456
⏰ Vaqt: 12:05, 11-Iyun 2026
```
2. `/start product_42` — bot mahsulot nomini ko'rsatib, "So'rovingiz qabul qilindi" deydi
3. Admin guruhda inline tugmalar: "Ko'rildi ✅" | "Javob berildi 💬" — bosilganda DB da status yangilanadi
4. Aloqa formasidan kelgan xabarlar ham shu guruhga

---

## ADMIN PANEL (apps/admin)

**Sahifalar:**
- `/login` — JWT auth
- `/dashboard` — statistika: jami mahsulotlar, so'rovlar (NEW/SEEN/REPLIED), oylik grafik
- `/products` — jadval (search, filter), "Yangi qo'shish", har birida "Tahrirlash" / "O'chirish"
- `/products/new` va `/products/[id]/edit` — to'liq forma: barcha maydonlar, rasm yuklash, specs dinamik jadval (qo'shish/o'chirish qatorlari), hujjat yuklash
- `/categories` — daraxt ko'rinish, drag-and-drop tartib
- `/brands` — logo bilan jadval
- `/inquiries` — so'rovlar jadval, status filter, "Ko'rildi" belgisi
- `/news` — maqolalar, rich text editor (TipTap)
- `/projects` — loyihalar CRUD

---

## KO'P TILLILIK

- Default: UZ (lotin)
- `/ru/*` prefixda rus tili
- `next-intl` kutubxonasi
- Barcha DB maydoni `nameUz/nameRu`, `descriptionUz/descriptionRu` juft
- `lang` attribute `<html>` da to'g'ri o'rnatilsin
- Tilni cookie da saqlash (1 yil)

---

## SEO

Har bir sahifada:
- `<title>` va `<meta description>` — Next.js `generateMetadata()`
- Open Graph teglari
- `lang` attribute
- Canonical URL
- Breadcrumb JSON-LD
- Product sahifada: `Product` schema.org
- `/sitemap.xml` — avtomatik (next-sitemap)
- `/robots.txt` — barcha sahifalar indekslansin, `/admin/*` bloklash

---

## DOCKER & DEPLOY

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: power_automation_db
      POSTGRES_USER: pa_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data

  meilisearch:
    image: getmeili/meilisearch:latest
    environment:
      MEILI_MASTER_KEY: ${MEILI_KEY}

  api:
    build: ./apps/api
    env_file: .env
    depends_on: [postgres, meilisearch]

  web:
    build: ./apps/web
    env_file: .env
    depends_on: [api]

  bot:
    build: ./apps/bot
    env_file: .env
    depends_on: [api]

  admin:
    build: ./apps/admin
    env_file: .env
    depends_on: [api]
```

**Nginx konfiguratsiya:**
- `powerautomation.uz` → web (port 3000)
- `api.powerautomation.uz` → api (port 3001)
- `admin.powerautomation.uz` → admin (port 3003)
- SSL: Certbot
- `gzip on`, `proxy_cache` statik fayllar uchun

**.env.example:**
```
DATABASE_URL=postgresql://pa_user:password@postgres:5432/power_automation_db
TELEGRAM_BOT_TOKEN=
ADMIN_CHAT_ID=
MEILI_URL=http://meilisearch:7700
MEILI_KEY=
JWT_SECRET=
NEXT_PUBLIC_API_URL=https://api.powerautomation.uz
NEXT_PUBLIC_TELEGRAM_BOT=@power_automation_bot
```

---

## PROGRESS TRACKING

Har bir katta qism tugagach `PROGRESS.md` ni yangilab bor:

```markdown
## Holat: [XX]% tugallangan

### ✅ Bajarildi
- [nima qilindi]

### 🔄 Jarayonda
- [hozir nima qilinmoqda]

### ⏳ Navbatda
- [keyingi nima]

### ⚠️ Muammolar
- [agar biror narsa ishlamasa]
```

---

## MUHIM QOIDALAR

1. **Narx ko'rsatma** — hech qayerda narx, "bepul", "chegirma" so'zlari bo'lmasin
2. **Savat yo'q** — "Savatga qo'shish", checkout, payment — umuman yo'q
3. **Telegram asosiy** — har bir mahsulot sahifasida kamida 2 joyda Telegram tugmasi
4. **Mobil birinchi** — barcha komponent avval mobil uchun, keyin kengaytirish
5. **TypeScript strict** — `any` ishlatma
6. **Seed data real bo'lsin** — namuna mahsulotlar haqiqiy texnik specs bilan (masalan: Yokogawa EJA110E differential pressure transmitter)
