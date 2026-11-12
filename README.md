# PrefillPrompt

This fork provides a ChatGPT-focused link studio at https://prefillprompt-baer.vercel.app. Write a prompt, choose whether to request web search, and copy a shareable link, Markdown, or QR code. The original multi-provider API remains available for existing links.

> [!IMPORTANT]
> The prompt is part of the URL. Anyone who receives the link—and systems that record URLs—can read it. Do not put secrets or sensitive personal information in a shared prompt.

<p align="center">
  <img src="./public/og-prefillprompt.png" width="720" alt="PrefillPrompt: one prompt branching into four AI destinations">
</p>

## Features

- ChatGPT prompt links with optional web search
- Copyable URLs and Markdown, QR export, and manual-copy fallback
- Examples and browser-local history with remove and undo
- Responsive keyboard-accessible interface with reduced-motion support
- Existing ChatGPT, Claude, Gemini, and Perplexity API links remain supported
- Stateless Nuxt app; this fork is deployed on Vercel

History stays in the current browser and does not sync between devices. Model selection, temporary mode, and native device sharing are not exposed in this fork's builder.

## Privacy

PrefillPrompt has no account system, application database, analytics SDK, or advertising tracker. Preferences and up to six recent prompts are optional browser-local history. The app continues to work when browser storage is denied or full.

Prompt links are not private: the prompt is encoded in the URL and can appear in browser history, clipboards, QR scanners, link previews, network infrastructure, and destination-provider logs. Do not put secrets or sensitive information in a PrefillPrompt URL. See [Privacy and logging](./docs/privacy.md) for the exact storage, request, and logging behavior.

## Try an example

| Destination | Prompt | Link |
| --- | --- | --- |
| ChatGPT with web search | Research the current state of Web Platform Baseline and cite primary sources. | [Open prompt](https://prefillprompt-baer.vercel.app/api/prompt?s=chatgpt&model=latest-reasoning&web=true&q=Research%20the%20current%20state%20of%20Web%20Platform%20Baseline%20and%20cite%20primary%20sources.) |
| Claude | Turn these rough release notes into a concise customer announcement. | [Open prompt](https://prefillprompt-baer.vercel.app/api/prompt?s=claude&model=latest&q=Turn%20these%20rough%20release%20notes%20into%20a%20concise%20customer%20announcement.) |
| Gemini | Compare three ways to add offline support to a Nuxt app, including tradeoffs. | [Open prompt](https://prefillprompt-baer.vercel.app/api/prompt?s=gemini&model=latest-fast&q=Compare%20three%20ways%20to%20add%20offline%20support%20to%20a%20Nuxt%20app%2C%20including%20tradeoffs.) |
| Perplexity | Find primary sources explaining Cloudflare Workers Static Assets routing. | [Open prompt](https://prefillprompt-baer.vercel.app/api/prompt?s=perplexity&q=Find%20primary%20sources%20explaining%20Cloudflare%20Workers%20Static%20Assets%20routing.) |

## Prompt-link API

See the [API reference and provider caveats](docs/prompt-link-api.md) for supported
parameters, legacy links, model aliases, and best-effort provider behavior.

## Local development

```bash
git clone https://github.com/jcb79107/prefillprompt.git
cd prefillprompt
pnpm install --frozen-lockfile
pnpm dev
```

The development server is available at `http://localhost:3000`.

The repository requires Node 22.13 or newer within the Node 22 release line, or Node 24 and newer, for development and Cloudflare commands. `.node-version` pins Node 22.16.0, and Corepack reads the pinned pnpm version from `package.json`.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the Nuxt development server. |
| `pnpm build` | Create the Vercel production build. |
| `pnpm build:cloudflare` | Build Nuxt for Cloudflare Workers and Static Assets. |
| `pnpm preview` | Preview the Cloudflare-targeted build locally. |
| `pnpm lint` | Run ESLint. |
| `pnpm models:update` | Validate OpenRouter's public endpoint and update the checked-in model catalog when its model set changes. |
| `pnpm typecheck` | Run Nuxt and Vue TypeScript checks. |
| `pnpm test` | Run the automated test suite once. |
| `pnpm check` | Run lint, typecheck, tests, and the Vercel production build. |
| `pnpm deploy:preview` | Upload a Cloudflare Worker version and print its preview URL without promoting it to production. |
| `pnpm deploy:blue` | Build and upload the named blue Cloudflare preview. |

Cloudflare scripts are retained for upstream-compatible previews. They are optional;
`pnpm check` verifies this fork’s Vercel target. Run `pnpm build:cloudflare` when
changing or publishing the alternative target.

## Architecture

- Nuxt renders the responsive prompt builder and browser-local state.
- A shared provider registry resolves services, models, aliases, and supported modes.
- The browser bundle reads a generated model catalog; the application does not depend on OpenRouter at runtime.
- The Nitro `/api/prompt` route validates a link and returns an uncached redirect without storing the prompt.
- Gemini requests redirect to a first-party clipboard handoff because the consumer app has no documented public prompt-link contract.
- Vercel serves the prerendered frontend and Nitro API routes for this fork.

## Contributing

1. Fork and clone the repository.
2. Create a focused branch.
3. Make the change and add or update tests.
4. Run `pnpm check`.
5. Open a pull request describing the behavior change and verification.

## Upstream

Forked from [ThatGuySam/prefillprompt](https://github.com/ThatGuySam/prefillprompt).
Report issues specific to this fork in [this repository](https://github.com/jcb79107/prefillprompt/issues).

## License

PrefillPrompt is open-source software available under the [MIT License](./LICENSE).
