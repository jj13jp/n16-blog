"use client"

import type { Engine, ISourceOptions } from "@tsparticles/engine"
import { NextParticles, NextParticlesProvider } from "@tsparticles/nextjs"
import { loadSlim } from "@tsparticles/slim"
import { useCallback } from "react"
import particleConfigData from "@/shared/config/particleConfig.json"

export function ParticleBackground() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine)
  }, [])

  const options = particleConfigData as ISourceOptions

  return (
    <NextParticlesProvider init={particlesInit}>
      <NextParticles id="tsparticles" options={options} className="-z-10" />
    </NextParticlesProvider>
  )
}
