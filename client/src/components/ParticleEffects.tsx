import React, { useEffect, useRef } from 'react';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: 'cyan' | 'violet' | 'white';
}

export const ParticleEffects: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Map<string, Particle>>(new Map());
  const animationRef = useRef<number | undefined>();
  const nextIdRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Emit particles from random positions
    const emitParticles = () => {
      const particleCount = Math.random() * 3 + 1;

      for (let i = 0; i < particleCount; i++) {
        const id = `particle-${nextIdRef.current++}`;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        const colors: Array<'cyan' | 'violet' | 'white'> = ['cyan', 'violet', 'white'];
        const color = colors[Math.floor(Math.random() * colors.length)];

        const particle: Particle = {
          id,
          x,
          y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: 1,
          maxLife: Math.random() * 3 + 2,
          size: Math.random() * 2 + 1,
          color,
        };

        particlesRef.current.set(id, particle);

        // Create DOM element
        const el = document.createElement('div');
        el.id = id;
        el.className = 'particle particle-glow';
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.width = `${particle.size}px`;
        el.style.height = `${particle.size}px`;
        el.style.borderRadius = '50%';
        el.style.position = 'fixed';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '1';

        const colorMap = {
          cyan: 'rgba(0, 217, 255, 0.6)',
          violet: 'rgba(183, 0, 255, 0.6)',
          white: 'rgba(255, 255, 255, 0.4)',
        };

        el.style.backgroundColor = colorMap[color];
        el.style.boxShadow = `0 0 ${particle.size * 2}px ${colorMap[color]}`;

        container.appendChild(el);
      }
    };

    // Animation loop
    const animate = () => {
      const now = Date.now();

      particlesRef.current.forEach((particle, id) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // Gravity
        particle.life -= 0.01;

        const el = document.getElementById(id);
        if (el) {
          el.style.left = `${particle.x}px`;
          el.style.top = `${particle.y}px`;
          el.style.opacity = `${Math.max(0, particle.life / particle.maxLife)}`;
        }

        if (particle.life <= 0) {
          if (el) {
            el.remove();
          }
          particlesRef.current.delete(id);
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // Emit particles periodically
    const emitInterval = setInterval(emitParticles, 500);

    // Start animation
    animate();

    return () => {
      clearInterval(emitInterval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Clean up remaining particles
      particlesRef.current.forEach((_, id) => {
        const el = document.getElementById(id);
        if (el) {
          el.remove();
        }
      });
      particlesRef.current.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};
