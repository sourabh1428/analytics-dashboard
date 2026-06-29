import posthog from 'posthog-js'

export const PH_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? ''
export const PH_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com'

export function initPostHog() {
  if (typeof window === 'undefined') return
  if (posthog.__loaded) return
  posthog.init(PH_KEY, {
    api_host: PH_HOST,
    person_profiles: 'always',
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
  })
}

export { posthog }
