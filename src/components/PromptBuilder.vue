<script setup lang="ts">
import type { PromptHistoryEntry } from '~/composables/usePromptHistory'
import QRCode from 'qrcode'
import { buildAbsoluteShareUrl, buildMarkdownLink, isShareUrlWithinLimit, MAX_PROMPT_LENGTH, MAX_QR_URL_LENGTH } from '~/lib/prompt-links'

const prompt = ref('')
const webSearch = ref(true)
const origin = ref('')
const status = ref('')
const copyBusy = ref(false)
const copyFailed = ref(false)
const qrDataUrl = ref('')
const qrOpen = ref(false)
const qrBusy = ref(false)
const promptInput = ref<HTMLTextAreaElement>()
const removed = ref<PromptHistoryEntry>()
const { entries: storedEntries, remove, save } = usePromptHistory()
const entries = computed(() => storedEntries.value.filter(entry => !entry.provider || entry.provider === 'chatgpt'))
const options = computed(() => ({ prompt: prompt.value, provider: 'chatgpt' as const, webSearch: webSearch.value }))
const promptUrl = computed(() => origin.value ? buildAbsoluteShareUrl(origin.value, options.value) : '')
const tooLong = computed(() => prompt.value.length > MAX_PROMPT_LENGTH || (promptUrl.value && !isShareUrlWithinLimit(promptUrl.value)))
const ready = computed(() => Boolean(prompt.value.trim() && promptUrl.value && !tooLong.value))
const qrAvailable = computed(() => ready.value && promptUrl.value.length <= MAX_QR_URL_LENGTH)
const examples = [
    { title: 'Find a better option', category: 'Compare', prompt: 'Compare three highly rated noise-cancelling headphones under $250. Search current reviews and prices, link your sources, and explain who each option is best for.' },
    { title: 'Plan a little escape', category: 'Explore', prompt: 'Plan a relaxed weekend in Chicago with independent bookstores, great coffee, and one neighborhood walk. Search for current hours and include source links.' },
    { title: 'Get up to speed', category: 'Learn', prompt: 'What changed in renewable energy this month? Search recent reporting, explain the three most important developments in plain English, and cite your sources.' },
]

onMounted(() => {
    origin.value = window.location.origin
})
watch([prompt, webSearch], () => {
    status.value = ''
    copyFailed.value = false
})

function loadPrompt(value: string, search = true) {
    prompt.value = value
    webSearch.value = search
    nextTick(() => promptInput.value?.focus())
}

async function copyLink(markdown = false) {
    if (!ready.value || copyBusy.value)
        return
    copyBusy.value = true
    copyFailed.value = false
    const value = markdown ? buildMarkdownLink(promptUrl.value, 'chatgpt', prompt.value) : promptUrl.value
    const sharedOptions = { ...options.value }
    try {
        await navigator.clipboard.writeText(value)
        save(sharedOptions)
        status.value = markdown ? 'Markdown copied. Ready to paste.' : 'Link copied. Send it to someone curious.'
    }
    catch {
        copyFailed.value = true
        status.value = 'Clipboard blocked. Select the link below and copy it manually.'
    }
    finally { copyBusy.value = false }
}

function remember() {
    if (ready.value)
        save(options.value)
}

async function showQr() {
    if (!qrAvailable.value || qrBusy.value)
        return
    qrBusy.value = true
    const sharedOptions = { ...options.value }
    try {
        qrDataUrl.value = await QRCode.toDataURL(promptUrl.value, { margin: 2, width: 360, errorCorrectionLevel: 'M', color: { dark: '#20243b', light: '#ffffff' } })
        qrOpen.value = true
        save(sharedOptions)
    }
    catch { status.value = 'Could not create a QR code. Copy the link instead.' }
    finally { qrBusy.value = false }
}

function removeEntry(entry: PromptHistoryEntry) {
    removed.value = entry
    remove(entry.id)
    status.value = 'Recent link removed. You can undo below.'
}

function undoRemove() {
    if (!removed.value)
        return
    save(removed.value)
    removed.value = undefined
    status.value = 'Recent link restored.'
}
</script>

