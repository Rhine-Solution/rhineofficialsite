import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useAdaptiveQuality } from '../hooks/useDeviceCapabilities';

interface OptimizedParticlesProps {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
}

export default function OptimizedParticles({ 
  count = 5000, 
  color = '#0082D8',
  size = 2,
  speed = 1 
}: OptimizedParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationRef = useRef<number>(0);
  const { getParticleCount, gpuTier } = useAdaptiveQuality();

  const actualCount = useMemo(() => getParticleCount(count), [getParticleCount, count]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: gpuTier !== 'low',
      powerPreference: gpuTier === 'high' ? 'high-performance' : 'low-power'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, gpuTier === 'low' ? 1 : 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(actualCount * 3);
    const velocities = new Float32Array(actualCount * 3);

    for (let i = 0; i < actualCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      velocities[i * 3] = (Math.random() - 0.5) * 0.02 * speed;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02 * speed;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02 * speed;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.userData = { velocities };

    const material = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: size * (gpuTier === 'low' ? 0.5 : 1),
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);

      const positions = geometry.attributes.position.array as Float32Array;
      const velocities = geometry.userData.velocities as Float32Array;

      for (let i = 0; i < actualCount; i++) {
        positions[i * 3] += velocities[i * 3];
        positions[i * 3 + 1] += velocities[i * 3 + 1];
        positions[i * 3 + 2] += velocities[i * 3 + 2];

        if (Math.abs(positions[i * 3]) > 30) velocities[i * 3] *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 30) velocities[i * 3 + 1] *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 30) velocities[i * 3 + 2] *= -1;
      }

      geometry.attributes.position.needsUpdate = true;
      particles.rotation.y += 0.0005 * speed;
      particles.rotation.x += 0.0002 * speed;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
        geometry.dispose();
        material.dispose();
        rendererRef.current.dispose();
      }
    };
  }, [actualCount, color, size, speed, gpuTier]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}