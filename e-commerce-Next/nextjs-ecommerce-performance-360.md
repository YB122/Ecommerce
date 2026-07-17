# Next.js E-Commerce Performance — A 360° Study Guide

> Scope: Next.js 16 (App Router, Cache Components stable, Turbopack default). If your project is on Next.js 14/15, the rendering model differs in important ways — these are called out explicitly below so you don't apply the wrong mental model to the wrong version.

Performance in a real e-commerce app is never one thing. It's six layers stacked on top of each other, and a slow site is almost always a problem in one specific layer that generic advice ("use Image component", "enable caching") doesn't fix. Study it in this order:

1. **Rendering & caching strategy** — what gets computed when, and how often
2. **Network & infrastructure** — where the bytes travel
3. **Asset delivery** — images, fonts, JS/CSS payload
4. **Client runtime** — what the browser's main thread actually does
5. **Data layer** — database, search, APIs
6. **Observability** — how you prove any of this worked

E-commerce is the hardest category to get this right in, because a single PDP (Product Detail Page) mixes static content (description), semi-static content (price, with promotions), and fully dynamic content (stock, personalized recommendations, cart state) — all on one route.

---

## 1. Rendering & Caching Strategy (the foundation everything else sits on)

This is the layer that determines everything downstream. Get it wrong and no amount of image optimization saves you.

### 1.1 The core trade-off

| Strategy | TTFB | Freshness | Server load | Best for |
|---|---|---|---|---|
| Static (SSG) | Excellent | Stale until rebuild | None | Marketing pages, legal pages |
| ISR / time-based revalidation | Excellent | Eventually consistent | Low | Category pages, blog/CMS content |
| SSR (force-dynamic) | Depends on backend | Always fresh | High | Cart, checkout, account pages |
| Client-side fetch (CSR) | Fast shell, slow data | Always fresh | Shifted to client | Live search, dashboards |
| **PPR (Partial Prerendering)** | Excellent (static shell) + fresh holes | Mixed, per-component | Low-medium | **Most e-commerce pages** |

PPR is the one most people haven't internalized yet because it's genuinely new (stable as of Next.js 16): a single route can serve an instantly-loading static shell **and** stream in dynamic, per-request content in the same response, instead of forcing the whole route into one bucket.

### 1.2 Next.js 16: Cache Components is now explicit and opt-in

This is the single biggest mental model shift from Next 14/15. In the old model, `fetch()` was cached by default unless you opted out. In Next.js 16 with Cache Components enabled, **nothing is cached unless you explicitly say so** — which removes the classic "why is my data stale and I never told it to cache" class of bugs.

```ts
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true, // unlocks PPR + 'use cache' + cacheLife/cacheTag
}

export default nextConfig
```

Once enabled, `cookies()`, `headers()`, `searchParams`, or any uncached async data access marks a component as dynamic automatically — you don't need `export const dynamic = 'force-dynamic'` scattered everywhere; you just wrap dynamic pieces in `<Suspense>` and Next.js figures out the static/dynamic boundary for you.

**Applying this to a PDP — the realistic e-commerce pattern:**

```tsx
// app/product/[slug]/page.tsx
import { Suspense } from 'react'
import { cacheLife, cacheTag } from 'next/cache'

// Static-ish data: description, images, SEO metadata — changes rarely
async function getProductCore(slug: string) {
  'use cache'
  cacheLife({ stale: 300, revalidate: 900, expire: 3600 }) // 5min/15min/1hr
  cacheTag(`product-${slug}`)

  const res = await fetch(`${process.env.API_URL}/products/${slug}`)
  return res.json()
}

// Genuinely dynamic: live stock, personalized price/promo — never cache this
async function getLiveStock(slug: string) {
  const res = await fetch(`${process.env.API_URL}/products/${slug}/stock`, {
    cache: 'no-store',
  })
  return res.json()
}

function StockBadge({ slug }: { slug: string }) {
  return (
    <Suspense fallback={<span className="skeleton h-4 w-20" />}>
      <LiveStock slug={slug} />
    </Suspense>
  )
}

async function LiveStock({ slug }: { slug: string }) {
  const stock = await getLiveStock(slug)
  return <span>{stock.available ? 'In stock' : 'Out of stock'}</span>
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params // params is async in Next 15+ — see note below
  const product = await getProductCore(slug)

  return (
    <article>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <StockBadge slug={slug} />
    </article>
  )
}
```

