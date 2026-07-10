// curriculum.ts
// Single source of content for the AI Engineering learning tracker.
// Completion is derived from her GitHub repo: a lesson is "done" when the file
// `${repoPath}/DONE.md` exists in her learning repo (see WEBSITE_SPEC.md).

export type ResourceType = "video" | "docs" | "article" | "course" | "interactive";

export interface Resource {
  title: string;
  url: string;
  type: ResourceType;
  note?: string;
}

export interface Lesson {
  id: string; // stable, used in URLs and to track completion
  pass: 1 | 2;
  order: number; // global ordering across both passes
  repoPath: string; // folder in her learning repo; DONE.md here marks completion
  title: string;
  objective: string;
  topics: string[];
  build: string; // the concrete thing she pushes for this lesson
  resources: Resource[];
}

export const COMPLETION_MARKER = "DONE.md";

export const PASSES = {
  1: {
    title: "Pass 1 — Foundations & Familiarity",
    blurb:
      "Learn Python properly, then build a simple, working version of every core AI Engineering concept (RAG, agent, MCP). Write things from scratch so the mechanics actually click. Breadth over depth.",
  },
  2: {
    title: "Pass 2 — Depth & Real Projects",
    blurb:
      "Rebuild those concepts as serious, portfolio-grade projects — this time driving Claude Code and Codex as the primary tools. Depth, quality, and production concerns.",
  },
} as const;

