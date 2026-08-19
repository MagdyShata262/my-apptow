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

# Angular

Angular — Deliver web apps with confidence 🚀

## Table of Contents

- [What is Angular](https://angular.dev/overview)
- [Installation guide](https://angular.dev/installation)
- [Style Guide](https://next.angular.dev/style-guide)

## Components

- [What is a component](https://angular.dev/guide/components)
- [Component selectors](https://angular.dev/guide/components/selectors)
- [Styling components](https://angular.dev/guide/components/styling)
- [Accepting data with input properties](https://angular.dev/guide/components/inputs)
- [Custom events with output](https://angular.dev/guide/components/outputs)
- [Content projection](https://angular.dev/guide/components/content-projection)
- [Component lifecycle](https://angular.dev/guide/components/lifecycle)

## Templates guides

- [Template Overview](https://angular.dev/guide/templates)
- [Adding event listeners](https://angular.dev/guide/templates/event-listeners)
- [Binding text, properties and attributes](https://angular.dev/guide/templates/binding)
- [Control Flow](https://angular.dev/guide/templates/control-flow)
- [Template variable declaration](https://angular.dev/guide/templates/variables)
- [Deferred loading of components](https://angular.dev/guide/templates/defer)
- [Expression syntax](https://angular.dev/guide/templates/expression-syntax)

## Directives

- [Directives overview](https://angular.dev/guide/directives)
- [Attribute directives](https://angular.dev/guide/directives/attribute-directives)
- [Structural directives](https://angular.dev/guide/directives/structural-directives)
- [Directive composition](https://angular.dev/guide/directives/directive-composition-api)
- [Optimizing images](https://angular.dev/guide/image-optimization)

## Signals

- [Signals overview](https://angular.dev/guide/signals)
- [Dependent state with linkedSignal](https://angular.dev/guide/signals/linked-signal)
- [Async reactivity with resources](https://angular.dev/guide/signals/resource)

## Dependency injection (DI)

- [Dependency Injection overview](https://angular.dev/guide/di)
- [Understanding Dependency injection](https://angular.dev/guide/di/dependency-injection)
- [Creating an injectable service](https://angular.dev/guide/di/creating-injectable-service)
- [Configuring dependency providers](https://angular.dev/guide/di/dependency-injection-providers)
- [Lazy loading services](https://angular.dev/guide/di/lazy-loading-services)
- [Injection context](https://angular.dev/guide/di/dependency-injection-context)
- [Hierarchical injectors](https://angular.dev/guide/di/hierarchical-dependency-injection)
- [Optimizing Injection tokens](https://angular.dev/guide/di/lightweight-injection-tokens)

## RxJS

- [RxJS interop with Angular signals](https://angular.dev/ecosystem/rxjs-interop)
- [Component output interop](https://angular.dev/ecosystem/rxjs-interop/output-interop)

## Loading Data

- [HttpClient overview](https://angular.dev/guide/http)
- [Setting up the HttpClient](https://angular.dev/guide/http/setup)
- [Making requests](https://angular.dev/guide/http/making-requests)
- [Intercepting requests](https://angular.dev/guide/http/interceptors)
- [Reactive data fetching with httpResource](https://angular.dev/guide/http/http-resource)
- [Testing](https://angular.dev/guide/http/testing)

## Forms

- [Forms overview](https://angular.dev/guide/forms)
- [Reactive Forms](https://angular.dev/guide/forms/reactive-forms)
- [Strictly types forms](https://angular.dev/guide/forms/typed-forms)
- [Template driven forms](https://angular.dev/guide/forms/template-driven-forms)
- [Validate forms input](https://angular.dev/guide/forms/form-validation)
- [Building dynamic forms](https://angular.dev/guide/forms/dynamic-forms)
- [Signal Forms](https://angular.dev/guide/forms/signals/overview)

## Accessibility

- [Angular Aria overview](https://angular.dev/guide/aria/overview)

## Routing

- [Routing overview](https://angular.dev/guide/routing)
- [Define routes](https://angular.dev/guide/routing/define-routes)
- [Route loading strategies](https://angular.dev/guide/routing/loading-strategies)
- [Show routes with outlets](https://angular.dev/guide/routing/show-routes-with-outlets)
- [Navigate to routes](https://angular.dev/guide/routing/navigate-to-routes)
- [Read route state](https://angular.dev/guide/routing/read-route-state)
- [Common routing tasks](https://angular.dev/guide/routing/common-router-tasks)
- [Creating custom route matches](https://angular.dev/guide/routing/routing-with-urlmatcher)

## Server Side Rendering (SSR)

- [SSR Overview](https://angular.dev/guide/performance)
- [Server and hybrid rendering](https://angular.dev/guide/ssr)
- [Rendering strategies in Angular](https://angular.dev/guide/routing/rendering-strategies)
- [Hybrid rendering with server routing](https://angular.dev/guide/hybrid-rendering)
- [Hydration](https://angular.dev/guide/hydration)
- [Incremental Hydration](https://angular.dev/guide/incremental-hydration)

# CLI

[Angular CLI Overview](https://angular.dev/tools/cli)

## Testing

- [Testing overview](https://angular.dev/guide/testing)
- [Testing coverage](https://angular.dev/guide/testing/code-coverage)
- [Testing services](https://angular.dev/guide/testing/services)
- [Basics of component testing](https://angular.dev/guide/testing/components-basics)
- [Component testing scenarios](https://angular.dev/guide/testing/components-scenarios)
- [Testing attribute directives](https://angular.dev/guide/testing/attribute-directives)
- [Testing pipes](https://angular.dev/guide/testing/pipes)
- [Debugging tests](https://angular.dev/guide/testing/debugging)
- [Testing utility apis](https://angular.dev/guide/testing/utility-apis)
- [Component harness overview](https://angular.dev/guide/testing/component-harnesses-overview)
- [Using component harness in tests](https://angular.dev/guide/testing/using-component-harnesses)
- [Creating a component harness for your components](https://angular.dev/guide/testing/creating-component-harnesses)

## Animations

- [Animations your content](https://angular.dev/guide/animations/css)
- [Route transition animation](https://angular.dev/guide/routing/route-transition-animations)
- [Migrating to native CSS animations](https://next.angular.dev/guide/animations/migration)

## APIs

- [API reference](https://angular.dev/api)
- [CLI command reference](https://angular.dev/cli)

## Others

- [Zoneless](https://angular.dev/guide/zoneless)
- [Error encyclopedia](https://angular.dev/errors)
- [Extended diagnostics](https://angular.dev/extended-diagnostics)
- [Update guide](https://angular.dev/update-guide)
- [Contribute to Angular](https://github.com/angular/angular/blob/main/CONTRIBUTING.md)
- [Angular's Roadmap](https://angular.dev/roadmap)
- [Keeping your projects up-to-date](https://angular.dev/update)
- [Security](https://angular.dev/best-practices/security)
- [Internationalization (i18n)](https://angular.dev/guide/i18n)
