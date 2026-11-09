import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { describe, it } from 'node:test'

const css = readFileSync(new URL('../src/assets/css/main.css', import.meta.url), 'utf8')
const qr = readFileSync(new URL('../src/components/QrDialog.vue', import.meta.url), 'utf8')

describe('motion and modal contracts', () => {
    it('keeps animations explicit and provides a reduced-motion alternative', () => {
        assert.doesNotMatch(css, /transition:\s*all\b/)
        assert.doesNotMatch(css, /scroll-behavior:\s*smooth/)
        assert.match(css, /prefers-reduced-motion: reduce[\s\S]*transition: none/)
        assert.match(css, /prefers-reduced-motion: reduce[\s\S]*transform: none/)
    })
    it('keeps QR focus modal until the exit completes', () => {
        assert.match(qr, /dialogElement\.value\.showModal\(\)/)
        assert.match(qr, /@after-leave="restoreFocus"/)
        assert.match(qr, /@cancel.prevent="emit\('close'\)"/)
    })
})
