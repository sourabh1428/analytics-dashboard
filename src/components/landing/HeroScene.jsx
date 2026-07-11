'use client'
/* eslint-disable react/no-unknown-property -- react-three-fiber JSX intrinsics (mesh, ambientLight, args, …) aren't real DOM props */

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'

// scrollRef is a plain mutable ref (not state) so scroll updates never
// trigger a React re-render — only the WebGL frame loop reads it.
function DistortedIcosahedron({ scrollRef }) {
  const meshRef = useRef(null)

  useFrame((state, delta) => {
    const mesh = meshRef.current
    if (!mesh) return
    const scroll = scrollRef.current ?? 0
    mesh.rotation.x += delta * 0.12
    mesh.rotation.y += delta * 0.18 + scroll * 0.006
    mesh.rotation.z = scroll * 0.4
    mesh.position.y = -scroll * 1.4
    const targetScale = 1 - scroll * 0.18
    mesh.scale.setScalar(mesh.scale.x + (targetScale - mesh.scale.x) * 0.08)
  })

  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.6, 4]} />
        <MeshDistortMaterial
          color="#F59E0B"
          emissive="#78350F"
          emissiveIntensity={0.25}
          roughness={0.15}
          metalness={0.4}
          distort={0.35}
          speed={1.8}
          wireframe
        />
      </mesh>
    </Float>
  )
}

export default function HeroScene({ scrollRef }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={1.1} color="#F59E0B" />
      <pointLight position={[-4, -2, -3]} intensity={0.4} color="#8B5CF6" />
      <DistortedIcosahedron scrollRef={scrollRef} />
    </Canvas>
  )
}