**Inventory webhook → instant invalidation, no waiting for the revalidate window:**

```ts
// app/api/webhooks/inventory/route.ts
import { revalidateTag } from 'next/cache'

export async function POST(req: Request) {
  const { productSlug } = await req.json()
  revalidateTag(`product-${productSlug}`)
  return Response.json({ revalidated: true })
}
```

This gives you the speed of a fully static page for the 95% of the PDP that doesn't change per-request, with the freshness of SSR for the 5% that does (stock, price overrides, "12 people viewing this now").

### 1.3 If you're on Next.js 14/15 (no Cache Components yet)

You'll still see this in a lot of production codebases, so know it: caching is controlled per-fetch via `next: { revalidate, tags }`, and route-level via `export const dynamic` / `export const revalidate`.

```ts
// Next 14/15 model
const res = await fetch(url, { next: { revalidate: 900, tags: [`product-${slug}`] } })
```

**Anti-pattern to flag in code review:** mixing `force-dynamic` at the page level with cached fetches inside — the page-level export wins and silently disables the caching you thought you had. Cache Components in Next 16 exists specifically because this implicit interaction was a constant source of bugs.

### 1.4 Route-by-route mapping for a typical store

- **Home / landing**: static shell, ISR for promotional banners (`revalidate: 60`)
- **Category / PLP**: PPR — static layout & filters, dynamic price/stock per product card streamed
- **PDP**: pattern above — `use cache` + tags for core data, `no-store` for stock/price-override
- **Search**: almost always fully dynamic, usually delegated entirely to a search service (more in §5)
- **Cart / Checkout / Account**: `force-dynamic`, never cached — this data is user-specific and the cost of serving stale cart data (wrong total, ghost item) is far worse than a slower TTFB

**Pitfall:** teams often cache too aggressively on cart/checkout to "make it fast," then ship bugs where one user sees another's cart. Speed is never worth correctness on these routes — cap your ambition at "fast enough," not "fastest possible," there.

