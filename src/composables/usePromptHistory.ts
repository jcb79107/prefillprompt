import type { PromptHistoryEntry } from '~/lib/prompt-history'
import type { PromptLinkOptions } from '~/lib/prompt-links'
import { parseHistory } from '~/lib/prompt-history'
import { buildSharePath } from '~/lib/prompt-links'
import { readStorage, removeStorage, writeStorage } from '~/lib/safe-storage'

export type { PromptHistoryEntry } from '~/lib/prompt-history'

const STORAGE_KEY = 'prefillprompt-history-v1'
const MAX_HISTORY_ITEMS = 6

export function usePromptHistory() {
    const entries = ref<PromptHistoryEntry[]>([])

    onMounted(() => {
        try {
            const stored = readStorage(() => window.localStorage, STORAGE_KEY)
            const parsed = stored ? JSON.parse(stored) : []
            entries.value = parseHistory(parsed)
        }
        catch {
            entries.value = []
        }
    })

    function persist() {
        // History is optional. Storage denial or quota exhaustion must not turn
        // a successful copy, share, or open action into a failure.
        writeStorage(() => window.localStorage, STORAGE_KEY, JSON.stringify(entries.value))
    }

    function save(options: PromptLinkOptions) {
        if (!import.meta.client || !options.prompt.trim()) {
            return
        }

        const duplicateKey = buildSharePath(options)
        const withoutDuplicate = entries.value.filter(entry => buildSharePath(entry) !== duplicateKey)

        entries.value = [
            {
                ...options,
                id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
                createdAt: new Date().toISOString(),
            },
            ...withoutDuplicate,
        ].slice(0, MAX_HISTORY_ITEMS)
        persist()
    }

    function remove(id: string) {
        entries.value = entries.value.filter(entry => entry.id !== id)
        persist()
    }

    function clear() {
        entries.value = []
        removeStorage(() => window.localStorage, STORAGE_KEY)
    }

    return {
        clear,
        entries,
        remove,
        save,
    }
}
