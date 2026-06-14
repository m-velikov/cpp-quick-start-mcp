#!/usr/bin/env node
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from "fs/promises";
import { readFileSync } from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import { parseArgs } from "node:util";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const { version: VERSION } = JSON.parse(
  readFileSync(path.join(__dirname, "..", "package.json"), "utf-8"),
);

const server = new Server(
  {
    name: "cpp-quick-start-mcp",
    version: VERSION,
  },
  {
    capabilities: {
      prompts: {},
      resources: {},
      tools: {},
    },
  },
);

// Extract the description from a SKILL.md frontmatter block, if present.
async function readSkillDescription(skillPath: string): Promise<string | undefined> {
  const content = await fs.readFile(skillPath, "utf-8");
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
  const description = frontmatter?.[1]?.match(/^description:\s*(.+)$/m);
  return description?.[1]?.trim();
}

// Resources: serve all SKILL.md files inside data/ folders
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const dirs = await fs.readdir(DATA_DIR);
  const resources = [];

  for (const dir of dirs) {
    if (dir === "meta-quickstart") continue; // Expose meta-quickstart as a Prompt, not a Resource

    const skillPath = path.join(DATA_DIR, dir, "SKILL.md");
    try {
      const description = await readSkillDescription(skillPath);
      resources.push({
        uri: `mcp://scaffold/${dir}`,
        name: `C++ Scaffolding Skill: ${dir}`,
        mimeType: "text/markdown",
        description: description ?? `Instructions for scaffolding ${dir}`,
      });
    } catch (e) {
      // Ignore directories without SKILL.md
    }
  }

  return { resources };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  const match = uri.match(/^mcp:\/\/scaffold\/(.+)$/);

  if (!match) {
    throw new McpError(ErrorCode.InvalidRequest, `Invalid URI: ${uri}`);
  }

  const skillName = path.basename(match[1] as string);
  const skillPath = path.join(DATA_DIR, skillName, "SKILL.md");

  try {
    const content = await fs.readFile(skillPath, "utf-8");
    return {
      contents: [
        {
          uri,
          mimeType: "text/markdown",
          text: content,
        },
      ],
    };
  } catch (error) {
    throw new McpError(ErrorCode.InvalidRequest, `Resource not found: ${uri}`);
  }
});

// Tools: explicitly expose list-resources and read-resource
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list-resources",
        description:
          "List all available C++ scaffolding skills/resources that can be fetched via read-resource.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "read-resource",
        description:
          "Read a specific C++ scaffolding skill/resource by its URI.",
        inputSchema: {
          type: "object",
          properties: {
            uri: {
              type: "string",
              description:
                "The URI of the resource to fetch (e.g., mcp://scaffold/best-practices-cpp).",
            },
          },
          required: ["uri"],
        },
      },
      {
        name: "start-cpp-quickstart",
        description:
          "Start the C++ quick-start workflow: interview the user about their preferred C++ stack and generate (or modernize) the project scaffolding. Use when starting a new C++ project, or modernizing, enhancing, or adding components to an existing one. Returns the workflow instructions to follow. This is the tool-based entry point to the same workflow exposed as the 'go' prompt, for hosts that do not surface MCP prompts.",
        inputSchema: {
          type: "object",
          properties: {},
          required: [],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "list-resources") {
    const dirs = await fs.readdir(DATA_DIR);
    const resources = [];
    for (const dir of dirs) {
      if (dir === "meta-quickstart") continue;
      const skillPath = path.join(DATA_DIR, dir, "SKILL.md");
      try {
        await fs.access(skillPath);
        resources.push(`mcp://scaffold/${dir}`);
      } catch (e) {
        // ignore
      }
    }
    return {
      content: [
        {
          type: "text",
          text: `Available resources:\n${resources
            .map((r) => `- ${r}`)
            .join("\n")}`,
        },
      ],
    };
  }

  if (request.params.name === "read-resource") {
    const uri = request.params.arguments?.uri;
    if (typeof uri !== "string") {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Invalid or missing 'uri' argument",
      );
    }

    const match = uri.match(/^mcp:\/\/scaffold\/(.+)$/);
    if (!match) {
      throw new McpError(ErrorCode.InvalidRequest, `Invalid URI: ${uri}`);
    }

    const skillName = path.basename(match[1] as string);
    const skillPath = path.join(DATA_DIR, skillName, "SKILL.md");

    try {
      const content = await fs.readFile(skillPath, "utf-8");
      return {
        content: [
          {
            type: "text",
            text: content,
          },
        ],
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InvalidRequest,
        `Resource not found: ${uri}`,
      );
    }
  }

  if (request.params.name === "start-cpp-quickstart") {
    const metaSkillPath = path.join(DATA_DIR, "meta-quickstart", "SKILL.md");
    try {
      const content = await fs.readFile(metaSkillPath, "utf-8");
      return {
        content: [
          {
            type: "text",
            text: content,
          },
        ],
      };
    } catch (error) {
      throw new McpError(
        ErrorCode.InternalError,
        "Failed to load meta-quickstart instructions",
      );
    }
  }

  throw new McpError(
    ErrorCode.MethodNotFound,
    `Tool not found: ${request.params.name}`,
  );
});

// Prompts: expose the meta-quickstart interview
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "go",
        description:
          "Conducts the C++ quick start interview to determine project stack.",
        arguments: [],
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name !== "go") {
    throw new McpError(
      ErrorCode.InvalidRequest,
      `Prompt not found: ${request.params.name}`,
    );
  }

  const metaSkillPath = path.join(DATA_DIR, "meta-quickstart", "SKILL.md");
  try {
    const content = await fs.readFile(metaSkillPath, "utf-8");
    return {
      description: "C++ Meta-Scaffold Interview Workflow",
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: content,
          },
        },
      ],
    };
  } catch (error) {
    throw new McpError(
      ErrorCode.InternalError,
      "Failed to load meta-quickstart instructions",
    );
  }
});

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      port: { type: "string", short: "p" },
      host: { type: "string", short: "h" },
      stdio: { type: "boolean" },
    },
  });

  const PORT = values.port
    ? parseInt(values.port, 10)
    : process.env.PORT
      ? parseInt(process.env.PORT, 10)
      : undefined;

  // If --stdio is passed (or no port is specified), use stdio.
  if (values.stdio || !PORT) {
    console.error("Starting C++ Quick Start MCP Server on stdio...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
    return;
  }

  // Otherwise, use SSE/Hono
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
  });

  await server.connect(transport);

  const app = new Hono();

  app.all("/mcp", async (c) => {
    return transport.handleRequest(c.req.raw);
  });

  const HOST = values.host ?? process.env.HOST ?? "127.0.0.1";

  console.log(
    `Starting C++ Quick Start MCP Server on http://${HOST}:${PORT}/mcp ...`,
  );
  serve({
    fetch: app.fetch,
    port: PORT,
    hostname: HOST,
  });
}

main().catch(console.error);
