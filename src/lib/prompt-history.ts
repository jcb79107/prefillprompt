import type { PromptLinkOptions } from './prompt-links.ts'
import { isProviderId, MAX_PROMPT_LENGTH } from './prompt-links.ts'

export interface PromptHistoryEntry extends PromptLinkOptions {
    id: string
    createdAt: string
}

export function parseHistory(value: unknown): PromptHistoryEntry[] {
    if (!Array.isArray(value))
        return []
    return value.filter((entry): entry is PromptHistoryEntry =>
        entry !== null && typeof entry === 'object'
        && typeof entry.id === 'string' && typeof entry.createdAt === 'string'
        && typeof entry.prompt === 'string' && Boolean(entry.prompt.trim())
        && entry.prompt.length <= MAX_PROMPT_LENGTH
        && (entry.provider === undefined || isProviderId(entry.provider))
        && (entry.webSearch === undefined || typeof entry.webSearch === 'boolean')
        && (entry.model === undefined || typeof entry.model === 'string')
        && (entry.temporary === undefined || typeof entry.temporary === 'boolean'),
    ).slice(0, 6)
}
