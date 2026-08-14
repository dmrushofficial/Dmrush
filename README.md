# DMrush

Main agency website for [dmrush.com](https://dmrush.com).

DMrush is an SEO, web development, and digital growth agency. This repository powers the public agency site.

Related properties that are **not** part of this project:

- `learn.dmrush.com` — DMrush Learn / institute
- `admin.dmrush.com` — admin panel

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Server Components by default

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run lint
npm run typecheck
npm run build
```

## Adding content later

- Services: `src/content/services.ts` plus a thin route file under `src/app`
- Case studies: `src/content/case-studies.ts`
- Team: `src/content/team.ts`
- Navigation: `src/content/navigation.ts`
- Site-wide facts and CTAs: `src/lib/site.ts`
