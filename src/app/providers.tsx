"use client"

import type { Engine, ISourceOptions } from "@tsparticles/engine"
import { NextParticles, NextParticlesProvider } from "@tsparticles/nextjs"
import { loadSlim } from "@tsparticles/slim"
import { type ReactNode, useCallback } from "react"
import particleConfigData from "@/shared/config/particleConfig.json"

export function Providers({ children }: { children: ReactNode }) {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  const options = particleConfigData as ISourceOptions

  return (
    <NextParticlesProvider init={particlesInit}>
      {children}
      <NextParticles id="tsparticles" options={options} className="-z-10" />
    </NextParticlesProvider>
  )
}
