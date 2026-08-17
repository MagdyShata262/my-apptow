You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection
  src/app/
  │
  ├── core/ # ⚙️ خدمات singleton — تُحمّل مرة واحدة
  │ ├── interceptors/
  │ │ └── auth.interceptor.ts # يرفق Bearer token مع كل طلب
  │ ├── guards/
  │ │ └── auth.guard.ts # يحمي صفحات العرض
  │ ├── services/
  │ │ ├── state.service.ts # حالة UI عامة بالـ Signals (ثيم، لغة، تحميل)
  │ │ └── auth.service.ts # 🔐 جديد: login/logout ضد DummyJSON
  │ └── index.ts # نقطة استيراد موحّدة (كما هو عندك)
  │
  ├── shared/ # 🧩 UI قابل لإعادة الاستخدام — بلا منطق
  │ ├── components/
  │ │ ├── header/ # (موجود عندك)
  │ │ ├── spinner/ # مؤشر تحميل موحّد
  │ │ └── error-box/ # رسالة خطأ موحّدة
  │ ├── utilities/ # pipes + دوال مساعدة نقية
  │ └── index.ts
  │
  ├── features/ # 📦 نطاقات العمل
  │ │
  │ ├── home/ # صفحة الهبوط (موجودة)
  │ │ └── home.component.ts
  │ │
  │ ├── about/ # صفحة عن التطبيق (موجودة)
  │ │ └── about.component.ts
  │ │
  │ ├── auth/ # 🔐 جديد: feature مستقل للدخول
  │ │ ├── login/
  │ │ │ └── login.component.ts
  │ │ └── auth.routes.ts
  │ │
  │ └── features/ # ⭐ معرض البيانات (محمي بالـ guard)
  │ ├── features.component.ts # Shell: تبويبات/قائمة جانبية + <router-outlet/>
  │ ├── features.routes.ts # توجيه داخلي لكل عرض
  │ │
  │ ├── products/ # العرض 1 — النمط المرجعي
  │ │ ├── data-access/
  │ │ │ ├── product.model.ts # شكل بيانات DummyJSON
  │ │ │ ├── products.service.ts # HTTP فقط (غبي)
  │ │ │ └── products.facade.ts # Signals + المنطق (ذكي)
  │ │ ├── components/
  │ │ │ └── product-card/ # Presentational
  │ │ ├── products-list.component.ts # Smart
  │ │ └── product-details.component.ts
  │ │
  │ ├── users/ # العرض 2 — نسخ نفس النمط
  │ │ ├── data-access/
  │ │ ├── components/
  │ │ └── users-list.component.ts
  │ │
  │ ├── todos/ # العرض 3
  │ └── recipes/ # العرض 4
  │
  ├── app.ts # 🐚 Thin Shell: header + <router-outlet/>
  ├── app.routes.ts # 🗺️ lazy loading لكل الـ features
  ├── app.scss
  └── AGENTS.md