export const lessons: Lesson[] = [
  // ────────────────────────────── PASS 1 ──────────────────────────────
  {
    id: "setup",
    pass: 1,
    order: 1,
    repoPath: "pass-1/01-setup",
    title: "Setup & Workflow",
    objective:
      "Get a working dev environment and good habits from day one: Python, an editor, git/GitHub, and virtual environments. Install Claude Code and Codex now and use them as a learning aid.",
    topics: [
      "Install Python 3.11+ and VS Code",
      "Terminal basics: navigating folders, running scripts",
      "git & GitHub: clone, add, commit, push, branches, pull requests",
      "Virtual environments with uv (or venv) and pip",
      "Reading tracebacks (read errors from the bottom up)",
      "Install Claude Code + Codex CLI; use them to explain code and unblock errors",
    ],
    build:
      "Create your learning GitHub repo, commit a hello-world script into this folder, and push it. Every lesson from here lives in git.",
    resources: [
      { title: "Python — official downloads", url: "https://www.python.org/downloads/", type: "docs" },
      { title: "GitHub — Get started (official docs)", url: "https://docs.github.com/en/get-started", type: "docs" },
      { title: "uv — the fast Python package/venv manager (docs)", url: "https://docs.astral.sh/uv/", type: "docs" },
      { title: "Claude Code — Overview & install", url: "https://code.claude.com/docs/en/overview", type: "docs" },
    ],
  },
  {
    id: "python-core",
    pass: 1,
    order: 2,
    repoPath: "pass-1/02-python-core",
    title: "Python Core (incl. Pydantic)",
    objective:
      "Write Python comfortably without copy-paste, and learn Pydantic — the data-modelling library that underpins structured LLM output, tool arguments, and agent/graph state. This is the foundation everything else sits on.",
    topics: [
      "Types: int, float, str, bool, None",
      "Strings & manipulation: slicing, split/join/strip/replace, f-strings",
      "Lists, tuples, dictionaries (incl. nested dicts), sets",
      "Control flow: if/elif/else, for/while, range/enumerate/zip, break/continue",
      "Comprehensions (list & dict) — used everywhere",
      "Functions: arguments, return values, defaults, *args/**kwargs, scope",
      "Error handling: try/except/finally, raising exceptions",
      "File I/O (text + JSON), modules and imports",
      "Type hints (typing): the language every modern AI library speaks",
      "Classes/OOP at reading level (understand objects; LLM SDKs return them)",
      "Pydantic: BaseModel, field types, validation, and JSON (de)serialization — the backbone of structured LLM output, tool schemas, FastMCP tools, and LangGraph state",
    ],
    build:
      "A command-line tool that reads a CSV/JSON file, processes it (filter, aggregate, transform), and writes results out — validating each record through a Pydantic model on the way in.",
    resources: [
      { title: "Learn Python – Full Course for Beginners (freeCodeCamp, YouTube)", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", type: "video", note: "~4.5h, the canonical free intro" },
      { title: "Corey Schafer — Python Tutorials for Beginners (YouTube channel)", url: "https://www.youtube.com/@coreyms", type: "video", note: "Best-in-class topic-by-topic explainers" },
      { title: "The Python Tutorial (official docs)", url: "https://docs.python.org/3/tutorial/", type: "docs" },
      { title: "Pydantic — official documentation", url: "https://docs.pydantic.dev/latest/", type: "docs", note: "Start with 'Models'; you'll use this constantly later" },
      { title: "W3Schools Python — quick reference", url: "https://www.w3schools.com/python/", type: "interactive" },
    ],
  },
  {
    id: "pandas-numpy",
    pass: 1,
    order: 3,
    repoPath: "pass-1/03-pandas-numpy",
    title: "Data Handling: pandas & NumPy",
    objective:
      "Manipulate tabular and numeric data in Python — translating your SQL intuition into code (this is home turf).",
    topics: [
      "NumPy: arrays, vectorized operations, shapes, indexing",
      "pandas: DataFrames, read/write CSV/Parquet, filtering, groupby, merges, missing data",
      "Mapping SQL → pandas (SELECT/WHERE/GROUP BY/JOIN equivalents)",
    ],
    build:
      "Reproduce a Power BI-style analysis you already know, entirely in pandas.",
    resources: [
      { title: "Learn Python for Data Science – pandas & NumPy (freeCodeCamp)", url: "https://www.freecodecamp.org/news/learn-python-for-data-science-full-course/", type: "video" },
      { title: "10 minutes to pandas (official docs)", url: "https://pandas.pydata.org/docs/user_guide/10min.html", type: "docs" },
      { title: "Kaggle — Pandas (free hands-on micro-course)", url: "https://www.kaggle.com/learn/pandas", type: "interactive" },
      { title: "NumPy — the absolute basics for beginners", url: "https://numpy.org/doc/stable/user/absolute_beginners.html", type: "docs" },
    ],
  },
  {
    id: "apis",
    pass: 1,
    order: 4,
    repoPath: "pass-1/04-apis",
    title: "APIs: The Bridge to AI",
    objective:
      "Talk to web services in code. LLMs are consumed via APIs, so this is the bridge skill into AI engineering. (You'll contrast APIs with MCP servers directly in lesson 9.)",
    topics: [
      "HTTP/REST basics: GET, POST, status codes, headers",
      "The requests library",
      "JSON: parsing responses, building request bodies",
      "Auth: API keys, environment variables, .env files, never commit secrets",
      "Rate limits and retries",
    ],
    build:
      "Call a free public API, parse the JSON, and store the results in a SQLite database. Keep it — you'll re-expose this same capability as an MCP server in lesson 9.",
    resources: [
      { title: "API Integration in Python (Real Python)", url: "https://realpython.com/api-integration-in-python/", type: "article" },
      { title: "requests — official documentation", url: "https://requests.readthedocs.io/en/latest/", type: "docs" },
      { title: "MDN — An overview of HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview", type: "docs" },
    ],
  },
  {
    id: "llm-fundamentals",
    pass: 1,
    order: 5,
    repoPath: "pass-1/05-llm-fundamentals",
    title: "LLM API Fundamentals",
    objective:
      "Use LLMs programmatically and understand how they behave. Tool use / function calling and reliable structured output are the most important concepts here.",
    topics: [
      "Anthropic & OpenAI SDKs: sending messages, system prompts",
      "Tool use / function calling — spend real time here (it powers agents later)",
      "Structured outputs with Pydantic schemas: getting reliable, validated JSON back",
      "ReAct prompting: interleaving reasoning and actions ('reason → act → observe') — the pattern under most agents",
      "Streaming responses",
      "Tokens, context windows, temperature/top_p",
      "Prompt engineering fundamentals: clear instructions, examples, output format",
    ],
    build:
      "A CLI assistant that turns plain-English into SQL (or explains SQL in plain English), returning a Pydantic-validated result object — plays straight to your strengths.",
    resources: [
      { title: "Anthropic — Build with Claude (docs home)", url: "https://docs.claude.com/en/docs/build-with-claude/overview", type: "docs" },
      { title: "Anthropic — Tool use (function calling)", url: "https://docs.claude.com/en/docs/build-with-claude/tool-use/overview", type: "docs" },
      { title: "ReAct: Synergizing Reasoning and Acting in LLMs (paper)", url: "https://arxiv.org/abs/2210.03629", type: "article", note: "The origin of the reason+act loop" },
      { title: "Prompt Engineering Guide — ReAct", url: "https://www.promptingguide.ai/techniques/react", type: "article" },
      { title: "Anthropic Courses (free, on GitHub)", url: "https://github.com/anthropics/courses", type: "course", note: "Includes API fundamentals and prompt engineering" },
    ],
  },
  {
    id: "simple-rag",
    pass: 1,
    order: 6,
    repoPath: "pass-1/06-simple-rag",
    title: "Simple RAG (Familiarity)",
    objective:
      "Understand retrieval end-to-end by building the simplest possible RAG. Rough is fine — the goal is understanding, not polish.",
    topics: [
      "Embeddings: what they are, cosine similarity, why semantic search beats keyword search",
      "One simple vector store: Chroma or FAISS",
      "Basic chunking (make it work; don't optimize yet)",
      "The core loop: embed docs → store → retrieve top-k → stuff into prompt → answer",
    ],
    build:
      "A minimal RAG over ~10 documents you care about. No fancy framework required.",
    resources: [
      { title: "What is Retrieval-Augmented Generation? (Pinecone Learn)", url: "https://www.pinecone.io/learn/retrieval-augmented-generation/", type: "article" },
      { title: "RAG from Scratch (LangChain, GitHub + videos)", url: "https://github.com/langchain-ai/rag-from-scratch", type: "course", note: "Long-form, taught by a LangChain engineer" },
      { title: "Chroma — Getting Started", url: "https://docs.trychroma.com/getting-started", type: "docs" },
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
      "Understand the agent loop by writing a ReAct loop from scratch — no framework. See the reason → act → observe mechanics with your own eyes.",
    topics: [
      "The agent loop = the ReAct pattern: reason → act (call a tool) → observe (feed the result back) → repeat",
      "Writing that loop by hand: parse the model's chosen tool call, execute it, append the observation, loop",
      "Wiring tool-calling (from the LLM module) into the loop",
      "Basic error handling and a loop/step limit so it can't run away",
      "Reading the trace: seeing the model's reasoning and tool calls step by step",
    ],
    build:
      "A tiny from-scratch ReAct agent with 2–3 tools (e.g. a calculator and a 'query my SQLite DB' tool) that prints each reason/act/observe step. No LangGraph yet.",
    resources: [
      { title: "Anthropic — Building effective agents", url: "https://www.anthropic.com/research/building-effective-agents", type: "article", note: "The single best conceptual read on agents" },
      { title: "ReAct: Synergizing Reasoning and Acting in LLMs (paper)", url: "https://arxiv.org/abs/2210.03629", type: "article" },
      { title: "Hugging Face — Agents Course (free)", url: "https://huggingface.co/learn/agents-course", type: "course" },
      { title: "OpenAI Agents SDK (Python docs)", url: "https://openai.github.io/openai-agents-python/", type: "docs" },
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
      "FastMCP: the fast, Pythonic way to build MCP servers — decorate a function with @mcp.tool and you have a tool",
      "Typed tools with Pydantic type hints, so the model gets a clean schema and clear descriptions",
      "Resources and prompts, not just tools; running the server over stdio",
      "Connect it to Claude Desktop or Claude Code and watch it work end-to-end",
    ],
    build:
      "A minimal FastMCP server exposing one simple tool (typed with Pydantic), wired into Claude Code.",
    resources: [
      { title: "Model Context Protocol — official site & docs", url: "https://modelcontextprotocol.io", type: "docs" },
      { title: "FastMCP — documentation", url: "https://gofastmcp.com/", type: "docs", note: "The fastest way to build an MCP server in Python" },
      { title: "MCP Python SDK (official GitHub)", url: "https://github.com/modelcontextprotocol/python-sdk", type: "docs", note: "FastMCP is included as mcp.server.fastmcp" },
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
      "You've now built both a REST API client (lesson 4) and an MCP server (lesson 8). Contrast them directly: both expose capabilities, but to different consumers, with different contracts. Know when to build or consume each.",
    topics: [
      "The core difference: a REST API is called by code a developer writes; an MCP tool is discovered and called by the model itself at runtime",
      "Contracts & discovery: OpenAPI/human docs (for developers) vs self-describing MCP tool schemas the LLM reads and reasons over",
      "Transport & shape: HTTP verbs + URLs + status codes vs MCP tools/resources/prompts over stdio or HTTP",
      "Statefulness, auth, and where each fits (backend integration vs assistant/agent tooling)",
      "The wrap pattern: turning an existing REST API into an MCP server so an agent can use it",
      "Decision guide: expose to an agent (MCP) vs call from your own code/frontend (API) — and when to do both",
    ],
    build:
      "Wrap the public API you called in lesson 4 as a FastMCP server, then write COMPARISON.md in this folder: the same capability exposed two ways, and a short table of when you'd choose an API vs an MCP server.",
    resources: [
      { title: "Anthropic — Introducing the Model Context Protocol", url: "https://www.anthropic.com/news/model-context-protocol", type: "article", note: "Why MCP exists, vs bespoke integrations" },
      { title: "MCP — Architecture & core concepts", url: "https://modelcontextprotocol.io/docs/concepts/architecture", type: "docs" },
      { title: "OpenAPI Specification — what a machine-readable API contract looks like", url: "https://www.openapis.org/", type: "docs" },
      { title: "Anthropic — Building effective agents", url: "https://www.anthropic.com/research/building-effective-agents", type: "article", note: "How agents actually consume tools" },
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
      "Scoping tasks well; giving good context; planning before coding",
      "Reviewing diffs critically — reading and understanding generated code (the key skill)",
      "Using Claude Code to scaffold, refactor, test, and debug",
    ],
    build:
      "Write a CLAUDE.md for your learning repo, create one custom slash command, and use Claude Code (with a subagent for one sub-task) to refactor an earlier Pass 1 project. Put notes on what worked in this folder.",
    resources: [
      { title: "Claude Code — Overview (docs)", url: "https://code.claude.com/docs/en/overview", type: "docs" },
      { title: "Claude Code — Subagents (docs)", url: "https://code.claude.com/docs/en/sub-agents", type: "docs" },
      { title: "Anthropic — Claude Code best practices", url: "https://www.anthropic.com/engineering/claude-code-best-practices", type: "article" },
      { title: "Using CLAUDE.md files (Anthropic blog)", url: "https://claude.com/blog/using-claude-md-files", type: "article" },
      { title: "OpenAI Codex CLI (GitHub)", url: "https://github.com/openai/codex", type: "docs" },
    ],
  },
  {
    id: "langchain-langgraph",
    pass: 2,
    order: 11,
    repoPath: "pass-2/07-langchain-langgraph",
    title: "LangChain & LangGraph (Agent Frameworks)",
    objective:
      "Move from hand-written loops to real orchestration. Learn LangChain for the building blocks and LangGraph for controllable, stateful, multi-step (and multi-agent) flows — the framework you'll use for the database agent next.",
    topics: [
      "LangChain: models, prompts, tools, and output parsers — and when a framework helps vs hurts",
      "LangGraph core: graphs as nodes + edges, typed state (a Pydantic/TypedDict schema), and the compiled runnable",
      "Rebuilding your ReAct agent as a LangGraph graph; the prebuilt ReAct agent vs a custom graph",
      "Control: conditional edges, loops with a step budget, persistence/checkpointing, human-in-the-loop interrupts",
      "Sub-agents / multi-agent patterns: supervisor and hand-off architectures, and when to split one agent into several",
      "Tracing runs with LangSmith to see every reason/act/observe step",
    ],
    build:
      "Rebuild your Pass 1 ReAct agent in LangGraph with typed state and a step limit, then add one sub-agent (a supervisor that hands a sub-task to a specialist). Trace it in LangSmith.",
    resources: [
      { title: "LangChain — Introduction (docs)", url: "https://python.langchain.com/docs/introduction/", type: "docs" },
      { title: "LangGraph — documentation", url: "https://langchain-ai.github.io/langgraph/", type: "docs" },
      { title: "LangGraph — Multi-agent systems (concepts)", url: "https://langchain-ai.github.io/langgraph/concepts/multi_agent/", type: "docs", note: "Supervisor & hand-off patterns for sub-agents" },
      { title: "LangGraph — Agentic RAG / quickstart tutorials", url: "https://langchain-ai.github.io/langgraph/tutorials/", type: "docs" },
    ],
  },
  {
    id: "production-rag",
    pass: 2,
    order: 12,
    repoPath: "pass-2/02-production-rag",
    title: "Production RAG (Deep Project)",
    objective:
      "Rebuild RAG as a real system: better chunking, retrieval quality, reranking, and basic retrieval evals.",
    topics: [
      "Serious chunking strategies and why they matter",
      "Retrieval quality: top-k tuning, metadata filtering, reranking, hybrid search",
      "One framework at working depth: LangChain OR LlamaIndex (don't over-invest)",
      "RAG failure modes: bad retrieval, hallucination, context stuffing",
      "Basic evals for retrieval (does it fetch the right chunks?)",
    ],
    build:
      "A polished RAG app over a substantial document set — or over a database schema so users can ask questions about the data model. Clean repo + README.",
    resources: [
      { title: "Production RAG with LangChain & Vector Databases (freeCodeCamp)", url: "https://www.freecodecamp.org/news/production-rag-with-langchain-vector-databases/", type: "video", note: "~8h, production lens" },
      { title: "LangChain — RAG tutorial (docs)", url: "https://python.langchain.com/docs/tutorials/rag/", type: "docs" },
      { title: "LlamaIndex — documentation", url: "https://docs.llamaindex.ai/", type: "docs" },
      { title: "Anthropic — Contextual Retrieval", url: "https://www.anthropic.com/news/contextual-retrieval", type: "article", note: "Big retrieval-quality wins" },
    ],
  },
  {
    id: "database-agent",
    pass: 2,
    order: 13,
    repoPath: "pass-2/03-database-agent",
    title: "Database Agent (Deep Project — your killer demo)",
    objective:
      "Build a multi-step agent wired to real data using LangGraph. Few career-changers can do this credibly — this is your standout portfolio piece.",
    topics: [
      "Structured agent orchestration in LangGraph: typed state, conditional edges, a bounded ReAct loop",
      "Robust tool-calling, memory/checkpointing, retries, guardrails (loop limits, validation, cost control)",
      "Multi-agent design where it earns its keep: a supervisor routing to specialist sub-agents (e.g. a SQL author, a result interpreter)",
      "Connecting the agent to a SQL/DBT-backed database: decide → query → interpret → answer",
    ],
    build:
      "A LangGraph agent that answers real business questions against a live database over multiple steps, with at least one specialist sub-agent. Clean repo + README + a short demo GIF.",
    resources: [
      { title: "LangGraph — documentation", url: "https://langchain-ai.github.io/langgraph/", type: "docs" },
      { title: "LangGraph — SQL agent tutorial", url: "https://langchain-ai.github.io/langgraph/tutorials/sql-agent/", type: "docs" },
      { title: "LangGraph — Multi-agent systems (concepts)", url: "https://langchain-ai.github.io/langgraph/concepts/multi_agent/", type: "docs" },
      { title: "Anthropic — Building effective agents", url: "https://www.anthropic.com/research/building-effective-agents", type: "article" },
    ],
  },
  {
    id: "production-mcp",
    pass: 2,
    order: 14,
    repoPath: "pass-2/04-production-mcp",
    title: "Production MCP Server with FastMCP (Deep Project)",
    objective:
      "Build an MCP server someone would actually use — multiple tools, good error handling, deployed and wired into Claude Code — using FastMCP end to end.",
    topics: [
      "FastMCP at depth: multiple tools, resources, and prompts in one server",
      "Good error handling and clear tool descriptions (so the model uses them well)",
      "Input validation with Pydantic — never trust model input",
      "Deploying FastMCP over HTTP (not just stdio) and using it daily",
      "Auth and safety for a server that takes real actions",
    ],
    build:
      "A FastMCP server exposing genuinely useful tools (e.g. 'query our warehouse', 'look up a metric definition'), deployed over HTTP and used from Claude Code.",
    resources: [
      { title: "FastMCP — documentation", url: "https://gofastmcp.com/", type: "docs" },
      { title: "FastMCP — running & deploying your server", url: "https://gofastmcp.com/deployment/running-server", type: "docs" },
      { title: "MCP Python SDK (official GitHub)", url: "https://github.com/modelcontextprotocol/python-sdk", type: "docs" },
      { title: "Example MCP servers (reference implementations)", url: "https://github.com/modelcontextprotocol/servers", type: "docs" },
    ],
  },
  {
    id: "evals-observability",
    pass: 2,
    order: 15,
    repoPath: "pass-2/05-evals-observability",
    title: "Evaluation & Observability",
    objective:
      "Prove the systems are good — where your BI background is a genuine edge. The 'is this number actually right?' instinct is exactly what most agent-builders lack.",
    topics: [
      "Evals: building eval sets, measuring accuracy/relevance, catching regressions",
      "Observability/logging (LangSmith or similar): tracing calls, debugging agent steps",
      "Cost and latency tradeoffs; handling non-determinism; prompt/version management",
    ],
    build:
      "Add a proper eval suite to your database agent so every change can be measured. This is a real differentiator in interviews.",
    resources: [
      { title: "Your AI Product Needs Evals (Hamel Husain)", url: "https://hamel.dev/blog/posts/evals/", type: "article", note: "The canonical, practical essay on LLM evals" },
      { title: "LangSmith — documentation", url: "https://docs.smith.langchain.com/", type: "docs" },
      { title: "Anthropic — Test & evaluate", url: "https://docs.claude.com/en/docs/test-and-evaluate/develop-tests", type: "docs" },
      { title: "OpenAI Cookbook — evals & recipes", url: "https://cookbook.openai.com/", type: "article" },
    ],
  },
  {
    id: "n8n-workflows",
    pass: 2,
    order: 16,
    repoPath: "pass-2/08-n8n-workflows",
    title: "Low-Code GenAI Workflows with n8n",
    objective:
      "Ship GenAI automations fast without wiring everything by hand. n8n lets you build LLM-powered workflows visually — triggers, tool nodes, and AI-agent nodes — a pragmatic way to prototype and deliver real automations (e.g. an ETL step that classifies or summarizes as data lands).",
    topics: [
      "What n8n is: node-based workflow automation (self-host or cloud); when low-code beats hand-written code",
      "Core nodes: triggers (webhook / schedule / chat), HTTP Request, and data transforms",
      "Advanced AI in n8n: the AI Agent node, chat-model nodes, tools, and memory",
      "Connecting an LLM (Anthropic / OpenAI) and adding a retrieval or tool-using step",
      "Calling your own API or MCP server from a workflow",
      "When to graduate a prototype from n8n to real code",
    ],
    build:
      "An n8n workflow that takes an input (webhook or schedule), runs it through an LLM with a tool or retrieval step, and delivers a useful result — e.g. summarize or classify incoming records and write them somewhere. Export the workflow JSON into this folder.",
    resources: [
      { title: "n8n — documentation", url: "https://docs.n8n.io/", type: "docs" },
      { title: "n8n — Advanced AI (AI Agent, chat models, tools)", url: "https://docs.n8n.io/advanced-ai/", type: "docs" },
      { title: "n8n — AI Agent node (reference)", url: "https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/", type: "docs" },
      { title: "n8n — workflow templates gallery", url: "https://n8n.io/workflows/", type: "article", note: "Steal a GenAI workflow and adapt it" },
    ],
  },
  {
    id: "deployment",
    pass: 2,
    order: 17,
    repoPath: "pass-2/06-deployment",
    title: "Deployment",
    objective:
      "Move from 'works on my laptop' to 'others can use it.' Ship something with a public URL.",
    topics: [
      "FastAPI to serve an endpoint, or Streamlit/Gradio for a quick demo UI",
      "Docker basics",
      "Deploying to a public URL",
    ],
    build:
      "Wrap the database agent in a FastAPI or Streamlit interface and deploy it somewhere accessible. Link it from your portfolio.",
    resources: [
      { title: "FastAPI — official docs (tutorial)", url: "https://fastapi.tiangolo.com/", type: "docs" },
      { title: "Streamlit — get started", url: "https://docs.streamlit.io/get-started", type: "docs" },
      { title: "Docker — get started", url: "https://docs.docker.com/get-started/", type: "docs" },
      { title: "Vercel — documentation", url: "https://vercel.com/docs", type: "docs", note: "For deploying this tracker site itself too" },
    ],
  },
];

// Convenience helpers the UI can use.
export const lessonsByPass = (p: 1 | 2) =>
  lessons.filter((l) => l.pass === p).sort((a, b) => a.order - b.order);

export const orderedLessons = () =>
  [...lessons].sort((a, b) => a.order - b.order);
