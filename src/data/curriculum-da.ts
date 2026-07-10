// curriculum-da.ts
// Track for a Data Analyst with Python + basic ML (classification, sklearn) who is
// moving into AI Engineering. Strengths assumed: Python, data wrangling, classical ML,
// measurement instincts. Gaps targeted: serious prompting, LLM APIs, agents/workflows,
// and shipping AI systems. Same shape as curriculum.ts.
//
// Completion rule is identical: a lesson is done when `${repoPath}/DONE.md` exists.

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
    title: "Pass 1 — From Analyst to AI Builder",
    blurb:
      "You already have Python and strong data instincts. This pass adds the AI-native layer you're missing: serious prompting, LLM APIs, structured output, RAG, agents, and low-code GenAI workflows — connecting each to the ML you already understand. Breadth over depth.",
  },
  2: {
    title: "Pass 2 — Depth & Real AI Projects",
    blurb:
      "Turn those foundations into portfolio-grade projects that lean on your analyst edge: data-grounded RAG, a data-analysis agent, rigorous evals, and shipping — driving Claude Code as your primary tool throughout.",
  },
} as const;

// Her edge to lean on: a data analyst who can measure whether an AI system is actually
// correct (evals, error analysis) is rare and valuable. Play to it, especially lessons 5 and 15.

