# Toast Notification Builder

Page to tweak toast notification settings and preview them right away. Built with Vue 3 + Quasar, and it can also push presets to Supabase if you plug it in.

### What it does
- lets you change toast type, colors, text, position, and animation
- shows the toast instantly so you can see the effect
- saves presets locally (and on Supabase if configured) so you can bring them back later

## Getting Started
1. Install packages:
	```bash
	pnpm install
	```
2. Start dev server:
	```bash
	pnpm run dev
	```

## Tests
Simple tests exist. Run them with:
```bash
pnpm vitest run
```

## Notes
- Config from the panel is kept under the `presets` key in localStorage.
- If Supabase env vars are set, the same data is also written to your Supabase table.
- UI are simple Quasar components
