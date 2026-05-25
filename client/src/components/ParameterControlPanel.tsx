import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ParameterControlPanelProps {
  onFrequencyChange: (value: number) => void;
  onCurvatureChange: (value: number) => void;
  onTopologyChange: (value: 'torus' | 'klein' | 'sphere') => void;
  onPhaseChange: (value: number) => void;
  onResonanceChange: (value: number) => void;
  onEntanglementChange: (value: number) => void;
}

export const ParameterControlPanel: React.FC<ParameterControlPanelProps> = ({
  onFrequencyChange,
  onCurvatureChange,
  onTopologyChange,
  onPhaseChange,
  onResonanceChange,
  onEntanglementChange,
}) => {
  const [frequency, setFrequency] = useState(1);
  const [curvature, setCurvature] = useState(0.5);
  const [topology, setTopology] = useState<'torus' | 'klein' | 'sphere'>('torus');
  const [phase, setPhase] = useState(0.5);
  const [resonance, setResonance] = useState(0.5);
  const [entanglement, setEntanglement] = useState(0.5);

  const handleFrequencyChange = (value: number[]) => {
    const newValue = value[0];
    setFrequency(newValue);
    onFrequencyChange(newValue);
  };

  const handleCurvatureChange = (value: number[]) => {
    const newValue = value[0];
    setCurvature(newValue);
    onCurvatureChange(newValue);
  };

  const handlePhaseChange = (value: number[]) => {
    const newValue = value[0];
    setPhase(newValue);
    onPhaseChange(newValue);
  };

  const handleResonanceChange = (value: number[]) => {
    const newValue = value[0];
    setResonance(newValue);
    onResonanceChange(newValue);
  };

  const handleEntanglementChange = (value: number[]) => {
    const newValue = value[0];
    setEntanglement(newValue);
    onEntanglementChange(newValue);
  };

  const handleTopologyChange = (newTopology: 'torus' | 'klein' | 'sphere') => {
    setTopology(newTopology);
    onTopologyChange(newTopology);
  };

  const resetAll = () => {
    setFrequency(1);
    setCurvature(0.5);
    setPhase(0.5);
    setResonance(0.5);
    setEntanglement(0.5);
    setTopology('torus');

    onFrequencyChange(1);
    onCurvatureChange(0.5);
    onPhaseChange(0.5);
    onResonanceChange(0.5);
    onEntanglementChange(0.5);
    onTopologyChange('torus');
  };

  return (
    <Card className="w-full bg-card/80 backdrop-blur-sm border-border glow-box p-6">
      <h3 className="text-xl font-bold glow-violet mb-4">Parameter Controls</h3>

      <Tabs defaultValue="photonic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="photonic">Photonic</TabsTrigger>
          <TabsTrigger value="antenna">Antenna</TabsTrigger>
          <TabsTrigger value="cosmological">Cosmological</TabsTrigger>
        </TabsList>

        <TabsContent value="photonic" className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium glow-cyan">
              Photon Frequency: {(frequency * 100).toFixed(1)}
            </label>
            <Slider
              value={[frequency]}
              onValueChange={handleFrequencyChange}
              min={0.1}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium glow-cyan">
              Manifold Curvature: {(curvature * 100).toFixed(1)}
            </label>
            <Slider
              value={[curvature]}
              onValueChange={handleCurvatureChange}
              min={0}
              max={2}
              step={0.05}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium glow-cyan mb-2 block">Topology Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['torus', 'klein', 'sphere'] as const).map((t) => (
                <Button
                  key={t}
                  onClick={() => handleTopologyChange(t)}
                  variant={topology === t ? 'default' : 'outline'}
                  className={`capitalize ${
                    topology === t ? 'bg-accent text-accent-foreground' : ''
                  }`}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="antenna" className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium glow-cyan">
              Antenna Phase: {(phase * 360).toFixed(1)}°
            </label>
            <Slider
              value={[phase]}
              onValueChange={handlePhaseChange}
              min={0}
              max={1}
              step={0.01}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium glow-cyan">
              Resonance Mode: {(resonance * 100).toFixed(1)}
            </label>
            <Slider
              value={[resonance]}
              onValueChange={handleResonanceChange}
              min={0}
              max={2}
              step={0.05}
              className="w-full"
            />
          </div>
        </TabsContent>

        <TabsContent value="cosmological" className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium glow-cyan">
              Spacetime Curvature: {(curvature * 100).toFixed(1)}
            </label>
            <Slider
              value={[curvature]}
              onValueChange={handleCurvatureChange}
              min={0}
              max={2}
              step={0.05}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium glow-cyan">
              Quantum Entanglement: {(entanglement * 100).toFixed(1)}
            </label>
            <Slider
              value={[entanglement]}
              onValueChange={handleEntanglementChange}
              min={0}
              max={2}
              step={0.05}
              className="w-full"
            />
          </div>
        </TabsContent>
      </Tabs>

      <Button
        onClick={resetAll}
        variant="outline"
        className="w-full mt-6 border-accent text-accent hover:bg-accent/10"
      >
        Reset All Parameters
      </Button>
    </Card>
  );
};
