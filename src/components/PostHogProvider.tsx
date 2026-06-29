'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { PH_KEY, PH_HOST } from '@/src/lib/posthog'

export default function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (posthog.__loaded) return
    posthog.init(PH_KEY, {
      api_host: PH_HOST,
      person_profiles: 'always',
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: true,
    })
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}
