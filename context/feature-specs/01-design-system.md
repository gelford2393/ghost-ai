React `AGENTS.md` before starting.

We're adding the design system and UI primitive components.

Install and configure `shadcn /ui`.

Add these shadcn components: 
- Button
- Input
- Label
- Card
- Tabs
- ScrollArea
- Dialog

Do not modify the generated `components/ui/*` files after installation.

Also Install `lucide-react`.

Create `lib/utils.ts` with the `cn()` helper for merging Tailwind Classes.

Ensure all components match the existing dark theme in `global.css`.

### Check when done

- All components import without errors
- `cn()` works as expected
- No Tailwind errors in browser console
- Components render correctly in dark mode
- No duplicate styling issues
- No default light styling appears