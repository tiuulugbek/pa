# POWER AUTOMATION — PROGRESS

## YANGILANISH (v3) — navbar / PDF / webp / SEO

### Navbar + qidiruv
- Ikki qatorli header: logo · markazda keng qidiruv paneli · amallar (theme/lang/telegram)
- 2-qator: nav havolalar + active state + mega-menu (ikonka + featured panel)
- Mobil: qidiruv ikonkasi + theme + hamburger; qidiruv global event (`pa:search-open`) + Cmd+K
- SearchModal endi global (Providers'da bir marta), triggerlar event yuboradi

### Dinamik PDF datasheet
- `apps/api/src/datasheet` — pdfkit bilan brendlangan A4 datasheet (header band, brend, nom,
  specs jadval, sertifikat badge'lar, sohalar, footer kontakt). DejaVuSans TTF (Lotin+Kirill+UZ)
- Endpoint: `GET /api/products/:slug/datasheet?lang=uz|ru|en`
- Mahsulot "Hujjatlar" tab'ida soxta .pdf oʻrniga "Texnik maʼlumotnoma (PDF)" tugmasi

### Rasmlar → real .webp
- `scripts/generate-images.mjs` (sharp): har mahsulot uchun brendlangan gradient .webp,
  news/loyiha/brend rasmlari ham. `pnpm gen:images`
- Seed image yoʻllari `.webp`, soxta documents olib tashlandi
- uploads endi bind-mount (`./apps/api/uploads`) — generatsiya qilingan fayllar bevosita xizmat qilinadi

### SEO
- Twitter card (summary_large_image) + OG locale/alternateLocale + keywords
- Catalog'da ItemList JSON-LD; (Product/Organization/WebSite/Breadcrumb/FAQ mavjud)

### Tekshiruv (v3) — `docker compose up` ✅
- webp xizmat: `/uploads/products/*.webp` → 200 image/webp (16.9KB)
- PDF datasheet: EN 200 application/pdf (26KB), RU 200 (29KB, Kirill ✓, %PDF-1.3), noto'g'ri slug → 404
- 36 product webp + news/loyiha rasmlari generatsiya qilindi (sharp)
- Navbar qidiruv paneli ("Search products...") va datasheet tugmasi web'da koʻrinadi
- Mahsulot sahifasi .webp rasmga ishora qiladi
- Barcha servislar running (bot — token yoʻq, ataylab)

---

## OPTIMIZATSIYA BOSQICHI (v2)

### ✅ 1. Ingliz tili (UZ/RU/EN) — tugallandi
- Prisma: `nameEn`, `descriptionEn`, `titleEn`, `bodyEn`, `descEn` qoʻshildi (Category/Product/NewsPost/Project) + performance indekslari
- `packages/types` Locale='uz'|'ru'|'en', barcha interfeyslarda En maydonlar
- `packages/ui` `pick()` EN + UZ fallback, INDUSTRY_META en/descEn, industryLabel/industryDesc
- `next-intl`: en locale, `messages/en.json` (+ uz/ru ga yangi namespace'lar), 3 tilli switcher
- 13 sahifa/komponentda locale ternarylari EN bilan yangilandi, DB matnlar `pick()` orqali
- `lib/seo.ts` canonical + hreflang (uz-UZ/ru-RU/en-US/x-default)
- Admin formalar (Product/News/Project/Category) EN inputlari bilan
- ✅ types/ui/db build, api/web/admin typecheck toza

### ✅ 2. 35 ta real mahsulot (UZ/RU/EN + specs) — tugallandi
- 7 brend (Emerson, Yokogawa, ABB, Endress+Hauser, Honeywell, Siemens, Bürkert)
- Kategoriya daraxtiga "Saviya oʻlchagichlar" va "Analizatorlar" qoʻshildi
- 35 mahsulot: bosim (6), sarf (7), harorat (4), saviya (5), klapan+pozitsioner (6), analizator/gaz (5), avtomatlashtirish/elektr (4)
- Real modellar: Rosemount 3051S/644/5408/8800/2120, Cerabar PMP71B, Promass F300, Micro Motion 5700,
  Micropilot FMR60, SITRANS P320/LR560/FUS1010, SIPART PS2, Fisher GX/easy-e/DVC6200, Bürkert 8696/2301...
- Har birida real texnik specs (JSON) + 3 tilli nom/tavsif. Seed `tsc` toza.

### ✅ 3. Performance — tugallandi
- API: Redis cache layer (ioredis, graceful fallback) — categories tree, product list, featured; admin mutatsiyalarda invalidatsiya
- Prisma indekslari (Product categoryId/brandId/isActive+isFeatured/isActive+createdAt, NewsPost, Project)
- ISR: mahsulot/yangilik/loyiha detali (`revalidate=600`), api client `next.revalidate`
- Loading skeletonlar (catalog, product detail, news) + shimmer
- next/image (SmartImage: fill, sizes, lazy, WebP; http manbalar unoptimized), Yandex map lazy (IntersectionObserver)
- Redis docker-compose servisi + REDIS_URL

### ✅ 4. UI/UX — tugallandi
- Hero: animatsion grid + suzuvchi orblar; stats counter (mavjud)
- ProductCard: hover quick-spec tooltip (top 3) + compare toggle
- Mega-menu: kategoriya ikonkalari + featured mahsulot paneli
- Mahsulot detali: tabbed (Overview/Specs/Documents/Related)
- Compare bar (3 tagacha) + /taqqoslash side-by-side jadval (cookie-backed CompareProvider)
- Mobil pastki navigatsiya (Home/Catalog/Industries/Contact)
- Global CMD+K qidiruv modali (Meilisearch real-time)
- "Soʻrov yuborish" suzuvchi tugma → mini-forma → Telegram
- Soha sahifasi: instrumentatsiya process diagrammasi
- framer-motion sahifa oʻtishlari (template.tsx)
- Dark/light rejim (cookie, html.dark, globals dark stillari)
- Empty state komponenti (qidiruv/bo'sh kategoriya)

### ✅ 5. SEO — tugallandi
- Dinamik OG rasmlar (ImageResponse): mahsulot + sayt default (3 til)
- GA4 (NEXT_PUBLIC_GA_ID, next/script afterInteractive)
- Branding bilan 404 (not-found) va 500 (error.tsx + global-error.tsx)
- Dinamik /sitemap.xml (mahsulot/yangilik/loyiha + hreflang, kunlik revalidate)
- Schema.org: Product, Organization, WebSite, BreadcrumbList, FAQPage (aloqa)
- Canonical + hreflang (uz-UZ/ru-RU/en-US/x-default) barcha asosiy sahifalarda

### Tekshiruv (v2) — `docker compose up -d` ✅ ishlaydi
- types/ui/db build, api/web/admin typecheck — toza
- web `next build`: 29 sahifa generatsiya (faqat Windows standalone symlink EPERM — Docker'da yo'q)
- **Runtime:** 36 mahsulot seed (UZ/RU/EN), Redis cache ulandi, Meilisearch 36 reindex
- Mahsulot detali EN/RU/UZ nomlarni koʻrsatadi; katalog 20 mahsulot; featured ishlaydi
- Qidiruv (Meili): "radar" → 3 saviya oʻlchagich
- /sitemap.xml: 36 mahsulot × 3 til + hreflang; OG rasm 200 (image/png, 218KB)
- Admin: login + 36 mahsulot, nameEn maydonlari
- Barcha 3 til (uz / /ru / /en) HTTP 200

### Runtime tuzatishlar (v2)
- **SSR API URL:** web konteyneri server tomonda `NEXT_PUBLIC_API_URL=localhost:3001` ga yetolmasdi
  (oʻzining loopback'i). `API_INTERNAL_URL=http://api:3001` qoʻshildi — server fetch'lar shu
  orqali, brauzer esa public URL orqali. Endi SSR/ISR/sitemap real maʼlumot oladi.
- Redis host porti 6379 band → `6380:6379` (ichki tarmoq baribir `redis:6379`)

---


## Holat: 100% tugallangan ✅

`docker compose build` muvaffaqiyatli yakunlandi (exit 0) — 4 image qurildi:
`power-automation-web`, `power-automation-api`, `power-automation-bot`, `power-automation-admin`.

### ✅ Bajarildi
- **Monorepo** — Turborepo + pnpm workspace, tsconfig, .env(.example), prettier, dockerignore, README
- **packages/types** — barcha shared TS turlari (strict, `any` yo'q)
- **packages/db** — Prisma schema (9 model), client singleton, real seed:
  5 brend (Emerson, Yokogawa, ABB, Endress+Hauser, Honeywell), 6 kategoriya + subkategoriyalar,
  10 mahsulot (Yokogawa EJA110E, Rosemount 3051S, Promass F300, ABB AC500/ACS880, CENTUM VP,
  Honeywell Optima Plus... real texnik specs), 2 yangilik, 2 loyiha, admin user
- **packages/ui** — design tokens, soha metadata, telegram/locale helperlar
- **apps/api (NestJS)** — categories, brands, products (filter/search/sort/featured/detail/views),
  news, projects, contact+inquiry→Telegram (HTML, inline tugmalar), Meilisearch (graceful fallback),
  JWT auth, admin CRUD (products/categories/brands/news/projects), inquiry status, dashboard stats,
  Multer upload, static /uploads, health
- **apps/bot (Telegraf)** — /start product_N → inquiry + admin guruhga yuborish, inline callback
  (Ko'rildi ✅ / Javob berildi 💬) → DB status yangilash
- **apps/web (Next.js 14)** — next-intl UZ/RU (as-needed prefix, cookie); Header (sticky/blur/mega-menu/
  mobil), Footer, floating TelegramCTA (pulse), Breadcrumb (JSON-LD); bosh sahifa (8 blok); katalog
  (filtr sidebar/qidiruv/sort/pagination); mahsulot detali (gallery/specs/sertifikat/hujjat/2× Telegram
  CTA/related); sohalar(+detail); haqimizda; loyihalar(+detail); yangiliklar(+detail); aloqa (forma+map);
  SEO (generateMetadata, robots, next-sitemap, Product/Breadcrumb JSON-LD); SmartImage fallback
- **apps/admin (Next.js 14)** — login (JWT), dashboard (stat kartalar + oylik grafik + so'rov holati),
  products (jadval + to'liq forma: dinamik specs/hujjat qatorlari, rasm upload), categories (daraxt),
  brands, inquiries (status filter + yangilash), news (forma), projects (forma)
- **Infra** — docker-compose.yml (postgres+meilisearch+api+web+bot+admin, healthcheck, volumes),
  4 Dockerfile (monorepo root context, multi-stage), Nginx (3 subdomen, gzip, proxy_cache, Certbot izoh)

### Tekshiruv
- `pnpm install` ✅ (lockfile yaratildi)
- Har bir paket/app TypeScript build/typecheck ✅
- `docker compose build` ✅ — 4 image muvaffaqiyatli qurildi

### Ishga tushirish (tekshirildi ✅ `docker compose up -d`)
```bash
cp .env.example .env   # TELEGRAM_BOT_TOKEN, ADMIN_CHAT_ID to'ldiring
docker compose up -d   # api birinchi ishga tushganda schema push + seed qiladi
```
Admin: **admin / admin123** · Web http://localhost:3002 · API http://localhost:3001 · Admin http://localhost:3003

### Runtime verifikatsiya natijalari
- postgres (healthy), meilisearch, api, web, admin — **running** ✅
- API health, products (10), featured (4), categories (6 ota + 14 bola), product detail (specs+related) ✅
- Meilisearch qidiruv ishlaydi ("bosim"→2, "coriolis"→1); API boot'da reindex qilinadi ✅
- POST /api/contact → inquiry yaratildi; admin JWT login, inquiries, dashboard ✅
- web/admin HTTP 200 (UZ + /ru) ✅
- **bot** — TELEGRAM_BOT_TOKEN bo'sh bo'lgani uchun ataylab to'xtaydi (token kiritilsa ishlaydi)

### Runtime tuzatishlar
- Host portlari band edi (lokal postgres :5432, node :3000) → compose'da `5433:5432`, `3002:3000`
- `express` to'g'ridan-to'g'ri dependency sifatida qo'shildi (pnpm strict node_modules uchun)
- Meilisearch indeksi API boot'da DB'dan reindex qilinadi (seed to'g'ridan DB'ga yozadi)

### MUHIM QOIDALAR — bajarildi
- ❌ Narx / "bepul" / "chegirma" — hech qayerda yo'q
- ❌ Savat / checkout / payment — yo'q
- ✅ Telegram asosiy kanal — har mahsulot sahifasida 2+ Telegram CTA
- ✅ Mobil-first responsive
- ✅ TypeScript strict, `any` ishlatilmagan
- ✅ Real sanoat mahsulot ma'lumotlari
