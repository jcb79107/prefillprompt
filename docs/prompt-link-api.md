# Prompt-link API

`GET https://prefillprompt-baer.vercel.app/api/prompt` redirects the browser to the selected service with the prompt and supported options.

| Query key | Required | Meaning |
| --- | --- | --- |
| `q` | Yes | The URL-encoded prompt text. Newlines and Unicode are supported. |
| `s` | No | Service ID or recognized service alias. Supported IDs are `chatgpt`, `claude`, `gemini`, and `perplexity`. A provider-specific model may imply its service; otherwise the default is ChatGPT. |
| `m` | No | Legacy name for the service. It is used only when `s` is absent. New links should use `s`. |
| `model` | No | A provider model ID or the alias `latest`, `latest-fast`, or `latest-reasoning`. |
| `web` | No | Set to `true` or `1` to request ChatGPT web search. |
| `temporary` | No | Set to `true` or `1` to request ChatGPT Temporary Chat or Claude Incognito. Experimental. |

For example:

```text
https://prefillprompt-baer.vercel.app/api/prompt?s=chatgpt&model=latest-reasoning&web=true&q=Compare%20the%20latest%20browser%20automation%20standards
```

```text
https://prefillprompt-baer.vercel.app/api/prompt?s=chatgpt&temporary=true&q=Help%20me%20brainstorm%20three%20names%20for%20a%20weekend%20prototype
```

## Provider caveats

PrefillPrompt launches third-party web applications; those applications do not provide a single stable, documented URL API for every model and mode.

- Model and mode controls are best-effort. A service may ignore an option, fall back to its default, rename a model, or require a particular account, plan, region, or feature rollout.
- The `latest*` aliases intentionally move to the latest known-good mapping. Use an explicit model ID when reproducibility matters.
- `web` currently targets ChatGPT web search. Other services choose their own search behavior.
- `temporary` currently maps to ChatGPT Temporary Chat and Claude Incognito. Gemini and Perplexity have no verified URL switch for this mode.
- Gemini does not publish a dependable third-party prompt-link contract. Gemini links use a one-tap copy-and-open handoff so the prompt is not silently dropped.
- Gemini and Perplexity do not publish stable URL controls for selecting consumer models or modes, so those destinations may use their account defaults.
- Temporary or incognito mode is not a privacy guarantee. Confirm the destination UI shows the requested mode before sending sensitive content.
- The OpenRouter catalog is useful for discovering model names, but it is not authoritative for consumer web-app URL controls. PrefillPrompt does not treat OpenRouter availability as proof that a model can be selected by URL.
