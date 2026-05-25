"use client"

import { useCallback } from "react"
import { NextParticlesProvider, NextParticles } from "@tsparticles/nextjs"
import type { Engine } from "@tsparticles/engine"
import type { ISourceOptions } from "@tsparticles/engine"
import { loadSlim } from "@tsparticles/slim"
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
