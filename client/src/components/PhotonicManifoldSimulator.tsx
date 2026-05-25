import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface PhotonicManifoldProps {
  frequency: number;
  curvature: number;
  topologyType: 'torus' | 'klein' | 'sphere';
}

export const PhotonicManifoldSimulator: React.FC<PhotonicManifoldProps> = ({
  frequency,
  curvature,
  topologyType,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const lightWavesRef = useRef<THREE.Points | null>(null);
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
    const ambientLight = new THREE.AmbientLight(0x00d9ff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xb700ff, 0.8);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Create manifold geometry
    const createManifoldGeometry = (type: string, detail: number): THREE.BufferGeometry => {
      if (type === 'torus') {
        return new THREE.TorusGeometry(1, 0.4, detail, detail);
      } else if (type === 'klein') {
        // Klein bottle approximation
        return new THREE.TorusGeometry(1, 0.5, detail, detail);
      } else {
        return new THREE.IcosahedronGeometry(1, detail);
      }
    };

    const geometry = createManifoldGeometry(topologyType, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00d9ff,
      emissive: 0x00d9ff,
      emissiveIntensity: 0.3,
      wireframe: false,
      shininess: 100,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    meshRef.current = mesh;

    // Create light wave particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = Math.floor(frequency * 50);
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00d9ff,
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    });

    const lightWaves = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(lightWaves);
    lightWavesRef.current = lightWaves;

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.01;

      // Rotate manifold based on frequency
      if (meshRef.current) {
        meshRef.current.rotation.x += frequency * 0.001;
        meshRef.current.rotation.y += frequency * 0.0015;

        // Apply curvature deformation
        const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;
        const positions = positionAttribute.array as Float32Array;

        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i];
          const y = positions[i + 1];
          const z = positions[i + 2];

          const distance = Math.sqrt(x * x + y * y + z * z);
          const deformation = Math.sin(time + distance * curvature) * 0.1;

          positions[i] = x * (1 + deformation);
          positions[i + 1] = y * (1 + deformation);
          positions[i + 2] = z * (1 + deformation);
        }

        positionAttribute.needsUpdate = true;
      }

      // Animate light waves
      if (lightWavesRef.current) {
        lightWavesRef.current.rotation.x += frequency * 0.0005;
        lightWavesRef.current.rotation.y += frequency * 0.0008;

        const positionAttribute = lightWavesRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
        const positions = positionAttribute.array as Float32Array;

        for (let i = 0; i < positions.length; i += 3) {
          const x = positions[i];
          const y = positions[i + 1];
          const z = positions[i + 2];

          const distance = Math.sqrt(x * x + y * y + z * z);
          const wave = Math.sin(time * frequency * 0.1 + distance) * 0.1;

          positions[i] = x + wave;
          positions[i + 1] = y + wave;
          positions[i + 2] = z + wave;
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
      geometry.dispose();
      material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [topologyType]);

  // Update on parameter changes
  useEffect(() => {
    if (!meshRef.current || !lightWavesRef.current) return;

    const material = meshRef.current.material as THREE.MeshPhongMaterial;
    material.emissiveIntensity = 0.2 + frequency * 0.01;

    const particleMaterial = lightWavesRef.current.material as THREE.PointsMaterial;
    particleMaterial.size = 0.05 + frequency * 0.001;
  }, [frequency, curvature]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-lg overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  );
};