📖 [Caching docs](https://nextjs.org/docs/app/getting-started/caching) · [Next.js 16 release notes](https://nextjs.org/blog/next-16) · [PPR explainer](https://nextjs.org/docs/app/getting-started/partial-prerendering)

---

## 2. Network & Infrastructure Layer

### 2.1 Runtime choice per route

Next.js 16 replaced `middleware.ts` with `proxy.ts` (runs on Node.js runtime, not Edge by default) to make the network boundary explicit. For route handlers/pages themselves you still choose:

```ts
export const runtime = 'edge' // or 'nodejs' (default)
```

- **Edge runtime**: lower cold-start latency, geographically distributed, but a restricted API surface (no native Node APIs, limited npm package support — this bites people using certain ORMs or crypto libs).
- **Node.js runtime**: full compatibility, slightly higher cold start on serverless platforms.

For an e-commerce app: lean on Edge for read-heavy, cacheable routes (category pages, search suggestion proxy) and Node.js for anything touching your ORM/payment SDK directly.

### 2.2 CDN strategy

- Static assets (`_next/static`, images) should be CDN-cached with long `max-age` + immutable hashes (Next.js does this by default on Vercel; on self-hosted/Docker deployments behind CloudFront/Cloudflare, verify your cache headers match — this is the #1 thing self-hosted teams misconfigure).
- ISR pages benefit from being served at the edge so the "stale-while-revalidate" window is geographically close to the user, not just close to your origin server.

### 2.3 Reduce round trips before they happen

```html
<link rel="preconnect" href="https://js.stripe.com" />
<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
```

Every third-party origin (payment SDK, analytics, review widgets) costs a DNS lookup + TLS handshake before the first byte. `preconnect` for things you'll definitely load this page; `dns-prefetch` for things you might load (e.g., a chat widget that appears after scroll).

📖 [Edge and Node.js runtimes](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#runtime)

---

## 3. Asset Delivery

### 3.1 Images — the single biggest LCP lever on a PDP

```tsx
import Image from 'next/image'

<Image
  src={product.heroImage}
  alt={product.name}
  width={800}
  height={800}
  priority // tells Next.js this is likely your LCP element — skip lazy-loading it
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

- Only mark **one** image `priority` per page — typically the hero/PDP main image. Marking everything priority defeats the purpose.
- Everything below the fold should lazy-load by default (the default behavior of `next/image` when `priority` is omitted).
- Serve AVIF/WebP via the built-in image optimizer; configure `remotePatterns` for your CMS/CDN image host in `next.config.ts`.

**Common e-commerce anti-pattern:** product card grids importing full-resolution images and letting CSS scale them down. You're shipping 2000px images for a 300px card — `next/image` with correct `sizes` fixes this, but only if `sizes` actually matches your CSS layout, not a guess.

### 3.2 Fonts — render-blocking is the enemy

```tsx
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap' })
```

`next/font` self-hosts Google Fonts at build time — no runtime request to `fonts.googleapis.com`, no render-blocking external request, no CLS from font swap (Next computes a fallback metric override automatically).

### 3.3 JavaScript bundle

```tsx
import dynamic from 'next/dynamic'

// Reviews tab isn't needed for first paint — defer it
const ProductReviews = dynamic(() => import('./ProductReviews'), {
  loading: () => <ReviewsSkeleton />,
})
```

**The barrel-file trap** — extremely common in e-commerce UI built on icon libraries or component kits:

```ts
// ❌ Pulls the entire icon library into your client bundle in many setups
import { ShoppingCart } from 'some-icon-library'

// ✅ Verify tree-shaking actually works for your bundler/library combo,
// or import the specific module path the library exposes for this purpose
```

Run `@next/bundle-analyzer` regularly, not once:

```ts
// next.config.ts
import withBundleAnalyzer from '@next/bundle-analyzer'

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(nextConfig)
```

📖 [next/image](https://nextjs.org/docs/app/api-reference/components/image) · [next/font](https://nextjs.org/docs/app/api-reference/components/font) · [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

---

## 4. Client Runtime — what the main thread is actually doing

This is where **Core Web Vitals** live, and where e-commerce-specific UX maps directly to metrics:

| Metric | What it measures | E-commerce example |
|---|---|---|
| **LCP** (Largest Contentful Paint) | Time to render the biggest visible element | The hero product image on a PDP |
| **INP** (Interaction to Next Paint — replaced FID) | Responsiveness of any interaction | Click "Add to Cart" → does the UI respond instantly? |
| **CLS** (Cumulative Layout Shift) | Visual stability | A promo banner injecting above the fold after load, shoving the price down |

### 4.1 Minimize the `'use client'` boundary, don't eliminate it

The instinct people have is "Server Components = fast, Client Components = slow," which oversimplifies it. The real rule: **push the boundary to the smallest leaf component possible.**

```tsx
// ❌ The whole product page becomes a client component because one button needs state
'use client'
export default function ProductPage({ product }) {
  const [qty, setQty] = useState(1)
  return ( /* entire page, including static description, ships as client JS */ )
}

// ✅ Only the interactive leaf is client-side
// ProductPage stays a Server Component
export default function ProductPage({ product }) {
  return (
    <article>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <AddToCartControl productId={product.id} /> {/* client component, small */}
    </article>
  )
}
```

The description, specs, and structured data never hydrate — zero JS cost for content that's never interactive.

### 4.2 React Compiler (stable in Next 16)

```ts
// next.config.ts
const nextConfig = { reactCompiler: true }
```

This automatically memoizes components, reducing (not eliminating) the need for manual `useMemo`/`useCallback`. Still hand-optimize genuinely expensive work — e.g., recalculating price across a dozen variant combinations on every keystroke in a configurator — the compiler optimizes re-renders, it doesn't make an O(n²) calculation cheap.

### 4.3 INP specifically for "Add to Cart"

The button click must:
1. Give immediate visual feedback (optimistic UI state change) — don't wait for the server round trip to update the cart icon
2. Use React's `useOptimistic` or local state to show "Added ✓" instantly, then reconcile with the server response

```tsx
'use client'
import { useOptimistic } from 'react'

function AddToCartButton({ productId, addToCart }: { productId: string; addToCart: (id: string) => Promise<void> }) {
  const [optimisticState, setOptimisticState] = useOptimistic('idle')

  return (
    <button
      onClick={async () => {
        setOptimisticState('added')
        await addToCart(productId)
      }}
    >
      {optimisticState === 'added' ? 'Added ✓' : 'Add to Cart'}
    </button>
  )
}
```

📖 [web.dev: INP](https://web.dev/articles/inp) · [React Compiler](https://react.dev/learn/react-compiler) · [useOptimistic](https://react.dev/reference/react/useOptimistic)

---

## 5. Data Layer — database, search, APIs

This is the layer that's invisible in Lighthouse but dictates your floor on TTFB no matter how good your caching is.

### 5.1 The N+1 problem (the most common ORM mistake on PLPs)

```ts
// ❌ N+1: one query for products, then one query per product for its images
const products = await prisma.product.findMany()
for (const p of products) {
  p.images = await prisma.image.findMany({ where: { productId: p.id } })
}

// ✅ One query, joined
const products = await prisma.product.findMany({
  include: { images: true },
  // select only what the PLP card actually renders — don't fetch description,
  // long-form specs, or review text you don't need on this view
})
```

### 5.2 Indexing for the filters your PLP actually exposes

If your category page supports filtering by category + price range + in-stock, a composite index matching that access pattern matters more than indexing every column individually:

```sql
CREATE INDEX idx_products_category_price_stock
ON products (category_id, price, in_stock);
```

Without it, "filter by category, sort by price" on a catalog of 200k SKUs does a sequential scan every time — this is usually the actual root cause when a PLP "feels slow" despite a perfectly cached frontend.

### 5.3 Connection pooling in serverless deployments

Serverless functions (including Vercel's deployment model) spin up new execution contexts frequently. Without pooling, each one opens its own DB connection, and you exhaust your database's connection limit under load — a real production failure mode, not a theoretical one.

```
DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true&connection_limit=1"
```

Use PgBouncer, Prisma Accelerate, or your cloud provider's serverless-aware pooling (e.g., RDS Proxy, Neon's pooled connection string).

### 5.4 Search: don't run `ILIKE '%query%'` against your products table at scale

This is the textbook e-commerce performance mistake. A `LIKE`/`ILIKE` wildcard query can't use a standard B-tree index and degrades badly as the catalog grows. Past a few thousand SKUs, delegate search to a purpose-built engine:

- **Algolia / Typesense / Meilisearch** — managed or self-hosted, sub-50ms typeahead, built-in typo tolerance and faceting
- **Postgres full-text search / `pg_trgm`** — a reasonable middle ground if you don't want another service yet, still meaningfully better than `ILIKE`
- **Elasticsearch/OpenSearch** — when you need heavy faceted search at large scale and already run the ops for it

Pair this with debounced client-side requests for autocomplete:

```tsx
const debouncedQuery = useDebouncedValue(query, 200) // don't fire a request per keystroke
```

### 5.5 Pagination

Offset pagination (`OFFSET 10000 LIMIT 20`) gets progressively slower as the offset grows, because the database still has to scan and discard every preceding row. Cursor-based pagination (`WHERE id > lastSeenId LIMIT 20`) stays flat regardless of depth — relevant for any catalog large enough that customers actually page deep, or for infinite-scroll PLPs.

📖 [Prisma performance docs](https://www.prisma.io/docs/orm/prisma-client/queries/query-optimization-performance) · [Postgres indexing](https://www.postgresql.org/docs/current/indexes.html)

---

## 6. E-Commerce-Specific Third-Party Script Tax

This deserves its own section because it's where e-commerce sites bleed performance that has nothing to do with your own code: analytics, A/B testing tools, chat widgets, review platforms, payment SDKs, tag managers — often 5-10 separate third-party scripts on a single PDP.

```tsx
import Script from 'next/script'

<Script src="https://widget.reviewplatform.com/embed.js" strategy="lazyOnload" />
<Script src="https://www.googletagmanager.com/gtm.js" strategy="afterInteractive" />
```

- `beforeInteractive` — only for scripts that must run before hydration (rare; consent management sometimes needs this)
- `afterInteractive` (default) — analytics, tag managers
- `lazyOnload` — chat widgets, review embeds, anything not needed for the initial experience
- `worker` (experimental, via Partytown) — runs heavy third-party scripts in a web worker, off the main thread entirely

**Specific to checkout:** load the payment SDK (Stripe.js, PayPal SDK, etc.) only on the checkout route, not globally via a root layout. It's a common mistake to put it in `app/layout.tsx` "to be safe," which means every visitor on every page pays for it even if 90% never reach checkout.

📖 [next/script](https://nextjs.org/docs/app/api-reference/components/script) · [Partytown](https://partytown.builder.io/)

---

## 7. Build & Deployment

- **Turbopack** is the default bundler as of Next.js 16 (stable), with significantly faster builds and Fast Refresh — if you're still on an explicit webpack config from an older project, that's the main migration item before upgrading.
- **`output: 'standalone'`** for Docker deployments — produces a minimal self-contained build instead of requiring the full `node_modules` tree in your image.
- **Avoid full-site revalidation storms**: if your CMS triggers a revalidation webhook on every content edit and you call `revalidatePath('/')` broadly instead of tagging specific products/categories, you can cause a "thundering herd" where every cached page regenerates simultaneously under load. Tag granularly (§1.2) instead.
- **Monorepo (Turborepo)** caching in CI matters once you have a shared design system/component library alongside the storefront — remote caching avoids rebuilding unchanged packages on every CI run.

---

## 8. Observability — prove it, don't guess it

You cannot performance-tune by feel past a certain point. Build measurement into the workflow, not as an afterthought:

```tsx
// app/_components/WebVitals.tsx
'use client'
import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // send to your analytics endpoint — this is REAL USER data (RUM),
    // which matters more than lab data because it reflects actual devices/networks
    fetch('/api/vitals', { method: 'POST', body: JSON.stringify(metric) })
  })
  return null
}
```

- **Lab data** (Lighthouse, locally or in CI) tells you about regressions before merge.
- **Field data** (RUM, Chrome UX Report) tells you what real customers on real devices actually experience — and is what Google uses for Core Web Vitals in search ranking, so lab-only optimization can mislead you about real-world impact.

Gate PRs on a performance budget in CI:

```yaml
# .github/workflows/lighthouse.yml
- uses: treosh/lighthouse-ci-action@v11
  with:
    urls: |
      https://staging.example.com/
      https://staging.example.com/product/sample-slug
    budgetPath: ./lighthouse-budget.json
