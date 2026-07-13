// curriculum-pm.ts
// Track for a Product Manager who wants hands-on familiarity with modern AI building
// blocks — enough to prototype, scope, and lead AI products — WITHOUT learning to code
// from scratch. Strengths assumed: product thinking, specs, tools, communication.
// Gaps targeted: fluency in the vocabulary (RAG, ReAct, multi-agent, MCP vs APIs, model
// routing) and the confidence to build prototypes and judge quality.
//
// Design: concept-fluency + implementation, never fundamentals. Each core building block
// gets a plain-English "what it is / why it matters for product" framing paired with a
// hands-on build. Claude Code writes the plumbing; light snippet-tweaking is welcome, never
// hand-authoring from a blank file. Every lesson still ships a pushable artifact.
//
// Completion rule is identical to the other tracks: a lesson is done when
// `${repoPath}/DONE.md` exists in the learner's public repo. Same shape as curriculum.ts.

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
    title: "Pass 1 — Get Fluent: Building Blocks & First Builds",
    blurb:
      "You don't need to code from scratch. This pass makes you fluent in the vocabulary and moving parts of modern AI — prompting, models & OpenRouter, RAG, agents & ReAct, multi-agent systems, MCP vs APIs — by pairing a plain-English explainer of each with something you personally ship. Light snippet-tweaking welcome; Claude Code handles the plumbing.",
  },
  2: {
    title: "Pass 2 — Ship Real Prototypes & Lead AI Products",
    blurb:
      "Go from demos to things people can use — and to leading AI work with an engineer's-eye credibility: directing real builds with Claude Code, judging quality with evals, scoping cost and risk, writing the AI spec, and shipping a portfolio-grade demo.",
  },
} as const;

// Your edge to lean on: a PM who can prototype an AI feature, prove it's good with an eval,
// and write the spec is rare. The Pass 2 craft lessons are where that edge compounds.

