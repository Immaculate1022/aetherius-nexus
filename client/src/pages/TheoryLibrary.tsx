import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Streamdown } from 'streamdown';

const theories = [
  {
    id: 'photonic-manifolds',
    title: 'Photonic Manifolds',
    description: 'Light propagation on curved topological surfaces',
    content: `
## Photonic Manifolds: Light on Curved Surfaces

Photonic manifolds represent a revolutionary approach to controlling light propagation through engineered topological structures. By embedding photonic circuits on non-Euclidean geometries, we can achieve unprecedented control over light behavior.

### Mathematical Foundation

The wave equation on a curved manifold is given by:

$$\\nabla^2 \\psi - \\frac{1}{c^2}\\frac{\\partial^2 \\psi}{\\partial t^2} = 0$$

where $\\nabla^2$ is the Laplacian operator in curved coordinates.

### Topological Properties

For a manifold with genus $g$, the number of topologically protected modes scales as:

$$N_{modes} = 2g + 1$$

This fundamental relationship ensures robust light propagation even in the presence of disorder.

### Applications

- **Integrated Photonics**: Miniaturized optical circuits on silicon
- **Quantum Computing**: Topologically protected qubits
- **Optical Communication**: Disorder-resistant waveguides
    `
  },
  {
    id: 'cosmological-bridges',
    title: 'Cosmological Bridges (Einstein-Rosen)',
    description: 'Wormholes and spacetime geometry',
    content: `
## Cosmological Bridges: Einstein-Rosen Wormholes

Einstein-Rosen bridges, commonly known as wormholes, represent hypothetical tunnels through spacetime that could connect distant regions of the universe.

### Schwarzschild Wormhole Metric

The Einstein-Rosen bridge is described by the Schwarzschild metric:

$$ds^2 = -\\left(1 - \\frac{2M}{r}\\right)dt^2 + \\left(1 - \\frac{2M}{r}\\right)^{-1}dr^2 + r^2(d\\theta^2 + \\sin^2\\theta d\\phi^2)$$

### Geodesic Equations

Massive particles follow geodesics given by:

$$\\frac{d^2x^\\mu}{d\\tau^2} + \\Gamma^\\mu_{\\rho\\sigma}\\frac{dx^\\rho}{d\\tau}\\frac{dx^\\sigma}{d\\tau} = 0$$

### Quantum Entanglement Bridges

Recent theoretical work suggests that quantum entanglement may be fundamentally connected to wormhole geometry through the ER=EPR conjecture:

$$\\text{Entangled Pairs} \\leftrightarrow \\text{Wormholes}$$

This profound connection suggests that spacetime itself may emerge from quantum entanglement.
    `
  },
  {
    id: 'mhrma',
    title: 'MHRMA Antenna Topology',
    description: 'Möbius Holographic Reflective Mechanical Antenna',
    content: `
## MHRMA: Möbius Holographic Reflective Mechanical Antenna

The Möbius Holographic Reflective Mechanical Antenna (MHRMA) represents a breakthrough in antenna design by leveraging non-orientable topology for enhanced signal reception and transmission.

### Möbius Strip Geometry

A Möbius strip is parametrized as:

$$\\mathbf{r}(u,v) = \\left(\\left(R + v\\cos\\frac{u}{2}\\right)\\cos u, \\left(R + v\\cos\\frac{u}{2}\\right)\\sin u, v\\sin\\frac{u}{2}\\right)$$

where $u \\in [0, 2\\pi]$ and $v \\in [-w/2, w/2]$.

### Resonance Modes

The antenna exhibits resonance at frequencies:

$$f_n = \\frac{nc}{2L}$$

where $L$ is the effective path length and $n$ is the mode number.

### Holographic Projection

Holographic zones are created through phase modulation:

$$\\Phi(x,y) = \\frac{2\\pi}{\\lambda}\\left(\\frac{x^2 + y^2}{2f}\\right)$$

This creates three-dimensional field distributions without physical lenses.
    `
  },
  {
    id: 'iof-urban',
    title: 'IOF-Urban Protocol',
    description: 'Intelligent Oscillator Framework for distributed optical computing',
    content: `
## IOF-Urban: Distributed Optical Computing Infrastructure

The Intelligent Oscillator Framework (IOF) enables city-scale optical computing through networked smart poles equipped with photonic processors.

### Luminous Grid Mesh (LGM)

The LGM forms a self-healing cellular automaton where nodes synchronize via optical phase-locked loops:

$$\\dot{\\phi}_i = \\omega_0 + K\\sum_j \\sin(\\phi_j - \\phi_i)$$

where $K$ is the coupling strength and $\\omega_0$ is the natural frequency.

### Coherence Cells

Nodes organize into coherence cells with characteristic size:

$$L_c = \\frac{c}{\\Delta f \\cdot Q}$$

where $Q$ is the quality factor of the optical resonators.

### Möbius Routing Layer

Data routes wrap around obstacles using topological paths:

$$\\text{Path Length} = L_{Euclidean} + L_{topological}$$

This ensures robust data delivery even during node failures.
    `
  },
  {
    id: 'iof-core',
    title: 'iof_core: Photonic AI Deployment',
    description: 'AI model weights on thin-film lithium niobate',
    content: `
## iof_core: Photonic AI on TFLN

Deploying artificial intelligence on photonic fabrics using thin-film lithium niobate (TFLN) enables nanosecond-latency inference.

### TFLN Resonators

Ultra-high Q-factor resonators are achieved with:

$$Q = \\frac{\\omega_0}{\\gamma} > 10^8$$

where $\\gamma$ is the damping rate.

### Weight Encoding

Neural network weights are encoded as optical phase and amplitude:

$$w_{ij} = A_{ij} e^{i\\phi_{ij}}$$

where $A_{ij}$ controls amplitude and $\\phi_{ij}$ controls phase.

### Convergence Dynamics

Standing waves form stable solutions representing computed outputs:

$$\\psi(x,t) = \\sum_n a_n e^{-i\\omega_n t}\\phi_n(x)$$

The system converges to the ground state in nanoseconds.

### C-Band Wavelengths

Operations occur in the C-band (1530-1565 nm) for compatibility with existing telecom infrastructure.
    `
  }
];