export const lessons: Lesson[] = [
  // ────────────────────────────── PASS 1 ──────────────────────────────
  {
    id: "setup",
    pass: 1,
    order: 1,
    repoPath: "pass-1/01-setup",
    title: "Setup & AI Tooling",
    objective:
      "You know Python; get the AI-engineering toolchain in place and adopt good habits. A clean environment, git flow, API keys handled safely, and Claude Code / Codex as a daily learning aid.",
    topics: [
      "Modern Python env with uv (fast venvs + dependency management)",
      "git & GitHub refresher: branches, commits, pull requests",
      "API keys & secrets: .env files, environment variables, never commit keys",
      "Install Claude Code + Codex CLI; use them to explain code and unblock errors",
      "Reading tracebacks fast (bottom-up)",
    ],
    build:
      "Set up your learning repo, create a uv project, add a .env pattern for keys, and commit a hello-world script that reads an env var. Push it.",
    resources: [
      { title: "uv — the fast Python package/venv manager (docs)", url: "https://docs.astral.sh/uv/", type: "docs" },
      { title: "GitHub — Get started (official docs)", url: "https://docs.github.com/en/get-started", type: "docs" },
      { title: "Claude Code — Overview & install", url: "https://code.claude.com/docs/en/overview", type: "docs" },
      { title: "12-Factor App — Config (why env vars)", url: "https://12factor.net/config", type: "article" },
    ],
  },
  {
    id: "python-for-ai",
    pass: 1,
    order: 2,
    repoPath: "pass-1/02-python-for-ai",
    title: "Python for AI: Types, Pydantic & Async",
    objective:
      "Sharpen the Python that AI libraries actually demand. You can already wrangle data; now get fluent in type hints, Pydantic (the schema layer for LLM I/O), and just enough async to call APIs efficiently.",
    topics: [
      "Type hints (typing): the language every modern AI library speaks",
      "Pydantic: BaseModel, validation, JSON (de)serialization — the backbone of structured LLM output, tool args, FastMCP tools, and LangGraph state",
      "HTTP in Python: requests / httpx, JSON, headers, retries",
      "Async basics: async/await, why LLM/API calls benefit from it",
      "Project structure, modules, and virtualenv hygiene",
    ],
    build:
      "A small CLI that calls a public API, validates each response through a Pydantic model, and writes clean records out. Add type hints throughout.",
    resources: [
      { title: "Pydantic — official documentation", url: "https://docs.pydantic.dev/latest/", type: "docs", note: "Start with 'Models' — you'll use this constantly" },
      { title: "Python — typing (official docs)", url: "https://docs.python.org/3/library/typing.html", type: "docs" },
      { title: "httpx — async-capable HTTP client (docs)", url: "https://www.python-httpx.org/", type: "docs" },
      { title: "Real Python — Async IO in Python", url: "https://realpython.com/async-io-python/", type: "article" },
    ],
  },
  {
    id: "prompting",
    pass: 1,
    order: 3,
    repoPath: "pass-1/03-prompting",
    title: "Prompt Engineering (your biggest gap)",
    objective:
      "This is the skill you're most missing — treat it seriously, like feature engineering for LLMs. Learn to write clear, structured, testable prompts that get reliable behaviour, and to evaluate them like an analyst.",
    topics: [
      "Anatomy of a good prompt: role/system, clear instructions, context, and explicit output format",
      "Few-shot examples and when they help; formatting them well",
      "Chain-of-thought and step-by-step reasoning; when to ask for it vs suppress it",
      "Controlling output: constraints, delimiters, and asking for JSON",
      "Prompt patterns: extraction, classification, summarization, rewriting",
      "Evaluating prompts: build a tiny test set and compare versions (your analyst instinct applied)",
    ],
    build:
      "Take a real text task (e.g. classify or extract fields from a batch of messages). Write 2–3 prompt versions, run them over a small labelled set, and record which wins and why in this folder.",
    resources: [
      { title: "Anthropic — Prompt engineering overview", url: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview", type: "docs" },
      { title: "Anthropic — Prompt engineering interactive tutorial (GitHub)", url: "https://github.com/anthropics/prompt-eng-interactive-tutorial", type: "course", note: "Hands-on, free" },
      { title: "OpenAI — Prompt engineering guide", url: "https://platform.openai.com/docs/guides/prompt-engineering", type: "docs" },
      { title: "Prompt Engineering Guide (promptingguide.ai)", url: "https://www.promptingguide.ai/", type: "article" },
    ],
  },
  {
    id: "llm-apis",
    pass: 1,
    order: 4,
    repoPath: "pass-1/04-llm-apis",
    title: "LLM API Fundamentals",
    objective:
      "Use LLMs programmatically. Tool use / function calling and reliable structured output (with Pydantic) are the concepts that unlock everything after this.",
    topics: [
      "Anthropic & OpenAI SDKs: sending messages, system prompts",
      "Tool use / function calling — spend real time here (it powers agents later)",
      "Structured outputs with Pydantic schemas: reliable, validated JSON",
      "Streaming responses",
      "Tokens, context windows, temperature/top_p and their effects",
    ],
    build:
      "A CLI assistant for a task you care about (e.g. turn plain English into a SQL/pandas query, or extract structured fields), returning a Pydantic-validated object.",
    resources: [
      { title: "Anthropic — Build with Claude (docs home)", url: "https://docs.claude.com/en/docs/build-with-claude/overview", type: "docs" },
      { title: "Anthropic — Tool use (function calling)", url: "https://docs.claude.com/en/docs/build-with-claude/tool-use/overview", type: "docs" },
      { title: "OpenAI — Function calling guide", url: "https://platform.openai.com/docs/guides/function-calling", type: "docs" },
      { title: "Anthropic Courses (free, on GitHub)", url: "https://github.com/anthropics/courses", type: "course" },
    ],
  },
  {
    id: "ml-vs-llms",
    pass: 1,
    order: 5,
    repoPath: "pass-1/05-ml-vs-llms",
    title: "From Classical ML to LLMs",
    objective:
      "Connect what you know to what's new. You can build a classifier; now learn when an LLM beats a trained model, when it doesn't, and how embeddings and LLMs change the ML playbook you already have.",
    topics: [
      "Trained model vs LLM: labelled data, latency, cost, and accuracy trade-offs",
      "LLMs as zero-shot / few-shot classifiers and extractors — vs a fitted sklearn model",
      "Embeddings: semantic similarity as a feature; embedding-based classification & clustering",
      "Hybrid systems: LLM for the fuzzy parts, classical ML / rules for the rest",
      "Evaluating an LLM classifier the way you'd evaluate any model (precision/recall, error analysis)",
    ],
    build:
      "Take a classification task you'd normally solve with sklearn and also solve it with an LLM (zero-shot) and with embeddings + a simple classifier. Compare accuracy, cost, and effort in this folder.",
    resources: [
      { title: "OpenAI — Embeddings guide", url: "https://platform.openai.com/docs/guides/embeddings", type: "docs" },
      { title: "Text classification with embeddings (OpenAI Cookbook)", url: "https://cookbook.openai.com/examples/classification_using_embeddings", type: "article" },
      { title: "Anthropic — Classification guide", url: "https://docs.claude.com/en/docs/about-claude/use-case-guides/ticket-routing", type: "docs", note: "LLM classification, done well" },
      { title: "scikit-learn — user guide (reference)", url: "https://scikit-learn.org/stable/user_guide.html", type: "docs" },
    ],
  },
  {
    id: "simple-rag",
    pass: 1,
    order: 6,
    repoPath: "pass-1/06-simple-rag",
    title: "Simple RAG (Familiarity)",
    objective:
      "Ground answers in your own data. Build the simplest possible retrieval pipeline end-to-end — the goal is understanding, not polish.",
    topics: [
      "Embeddings and cosine similarity; why semantic search beats keyword search",
      "One simple vector store: Chroma or FAISS",
      "Basic chunking (make it work; don't optimize yet)",
      "The core loop: embed docs → store → retrieve top-k → stuff into prompt → answer",
    ],
    build:
      "A minimal RAG over ~10 documents you care about (or a data dictionary / schema doc). No heavy framework required.",
    resources: [
      { title: "What is Retrieval-Augmented Generation? (Pinecone Learn)", url: "https://www.pinecone.io/learn/retrieval-augmented-generation/", type: "article" },
      { title: "Chroma — Getting Started", url: "https://docs.trychroma.com/getting-started", type: "docs" },
      { title: "RAG from Scratch (LangChain, GitHub + videos)", url: "https://github.com/langchain-ai/rag-from-scratch", type: "course" },
      { title: "OpenAI — Embeddings guide", url: "https://platform.openai.com/docs/guides/embeddings", type: "docs" },
    ],
  },
  {
    id: "simple-agent",
    pass: 1,
    order: 7,
    repoPath: "pass-1/07-simple-agent",
    title: "Simple Agent & the ReAct Loop (Familiarity)",
    objective:
      "Understand the agent loop by writing a ReAct loop from scratch — no framework. See reason → act → observe with your own eyes.",
    topics: [
      "The agent loop = the ReAct pattern: reason → act (call a tool) → observe (feed the result back) → repeat",
      "Writing that loop by hand: parse the model's tool call, execute it, append the observation, loop",
      "Wiring tool-calling (from the LLM module) into the loop",
      "Guardrails: a loop/step limit and error handling so it can't run away",
      "Reading the trace step by step",
    ],
    build:
      "A tiny from-scratch ReAct agent with 2–3 tools (e.g. a calculator and a 'query my data' tool) that prints each reason/act/observe step. No framework yet.",
    resources: [
      { title: "Anthropic — Building effective agents", url: "https://www.anthropic.com/research/building-effective-agents", type: "article", note: "The single best conceptual read on agents" },
      { title: "ReAct: Synergizing Reasoning and Acting in LLMs (paper)", url: "https://arxiv.org/abs/2210.03629", type: "article" },
      { title: "Hugging Face — Agents Course (free)", url: "https://huggingface.co/learn/agents-course", type: "course" },
    ],
  },
  {
    id: "simple-mcp",
    pass: 1,
    order: 8,
    repoPath: "pass-1/08-simple-mcp",
    title: "Simple MCP Server with FastMCP (Familiarity)",
    objective:
      "Understand MCP by exposing a tool through it with FastMCP and wiring it into Claude Code. Fast once agents click.",
    topics: [
      "What MCP is: a standard way to expose tools, resources, and prompts to LLM apps",
      "FastMCP: the fast, Pythonic way to build MCP servers — decorate a function with @mcp.tool",
      "Typed tools with Pydantic type hints, so the model gets a clean schema",
      "Running the server over stdio and connecting it to Claude Code",
    ],
    build:
      "A minimal FastMCP server exposing one useful tool (e.g. 'run this saved query'), typed with Pydantic, wired into Claude Code.",
    resources: [
      { title: "Model Context Protocol — official site & docs", url: "https://modelcontextprotocol.io", type: "docs" },
      { title: "FastMCP — documentation", url: "https://gofastmcp.com/", type: "docs", note: "The fastest way to build an MCP server in Python" },
      { title: "MCP Python SDK (official GitHub)", url: "https://github.com/modelcontextprotocol/python-sdk", type: "docs" },
      { title: "Build a Python MCP Server (Real Python)", url: "https://realpython.com/python-mcp/", type: "article" },
    ],
  },
  {
    id: "apis-vs-mcp",
    pass: 1,
    order: 9,
    repoPath: "pass-1/09-apis-vs-mcp",
    title: "APIs vs MCP: When to Use Which",
    objective:
      "You've now called an API (lesson 4) and built an MCP server (lesson 8). Contrast them: both expose capabilities, but to different consumers with different contracts. Know when to build or consume each.",
    topics: [
      "The core difference: a REST API is called by code a developer writes; an MCP tool is discovered and called by the model itself at runtime",
      "Contracts & discovery: OpenAPI/human docs vs self-describing MCP tool schemas the LLM reads",
      "Transport & shape: HTTP verbs + URLs + status codes vs MCP tools/resources/prompts over stdio or HTTP",
      "Where each fits: pipelines and dashboards (API) vs assistants and agents (MCP)",
      "The wrap pattern: turning an existing API into an MCP server so an agent can use it",
    ],
    build:
      "Wrap the API you called in lesson 4 as a FastMCP server, then write COMPARISON.md: the same capability exposed two ways, with a short table of when you'd choose an API vs an MCP server.",
    resources: [
      { title: "Anthropic — Introducing the Model Context Protocol", url: "https://www.anthropic.com/news/model-context-protocol", type: "article" },
      { title: "MCP — Architecture & core concepts", url: "https://modelcontextprotocol.io/docs/concepts/architecture", type: "docs" },
      { title: "OpenAPI Specification — a machine-readable API contract", url: "https://www.openapis.org/", type: "docs" },
      { title: "Anthropic — Building effective agents", url: "https://www.anthropic.com/research/building-effective-agents", type: "article" },
    ],
  },

  // ────────────────────────────── PASS 2 ──────────────────────────────
  {
    id: "claude-code-mastery",
    pass: 2,
    order: 10,
    repoPath: "pass-2/01-claude-code-mastery",
    title: "Claude Code & Codex Mastery",
    objective:
      "Become a genuine power user — directing AI tools, not just prompting them. This underpins every project in Pass 2.",
    topics: [
      "CLAUDE.md / AGENTS.md conventions — persistent project context",
      "Slash commands and custom commands; /init, plan mode, /clear hygiene",
      "Subagents in Claude Code: delegating scoped work to fresh contexts",
      "Scoping tasks well; planning before coding",
      "Reviewing diffs critically — reading and understanding generated code (the key skill)",
    ],
    build:
      "Write a CLAUDE.md for your learning repo, create one custom slash command, and use Claude Code (with a subagent for one sub-task) to refactor an earlier Pass 1 project. Note what worked.",
    resources: [
      { title: "Claude Code — Overview (docs)", url: "https://code.claude.com/docs/en/overview", type: "docs" },
      { title: "Claude Code — Subagents (docs)", url: "https://code.claude.com/docs/en/sub-agents", type: "docs" },
      { title: "Anthropic — Claude Code best practices", url: "https://www.anthropic.com/engineering/claude-code-best-practices", type: "article" },
      { title: "OpenAI Codex CLI (GitHub)", url: "https://github.com/openai/codex", type: "docs" },
    ],
  },
  {
    id: "n8n-workflows",
    pass: 2,
    order: 11,
    repoPath: "pass-2/02-n8n-workflows",
    title: "Low-Code GenAI Workflows with n8n",
    objective:
      "Deliver GenAI automations fast without building a whole app. n8n lets you assemble LLM-powered workflows visually — perfect for the reporting, alerting, and data-enrichment automations an analyst is asked for constantly.",
    topics: [
      "What n8n is: node-based workflow automation (self-host or cloud); when low-code beats hand-written code",
      "Core nodes: triggers (webhook / schedule / chat), HTTP Request, and data transforms",
      "Advanced AI in n8n: the AI Agent node, chat-model nodes, tools, and memory",
      "Connecting an LLM (Anthropic / OpenAI) and adding a retrieval or tool-using step",
      "Calling your own API or MCP server from a workflow",
      "When to graduate a prototype from n8n to real code",
    ],
    build:
      "An n8n workflow on a schedule that pulls data, runs it through an LLM (classify or summarize), and delivers a result (e.g. a Slack/email digest or a written row). Export the workflow JSON into this folder.",
    resources: [
      { title: "n8n — documentation", url: "https://docs.n8n.io/", type: "docs" },
      { title: "n8n — Advanced AI (AI Agent, chat models, tools)", url: "https://docs.n8n.io/advanced-ai/", type: "docs" },
      { title: "n8n — AI Agent node (reference)", url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/", type: "docs" },
      { title: "n8n — workflow templates gallery", url: "https://n8n.io/workflows/", type: "article", note: "Steal a GenAI workflow and adapt it" },
    ],
  },
  {
    id: "langchain-langgraph",
    pass: 2,
    order: 12,
    repoPath: "pass-2/03-langchain-langgraph",
    title: "LangChain & LangGraph (Agent Frameworks)",
    objective:
      "Move from hand-written loops to real orchestration. Learn LangChain for building blocks and LangGraph for controllable, stateful, multi-step (and multi-agent) flows — the framework behind your data agent next.",
    topics: [
      "LangChain: models, prompts, tools, and output parsers — and when a framework helps vs hurts",
      "LangGraph core: nodes + edges, typed state (Pydantic/TypedDict), and the compiled runnable",
      "Rebuilding your ReAct agent as a LangGraph graph; prebuilt ReAct agent vs a custom graph",
      "Control: conditional edges, loops with a step budget, checkpointing, human-in-the-loop interrupts",
      "Sub-agents / multi-agent patterns: supervisor and hand-off architectures",
      "Tracing with LangSmith to see every reason/act/observe step",
    ],
    build:
      "Rebuild your Pass 1 ReAct agent in LangGraph with typed state and a step limit, then add one sub-agent (a supervisor handing a sub-task to a specialist). Trace it in LangSmith.",
    resources: [
      { title: "LangChain — Introduction (docs)", url: "https://python.langchain.com/docs/introduction/", type: "docs" },
      { title: "LangGraph — documentation", url: "https://langchain-ai.github.io/langgraph/", type: "docs" },
      { title: "LangGraph — Multi-agent systems (concepts)", url: "https://langchain-ai.github.io/langgraph/concepts/multi_agent/", type: "docs" },
      { title: "LangGraph — tutorials", url: "https://langchain-ai.github.io/langgraph/tutorials/", type: "docs" },
    ],
  },
  {
    id: "data-rag",
    pass: 2,
    order: 13,
    repoPath: "pass-2/04-data-rag",
    title: "Production RAG over Your Data (Deep Project)",
    objective:
      "Make retrieval actually good on real, messy content — the difference between a demo and a product. Ground it in data you understand (docs, a schema, or a knowledge base).",
    topics: [
      "Serious chunking strategies; metadata filtering",
      "Retrieval quality: top-k tuning, reranking, hybrid (vector + keyword) search",
      "RAG failure modes: bad retrieval, hallucination, context stuffing",
      "Retrieval evals: is it fetching the right chunks? (your measurement edge)",
    ],
    build:
      "A polished RAG app over a substantial document set — or over a database schema so users can ask questions about the data model — with reranking and a small retrieval eval. Clean repo + README.",
    resources: [
      { title: "LangChain — RAG tutorial (docs)", url: "https://python.langchain.com/docs/tutorials/rag/", type: "docs" },
      { title: "Anthropic — Contextual Retrieval", url: "https://www.anthropic.com/news/contextual-retrieval", type: "article" },
      { title: "Production RAG with LangChain & Vector Databases (freeCodeCamp)", url: "https://www.freecodecamp.org/news/production-rag-with-langchain-vector-databases/", type: "video" },
      { title: "LlamaIndex — documentation", url: "https://docs.llamaindex.ai/", type: "docs" },
    ],
  },
  {
    id: "data-agent",
    pass: 2,
    order: 14,
    repoPath: "pass-2/05-data-agent",
    title: "Data Analysis Agent (Deep Project — your killer demo)",
    objective:
      "Build a multi-step agent wired to real data — exactly the thing your analyst background makes credible. It decides what to query, runs it, interprets the result, and answers.",
    topics: [
      "Structured orchestration in LangGraph: typed state, conditional edges, a bounded ReAct loop",
      "Tools the agent uses: run SQL / pandas, look up a metric definition, chart a result",
      "Multi-agent where it earns its keep: a supervisor routing to a SQL author and a result interpreter",
      "Guardrails: loop/cost limits, query validation, and never trusting model output blindly",
    ],
    build:
      "A LangGraph agent that answers real business questions against a live database or dataset over multiple steps, with at least one specialist sub-agent. Clean repo + README + a short demo GIF.",
    resources: [
      { title: "LangGraph — SQL agent tutorial", url: "https://langchain-ai.github.io/langgraph/tutorials/sql-agent/", type: "docs" },
      { title: "LangGraph — Multi-agent systems (concepts)", url: "https://langchain-ai.github.io/langgraph/concepts/multi_agent/", type: "docs" },
      { title: "Anthropic — Building effective agents", url: "https://www.anthropic.com/research/building-effective-agents", type: "article" },
      { title: "LangGraph — documentation", url: "https://langchain-ai.github.io/langgraph/", type: "docs" },
    ],
  },
  {
    id: "evals-observability",
    pass: 2,
    order: 15,
    repoPath: "pass-2/06-evals-observability",
    title: "Evaluation & Observability (your edge)",
    objective:
      "Prove the systems are good — this is where your analyst background is a genuine advantage. The 'is this number actually right?' instinct is exactly what most agent-builders lack.",
    topics: [
      "Evals: building eval sets, measuring accuracy/relevance, catching regressions",
      "Error analysis for LLM systems: reading failures like you'd read model errors",
      "Observability/tracing (LangSmith or similar): debugging agent steps",
      "Cost and latency tradeoffs; handling non-determinism; prompt/version management",
    ],
    build:
      "Add a proper eval suite to your data agent so every change can be measured, plus a short error-analysis write-up. This is a real differentiator in interviews.",
    resources: [
      { title: "Your AI Product Needs Evals (Hamel Husain)", url: "https://hamel.dev/blog/posts/evals/", type: "article", note: "The canonical, practical essay on LLM evals" },
      { title: "LangSmith — documentation", url: "https://docs.smith.langchain.com/", type: "docs" },
      { title: "Anthropic — Test & evaluate", url: "https://docs.claude.com/en/docs/test-and-evaluate/develop-tests", type: "docs" },
      { title: "OpenAI Cookbook — evals & recipes", url: "https://cookbook.openai.com/", type: "article" },
    ],
  },
  {
    id: "deployment",
    pass: 2,
    order: 16,
    repoPath: "pass-2/07-deployment",
    title: "Deployment",
    objective:
      "Move from 'works in my notebook' to 'others can use it.' Ship something with a public URL — Streamlit is a fast path for a data person.",
    topics: [
      "Streamlit or Gradio for a quick, shareable UI; FastAPI when you need an endpoint",
      "Docker basics",
      "Deploying to a public URL; managing secrets in production",
    ],
    build:
      "Wrap your data agent (or RAG app) in a Streamlit or FastAPI interface and deploy it somewhere accessible. Link it from your portfolio.",
    resources: [
      { title: "Streamlit — get started", url: "https://docs.streamlit.io/get-started", type: "docs" },
      { title: "FastAPI — official docs (tutorial)", url: "https://fastapi.tiangolo.com/", type: "docs" },
      { title: "Docker — get started", url: "https://docs.docker.com/get-started/", type: "docs" },
      { title: "Streamlit Community Cloud — deploy (docs)", url: "https://docs.streamlit.io/deploy/streamlit-community-cloud", type: "docs" },
    ],
  },
];

export const lessonsByPass = (p: 1 | 2) =>
  lessons.filter((l) => l.pass === p).sort((a, b) => a.order - b.order);

export const orderedLessons = () =>
  [...lessons].sort((a, b) => a.order - b.order);
