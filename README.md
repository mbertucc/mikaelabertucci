# mikaelabertucci.com

Personal portfolio and resume site for Mikaela Bertucci — Founder of Delpheus, Agentic Product Owner, and context engineer.

Built with Claude Code on Anthropic's stack.

## Stack

- **Frontend** — React + Vite + TypeScript + Tailwind CSS
- **Backend** — Supabase (auth, database, edge functions)
- **Deployment** — Vercel
- **AI** — Anthropic API via Supabase edge functions (chat, JD analyzer, site metrics)

## Local development

```sh
npm install
npm run dev
```

## Features

- AI-queryable portfolio via "Ask AI About Me" chat drawer (streaming, Claude-powered)
- Honest fit-check: paste a JD, get a real verdict including when it's "not your person"
- Living Spec card with typewriter effect
- Delpheus Deep Aurora design system
