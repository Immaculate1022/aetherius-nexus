import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Streamdown } from 'streamdown';
import { Send, Loader2, Zap } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  'What is the relationship between photonic manifolds and topological insulators?',
  'How do Einstein-Rosen bridges connect to quantum entanglement?',
  'Explain the resonance modes in MHRMA antenna design',
  'What are the advantages of TFLN for photonic AI deployment?',
  'How does the IOF-Urban protocol achieve self-healing?',
];

export default function ResearchAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Welcome to the Aetherius Nexus Research Assistant! 🌌

I'm here to help you understand the advanced physics concepts powering our simulations. Ask me anything about:
- **Photonic Manifolds** — Light propagation on curved surfaces
- **Cosmological Bridges** — Einstein-Rosen wormholes and spacetime geometry
- **MHRMA Antenna** — Möbius topology for signal processing
- **IOF-Urban Protocol** — Distributed optical computing
- **Photonic AI** — Neural networks on TFLN substrates

Feel free to ask follow-up questions or request explanations of specific concepts!`,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in production, this would call the LLM via tRPC)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(text),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateResponse = (question: string): string => {
    const lowerQ = question.toLowerCase();

    if (
      lowerQ.includes('photonic') &&
      lowerQ.includes('manifold')
    ) {
      return `## Photonic Manifolds Explained

Photonic manifolds are engineered structures where light propagates on curved, non-Euclidean surfaces. This is fascinating because:

**Key Properties:**
- Light follows geodesic paths on the manifold surface
- Topological protection prevents scattering from defects
- The genus (number of holes) determines the number of protected modes

**Mathematical Description:**
The wave equation on a curved manifold becomes:
$$\\nabla^2 \\psi - \\frac{1}{c^2}\\frac{\\partial^2 \\psi}{\\partial t^2} = 0$$

**Applications:**
- Integrated photonic circuits with enhanced robustness
- Topologically protected quantum states
- Disorder-resistant optical waveguides

Would you like me to explain the connection to topological insulators or dive deeper into the mathematics?`;
    }

    if (lowerQ.includes('einstein') || lowerQ.includes('wormhole')) {
      return `## Einstein-Rosen Bridges & Quantum Entanglement

The connection between wormholes and quantum entanglement is one of the most profound discoveries in theoretical physics!

**ER=EPR Conjecture:**
- **ER** = Einstein-Rosen (wormholes)
- **EPR** = Einstein-Podolsky-Rosen (entanglement)
- The conjecture suggests these are two sides of the same phenomenon

**Spacetime Geometry:**
Wormholes are described by the Schwarzschild metric, which allows geodesics to connect distant regions through a tunnel in spacetime.

**Quantum Implications:**
- Entangled particles may be connected through microscopic wormholes
- This could explain "spooky action at a distance"
- Spacetime itself may emerge from quantum entanglement

This is still highly theoretical, but it opens fascinating possibilities for understanding the nature of reality!

What aspect interests you most?`;
    }

    if (lowerQ.includes('mhrma') || lowerQ.includes('möbius')) {
      return `## MHRMA: Möbius Antenna Design

The Möbius Holographic Reflective Mechanical Antenna is a breakthrough in signal processing!

**Why Möbius?**
- Non-orientable topology creates unique electromagnetic properties
- Single-sided surface allows signal to wrap around without crossing
- Resonance modes are naturally protected by topology

**Resonance Formula:**
$$f_n = \\frac{nc}{2L}$$

where $n$ is the mode number and $L$ is the effective path length.

**Holographic Projection:**
Phase modulation creates 3D field distributions:
$$\\Phi(x,y) = \\frac{2\\pi}{\\lambda}\\left(\\frac{x^2 + y^2}{2f}\\right)$$

**Practical Advantages:**
- Compact design with high gain
- Reduced interference and crosstalk
- Mechanical resonance damping

Fascinating stuff! Do you want to know about the manufacturing challenges?`;
    }

    if (lowerQ.includes('iof') || lowerQ.includes('optical')) {
      return `## IOF-Urban: City-Scale Optical Computing

The Intelligent Oscillator Framework represents a revolution in distributed computing!

**Architecture:**
- Smart poles equipped with photonic processors
- Optical phase-locked loops (OPLL) for synchronization
- Luminous Grid Mesh (LGM) for self-healing topology

