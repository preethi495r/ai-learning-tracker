// curriculum-wife.ts
// Track for an experienced frontend engineer (React / Next.js / TypeScript / accessibility)
// moving into full-stack + AI-native development. Same shape as curriculum.ts so it can
// power its own single-track site OR be composed into a multi-track site.
//
// Completion rule is identical: a lesson is done when `${repoPath}/DONE.md` exists in her repo.

export type ResourceType = "video" | "docs" | "article" | "course" | "interactive";

export interface Resource {
  title: string;
  url: string;
  type: ResourceType;
  note?: string;
}

export interface Lesson {
  id: string;
  pass: 1 | 2;
  order: number;
  repoPath: string;
  title: string;
  objective: string;
  topics: string[];
  build: string;
  resources: Resource[];
}

export const COMPLETION_MARKER = "DONE.md";

export const PASSES = {
  1: {
    title: "Pass 1 — Full-Stack & AI Foundations",
    blurb:
      "You already own the frontend. This pass adds the missing backend half (servers, data, auth) and a first, simple pass over the AI-native layer (LLM APIs, streaming UIs, RAG, agents). Breadth over depth — build small versions of each.",
  },
  2: {
    title: "Pass 2 — Depth & Real Products (with Claude Code)",
    blurb:
      "Rebuild those foundations into shippable, portfolio-grade AI products, driving Claude Code as the primary tool. Depth, production concerns, and — your edge — genuinely well-crafted, accessible AI UX.",
  },
} as const;

// Her differentiator to keep in mind throughout: most AI apps have poor UX and worse
// accessibility. A frontend engineer who ships accessible, fast, well-designed AI
// interfaces end-to-end is rare and valuable. Lean into it (esp. lessons 5 and 13).

