import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface MHRMAAntennaProps {
  phase: number;
  resonance: number;
  time: number;
}

export const MHRMAAntennaSimulator: React.FC<MHRMAAntennaProps> = ({
  phase,
  resonance,
  time,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mobiusRef = useRef<THREE.Mesh | null>(null);
  const resonanceModeRef = useRef<THREE.Points | null>(null);
  const animationRef = useRef<number | undefined>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xb700ff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00d9ff, 0.8);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);

    // Create Möbius strip geometry
    const createMobiusGeometry = (): THREE.BufferGeometry => {
      const geometry = new THREE.BufferGeometry();
      const positions: number[] = [];
      const indices: number[] = [];

      const segments = 128;
      const rings = 32;
      const radius = 1;
      const width = 0.5;

      for (let i = 0; i <= rings; i++) {
        const u = (i / rings) * Math.PI * 2;
        const halfU = u / 2;

        for (let j = 0; j <= segments; j++) {
          const v = (j / segments) * 2 - 1;

          const x = (radius + v * width * Math.cos(halfU)) * Math.cos(u);
          const y = (radius + v * width * Math.cos(halfU)) * Math.sin(u);
          const z = v * width * Math.sin(halfU);

          positions.push(x, y, z);
        }
      }

      for (let i = 0; i < rings; i++) {
        for (let j = 0; j < segments; j++) {
          const a = i * (segments + 1) + j;
          const b = a + segments + 1;

          indices.push(a, b, a + 1);
          indices.push(a + 1, b, b + 1);
        }
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
      geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));
      geometry.computeVertexNormals();

      return geometry;
    };

    const mobiusGeometry = createMobiusGeometry();
    const mobiusMaterial = new THREE.MeshPhongMaterial({
      color: 0xb700ff,
      emissive: 0xb700ff,
      emissiveIntensity: 0.3,
      wireframe: false,
      side: THREE.DoubleSide,
      shininess: 100,
    });

    const mobius = new THREE.Mesh(mobiusGeometry, mobiusMaterial);
    scene.add(mobius);
    mobiusRef.current = mobius;

    // Create holographic projection zones (resonance modes)
    const createResonanceModes = () => {
      const geometry = new THREE.BufferGeometry();
      const particleCount = 512;
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.5 + Math.random() * 1.5;
        const z = (Math.random() - 0.5) * 2;

        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius;
        positions[i * 3 + 2] = z;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const particleMaterial = new THREE.PointsMaterial({
        color: 0x00d9ff,
        size: 0.06,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.5,
      });

      const particles = new THREE.Points(geometry, particleMaterial);
      scene.add(particles);
      resonanceModeRef.current = particles;
    };

    createResonanceModes();

    // Animation loop
    let frameCount = 0;
    const animate = () => {
      frameCount++;

      // Rotate Möbius strip based on phase
      if (mobiusRef.current) {
        mobiusRef.current.rotation.x += phase * 0.001;
        mobiusRef.current.rotation.y += phase * 0.0015;
        mobiusRef.current.rotation.z += phase * 0.0005;

        // Scale based on resonance
        const scale = 1 + Math.sin(frameCount * 0.02 + resonance) * 0.15;
        mobiusRef.current.scale.set(scale, scale, scale);
      }

      // Animate resonance modes
      if (resonanceModeRef.current) {
        const positionAttribute = resonanceModeRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
        const positions = positionAttribute.array as Float32Array;

        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i];
          const y = positions[i + 1];
          const z = positions[i + 2];

          const distance = Math.sqrt(x * x + y * y);
          const wave = Math.sin(frameCount * 0.01 * resonance + distance * phase) * 0.08;

          positions[i] = x * (1 + wave);
          positions[i + 1] = y * (1 + wave);
          positions[i + 2] = z + Math.sin(frameCount * 0.005 + phase) * 0.03;
        }

        positionAttribute.needsUpdate = true;

        // Rotate holographic zone
        resonanceModeRef.current.rotation.z += resonance * 0.001;
      }

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      renderer.dispose();
      mobiusGeometry.dispose();
      mobiusMaterial.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  );
};