```

📖 [useReportWebVitals](https://nextjs.org/docs/app/api-reference/functions/use-report-web-vitals) · [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) · [web.dev Core Web Vitals](https://web.dev/articles/vitals)

---

## 9. A Study Roadmap (since your senior framed this as "study")

A reasonable order to go deep, layer by layer, rather than trying to absorb all of this at once:

1. **Week 1 — Rendering model**: Server vs Client Components, PPR, Cache Components (`use cache`, `cacheLife`, `cacheTag`). Build a toy PDP that mixes a cached static section with a streamed dynamic stock indicator, like §1.2.
2. **Week 2 — Assets & Core Web Vitals**: `next/image`, `next/font`, bundle analysis, then measure LCP/INP/CLS on your own build with Lighthouse and explain *why* each number is what it is.
3. **Week 3 — Data layer**: find (or deliberately create) an N+1 query in a side project, fix it, measure the query count before/after with your ORM's query logging. Set up a basic search service and compare it against `ILIKE`.
4. **Week 4 — Infra & observability**: deploy with the CDN/runtime choices from §2, wire up `useReportWebVitals`, add a Lighthouse CI budget gate to a sample repo's CI pipeline.

By the end of that, you won't just be able to say "I used `next/image`" — you'll be able to explain *which layer* a given performance problem lives in when your senior asks, which is really what "360°" means here: not knowing every trick, but knowing where to look first.

---

## Reference Index

- [Next.js Caching (current model)](https://nextjs.org/docs/app/getting-started/caching)
- [Next.js 16 release notes](https://nextjs.org/blog/next-16)
- [Partial Prerendering](https://nextjs.org/docs/app/getting-started/partial-prerendering)
- [next/image API](https://nextjs.org/docs/app/api-reference/components/image)
- [next/font API](https://nextjs.org/docs/app/api-reference/components/font)
- [next/script API](https://nextjs.org/docs/app/api-reference/components/script)
- [React Compiler](https://react.dev/learn/react-compiler)
- [web.dev — Core Web Vitals](https://web.dev/articles/vitals)
- [Prisma query optimization](https://www.prisma.io/docs/orm/prisma-client/queries/query-optimization-performance)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
