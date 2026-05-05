We need the base chrome components that frame every editor screen - the top navbar and the left sidebar shell. These will be reused and extended in every chapter that follows

### Editor Navbar

Create `components/editor/editor-navbar.tsx`.

Requirements: 

- fixed-height top navbar
- left, center, and right sections
- left section contains sidebar toggle button
- use `PanelLeftOpen`/ `PanelLeftClose` icons based on sidebar state
- center contains project title and save status
- right empty for now
- dark background with subtle bottom border

###Project Sidebar

Create `components/editor/project-sidebar.tsx`.

Requirements:

- sidebar should float above the editor canvas
- opening it should not push page content
- slide in from the left
- accepts `isOpen` prop
- header with `Projects`title + close button
- shadcn `Tabs`: 
 - My Projects
 - shared
- both tabs show empty placeholder state
- full-width New Project button at the bottom Plus icon

Dialog Pattern

Use existing color token from globals.css for dialog styling

support:
- title
- description
- footer actions

Do not build dialogs yet

Check when done:
- No Tailwind errors
- Sidebar opens/closes correctly
- Navbar looks correct
- Tabs show empty state
- New Project button renders
- Dialog pattern is ready for future use
