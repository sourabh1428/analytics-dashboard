'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Plain Three.js, no React reconciler involved — a single decorative mesh
// doesn't need @react-three/fiber's declarative scene graph, and this avoids
// its dependency on React's internal fiber/owner state (which has repeatedly
// broken across React/Next.js minor versions in that ecosystem).
export default function HeroScene({ scrollRef }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 0, 5.2)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    container.appendChild(renderer.domElement)

    const geometry = new THREE.IcosahedronGeometry(1.6, 4)
    const material = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.25,
      roughness: 0.15,
      metalness: 0.4,
      wireframe: true,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const ambient = new THREE.AmbientLight(0xffffff, 0.5)
    const pointA = new THREE.PointLight(0xf59e0b, 1.1)
    pointA.position.set(4, 4, 4)
    const pointB = new THREE.PointLight(0x8b5cf6, 0.4)
    pointB.position.set(-4, -2, -3)
    scene.add(ambient, pointA, pointB)

    function resize() {
      const { clientWidth, clientHeight } = container
      if (!clientWidth || !clientHeight) return
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(clientWidth, clientHeight)
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    let frameId
    let scale = 1
    const clock = new THREE.Clock()

    function tick() {
      const delta = clock.getDelta()
      const scroll = scrollRef?.current ?? 0

      mesh.rotation.x += delta * 0.12
      mesh.rotation.y += delta * 0.18 + scroll * 0.006
      mesh.rotation.z = scroll * 0.4
      mesh.position.y = -scroll * 1.4

      const targetScale = 1 - scroll * 0.18
      scale += (targetScale - scale) * 0.08
      mesh.scale.setScalar(scale)

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [scrollRef])

  return <div ref={containerRef} className="h-full w-full" aria-hidden="true" />
}
