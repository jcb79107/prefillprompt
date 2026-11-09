import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'

const css = readFileSync(new URL('../src/assets/css/main.css', import.meta.url), 'utf8')
const app = readFileSync(new URL('../src/app.vue', import.meta.url), 'utf8')

describe('responsive theme', () => {
    it('provides system dark and high-contrast fallbacks', () => {
        assert.match(css, /prefers-color-scheme: dark/)
        assert.match(css, /color-scheme: dark/)
        assert.match(css, /forced-colors: active/)
        assert.match(css, /scrollbar-color: auto/)
        assert.match(app, /prefers-color-scheme: light/)
        assert.match(app, /prefers-color-scheme: dark/)
    })
    it('uses a natural page layout with a single-column narrow workspace', () => {
        assert.doesNotMatch(css, /\.phone-frame/)
        assert.match(css, /max-width: 800px[\s\S]*\.workspace-grid \{ grid-template-columns: 1fr/)
        assert.match(css, /:focus-visible/)
    })
})