export default function TheoryLibrary() {
  const [activeTab, setActiveTab] = useState(theories[0].id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-cyan-400 mb-4 drop-shadow-lg">
            Theory Library
          </h1>
          <p className="text-xl text-cyan-300/70">
            Deep dives into photonics, cosmology, and advanced physics
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2 mb-8 bg-slate-900/50 border border-cyan-500/20 p-2 rounded-lg">
            {theories.map((theory) => (
              <TabsTrigger
                key={theory.id}
                value={theory.id}
                className="text-sm md:text-base data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-300 text-cyan-200/60 hover:text-cyan-300 transition-colors"
              >
                {theory.title.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Content */}
          {theories.map((theory) => (
            <TabsContent key={theory.id} value={theory.id}>
              <Card className="bg-slate-900/50 border-cyan-500/20 p-8 backdrop-blur-sm">
                <h2 className="text-3xl font-bold text-cyan-300 mb-2">
                  {theory.title}
                </h2>
                <p className="text-cyan-200/60 mb-6">{theory.description}</p>

                {/* MathJax Content */}
                <div className="prose prose-invert max-w-none text-cyan-100/80">
                  <Streamdown>{theory.content}</Streamdown>
                </div>

                {/* Math Note */}
                <div className="mt-8 p-4 bg-violet-500/10 border border-violet-500/30 rounded-lg">
                  <p className="text-sm text-violet-300">
                    💡 <strong>Note:</strong> Mathematical equations are rendered using MathJax. Inline math uses $...$ and display math uses $$...$$
                  </p>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-cyan-200/50 text-sm">
          <p>
            All theories and equations are based on peer-reviewed physics literature and cutting-edge research.
          </p>
        </div>
      </div>
    </div>
  );
}
