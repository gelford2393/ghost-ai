Clerk is already installed and connected. Wire it into the Next.js app: provider, auth pages, redirects, route protection, and user menu.

## Design

Use Clerk's `dark` theme from `@clerk/ui/themes` as the base.

Override Clerk appearance variables using the app's existing CSS variables in `globals.css`. Do not hardcode colors. 

## Sign-in and sign-up pages

- large screens: simple two-panel layout
- left: compact logo, tagline, short text-only features list
- right: centered Clerk form
- small screens: form only
- no gradients
- no oversized hero sections
- no feature cards
- no scroll-heavy layouts

Keep the layout minimal and professional

## Implementation

Wrap the root layout with `ClerkProvider` using Clerk's `dark` theme

Create sign-in and sign-up pages using Clerk components

Use `proxy.ts`at the project root, not `middleware.ts`.

Define public routes using the existing sign-in and sign-up env vars. Protect everything else by default.

Update `/`:

- authenticated users redirect to `/editor`
- unauthenticated users redirect to `/sign-in`

Add Clerk's built-in `UserButton` component to `editor-navbar.tsx` (top-right), and attach it to the existing right-side empty section for profile settings and logout. 

Keep Clerk's default user menu and profile flows intact. Do not rebuild or heavily customize Clerk internals.

Use existing Clerk env vars. Do not rename, modify, or add new ones.

## Dependencies

install: @clerk/ui.

## Check when done:

- `proxy.ts` exists and is correct
- All Clerk components render correctly
- Auth pages work
- Redirects work
- Route protection works
- User menu works
- No Tailwind errors
- No TypeScript errors
- No build errors
- all routes are protected except public auth paths
- auth pages use CSS variables with no hardcoded colors
- `ClerkProvider` wraps root layout
- no UI is duplicated - only Clerk components are used
- no Clerk secrets hardcoded in code
- `npm run build` passes