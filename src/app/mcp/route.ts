import { createMcpHandler } from "@modelcontextprotocol/server";

import { createServer } from "@/lib/mcp";

// The public MCP endpoint that AI assistants connect to. See /ai for setup instructions.
const handler = createMcpHandler(() => createServer());

// Read-only public data, so any origin may call it (browser-based MCP clients need CORS).
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Expose-Headers": "Mcp-Session-Id, Mcp-Protocol-Version",
};

async function serve(request: Request) {
  const response = await handler.fetch(request);
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(CORS)) headers.set(k, v);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export const GET = serve;
export const POST = serve;
export const DELETE = serve;
export const OPTIONS = () => new Response(null, { status: 204, headers: CORS });
