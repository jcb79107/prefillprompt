import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { parseHistory } from '../src/lib/prompt-history.ts'

const entry = { id: 'one', createdAt: '2026-11-07', prompt: 'Find local coffee', provider: 'chatgpt', webSearch: true }

describe('browser history trust boundary', () => {
    it('rejects malformed or incompatible stored entries', () => {
        const invalid = [null, 1, 'x', {}, { ...entry, prompt: 42 }, { ...entry, prompt: ' ' }, { ...entry, provider: 'unknown' }, { ...entry, webSearch: 'false' }, { ...entry, prompt: 'x'.repeat(12001) }]
        assert.deepEqual(parseHistory(invalid), [])
        assert.deepEqual(parseHistory({}), [])
    })
    it('retains valid ChatGPT history and bounds its size', () => {
        assert.deepEqual(parseHistory([entry]), [entry])
        assert.equal(parseHistory(Array.from({ length: 12 }, (_, i) => ({ ...entry, id: String(i) }))).length, 6)
        assert.deepEqual(parseHistory([null, entry]), [entry])
        assert.deepEqual(parseHistory([{ ...entry, provider: 'claude' }]), [{ ...entry, provider: 'claude' }])
    })
})