export const lessons: Lesson[] = [
  // ────────────────────────────── PASS 1 ──────────────────────────────
  {
    id: "setup",
    pass: 1,
    order: 1,
    repoPath: "pass-1/01-setup",
    title: "Setup & Your AI Workbench",
    objective:
      "Stand up your toolkit and the one meta-skill this whole track runs on: let AI do the typing while you steer (and occasionally tweak). Accounts, Claude Code, and a GitHub repo — without becoming a terminal user.",
    topics: [
      "Claude and ChatGPT accounts — what each is good at and when to reach for which",
      "Installing Claude Code (and optionally Codex) as your build copilot",
      "Creating a GitHub repo in the browser (no command line needed)",
      "Letting Claude Code do commits and pushes for you — you review, it types",
      "How to phrase what you want so an AI tool builds the right thing",
      "When it's fine to hand-edit a single line yourself",
    ],
    build:
      "Create your learning GitHub repo, then have Claude Code commit an intro.md into this folder describing the AI product idea you want to build toward this course. Push it — every lesson from here lives in git.",
    resources: [
      { title: "Claude Code — Overview & install", url: "https://code.claude.com/docs/en/overview", type: "docs" },
      { title: "GitHub — Create a repo (Quickstart)", url: "https://docs.github.com/en/get-started/quickstart/create-a-repo", type: "docs" },
      { title: "Anthropic — Claude Code best practices", url: "https://www.anthropic.com/engineering/claude-code-best-practices", type: "article", note: "How to direct an AI builder well" },
    ],
  },
  {
    id: "prompting",
    pass: 1,
    order: 2,
    repoPath: "pass-1/02-prompting",
    title: "Prompting That Actually Works",
    objective:
      "Prompting is the PM's core AI skill. Move from casual chat to reliable, reusable, structured prompts you can point at real work.",
    topics: [
      "Anatomy of a strong prompt: role, context, task, constraints, output format",
      "Few-shot examples: showing the model what 'good' looks like",
      "Iterating and debugging a prompt when the output is wrong",
      "Asking for structured output: tables, JSON, or a fixed template",
      "Prompt chaining: breaking a big task into a sequence of prompts",
      "System vs user prompts, and why the system prompt sets the rules",
    ],
    build:
      "A reusable prompt (saved in this folder) that reliably turns a messy meeting or call transcript into a structured PRD outline or a set of user stories — with 2–3 worked example inputs/outputs showing it holds up.",
    resources: [
      { title: "Anthropic — Prompt engineering overview", url: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview", type: "docs" },
      { title: "OpenAI — Prompt engineering guide", url: "https://platform.openai.com/docs/guides/prompt-engineering", type: "docs" },
      { title: "Prompt Engineering Guide (promptingguide.ai)", url: "https://www.promptingguide.ai/", type: "article" },
      { title: "Anthropic Courses — Prompt engineering (free)", url: "https://github.com/anthropics/courses", type: "course" },
    ],
  },
  {
    id: "llm-behaviour",
    pass: 1,
    order: 3,
    repoPath: "pass-1/03-llm-behaviour",
    title: "How LLMs Actually Behave (just enough)",
    objective:
      "Build accurate intuition for what models can and can't do, so you scope features realistically — without an engineering deep-dive.",
    topics: [
      "Tokens and context windows: why long documents get truncated",
      "Temperature: turning creativity/randomness up and down",
      "Why models hallucinate, and what reduces it (grounding, examples, constraints)",
      "Tool use and structured output — conceptually — as what makes agents possible",
      "Using the Anthropic/OpenAI playground as a lab to feel these levers",
      "A peek at one tiny API call via Claude Code: edit a value and re-run to see the effect",
    ],
    build:
      "A findings.md documenting a small playground experiment — the same prompt at different temperatures, and with vs. without an example — plus the one-line takeaway for each run.",
    resources: [
      { title: "Anthropic — Build with Claude (overview)", url: "https://docs.claude.com/en/docs/build-with-claude/overview", type: "docs" },
      { title: "What are tokens? (OpenAI Help)", url: "https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them", type: "article" },
      { title: "Anthropic — Reduce hallucinations", url: "https://docs.claude.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations", type: "docs" },
    ],
  },
  {
    id: "models-openrouter",
    pass: 1,
    order: 4,
    repoPath: "pass-1/04-models-openrouter",
    title: "The Model Landscape & OpenRouter",
    objective:
      "Know the field of models and how to reach any of them from one place — a real scoping and cost lever for PMs, not just trivia.",
    topics: [
      "The families: Claude, GPT, Gemini, and open models (Llama, Mistral, Qwen)",
      "Closed vs open, and big vs small — the cost / quality / latency tradeoffs",
      "What OpenRouter is: one API and key to access many models, with routing and fallback",
      "Comparing price and speed across models side by side",
      "Picking the right model for a job (and why the best model isn't always the answer)",
    ],
    build:
      "Use OpenRouter (its playground, or a tiny Claude Code snippet you can tweak) to run the SAME prompt through two or three different models. Record a short comparison of quality, speed, and cost in this folder.",
    resources: [
      { title: "OpenRouter — documentation", url: "https://openrouter.ai/docs", type: "docs", note: "One API for many models" },
      { title: "OpenRouter — Models & pricing", url: "https://openrouter.ai/models", type: "interactive", note: "Compare models and per-token cost" },
      { title: "Open vs. closed LLMs — a practical explainer (IBM)", url: "https://www.ibm.com/think/topics/open-source-llms", type: "article" },
    ],
  },
  {
    id: "vibe-coding",
    pass: 1,
    order: 5,
    repoPath: "pass-1/05-vibe-coding",
    title: "Vibe-Coding a Prototype",
    objective:
      "The PM superpower: turn an idea into a clickable, working AI prototype by describing it — no hand-written code.",
    topics: [
      "The vibe-coding tools (Lovable, v0, Bolt, Claude Artifacts) and what each is good for",
      "Describing a UI and a data flow in plain words",
      "Iterating by conversation: refining the prototype turn by turn",
      "Wiring in an LLM call so the prototype actually does something AI-powered",
      "A prototype's limits: great for demos and alignment, not production",
    ],
    build:
      "Ship a small AI-powered web prototype (e.g. a feedback summarizer or an idea-to-copy tool). Put the live link and your prompt history / notes in this folder.",
    resources: [
      { title: "Lovable — documentation", url: "https://docs.lovable.dev/", type: "docs" },
      { title: "v0 by Vercel", url: "https://v0.app/", type: "interactive" },
      { title: "Bolt.new", url: "https://bolt.new/", type: "interactive" },
      { title: "Anthropic — Build with Claude Artifacts", url: "https://support.claude.com/en/articles/9945110-using-artifacts-to-create-and-share-content", type: "article" },
    ],
  },
  {
    id: "rag",
    pass: 1,
    order: 6,
    repoPath: "pass-1/06-rag",
    title: "What is RAG? Chat With Your Docs",
    objective:
      "Understand retrieval-augmented generation by building a 'chat over my documents' assistant — and see where it breaks, which is what you'll scope around later.",
    topics: [
      "RAG in plain terms: give the model your documents so it answers from them, not from memory",
      "Why RAG beats pasting everything into one prompt (context limits, cost, freshness)",
      "Grounding and citations: answers you can trust and trace",
      "Failure modes framed as product risks: wrong chunk retrieved, confident-but-wrong answers",
      "Build it via a no-code/template route or a Claude Code–scaffolded app (tweak a config line to change chunking)",
    ],
    build:
      "A working doc-Q&A assistant over a set of documents you care about (a policy pack, a set of product specs). Add a note on one failure you saw and why it happened.",
    resources: [
      { title: "What is Retrieval-Augmented Generation? (Pinecone Learn)", url: "https://www.pinecone.io/learn/retrieval-augmented-generation/", type: "article" },
      { title: "Chat with your PDFs — a no-code walkthrough (YouTube)", url: "https://www.youtube.com/watch?v=wUAUdEw5oxM", type: "video", note: "Build a doc chatbot without coding" },
      { title: "Anthropic — Contextual Retrieval", url: "https://www.anthropic.com/news/contextual-retrieval", type: "article", note: "Why retrieval quality makes or breaks RAG" },
    ],
  },
  {
    id: "react-agent",
    pass: 1,
    order: 7,
    repoPath: "pass-1/07-react-agent",
    title: "What is an Agent? The ReAct Loop",
    objective:
      "Understand what an 'agent' really is by building one that completes a multi-step task, and name the pattern under it: ReAct.",
    topics: [
      "Agent = reason → act (use a tool) → observe → repeat — this is the ReAct pattern, in plain English",
      "Autonomy vs. a fixed workflow, and when each is the right call",
      "Tools as the agent's hands: what it can actually do in the world",
      "Guardrails from a product lens: step limits, review points, cost control",
      "Build via an agent builder or by directing Claude Code — then read the trace",
    ],
    build:
      "An agent that does a real multi-step task (e.g. research a topic across sources and produce a brief), plus a written trace of its reason/act/observe steps and where you'd insert a human check.",
    resources: [
      { title: "Anthropic — Building effective agents", url: "https://www.anthropic.com/research/building-effective-agents", type: "article", note: "The best plain-English read on agents" },
      { title: "Prompt Engineering Guide — ReAct", url: "https://www.promptingguide.ai/techniques/react", type: "article" },
      { title: "Hugging Face — Agents Course (free)", url: "https://huggingface.co/learn/agents-course", type: "course" },
    ],
  },
  {
    id: "multi-agent",
    pass: 1,
    order: 8,
    repoPath: "pass-1/08-multi-agent",
    title: "Multi-Agent Systems",
    objective:
      "Understand when one agent isn't enough, and what 'multi-agent' actually means — vocabulary you'll need in any AI roadmap conversation.",
    topics: [
      "Why split work across agents: specialization, focus, and reliability",
      "The common shapes: a supervisor/orchestrator directing specialist agents, and hand-off between agents",
      "Orchestration and its failure modes at a concept level: cost, loops, coordination overhead",
      "When a single agent — or even a plain workflow — is the better, cheaper call",
    ],
    build:
      "Either wire a small multi-step / supervisor-style flow (via a low-code builder or n8n), OR write a one-page design: the specialist agents for a real problem, who orchestrates them, and where it could go wrong. Push whichever you build.",
    resources: [
      { title: "Anthropic — Building effective agents (orchestrator-workers)", url: "https://www.anthropic.com/research/building-effective-agents", type: "article" },
      { title: "LangGraph — Multi-agent systems (concepts)", url: "https://langchain-ai.github.io/langgraph/concepts/multi_agent/", type: "docs", note: "Read for the patterns; no coding required" },
      { title: "Anthropic — How we built a multi-agent research system", url: "https://www.anthropic.com/engineering/multi-agent-research-system", type: "article" },
    ],
  },
  {
    id: "mcp",
    pass: 1,
    order: 9,
    repoPath: "pass-1/09-mcp",
    title: "What is MCP?",
    objective:
      "Understand the standard the industry is coalescing on for connecting AI to tools and data — by wiring an existing MCP server into your assistant. No server-building.",
    topics: [
      "What MCP is and why it exists: one standard way to give any AI app tools, data, and prompts — instead of a bespoke integration each time",
      "Tools vs. resources vs. prompts — the three things an MCP server can expose",
      "Connecting a ready-made MCP server to Claude Desktop or Claude Code",
      "The product ideas it unlocks: assistants and agents that can safely act in your stack",
    ],
    build:
      "Connect an existing MCP server (e.g. filesystem, GitHub, or a data source) to Claude Desktop/Code, use it, and write a note in this folder: what it let the assistant do, and one product feature it makes possible.",
    resources: [
      { title: "Model Context Protocol — official site", url: "https://modelcontextprotocol.io", type: "docs" },
      { title: "Anthropic — Introducing the Model Context Protocol", url: "https://www.anthropic.com/news/model-context-protocol", type: "article", note: "Why MCP exists" },
      { title: "MCP — Connect to local servers (quickstart)", url: "https://modelcontextprotocol.io/quickstart/user", type: "docs", note: "Wire a server into Claude Desktop" },
    ],
  },
  {
    id: "apis-vs-mcp",
    pass: 1,
    order: 10,
    repoPath: "pass-1/10-apis-vs-mcp",
    title: "APIs vs MCP: When to Use Which",
    objective:
      "Place MCP next to the thing PMs already know — APIs — and know which is which in a scoping conversation.",
    topics: [
      "The core difference: a REST API is called by code a developer writes; an MCP tool is discovered and called by the model itself at runtime",
      "Contracts and discovery: OpenAPI / human docs (for developers) vs. self-describing MCP schemas the model reads",
      "Where each fits: backend integration vs. assistant/agent tooling",
      "The 'wrap an existing API as an MCP server' pattern, so an agent can use it",
      "A decision guide for product scoping: expose to an agent (MCP) vs. call from your own product (API) — and when to do both",
    ],
    build:
      "A COMPARISON.md in this folder: the same capability framed both ways, a short when-to-use-which table, and one feature idea for each path.",
    resources: [
      { title: "Anthropic — Introducing the Model Context Protocol", url: "https://www.anthropic.com/news/model-context-protocol", type: "article" },
      { title: "MCP — Architecture & core concepts", url: "https://modelcontextprotocol.io/docs/concepts/architecture", type: "docs" },
      { title: "OpenAPI — what a machine-readable API contract looks like", url: "https://www.openapis.org/", type: "docs" },
    ],
  },
  {
    id: "n8n",
    pass: 1,
    order: 11,
    repoPath: "pass-1/11-n8n",
    title: "Automate It with n8n",
    objective:
      "Wire AI into a repeatable workflow with low code — the PM's automation workhorse for real operational wins.",
    topics: [
      "Node-based automation: triggers → steps → outputs",
      "The AI Agent and chat-model nodes; connecting an LLM (Anthropic / OpenAI)",
      "Adding a tool or retrieval step to a workflow",
      "Calling an external service or an MCP server from a workflow",
      "When to graduate a workflow from n8n to real engineering",
    ],
    build:
      "An n8n workflow that takes an input (form / webhook / schedule), runs it through an LLM with a tool or retrieval step, and delivers a useful result (e.g. triage and summarize incoming feedback into a table). Export the workflow JSON into this folder.",
    resources: [
      { title: "n8n — documentation", url: "https://docs.n8n.io/", type: "docs" },
      { title: "n8n — Advanced AI (AI Agent, chat models, tools)", url: "https://docs.n8n.io/advanced-ai/", type: "docs" },
      { title: "n8n — workflow templates gallery", url: "https://n8n.io/workflows/", type: "article", note: "Steal a GenAI workflow and adapt it" },
    ],
  },

  // ────────────────────────────── PASS 2 ──────────────────────────────
  {
    id: "claude-code",
    pass: 2,
    order: 12,
    repoPath: "pass-2/01-claude-code",
    title: "Directing Claude Code to Build Real Things",
    objective:
      "Go beyond one-shot prototypes: direct Claude Code to build and change a small real app end-to-end, reviewing (and lightly editing) its work well enough to steer it.",
    topics: [
      "Scoping a task for an AI builder so it does what you actually mean",
      "Giving persistent context with a CLAUDE.md file",
      "Plan-then-build: getting a plan before any code is written",
      "Reading a diff at a product level — 'did it do what I asked?'",
      "Making a small manual tweak and re-running to see the effect",
      "Asking for tests and fixes; knowing when to hand off to an engineer",
    ],
    build:
      "A small internal tool you scoped and directed Claude Code to build (a tiny dashboard, or a script that automates a chore), committed here with a short 'what I asked / what it built / what I tweaked' note.",
    resources: [
      { title: "Claude Code — Overview (docs)", url: "https://code.claude.com/docs/en/overview", type: "docs" },
      { title: "Anthropic — Claude Code best practices", url: "https://www.anthropic.com/engineering/claude-code-best-practices", type: "article" },
      { title: "Anthropic — Manage Claude's memory (CLAUDE.md)", url: "https://code.claude.com/docs/en/memory", type: "docs" },
    ],
  },
  {
    id: "driving-agents",
    pass: 2,
    order: 13,
    repoPath: "pass-2/02-driving-agents",
    title: "Driving Agents: Hooks, Skills & Agent Runtimes",
    objective:
      "Learn the operational levers that turn a demo agent into a governed, reliable system you can run a real project on — the functionalities that let you DRIVE AI work, not just prototype it.",
    topics: [
      "Hooks: automated behaviors that fire on events (e.g. Claude Code hooks that run a command before/after a tool call) to enforce rules, add guardrails, format output, notify, or block risky actions — behavior you configure, not prompt",
      "Memory & skills: persistent context (CLAUDE.md) and self-improving skill files (like Hermes' SKILL.md) so agents get measurably better at your workflows over time",
      "Permissions & guardrails: scoping what an agent may touch, approval gates, and the security surface you own",
      "Agent runtimes / platforms: self-hosted personal agents — OpenClaw (connects an LLM to your channels, files, shell, and APIs) and Hermes (Nous Research; reliable tool-calling, model-agnostic via OpenRouter, persistent memory) — and when a PM would reach for one",
      "Governance for real adoption: prompt injection, over-broad permissions, and data exposure — the questions to answer before rolling an agent out to a team",
    ],
    build:
      "Configure one behavior-driving control yourself: add a Claude Code hook (a command that runs before/after a tool use), OR stand up a small OpenClaw or Hermes agent with a scoped permission and a memory/skill file. Then write a short note in this folder — what behavior you enforced, and one governance risk you'd flag before a team rollout.",
    resources: [
      { title: "Claude Code — Hooks (docs)", url: "https://code.claude.com/docs/en/hooks", type: "docs", note: "Run commands on agent events to drive behavior" },
      { title: "OpenClaw — your own personal AI agent", url: "https://openclaw.ai/", type: "docs", note: "Open-source local agent across your channels, files, and tools" },
      { title: "Hermes Agent (Nous Research)", url: "https://hermes-agent.org/", type: "docs", note: "Self-hosted agent: reliable tool-calling + persistent SKILL.md memory" },
      { title: "OWASP — LLM01: Prompt Injection", url: "https://genai.owasp.org/llmrisk/llm01-prompt-injection/", type: "article", note: "The top risk once an agent can act in your stack" },
    ],
  },
  {
    id: "evals",
    pass: 2,
    order: 14,
    repoPath: "pass-2/03-evals",
    title: "Is It Any Good? Evals for PMs",
    objective:
      "Your genuine edge. Learn to define and measure AI quality so 'it feels better' becomes 'it improved 18% on our test set.'",
    topics: [
      "Why AI quality is hard: non-deterministic output, no single right answer",
      "Building a small eval set from real examples",
      "Pass/fail checks and rubric scoring",
      "Catching regressions when you change a prompt or a model",
      "LLM-as-judge at a glance: using a model to grade outputs",
      "Making quality a PM-owned artifact, not an engineering afterthought",
    ],
    build:
      "A lightweight eval sheet for one of your earlier builds (the prompt from lesson 2 or the agent from lesson 7): 8–12 test cases, clear criteria, and scored results before and after one change.",
    resources: [
      { title: "Your AI Product Needs Evals (Hamel Husain)", url: "https://hamel.dev/blog/posts/evals/", type: "article", note: "The canonical, practical essay on LLM evals" },
      { title: "Anthropic — Create strong empirical evaluations", url: "https://docs.claude.com/en/docs/test-and-evaluate/develop-tests", type: "docs" },
      { title: "Anthropic — Define your success criteria", url: "https://docs.claude.com/en/docs/test-and-evaluate/define-success", type: "docs" },
    ],
  },
  {
    id: "cost-risk",
    pass: 2,
    order: 15,
    repoPath: "pass-2/04-cost-risk",
    title: "Cost, Latency, Safety & Risk",
    objective:
      "Scope AI features responsibly — the questions leadership and engineers will ask, answered by you.",
    topics: [
      "Token-cost math: how per-use cost scales with volume and context size",
      "Latency vs. quality tradeoffs; big vs. small model choice (ties back to OpenRouter)",
      "Hallucination, PII, and safety risks — and who owns them",
      "Human-in-the-loop and guardrails as product decisions",
      "A lightweight feasibility framework for a new AI feature",
    ],
    build:
      "A one-page feasibility & risk brief for a real feature idea: a rough cost estimate, the top risks, and concrete mitigations. Save it in this folder.",
    resources: [
      { title: "Anthropic — Pricing", url: "https://www.anthropic.com/pricing", type: "docs", note: "Do the per-request cost math" },
      { title: "OpenAI — Pricing", url: "https://openai.com/api/pricing/", type: "docs" },
      { title: "Anthropic — Reduce hallucinations (guardrails)", url: "https://docs.claude.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations", type: "docs" },
    ],
  },
  {
    id: "ai-prd",
    pass: 2,
    order: 16,
    repoPath: "pass-2/05-ai-prd",
    title: "Writing the AI PRD / Spec",
    objective:
      "Produce an implementation-informed spec an engineering team could actually build from — using everything you now understand.",
    topics: [
      "What's different about an AI PRD: model choice, data & retrieval, prompts as spec",
      "Evals as acceptance criteria, guardrails, rollout and fallback plans, cost",
      "Considering the non-AI alternative honestly",
      "Success metrics that include quality, not just usage",
    ],
    build:
      "A complete AI-feature PRD in this folder for the idea you've been developing, with an evals section (reuse your eval sheet) and a cost/risk section (reuse your feasibility brief).",
    resources: [
      { title: "Anthropic — Define your success criteria", url: "https://docs.claude.com/en/docs/test-and-evaluate/define-success", type: "docs" },
      { title: "Lenny's Newsletter — How the best PMs are using AI", url: "https://www.lennysnewsletter.com/p/how-the-best-product-managers-are-using-ai", type: "article" },
      { title: "The AI PM's guide to writing an AI PRD (a template)", url: "https://www.productcompass.pm/p/ai-prd-template", type: "article" },
    ],
  },
  {
    id: "ship",
    pass: 2,
    order: 17,
    repoPath: "pass-2/06-ship",
    title: "Ship & Share Your Prototype",
    objective:
      "Get a real, clickable URL other people can use — the difference between a demo and a decision.",
    topics: [
      "Publishing a vibe-coded app (Lovable / Vercel), or having Claude Code build & deploy a small Streamlit app",
      "Editing the title and copy yourself so it feels finished",
      "Keys and secrets at a 'don't leak them' level",
      "Writing a short walkthrough so others can try it without you",
    ],
    build:
      "A deployed prototype with a shareable link, plus a short README (or a Loom) in this folder explaining what it does and how to try it.",
    resources: [
      { title: "Lovable — Deploy & publish", url: "https://docs.lovable.dev/features/deploy", type: "docs" },
      { title: "Streamlit — Community Cloud deploy", url: "https://docs.streamlit.io/deploy/streamlit-community-cloud", type: "docs", note: "Claude Code can scaffold the app for you" },
      { title: "Vercel — deploying a project", url: "https://vercel.com/docs/deployments", type: "docs" },
    ],
  },
  {
    id: "capstone",
    pass: 2,
    order: 18,
    repoPath: "pass-2/07-capstone",
    title: "Capstone — Lead a Mini AI Product",
    objective:
      "Put it together the way you'll actually work: prototype → measure → spec → ship. A portfolio piece that shows you can lead an AI product end to end.",
    topics: [
      "Choosing a real, scoped problem worth solving",
      "Picking the right tool: vibe-code vs. agent vs. automation",
      "Proving quality with an eval before you commit",
      "Writing the spec that ties it together",
      "Shipping a demo and telling the story",
    ],
    build:
      "A capstone folder linking your prototype + PRD + eval + a short demo. This is the piece you show people to prove you can lead AI work.",
    resources: [
      { title: "Anthropic — Building effective agents", url: "https://www.anthropic.com/research/building-effective-agents", type: "article", note: "Revisit now that it all connects" },
      { title: "Lenny's Newsletter — How the best PMs are using AI", url: "https://www.lennysnewsletter.com/p/how-the-best-product-managers-are-using-ai", type: "article" },
      { title: "Anthropic Courses (free, on GitHub)", url: "https://github.com/anthropics/courses", type: "course" },
    ],
  },
];

export const lessonsByPass = (p: 1 | 2) =>
  lessons.filter((l) => l.pass === p).sort((a, b) => a.order - b.order);

export const orderedLessons = () =>
  [...lessons].sort((a, b) => a.order - b.order);
