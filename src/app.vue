<script setup lang="ts">
useHead({
    htmlAttrs: {
        lang: 'en',
    },
    link: [
        { rel: 'canonical', href: 'https://prefillprompt-baer.vercel.app/' },
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'manifest', href: '/site.webmanifest' },
    ],
    meta: [
        {
            name: 'referrer',
            content: 'no-referrer',
        },
        {
            name: 'theme-color',
            content: '#fffdf8',
            media: '(prefers-color-scheme: light)',
        },
        {
            name: 'theme-color',
            content: '#08111f',
            media: '(prefers-color-scheme: dark)',
        },
    ],
})

useSeoMeta({
    title: 'PrefillPrompt — Share a better ChatGPT prompt',
    description: 'Create one-click ChatGPT prompt links with optional web search. Share them as a URL, Markdown button, or QR code.',
    ogTitle: 'PrefillPrompt — Share a better ChatGPT prompt',
    ogDescription: 'Create one-click ChatGPT prompt links with optional web search.',
    ogType: 'website',
    ogUrl: 'https://prefillprompt-baer.vercel.app/',
    twitterCard: 'summary',
    twitterTitle: 'PrefillPrompt — Share a better ChatGPT prompt',
    twitterDescription: 'Create one-click ChatGPT prompt links with optional web search.',
})
</script>

<template>
    <NuxtPage />
</template>
