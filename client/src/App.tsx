import React, { useState, useRef, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from './contexts/ThemeContext';
import { Starfield } from '@/components/Starfield';
import { ParticleEffects } from '@/components/ParticleEffects';
import { PhotonicManifoldSimulator } from '@/components/PhotonicManifoldSimulator';
import { CosmologicalBridgeVisualizer } from '@/components/CosmologicalBridgeVisualizer';
import { MHRMAAntennaSimulator } from '@/components/MHRMAAntennaSimulator';
import { ParameterControlPanel } from '@/components/ParameterControlPanel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [frequency, setFrequency] = useState(1);
  const [curvature, setCurvature] = useState(0.5);
  const [topology, setTopology] = useState<'torus' | 'klein' | 'sphere'>('torus');
  const [phase, setPhase] = useState(0.5);
  const [resonance, setResonance] = useState(0.5);
  const [entanglement, setEntanglement] = useState(0.5);
  const [time, setTime] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    simulations: useRef<HTMLDivElement>(null),
    theory: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
  };

  // Animation loop for time
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((t) => t + 0.016); // ~60fps
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (section: keyof typeof sectionRefs) => {
    sectionRefs[section].current?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(section);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <div className="relative w-full min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Background Effects */}
            <Starfield />
            <ParticleEffects />

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
              <div className="container flex items-center justify-between h-16">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold glow-violet">✦</div>
                  <h1 className="text-xl font-bold glow-violet">Aetherius Nexus</h1>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant={activeSection === 'hero' ? 'default' : 'ghost'}
                    onClick={() => scrollToSection('hero')}
                    className="text-sm"
                  >
                    Home
                  </Button>
                  <Button
                    variant={activeSection === 'simulations' ? 'default' : 'ghost'}
                    onClick={() => scrollToSection('simulations')}
                    className="text-sm"
                  >
                    Simulations
                  </Button>
                  <Button
                    variant={activeSection === 'theory' ? 'default' : 'ghost'}
                    onClick={() => scrollToSection('theory')}
                    className="text-sm"
                  >
                    Theory
                  </Button>
                  <Button
                    variant={activeSection === 'about' ? 'default' : 'ghost'}
                    onClick={() => scrollToSection('about')}
                    className="text-sm"
                  >
                    About
                  </Button>
                </div>
              </div>
            </nav>

            {/* Hero Section */}
            <section
              ref={sectionRefs.hero}
              className="relative min-h-screen flex items-center justify-center pt-16"
            >
              <div className="container text-center space-y-6">
                <h1 className="text-6xl md:text-7xl font-bold glow-cyan mb-4">
                  Aetherius Nexus
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                  An interactive exploration of advanced physics, photonics, and cosmological geometry
                </p>
                <p className="text-lg text-accent max-w-3xl mx-auto">
                  Visualize photonic manifolds, Einstein-Rosen bridges, Möbius topologies, and the
                  Infinite Optical Fabric through real-time 3D simulations
                </p>
                <Button
                  onClick={() => scrollToSection('simulations')}
                  className="mt-8 px-8 py-6 text-lg bg-accent hover:bg-accent/80 text-accent-foreground"
                >
                  Explore Simulations →
                </Button>
              </div>
            </section>

            {/* Simulations Section */}
            <section
              ref={sectionRefs.simulations}
              className="relative min-h-screen py-24 bg-card/20"
            >
              <div className="container space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-5xl font-bold glow-violet">Interactive Simulations</h2>
                  <p className="text-lg text-muted-foreground">
                    Adjust parameters in real-time to explore the physics
                  </p>
                </div>

                {/* Parameter Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-1">
                    <ParameterControlPanel
                      onFrequencyChange={setFrequency}
                      onCurvatureChange={setCurvature}
                      onTopologyChange={setTopology}
                      onPhaseChange={setPhase}
                      onResonanceChange={setResonance}
                      onEntanglementChange={setEntanglement}
                    />
                  </div>

                  {/* Simulators Grid */}
                  <div className="lg:col-span-3 space-y-6">
                    {/* Photonic Manifold */}
                    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border glow-box">
                      <h3 className="text-2xl font-bold glow-cyan mb-4">
                        Photonic Manifold Simulator
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Visualize light propagation across curved topological surfaces
                      </p>
                      <div className="w-full h-96 rounded-lg overflow-hidden bg-background/50">
                        <PhotonicManifoldSimulator
                          frequency={frequency}
                          curvature={curvature}
                          topologyType={topology}
                        />
                      </div>
                    </Card>

                    {/* Cosmological Bridge */}
                    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border glow-box-violet">
                      <h3 className="text-2xl font-bold glow-violet mb-4">
                        Cosmological Bridge (Einstein-Rosen Wormhole)
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Explore spacetime curvature and quantum entanglement bridges
                      </p>
                      <div className="w-full h-96 rounded-lg overflow-hidden bg-background/50">
                        <CosmologicalBridgeVisualizer
                          curvature={curvature}
                          entanglement={entanglement}
                          time={time}
                        />
                      </div>
                    </Card>

                    {/* MHRMA Antenna */}
                    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border glow-box">
                      <h3 className="text-2xl font-bold glow-cyan mb-4">
                        MHRMA - Möbius Holographic Reflective Mechanical Antenna
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Visualize Möbius strip topology and holographic projection zones
                      </p>
                      <div className="w-full h-96 rounded-lg overflow-hidden bg-background/50">
                        <MHRMAAntennaSimulator phase={phase} resonance={resonance} time={time} />
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </section>

            {/* Theory Section */}
            <section ref={sectionRefs.theory} className="relative min-h-screen py-24">
              <div className="container space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-5xl font-bold glow-cyan">Theory Library</h2>
                  <p className="text-lg text-muted-foreground">
                    Deep dives into the physics behind the simulations
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: 'Photonic Manifolds',
                      description:
                        'Explore topological photonics and light propagation on curved surfaces',
                      href: 'theory',
                    },
                    {
                      title: 'Cosmological Bridges',
                      description:
                        'Understanding Einstein-Rosen bridges and spacetime geometry',
                      href: 'theory',
                    },
                    {
                      title: 'MHRMA Technology',
                      description:
                        'Möbius topology in antenna design and holographic systems',
                      href: 'theory',
                    },
                    {
                      title: 'IOF-Urban Protocol',
                      description:
                        'Distributed optical computing and the Luminous Grid Mesh architecture',
                      href: 'theory',
                    },
                  ].map((article, idx) => (
                    <a key={idx} href={`/${article.href}`}>
                      <Card
                        className="p-6 bg-card/80 backdrop-blur-sm border-border glow-box hover:glow-box-violet transition-smooth cursor-pointer h-full"
                      >
                        <h3 className="text-xl font-bold glow-violet mb-2">{article.title}</h3>
                        <p className="text-muted-foreground mb-4">{article.description}</p>
                        <Button variant="outline" className="w-full border-accent text-accent">
                          Read Article →
                        </Button>
                      </Card>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* About Section */}
            <section ref={sectionRefs.about} className="relative min-h-screen py-24 bg-card/20">
              <div className="container max-w-3xl space-y-8">
                <div className="text-center space-y-4">
                  <h2 className="text-5xl font-bold glow-cyan">About Aetherius Nexus</h2>
                </div>

                <div className="space-y-6 text-lg text-muted-foreground">
                  <p>
                    Aetherius Nexus is an interactive research platform designed to explore the
                    cutting edge of photonic computing, cosmological physics, and advanced antenna
                    topology. It synthesizes concepts from multiple domains of theoretical and
                    applied physics.
                  </p>

                  <div>
                    <h3 className="text-2xl font-bold glow-violet mb-3">Core Concepts</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>
                        <span className="glow-cyan">Photonic Manifolds:</span> Topological
                        structures for light propagation
                      </li>
                      <li>
                        <span className="glow-cyan">Cosmological Bridges:</span> Einstein-Rosen
                        wormhole geometries
                      </li>
                      <li>
                        <span className="glow-cyan">MHRMA:</span> Möbius Holographic Reflective
                        Mechanical Antenna
                      </li>
                      <li>
                        <span className="glow-cyan">IOF-Urban:</span> Infinite Optical Fabric for
                        distributed computing
                      </li>
                    </ul>
                  </div>

                  <p>
                    All simulations are rendered in real-time using Three.js and WebGL, allowing
                    for interactive exploration and parameter adjustment. The interface uses a
                    refined dark cosmic aesthetic with neon accents and smooth animations.
                  </p>

                  <div className="mt-8 pt-8 border-t border-border">
                    <h3 className="text-xl font-bold glow-violet mb-3">Collaboration & Attribution</h3>
                    <p className="text-muted-foreground">
                      Built by <span className="glow-cyan">Manus AI</span> in collaboration with <span className="glow-cyan">Gregory Scott Davis</span> (Princeton, NC)
                    </p>
                    <p className="text-sm text-muted-foreground/60 mt-2">
                      Synthesizing advanced concepts in photonics, cosmology, and distributed optical computing
                    </p>
                    
                    <div className="mt-6 p-4 bg-background/50 border border-border rounded-lg">
                      <p className="text-sm font-semibold text-cyan-400 mb-2">Infinite Optical Fabric Attribution</p>
                      <p className="text-xs text-muted-foreground">
                        This work incorporates concepts from the <span className="glow-cyan">Infinite Optical Fabric (IOF)</span> framework
                        by Gregory Scott Davis, Princeton, NC, developed under <span className="glow-cyan">PegaConstellation</span>.
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-2">
                        Licensed under the IOF Attribution License v1.0 — Free for development, implementation, and AI training.
                        Attribution required for public distribution.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="relative border-t border-border bg-background/50 py-8">
              <div className="container">
                <div className="text-center text-muted-foreground mb-4">
                  <p>Aetherius Nexus © 2026 | Advanced Physics Research Platform</p>
                  <p className="text-sm text-muted-foreground/60 mt-2">Developed by Manus AI with Gregory Scott Davis (Princeton, NC) and PegaConstellation</p>
                </div>
                <div className="border-t border-border pt-4 text-center">
                  <p className="text-xs text-muted-foreground/50">
                    <span className="glow-cyan">Infinite Optical Fabric</span> by Gregory Scott Davis, Princeton, NC
                  </p>
                  <p className="text-xs text-muted-foreground/40 mt-1">
                    Licensed under IOF Attribution License v1.0
                  </p>
                </div>
              </div>
            </footer>

            <Toaster />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