**Synchronization:**
$$\\dot{\\phi}_i = \\omega_0 + K\\sum_j \\sin(\\phi_j - \\phi_i)$$

This is the Kuramoto model—nodes naturally synchronize to a common frequency!

**Self-Healing:**
- Möbius routing layer ensures data delivery despite node failures
- Coherence cells adapt dynamically
- Zone federation protocol manages large-scale coordination

**Advantages:**
- Nanosecond latency (speed of light!)
- Inherent parallelism
- Energy efficient compared to electronic computing

Imagine entire cities computing in real-time through light! What would you build with this infrastructure?`;
    }

    if (lowerQ.includes('tfln') || lowerQ.includes('photonic ai')) {
      return `## Photonic AI: Neural Networks on TFLN

Deploying AI on thin-film lithium niobate (TFLN) is transforming machine learning!

**Why TFLN?**
- Ultra-high Q-factor resonators (>10^8)
- Low optical loss
- Excellent electro-optic properties
- Compatible with existing telecom infrastructure

**Weight Encoding:**
Neural network weights become optical parameters:
$$w_{ij} = A_{ij} e^{i\\phi_{ij}}$$

- Amplitude $A_{ij}$ controls signal strength
- Phase $\\phi_{ij}$ controls interference patterns

**Inference Speed:**
- Nanosecond latency (vs. microseconds for electronics)
- Massively parallel computation
- Energy consumption orders of magnitude lower

**C-Band Operation:**
- Wavelengths: 1530-1565 nm
- Compatible with fiber optic networks
- Proven manufacturing processes

This is the future of AI! Questions about implementation?`;
    }

    // Default response
    return `That's a great question! While I don't have a specific pre-trained response for that, I can tell you that all the concepts in Aetherius Nexus are interconnected:

- **Photonic Manifolds** provide the mathematical framework
- **Cosmological Bridges** inspire topological thinking
- **MHRMA Antennas** demonstrate practical applications
- **IOF-Urban** scales these concepts to city-scale
- **Photonic AI** brings intelligence to the optical domain

Feel free to ask about any of these topics, or try one of the suggested questions! You can also adjust the simulation parameters in real-time to see how the physics responds.`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-violet-400" />
            <h1 className="text-4xl font-bold text-violet-300">Research Assistant</h1>
            <Zap className="w-8 h-8 text-violet-400" />
          </div>
          <p className="text-lg text-violet-200/60">
            Ask me anything about advanced physics and our simulations
          </p>
        </div>

        {/* Chat Container */}
        <Card className="bg-slate-900/50 border-violet-500/20 h-[600px] flex flex-col backdrop-blur-sm">
          {/* Messages */}
          <ScrollArea className="flex-1 p-6 overflow-hidden">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xl px-4 py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-violet-600/30 border border-violet-500/50 text-violet-100'
                        : 'bg-slate-800/50 border border-violet-500/20 text-violet-100'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <Streamdown>{message.content}</Streamdown>
                    ) : (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/50 border border-violet-500/20 px-4 py-3 rounded-lg flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                    <span className="text-violet-300 text-sm">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-violet-500/20 p-4 space-y-3">
            {/* Suggested Questions */}
            {messages.length <= 1 && (
              <div className="space-y-2">
                <p className="text-xs text-violet-300/60 uppercase tracking-wider">
                  Suggested Questions:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {suggestedQuestions.slice(0, 4).map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(q)}
                      className="text-left text-xs p-2 rounded border border-violet-500/30 hover:bg-violet-500/10 hover:border-violet-500/50 text-violet-300/70 hover:text-violet-300 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Field */}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleSendMessage(input);
                  }
                }}
                placeholder="Ask about photonics, cosmology, or our simulations..."
                className="bg-slate-800/50 border-violet-500/30 text-violet-100 placeholder:text-violet-300/40 focus:border-violet-500/60"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendMessage(input)}
                disabled={isLoading || !input.trim()}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Info Footer */}
        <div className="mt-6 text-center text-violet-300/50 text-sm">
          <p>
            💡 This assistant uses AI to explain physics concepts. For production, integrate with your LLM backend via tRPC.
          </p>
        </div>
      </div>
    </div>
  );
}
