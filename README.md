# C++ Quick Start MCP Server

[![Discord](https://img.shields.io/badge/Discord-Join%20Us-7289da?logo=discord&logoColor=white)](https://discord.gg/qrhuftYXs4)

This is a **Model Context Protocol (MCP)** server that equips any compatible AI assistant (Antigravity, Cursor, Claude Desktop, etc.) with the ability to expertly scaffold cross-platform C++ projects.

Instead of writing boilerplate from scratch (and hallucinating build system rules), this MCP server acts as an interactive "Knowledge Base". It guides the AI through a structured interview process and then provides it with exact, proven templates for CMake, Conan, vcpkg, GitHub Actions, and standard directory layouts.

## Features

- **The `go` Prompt**: Initiates an interactive interview with the developer to determine the exact C++ stack (Standard, Build System, Package Manager, CI/CD, Coding Style, etc.).
- **Dynamic Scaffolding Resources**: Provides the AI with deep, instructional markdown resources (`mcp://scaffold/conan`, `mcp://scaffold/github-actions`, etc.) so it knows exactly how to write the requested boilerplate files perfectly.
- **Agent-Ready Architecture**: When you run the prompt, your C++ project will be automatically configured for modern agentic development. It seeds your project with built-in guidelines and architecture rules so future AI agents know exactly how to collaborate on your codebase safely and predictably.

## Installation

Ensure you have Node.js and `npm` installed.

### Install via NPM (Recommended)

You can install the server directly from the official npm registry:

```bash
npm install -g @m-velikov/cpp-quick-start-mcp
```

### Install from Source (Local Development)

If you are cloning this repository to build it locally:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build the server:
   ```bash
   npm run build
   ```
3. Install the package globally from the local directory:
   ```bash
   npm install -g .
   ```

Once installed via either method, the `cpp-quick-start-mcp` command will be available system-wide.

### Starting the Server (Optional)

If you want to run the server standalone over HTTP/SSE instead of standard I/O:

```bash
# Start with default options (port 3000, host 0.0.0.0)
cpp-quick-start-mcp --port 3000
```

_The server binds to all interfaces (`0.0.0.0`) on port `3000` by default._

## Connecting to an AI Agent

This server supports **Dual Transport** (both `stdio` for local clients and `sse` for remote clients).

### 1. Local Connection (stdio) - DEFAULT

For local IDE clients, you can connect directly without running an HTTP server.

**Option A: Global Install (Recommended)**
If you installed the package globally, use the `cpp-quick-start-mcp` command directly in the configurations below. _(Note: On Windows, use `cpp-quick-start-mcp.cmd` instead)._

**Option B: NPX (No Install Required)**
Alternatively, you can configure your IDE to run the MCP server directly via `npx` without installing it globally. Simply use `npx` as the command (or `npx.cmd` on Windows) and pass `-y @m-velikov/cpp-quick-start-mcp` as the arguments. For example:
```json
"mcpServers": {
  "cpp-quick-start": {
    "command": "npx",
    "args": ["-y", "@m-velikov/cpp-quick-start-mcp"]
  }
}
```

#### Antigravity IDE

1. Open the MCP Store by clicking the "..." dropdown at the top of the editor's side panel or agent panel, and select **MCP Servers**.
2. Click **Manage MCP Servers**, then select **View raw config** to edit your `mcp_config.json` file.
3. Add the following to your configuration:
   ```json
   "mcpServers": {
     "cpp-quick-start": {
       "command": "cpp-quick-start-mcp",
       "args": []
     }
   }
   ```
   Alternatively, simply ask the Antigravity agent: "Add the cpp-quick-start-mcp server to my configuration".

#### Codex

Codex uses a TOML file for configuration instead of JSON.

1. Open your `~/.codex/config.toml` file (or `.codex/config.toml` in your project folder).
2. Add the server entry:
   ```toml
   [mcp.servers.cpp-quick-start]
   command = "cpp-quick-start-mcp"
   args = []
   ```
   Alternatively, use the Codex CLI:

```bash
codex mcp add cpp-quick-start -- cpp-quick-start-mcp
```

#### Claude Code

1. You can add the MCP server directly via the Claude Code CLI using the following command:
   ```bash
   claude mcp add-json cpp-quick-start '{"type":"stdio","command":"cpp-quick-start-mcp","args":[]}'
   ```
2. Or you can manually edit your `claude.json` configuration file and add the JSON block shown in the Antigravity section.
3. Restart Claude Code or verify active servers with `claude mcp list`.

#### GitHub Copilot

1. In Visual Studio Code, open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and type **MCP: Add Server**.
2. Follow the guided flow, using `cpp-quick-start-mcp` as the command.
3. Alternatively, manually edit your global `~/.copilot/mcp-config.json` or project-scoped `.mcp/copilot/mcp.json` file and add the JSON configuration block.
4. Ensure you are in "Agent mode" in your Copilot chat interface to interact with your added MCP tools.

### 2. Remote Connection (SSE)

If you start the server using `--port`, it will automatically switch to HTTP/SSE transport mode. This is extremely useful if you are building a custom MCP client (using the `@modelcontextprotocol/sdk` client library) or deploying the server to the cloud.

_Note: Not all IDEs (like Antigravity or Cursor) currently support configuring remote SSE servers via their `mcp.json` files yet. For those IDEs, you must use the Local Connection (`stdio`) method above._

Example configuration for a custom web client:

```json
{
  "mcpServers": {
    "cpp-quick-start": {
      "type": "sse",
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

## Usage

### New Projects

Once connected, simply open an empty folder in your editor/terminal. To start the scaffolding interview, you can simply tell your AI assistant:

> `/go help me start a new C++ project`

_(Depending on your client, you may need to use the full prompt command: `/mcp:cpp-quick-start:go help me start a new C++ project`)_

The AI will take over, interview you, and generate your custom C++ boilerplate.

### Existing Projects

You can also use this MCP server to configure or modernize an existing project for agentic development. Open your existing project folder and tell your AI assistant:

> `/go upgrade the project`

The AI will read the exact blueprints from the MCP server and cleanly integrate them into your existing codebase (e.g., adding an `AGENTS.md`, setting up GitHub Actions, or integrating a package manager).

## Community

Got questions, ideas, or need help setting up your C++ environment? Come hang out with us on Discord!

[Join the Discord Server](https://discord.gg/YOUR_INVITE_LINK)