<template>
    <div class="workspace">
        <div class="workspace-heading">
            <span class="eyebrow">THE LINK STUDIO</span>
            <span class="workspace-note"><span class="status-dot" /> No account needed</span>
        </div>
        <div class="workspace-grid">
            <section class="editor-panel" aria-labelledby="editor-title">
                <div class="panel-heading">
                    <label id="editor-title" for="prompt-input">What’s the question?</label>
                    <span class="character-count">{{ prompt.length.toLocaleString('en-US') }} / 12,000</span>
                </div>
                <textarea
                    id="prompt-input"
                    ref="promptInput"
                    v-model="prompt"
                    class="prompt-input"
                    style="resize: none"
                    :maxlength="MAX_PROMPT_LENGTH"
                    :aria-invalid="Boolean(tooLong)"
                    aria-describedby="prompt-help prompt-limit"
                    placeholder="Find the best little coffee shops in Copenhagen. Include a few local favorites and links to their menus…"
                />
                <p id="prompt-limit" class="validation-message" :role="tooLong ? 'alert' : undefined">
                    {{ tooLong ? 'This prompt makes the link too long. Shorten it before sharing.' : 'A little context goes a long way. Be specific about what you need.' }}
                </p>
                <div class="editor-settings">
                    <label class="search-toggle">
                        <input v-model="webSearch" type="checkbox">
                        <span class="switch-track" aria-hidden="true"><span /></span>
                        <span><strong>Search the web</strong><small>Ask ChatGPT for up-to-date answers</small></span>
                    </label>
                    <span class="mode-badge">{{ webSearch ? 'SEARCH ON' : 'CHAT MODE' }}</span>
                </div>
                <p id="prompt-help" class="editor-footnote">
                    Your words go straight to ChatGPT. We don’t rewrite them.
                </p>
            </section>

            <section class="share-panel" aria-labelledby="share-title">
                <div class="share-heading">
                    <span class="eyebrow">YOUR NEXT CONVERSATION</span>
                    <svg class="route-mark" aria-hidden="true" viewBox="0 0 48 48"><path d="M9 33h15a9 9 0 0 0 0-18H9m9-7-8 7 8 7M30 30l9 9m0-9v9h-9" /></svg>
                </div>
                <div class="destination">
                    <span class="destination-icon" aria-hidden="true">↗</span><div>
                        <h2 id="share-title">
                            ChatGPT<span>{{ webSearch ? ' + web search' : '' }}</span>
                        </h2><p>A fresh conversation for everyone.</p>
                    </div>
                </div>
                <blockquote :class="{ 'preview-empty': !prompt.trim() }">
                    {{ prompt.trim() || 'Your next good question starts here.' }}
                </blockquote>
                <div class="share-divider" />
                <button class="button button-primary" :disabled="!ready || copyBusy" :aria-busy="copyBusy" @click="copyLink()">
                    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m10 13 4-4m-6 7-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 1 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" /></svg>
                    {{ copyBusy ? 'Copying…' : 'Copy share link' }}
                    <span aria-hidden="true">↗</span>
                </button>
                <a v-if="ready" class="button button-secondary" :href="promptUrl" target="_blank" rel="noopener noreferrer" @click="remember">{{ webSearch ? 'Search in ChatGPT' : 'Open in ChatGPT' }} <span aria-hidden="true">↗</span></a>
                <button v-else class="button button-secondary" disabled>
                    {{ webSearch ? 'Search in ChatGPT' : 'Open in ChatGPT' }} <span aria-hidden="true">↗</span>
                </button>
                <div class="format-actions">
                    <button :disabled="!ready || copyBusy" @click="copyLink(true)">
                        Copy Markdown
                    </button>
                    <span aria-hidden="true">·</span>
                    <button :disabled="!qrAvailable || qrBusy" @click="showQr">
                        {{ qrBusy ? 'Creating…' : 'QR code' }}
                    </button>
                </div>
                <p v-if="ready && !qrAvailable" class="small-note">
                    This link is too long for a QR code. Copy it instead.
                </p>
                <p class="status-message" :class="{ 'is-error': copyFailed }" role="status" aria-live="polite">
                    {{ status || (ready ? 'Ready when you are.' : 'Add your prompt to make a link.') }}
                </p>
                <details v-if="ready" class="link-details" :open="copyFailed">
                    <summary>View & copy the full link</summary>
                    <label class="sr-only" for="share-url">Share link</label>
                    <textarea id="share-url" :value="promptUrl" readonly rows="3" style="resize: none" @focus="($event.target as HTMLTextAreaElement).select()" />
                </details>
            </section>
        </div>
        <p class="privacy-note">
            <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 4 8 9 8 9s8-5 8-9V6zM12 8v5m0 3h.01" /></svg><span>Anyone with the link can read the prompt. Keep sensitive information out. Opening a link may send it immediately; ChatGPT controls search availability.</span>
        </p>

        <section class="starter-section" aria-labelledby="starter-title">
            <div class="section-heading">
                <h2 id="starter-title">
                    A little inspiration
                </h2><p>Start with one of these. Make it yours.</p>
            </div>
            <div class="starter-grid">
                <button v-for="example in examples" :key="example.title" class="starter-button" @click="loadPrompt(example.prompt)">
                    <span class="eyebrow">{{ example.category }}</span><strong>{{ example.title }} <span aria-hidden="true">↗</span></strong>
                </button>
            </div>
        </section>
        <section class="recent-section" aria-labelledby="recent-title">
            <div class="section-heading">
                <h2 id="recent-title">
                    Recently sent
                </h2><p>Only in this browser. Up to six links.</p>
            </div>
            <p v-if="!entries.length" class="recent-empty">
                Your copied and opened prompts will appear here.
            </p>
            <ul v-else class="recent-list">
                <li v-for="entry in entries" :key="entry.id">
                    <button class="recent-use" @click="loadPrompt(entry.prompt, entry.webSearch ?? false)">
                        <span>{{ entry.prompt }}</span><small>{{ entry.webSearch ? 'Web search' : 'Chat' }} <span aria-hidden="true">↗</span></small>
                    </button><button class="remove-button" :aria-label="`Remove recent prompt: ${entry.prompt.slice(0, 40)}`" @click="removeEntry(entry)">
                        ×
                    </button>
                </li>
            </ul>
            <button v-if="removed" class="text-button" @click="undoRemove">
                Undo remove
            </button>
        </section>
        <QrDialog :data-url="qrDataUrl" :open="qrOpen" @close="qrOpen = false" />
    </div>
</template>
