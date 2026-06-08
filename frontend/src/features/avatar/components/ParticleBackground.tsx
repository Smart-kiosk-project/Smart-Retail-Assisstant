import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { AvatarState } from '../types'

interface ParticleBackgroundProps {
  avatarState: AvatarState
}

const STATE_COLORS: Record<AvatarState, { primary: number; secondary: number; speed: number }> = {
  idle:      { primary: 0x378ADD, secondary: 0x1a3a5c, speed: 0.3 },
  greeting:  { primary: 0x3db85a, secondary: 0x1a4a2a, speed: 0.8 },
  listening: { primary: 0x9b6dff, secondary: 0x3a1a6a, speed: 1.0 },
  thinking:  { primary: 0xf0a500, secondary: 0x4a3000, speed: 0.6 },
  talking:   { primary: 0x378ADD, secondary: 0x0a2a4a, speed: 1.4 },
  goodbye:   { primary: 0x3db85a, secondary: 0x0a2a14, speed: 0.5 },
}

export default function ParticleBackground({ avatarState }: ParticleBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef(avatarState)

  useEffect(() => {
    stateRef.current = avatarState
  }, [avatarState])

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 80

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    // --- Particles ---
    const PARTICLE_COUNT = 220
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const velocities: { x: number; y: number; z: number }[] = []

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 160
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60
      velocities.push({
        x: (Math.random() - 0.5) * 0.04,
        y: (Math.random() - 0.5) * 0.04,
        z: (Math.random() - 0.5) * 0.02,
      })
    }

    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const particleMat = new THREE.PointsMaterial({
      color: 0x378ADD,
      size: 0.9,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // --- Connection lines ---
    const MAX_CONNECTIONS = 300
    const linePositions = new Float32Array(MAX_CONNECTIONS * 6)
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x378ADD, transparent: true, opacity: 0.15 })
    const lineSegments = new THREE.LineSegments(lineGeo, lineMaterial)
    scene.add(lineSegments)

    // --- Grid floor ---
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x1a2a3a,
      transparent: true,
      opacity: 0.4,
    })
    const gridHelper = new THREE.GridHelper(200, 30, 0x1a2a3a, 0x0d1a24)
    gridHelper.position.y = -45
    gridHelper.material = gridMaterial
    scene.add(gridHelper)

    // --- Ambient glow orb (center) ---
    const orbGeo = new THREE.SphereGeometry(6, 32, 32)
    const orbMat = new THREE.MeshBasicMaterial({
      color: 0x378ADD,
      transparent: true,
      opacity: 0.04,
    })
    const orb = new THREE.Mesh(orbGeo, orbMat)
    orb.position.set(-20, 0, -20)
    scene.add(orb)

    // --- Ring ---
    const ringGeo = new THREE.RingGeometry(18, 18.3, 64)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x378ADD,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2.4
    ring.position.set(-20, -5, -10)
    scene.add(ring)

    // Animate
    let animId: number
    let currentSpeed = 0.3
    let currentColor = new THREE.Color(0x378ADD)
    let targetColor  = new THREE.Color(0x378ADD)

    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      const cfg = STATE_COLORS[stateRef.current]
      targetColor.set(cfg.primary)
      currentSpeed += (cfg.speed - currentSpeed) * 0.02
      currentColor.lerp(targetColor, 0.02)

      particleMat.color.copy(currentColor)
      lineMaterial.color.copy(currentColor)
      orbMat.color.copy(currentColor)
      ringMat.color.copy(currentColor)

      // Move particles
      const pos = particleGeo.attributes.position.array as Float32Array
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i * 3]     += velocities[i].x * currentSpeed
        pos[i * 3 + 1] += velocities[i].y * currentSpeed
        pos[i * 3 + 2] += velocities[i].z * currentSpeed

        if (Math.abs(pos[i * 3])     > 80) velocities[i].x *= -1
        if (Math.abs(pos[i * 3 + 1]) > 60) velocities[i].y *= -1
        if (Math.abs(pos[i * 3 + 2]) > 30) velocities[i].z *= -1
      }
      particleGeo.attributes.position.needsUpdate = true

      // Build connection lines
      let lineIdx = 0
      for (let a = 0; a < PARTICLE_COUNT && lineIdx < MAX_CONNECTIONS; a++) {
        for (let b = a + 1; b < PARTICLE_COUNT && lineIdx < MAX_CONNECTIONS; b++) {
          const dx = pos[a * 3]     - pos[b * 3]
          const dy = pos[a * 3 + 1] - pos[b * 3 + 1]
          const dz = pos[a * 3 + 2] - pos[b * 3 + 2]
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
          if (dist < 22) {
            linePositions[lineIdx * 6]     = pos[a * 3]
            linePositions[lineIdx * 6 + 1] = pos[a * 3 + 1]
            linePositions[lineIdx * 6 + 2] = pos[a * 3 + 2]
            linePositions[lineIdx * 6 + 3] = pos[b * 3]
            linePositions[lineIdx * 6 + 4] = pos[b * 3 + 1]
            linePositions[lineIdx * 6 + 5] = pos[b * 3 + 2]
            lineIdx++
          }
        }
      }
      lineGeo.setDrawRange(0, lineIdx * 2)
      lineGeo.attributes.position.needsUpdate = true

      // Rotate ring slowly
      ring.rotation.z = elapsed * 0.08
      orb.scale.setScalar(1 + Math.sin(elapsed * 1.5) * 0.06)

      // Gentle camera drift
      camera.position.x = Math.sin(elapsed * 0.05) * 3
      camera.position.y = Math.cos(elapsed * 0.04) * 2
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background: 'radial-gradient(ellipse at 30% 50%, #0a1628 0%, #0d0d0f 60%, #050507 100%)',
      }}
    />
  )
}