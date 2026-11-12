import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'

let resolveDependency = createRequire(import.meta.url)
for (const dependency of ['nuxt/package.json', '@nuxt/nitro-server', 'nitropack/package.json', '@rollup/plugin-node-resolve']) {
    resolveDependency = createRequire(resolveDependency.resolve(dependency))
}
const merge = resolveDependency('deepmerge')

test('build dependency cannot poison merged object prototypes', () => {
    const payload = JSON.parse('{"__proto__":{"polluted":true},"safe":1}')
    for (const result of [merge(payload, {}), merge(Object.create(null), payload), merge({}, { nested: payload }).nested]) {
        assert.equal(Object.getPrototypeOf(result), Object.prototype)
        assert.equal(result.polluted, undefined)
        assert.equal(result.safe, 1)
    }
    assert.deepEqual(merge({ nested: { a: 1 }, list: [1] }, { nested: { b: 2 }, list: [2] }), {
        nested: { a: 1, b: 2 },
        list: [1, 2],
    })
})