export const lessons: Lesson[] = [
  // ────────────────────────────── PASS 1 ──────────────────────────────
  {
    id: "backend-foundations",
    pass: 1,
    order: 1,
    repoPath: "pass-1/01-backend-foundations",
    title: "Backend for Frontend Devs",
    objective:
      "Own the server half. You know the browser; now learn what happens on the other side of the request — and how to write it in the stack you already use.",
    topics: [
      "Node.js runtime basics; how a server actually handles a request",
      "HTTP & REST design: methods, status codes, resources, idempotency",
      "Next.js Route Handlers (API routes) and Server Actions",
      "Server vs client components; where code runs and why it matters",
      "Environment variables & secrets; never ship keys to the client",
    ],
    build:
      "A small Next.js API (Route Handlers) with a few REST endpoints backed by in-memory data — GET/POST/PATCH/DELETE — called from a simple client page.",
    resources: [
      { title: "Next.js — Route Handlers (docs)", url: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers", type: "docs" },
      { title: "Next.js — Server Actions & Mutations (docs)", url: "https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations", type: "docs" },
      { title: "MDN — An overview of HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview", type: "docs" },
      { title: "Next.js Learn — official full-stack course (free)", url: "https://nextjs.org/learn", type: "course", note: "Great for filling full-stack gaps end to end" },
    ],
  },
  {
    id: "data-layer",
    pass: 1,
    order: 2,
    repoPath: "pass-1/02-data-layer",
    title: "The Data Layer: SQL, Postgres & an ORM",
    objective:
      "Persist real data. Learn enough SQL to be dangerous, then use a type-safe ORM so the database feels like TypeScript.",
    topics: [
      "SQL fundamentals: SELECT/WHERE/JOIN/GROUP BY, indexes",
      "PostgreSQL: tables, relationships, constraints",
      "Drizzle ORM: schema in TypeScript, queries, migrations",
      "Connecting a hosted Postgres (Neon/Supabase) to a Next.js app",
      "Schema design basics; modelling a real feature",
    ],
    build:
      "Add a Postgres database (Drizzle) to the previous app: define a schema, run migrations, and replace the in-memory data with real persisted CRUD.",
    resources: [
      { title: "SQLBolt — interactive SQL lessons (free)", url: "https://sqlbolt.com/", type: "interactive" },
      { title: "Drizzle ORM — documentation", url: "https://orm.drizzle.team/docs/overview", type: "docs" },
      { title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/", type: "docs" },
      { title: "Neon — Postgres for Next.js (docs)", url: "https://neon.tech/docs/guides/nextjs", type: "docs" },
    ],
  },
  {
    id: "auth-security",
    pass: 1,
    order: 3,
    repoPath: "pass-1/03-auth-security",
    title: "Auth & Security Basics",
    objective:
      "Let real users sign in, and protect what's behind the login. Auth is where most full-stack beginners get stuck — get comfortable here.",
    topics: [
      "Sessions vs JWTs; cookies and how auth state is kept",
      "Auth.js (NextAuth): providers, sessions, protecting routes",
      "Authorization: gating pages, API routes, and server actions",
      "Security baseline: input validation, OWASP Top 10 awareness, secret handling",
    ],
    build:
      "Add authentication (Auth.js) to your app: sign-in, a protected page and protected API route, and per-user data.",
    resources: [
      { title: "Auth.js — documentation", url: "https://authjs.dev/", type: "docs" },
      { title: "Next.js — Authentication (docs)", url: "https://nextjs.org/docs/app/building-your-application/authentication", type: "docs" },
      { title: "OWASP Top Ten", url: "https://owasp.org/www-project-top-ten/", type: "article" },
    ],
  },
  {
    id: "llm-apis-ai-sdk",
    pass: 1,
    order: 4,
    repoPath: "pass-1/04-llm-apis-ai-sdk",
    title: "LLM APIs & the AI SDK",
    objective:
      "Call LLMs from TypeScript the idiomatic way. The Vercel AI SDK will be your main tool — learn its core before its UI hooks.",
    topics: [
      "Calling LLMs server-side (why a key must never hit the client)",
      "AI SDK Core: generateText, streamText, generateObject/streamObject",
      "Provider abstraction (Anthropic / OpenAI / others) — swap models in a line",
      "Tool calling and structured output with Zod schemas",
      "Tokens, context windows, temperature; prompt basics",
    ],
    build:
      "A Route Handler that calls an LLM and returns a structured (Zod-validated) JSON result — e.g. extract fields from pasted text — rendered on a page.",
    resources: [
      { title: "AI SDK — Introduction & Core (docs)", url: "https://ai-sdk.dev/docs/introduction", type: "docs" },
      { title: "Vercel Academy — AI SDK course (free, official)", url: "https://vercel.com/academy/ai-sdk", type: "course" },
      { title: "Anthropic — Tool use (function calling)", url: "https://docs.claude.com/en/docs/build-with-claude/tool-use/overview", type: "docs" },
    ],
  },
  {
    id: "ai-native-ui",
    pass: 1,
    order: 5,
    repoPath: "pass-1/05-ai-native-ui",
    title: "AI-Native UIs (your edge)",
    objective:
      "This is where your frontend and accessibility skills become a superpower. Build streaming AI interfaces that are fast, resilient, and usable by everyone.",
    topics: [
      "useChat / useCompletion: streaming chat UX with little boilerplate",
      "Loading, error, abort/stop, and retry states for LLM calls",
      "Generative UI: streaming components, not just text",
      "Accessible AI interfaces: aria-live regions for streaming, focus management, reduced-motion, screen-reader-friendly updates",
      "When NOT to stream (structured/one-shot results)",
    ],
    build:
      "A polished streaming chat UI with proper loading/error/stop states and an accessible live region for incoming tokens.",
    resources: [
      { title: "AI SDK UI — Chatbot (useChat) docs", url: "https://ai-sdk.dev/docs/ai-sdk-ui/chatbot", type: "docs" },
      { title: "Stream responses in Next.js with the AI SDK (LogRocket)", url: "https://blog.logrocket.com/nextjs-vercel-ai-sdk-streaming/", type: "article" },
      { title: "MDN — ARIA live regions", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions", type: "docs", note: "Key to accessible streaming output" },
    ],
  },
  {
    id: "simple-rag-ts",
    pass: 1,
    order: 6,
    repoPath: "pass-1/06-simple-rag-ts",
    title: "Simple RAG (TypeScript)",
    objective:
      "Ground answers in your own data. Build the simplest retrieval pipeline end-to-end in the JS/TS stack.",
    topics: [
      "Embeddings and semantic search (why it beats keyword search)",
      "Storing vectors: pgvector in your existing Postgres (or a hosted store)",
      "Chunking, embedding, retrieving top-k, and grounding the prompt",
      "The retrieval-as-a-tool pattern (searchDocs) with the AI SDK",
    ],
    build:
      "A minimal 'chat with these docs' feature: embed a handful of documents into pgvector and answer questions grounded in them.",
    resources: [
      { title: "AI SDK — RAG chatbot guide", url: "https://ai-sdk.dev/docs/guides/rag-chatbot", type: "docs" },
      { title: "pgvector — open-source vector search for Postgres", url: "https://github.com/pgvector/pgvector", type: "docs" },
      { title: "What is Retrieval-Augmented Generation? (Pinecone Learn)", url: "https://www.pinecone.io/learn/retrieval-augmented-generation/", type: "article" },
    ],
  },
  {
    id: "simple-agent-ts",
    pass: 1,
    order: 7,
    repoPath: "pass-1/07-simple-agent-ts",
    title: "Simple Agent (TypeScript)",
    objective:
      "Understand the agent loop by building a small multi-step, tool-using flow — see the mechanics before reaching for heavier frameworks.",
    topics: [
      "The agent loop: plan → act → observe → repeat",
      "Multi-step tool use with the AI SDK (stopWhen / step control)",
      "Wiring a real tool (e.g. query your DB, call an API)",
      "Guardrails: step limits, validation, cost awareness",
    ],
    build:
      "A tiny agent that answers a question by choosing and calling 1–2 tools (e.g. a DB lookup + a calculation), with a hard step limit.",
    resources: [
      { title: "AI SDK — Agents & tool calling (docs)", url: "https://ai-sdk.dev/docs/foundations/agents", type: "docs" },
      { title: "Anthropic — Building effective agents", url: "https://www.anthropic.com/research/building-effective-agents", type: "article", note: "Best conceptual read on agents" },
      { title: "LangGraph.js — docs (for later, heavier orchestration)", url: "https://langchain-ai.github.io/langgraphjs/", type: "docs" },
    ],
  },

  // ────────────────────────────── PASS 2 ──────────────────────────────
  {
    id: "claude-code-fullstack",
    pass: 2,
    order: 8,
    repoPath: "pass-2/01-claude-code-fullstack",
    title: "Claude Code for Full-Stack & Agentic Work",
    objective:
      "You already use Claude Code. Level it up for backend and agentic work you're newer to — and, crucially, learn to review generated backend/DB/auth code as critically as you review UI.",
    topics: [
      "CLAUDE.md for a full-stack repo; plan mode; scoping larger tasks",
      "Custom slash commands; subagents for multi-part work",
      "Driving DB/schema/auth changes and reading them critically",
      "Using MCP servers to extend Claude Code",
    ],
    build:
      "Write a CLAUDE.md for a full-stack repo and use Claude Code to add a non-trivial backend feature (new table + API + protected UI). Note what you had to correct.",
    resources: [
      { title: "Anthropic — Claude Code best practices", url: "https://www.anthropic.com/engineering/claude-code-best-practices", type: "article" },
      { title: "Using CLAUDE.md files (Anthropic blog)", url: "https://claude.com/blog/using-claude-md-files", type: "article" },
      { title: "ClaudeLog — community tips & mechanics", url: "https://claudelog.com/", type: "article" },
    ],
  },
  {
    id: "production-fullstack-ai-app",
    pass: 2,
    order: 9,
    repoPath: "pass-2/02-production-fullstack-ai-app",
    title: "Production Full-Stack AI App",
    objective:
      "Ship a real, complete product that uses everything from Pass 1: Next.js + Postgres + auth + an LLM feature, with persistence.",
    topics: [
      "App architecture: routes, data layer, auth, AI feature",
      "Persisting conversations/history per user",
      "Rate limiting and abuse protection on AI routes",
      "Clean, accessible, responsive UI throughout",
    ],
    build:
      "A deployed 'chat with your data' app: users sign in, add content, and chat with an LLM grounded in their own data. Clean repo + README + live link.",
    resources: [
      { title: "Vercel — official AI Chatbot starter (GitHub)", url: "https://github.com/vercel/ai-chatbot", type: "docs", note: "Read it as a reference architecture" },
      { title: "Next.js Learn — full-stack course (free)", url: "https://nextjs.org/learn", type: "course" },
      { title: "Build a Next.js AI chatbot from scratch (tutorial)", url: "https://www.digitalapplied.com/blog/build-nextjs-16-ai-chatbot-tutorial-ai-sdk-from-scratch", type: "article" },
    ],
  },
  {
    id: "production-rag-ts",
    pass: 2,
    order: 10,
    repoPath: "pass-2/03-production-rag-ts",
    title: "Production RAG (TypeScript)",
    objective:
      "Make retrieval actually good on real, messy content — the difference between a demo and a product.",
    topics: [
      "Serious chunking strategies; metadata filtering",
      "Reranking and hybrid (vector + keyword) search",
      "pgvector at depth: indexes, performance",
      "Basic retrieval evals: is it fetching the right chunks?",
    ],
    build:
      "Upgrade your RAG feature to production quality on a substantial document set, with reranking and a small retrieval eval.",
    resources: [
      { title: "AI SDK — RAG chatbot guide", url: "https://ai-sdk.dev/docs/guides/rag-chatbot", type: "docs" },
      { title: "Anthropic — Contextual Retrieval", url: "https://www.anthropic.com/news/contextual-retrieval", type: "article" },
      { title: "pgvector — indexing & performance", url: "https://github.com/pgvector/pgvector", type: "docs" },
    ],
  },
  {
    id: "agentic-feature",
    pass: 2,
    order: 11,
    repoPath: "pass-2/04-agentic-feature",
    title: "An Agentic Feature in a Real Product",
    objective:
      "Add a multi-step, tool-using agent to a real UI — with the guardrails and human-in-the-loop touches that make agents safe to ship.",
    topics: [
      "Multi-step orchestration; when to reach for LangGraph.js",
      "Tools that act on your app's data; validation of tool inputs",
      "Human-in-the-loop confirmation for consequential actions",
      "Guardrails: step/cost limits, error recovery, observability hooks",
    ],
    build:
      "An agentic feature inside your app (e.g. an assistant that can look things up and take a reversible action), with a confirmation step and hard limits.",
    resources: [
      { title: "AI SDK — Agents & tool calling (docs)", url: "https://ai-sdk.dev/docs/foundations/agents", type: "docs" },
      { title: "Anthropic — Building effective agents", url: "https://www.anthropic.com/research/building-effective-agents", type: "article" },
      { title: "LangGraph.js — documentation", url: "https://langchain-ai.github.io/langgraphjs/", type: "docs" },
    ],
  },
  {
    id: "mcp-for-product-devs",
    pass: 2,
    order: 12,
    repoPath: "pass-2/05-mcp-for-product-devs",
    title: "MCP for Product Developers",
    objective:
      "Understand the protocol that connects assistants to tools and data — by building a server that exposes your own app, in TypeScript.",
    topics: [
      "What MCP is: tools, resources, and prompts, standardized",
      "Build an MCP server (TypeScript SDK) exposing app data/actions",
      "Consuming MCP from Claude Code / other hosts",
      "Clear tool descriptions and input validation so models use tools well",
    ],
    build:
      "An MCP server exposing 1–2 useful tools from your app (e.g. 'search my content', 'create an item'), wired into Claude Code.",
    resources: [
      { title: "Model Context Protocol — official site & docs", url: "https://modelcontextprotocol.io", type: "docs" },
      { title: "MCP TypeScript SDK (official GitHub)", url: "https://github.com/modelcontextprotocol/typescript-sdk", type: "docs" },
      { title: "Example MCP servers (reference implementations)", url: "https://github.com/modelcontextprotocol/servers", type: "docs" },
    ],
  },
  {
    id: "evals-observability-ai-ux",
    pass: 2,
    order: 13,
    repoPath: "pass-2/06-evals-observability-ai-ux",
    title: "Evals, Observability & AI UX Quality",
    objective:
      "Prove your AI features are good — and make them feel good. Combines LLM evaluation with the AI-specific UX and accessibility polish that's genuinely your edge.",
    topics: [
      "Evals: building eval sets, measuring quality, catching regressions",
      "Observability/tracing for LLM calls (AI SDK telemetry, LangSmith)",
      "AI UX: perceived latency, streaming, graceful failure, empty/error states",
      "Accessibility of AI features: live regions, focus, motion, clear affordances",
    ],
    build:
      "Add a small eval suite and tracing to your app's main AI feature, plus an accessibility pass on the AI UI (documented in DONE.md).",
    resources: [
      { title: "Your AI Product Needs Evals (Hamel Husain)", url: "https://hamel.dev/blog/posts/evals/", type: "article", note: "The canonical practical essay on evals" },
      { title: "AI SDK — Telemetry / observability (docs)", url: "https://ai-sdk.dev/docs/ai-sdk-core/telemetry", type: "docs" },
      { title: "web.dev — accessibility fundamentals", url: "https://web.dev/learn/accessibility", type: "course" },
    ],
  },
  {
    id: "deploy-perf-cost",
    pass: 2,
    order: 14,
    repoPath: "pass-2/07-deploy-perf-cost",
    title: "Deploy, Performance & Cost",
    objective:
      "Ship it well: deployed, fast, and cost-aware. Bring your frontend performance instincts to the full-stack + AI world.",
    topics: [
      "Deploying to Vercel; serverless vs edge functions; streaming at the edge",
      "Caching strategies; rate limiting; handling function timeouts",
      "LLM cost & latency: model choice, token budgeting, streaming",
      "Core Web Vitals and perf for AI-heavy pages",
    ],
    build:
      "Deploy your app to production with rate limiting and caching in place; write a short note on its cost/latency profile and Web Vitals.",
    resources: [
      { title: "Vercel — documentation", url: "https://vercel.com/docs", type: "docs" },
      { title: "Next.js — Deploying (docs)", url: "https://nextjs.org/docs/app/building-your-application/deploying", type: "docs" },
      { title: "web.dev — Core Web Vitals", url: "https://web.dev/articles/vitals", type: "article" },
    ],
  },
];

export const lessonsByPass = (p: 1 | 2) =>
  lessons.filter((l) => l.pass === p).sort((a, b) => a.order - b.order);

export const orderedLessons = () =>
  [...lessons].sort((a, b) => a.order - b.order);
