import { ExternalLinkIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CopyBlock } from "@/components/ai/copy-button";
import { Badge } from "@/components/ui/badge";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Use with AI: Claude, ChatGPT and MCP",
  description: `Connect Claude, ChatGPT or your coding assistant to ${site.name}'s degree apprenticeship listings and guides with our free MCP server. No sign-in.`,
  alternates: { canonical: "/ai" },
};

const MCP_URL = `${site.url}/mcp`;

const TOOLS = [
  { name: "search_roles", does: "Search listings by keyword, sector, level and location, sorted by deadline or salary." },
  { name: "get_role", does: "Full details of one role: salary, dates, entry requirements and description." },
  { name: "list_filters", does: "Valid sectors and levels, and the most common locations, with counts." },
  { name: "list_guides", does: "Our guides, articles and practice tests." },
  { name: "get_guide", does: "The full text of a guide, such as how to prepare for a video interview." },
];

const PROMPTS = [
  "Find software engineering degree apprenticeships near Manchester that close in the next month.",
  "Which open Level 6 engineering apprenticeships pay the most? Show salaries and closing dates.",
  "I'm predicted ABB in Maths, Physics and Chemistry. Which open roles could suit me, and why?",
  "Using the video interview guide, give me five practice questions for this role, then mark my answers.",
];

const NO_MCP_PROMPT = `Use the degree apprenticeship data from ${site.name}. A summary of the site is at ${site.url}/llms.txt and every listing is at ${site.url}/roles.json. Only use information from those pages, and include each role's link.`;

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`step-${n}`} className="space-y-4 rounded-xl border bg-card p-5 md:p-6">
      <h2 id={`step-${n}`} className="text-lg font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Steps({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="ml-5 list-decimal space-y-2 text-[15px] leading-relaxed text-foreground/90 marker:text-muted-foreground">
      {items.map((item, i) => (
        <li key={i} className="pl-1">
          {item}
        </li>
      ))}
    </ol>
  );
}

function DocsLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary">
      {children} <ExternalLinkIcon className="size-3.5" aria-hidden />
    </a>
  );
}

export default function AiPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Use with AI</h1>
        <p className="text-muted-foreground">
          Connect Claude, ChatGPT or your coding assistant to our listings and guides, then ask in plain English, such as
          &ldquo;find civil engineering apprenticeships in Leeds closing this month&rdquo;. It&apos;s free, needs no
          sign-in, and only reads public data.
        </p>
      </div>

      <section aria-labelledby="server-url" className="space-y-3 rounded-xl border border-primary/30 bg-primary/5 p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="server-url" className="text-lg font-semibold tracking-tight">
            Our MCP server
          </h2>
          <Badge variant="secondary">Read-only · no sign-in</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          MCP (Model Context Protocol) is the standard way to give AI assistants access to tools and data. Paste this URL
          into any assistant that supports remote MCP servers:
        </p>
        <CopyBlock text={MCP_URL} label="Copy URL" />
      </section>

      <Step n={1} title="Claude (web, desktop and mobile)">
        <Steps
          items={[
            <>
              Open <strong>Customize → Connectors</strong> (in some versions it&apos;s <strong>Settings → Connectors</strong>).
            </>,
            <>
              Choose <strong>Add custom connector</strong>, name it <strong>{site.name}</strong>, and paste the URL above.
              Leave sign-in options empty.
            </>,
            <>Start a chat, turn the connector on from the tools menu, and ask away.</>,
          ]}
        />
        <p className="text-sm text-muted-foreground">
          Custom connectors work on every Claude plan. The free plan allows one.
        </p>
        <DocsLink href="https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp">
          Claude&apos;s guide to custom connectors
        </DocsLink>
      </Step>

      <Step n={2} title="ChatGPT">
        <Steps
          items={[
            <>
              Open <strong>Settings → Apps → Advanced settings</strong> and turn on <strong>Developer mode</strong>.
            </>,
            <>
              Choose <strong>Create app</strong>, name it <strong>{site.name}</strong>, paste the URL above and set
              authentication to <strong>No authentication</strong>.
            </>,
            <>In a new chat, choose the app from the + menu and ask away.</>,
          ]}
        />
        <p className="text-sm text-muted-foreground">
          Developer mode depends on your ChatGPT plan, and menu names change from time to time.
        </p>
        <DocsLink href="https://developers.openai.com/api/docs/guides/developer-mode">OpenAI&apos;s developer mode guide</DocsLink>
      </Step>

      <Step n={3} title="Claude Code, Cursor, VS Code and other tools">
        <p className="text-sm text-muted-foreground">Claude Code: run this in your terminal.</p>
        <CopyBlock text={`claude mcp add --transport http degreeapprentice ${MCP_URL}`} />
        <p className="text-sm text-muted-foreground">
          Cursor and most other MCP clients: add this to your MCP settings file.
        </p>
        <CopyBlock text={JSON.stringify({ mcpServers: { degreeapprentice: { url: MCP_URL } } }, null, 2)} />
        <p className="text-sm text-muted-foreground">VS Code: add this to <code className="font-mono text-[13px]">.vscode/mcp.json</code>.</p>
        <CopyBlock text={JSON.stringify({ servers: { degreeapprentice: { type: "http", url: MCP_URL } } }, null, 2)} />
      </Step>

      <Step n={4} title="Any other AI chat, without connecting">
        <p className="text-[15px] leading-relaxed text-foreground/90">
          If your assistant can browse the web, paste this at the start of your chat. Or download{" "}
          <a href="/roles.csv" className="text-primary">
            every listing as a spreadsheet
          </a>{" "}
          and upload it.
        </p>
        <CopyBlock text={NO_MCP_PROMPT} label="Copy prompt" prose />
      </Step>

      <section aria-labelledby="tools" className="space-y-4">
        <h2 id="tools" className="text-xl font-semibold tracking-tight">
          What your assistant can do
        </h2>
        <dl className="divide-y rounded-xl border bg-card">
          {TOOLS.map((t) => (
            <div key={t.name} className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr] sm:gap-4">
              <dt className="font-mono text-[13px] text-primary">{t.name}</dt>
              <dd className="text-sm text-foreground/90">{t.does}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="prompts" className="space-y-4">
        <h2 id="prompts" className="text-xl font-semibold tracking-tight">
          Things to ask
        </h2>
        <div className="grid gap-2">
          {PROMPTS.map((p) => (
            <CopyBlock key={p} text={p} prose />
          ))}
        </div>
      </section>

      <section className="space-y-2 text-sm text-muted-foreground">
        <h2 className="font-semibold text-foreground">Good to know</h2>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            The server only reads public listings and guides. It can&apos;t see your CV, test scores or anything else saved
            in your browser.
          </li>
          <li>AI assistants make mistakes. Always check dates and requirements on the employer&apos;s official page before applying.</li>
          <li>
            Developers can also use the <a href="/roles.json" className="text-primary">JSON</a> and{" "}
            <a href="/roles.csv" className="text-primary">CSV</a> downloads or{" "}
            <a href="/llms.txt" className="text-primary">llms.txt</a>. The server&apos;s code is{" "}
            <a href={`${site.repoUrl}/blob/main/src/lib/mcp.ts`} target="_blank" rel="noopener noreferrer" className="text-primary">
              open source
            </a>
            . <Link href="/about" className="text-primary">More about the project</Link>.
          </li>
        </ul>
      </section>
    </div>
  );
}
