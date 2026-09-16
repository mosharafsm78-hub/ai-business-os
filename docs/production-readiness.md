# Forge Production Readiness

## Product direction
Forge is a production SaaS website/web application. The public experience uses a consistent light visual system across Business Finder, Product Lab, Business Plan, Store Launch, billing/checkout, and operational pages.

## UI rules
- Large content surfaces remain light.
- Dark navy is reserved for small brand/control accents, not page-sized content blocks.
- Business Plan selected products are first-class content, not a persistent Product Lab shortlist overlay.
- User-provided business names are used as identity; Forge must not invent a company name silently.
- Mobile layouts must reflow without horizontal scrolling.

## Release gate
Every production commit must:
1. Pass `node --check app-v6.js`.
2. Contain the required runtime files.
3. Deploy through CI rather than manual file replacement.
4. Be reviewed on a real mobile viewport and desktop viewport.
5. Have no permanent loading state, console-blocking JavaScript error, or broken primary navigation.

## Hosting direction
- GitHub remains source control and CI.
- GitHub Pages remains a static fallback.
- Vercel is the intended primary production host for the public website because it supports Git-connected production/preview deployments and custom domains.
- A dedicated production database must be used before persistent customer data is introduced; do not reuse an unrelated Supabase project.

## Launch sequence
1. Stabilize UI and runtime.
2. Connect the repository to a dedicated Vercel project.
3. Add the production domain.
4. Add a dedicated production data/auth project.
5. Configure environment variables.
6. Test sign-up, workspace creation, navigation, Product Lab -> Business Plan flow, billing/checkout states, mobile reflow and recovery states.
7. Only then announce the domain publicly.

## Reliability
No hosting provider can honestly guarantee zero downtime. The target is controlled releases, automated validation, preview testing, fast rollback, persistent production data, and a documented fallback.
