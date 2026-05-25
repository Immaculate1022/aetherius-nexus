import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CosmologicalBridgeProps {
  curvature: number;
  entanglement: number;
  time: number;
}

export const CosmologicalBridgeVisualizer: React.FC<CosmologicalBridgeProps> = ({
  curvature,
  entanglement,
  time,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const wormholeRef = useRef<THREE.Mesh | null>(null);
  const geodesicsRef = useRef<THREE.LineSegments | null>(null);
  const entanglementParticlesRef = useRef<THREE.Points | null>(null);
  const animationRef = useRef<number>();

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
    camera.position.z = 4;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xb700ff, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00d9ff, 0.6);
    pointLight1.position.set(-5, 0, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xb700ff, 0.6);
    pointLight2.position.set(5, 0, 0);
    scene.add(pointLight2);

    // Create wormhole tunnel geometry
    const createWormholeGeometry = (): THREE.BufferGeometry => {
      const geometry = new THREE.BufferGeometry();
      const positions: number[] = [];
      const indices: number[] = [];

      const segments = 64;
      const rings = 32;
      const radius = 1;

      for (let i = 0; i <= rings; i++) {
        const z = (i / rings) * 4 - 2;
        const ringRadius = radius * (1 + Math.sin(z * Math.PI) * 0.3);

        for (let j = 0; j <= segments; j++) {
          const angle = (j / segments) * Math.PI * 2;
          const x = Math.cos(angle) * ringRadius;
          const y = Math.sin(angle) * ringRadius;

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

    const wormholeGeometry = createWormholeGeometry();
    const wormholeMaterial = new THREE.MeshPhongMaterial({
      color: 0x00d9ff,
      emissive: 0x00d9ff,
      emissiveIntensity: 0.2,
      wireframe: false,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      shininess: 100,
    });

    const wormhole = new THREE.Mesh(wormholeGeometry, wormholeMaterial);
    scene.add(wormhole);
    wormholeRef.current = wormhole;

    // Create geodesic paths
    const createGeodesics = () => {
      const geometry = new THREE.BufferGeometry();
      const positions: number[] = [];

      const pathCount = 12;
      const pointsPerPath = 64;

      for (let p = 0; p < pathCount; p++) {
        const angle = (p / pathCount) * Math.PI * 2;

        for (let i = 0; i < pointsPerPath; i++) {
          const t = i / pointsPerPath;
          const z = t * 4 - 2;
          const ringRadius = 1 * (1 + Math.sin(z * Math.PI) * 0.3);
          const pathRadius = ringRadius * 0.8;

          const x = Math.cos(angle) * pathRadius;
          const y = Math.sin(angle) * pathRadius;

          positions.push(x, y, z);
        }
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));

      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xb700ff,
        transparent: true,
        opacity: 0.4,
        linewidth: 2,
      });

      const lines = new THREE.LineSegments(geometry, lineMaterial);
      scene.add(lines);
      geodesicsRef.current = lines;
    };

    createGeodesics();

    // Create entanglement particles
    const createEntanglementParticles = () => {
      const geometry = new THREE.BufferGeometry();
      const particleCount = 256;
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const z = Math.random() * 4 - 2;
        const ringRadius = 1 * (1 + Math.sin(z * Math.PI) * 0.3);

        positions[i * 3] = Math.cos(angle) * ringRadius;
        positions[i * 3 + 1] = Math.sin(angle) * ringRadius;
        positions[i * 3 + 2] = z;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const particleMaterial = new THREE.PointsMaterial({
        color: 0x00d9ff,
        size: 0.08,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.7,
      });

      const particles = new THREE.Points(geometry, particleMaterial);
      scene.add(particles);
      entanglementParticlesRef.current = particles;
    };

    createEntanglementParticles();

    // Animation loop
    let frameCount = 0;
    const animate = () => {
      frameCount++;

      // Rotate wormhole based on curvature
      if (wormholeRef.current) {
        wormholeRef.current.rotation.x += curvature * 0.001;
        wormholeRef.current.rotation.y += curvature * 0.0015;

        // Pulsate wormhole based on entanglement
        const scale = 1 + Math.sin(frameCount * 0.02 + entanglement) * 0.1;
        wormholeRef.current.scale.set(scale, scale, scale);
      }

      // Animate geodesics
      if (geodesicsRef.current) {
        geodesicsRef.current.rotation.z += 0.001;
      }

      // Animate entanglement particles
      if (entanglementParticlesRef.current) {
        const positionAttribute = entanglementParticlesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
        const positions = positionAttribute.array as Float32Array;

        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i];
          const y = positions[i + 1];
          const z = positions[i + 2];

          const distance = Math.sqrt(x * x + y * y);
          const wave = Math.sin(frameCount * 0.01 + distance * entanglement) * 0.05;

          positions[i] = x + wave;
          positions[i + 1] = y + wave;
          positions[i + 2] = z + Math.sin(frameCount * 0.005) * 0.02;
        }

        positionAttribute.needsUpdate = true;
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
      wormholeGeometry.dispose();
      wormholeMaterial.dispose();
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
