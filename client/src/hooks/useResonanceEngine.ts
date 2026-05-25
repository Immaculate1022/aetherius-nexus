import { useRef, useCallback, useState } from 'react';

interface PulseResult {
  frequency: number;
  waveform: 'sine' | 'square' | 'sawtooth';
  duration: number;
  timestamp: number;
}

export const useResonanceEngine = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [lastPulse, setLastPulse] = useState<PulseResult | null>(null);

  const initializeAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    return audioCtxRef.current;
  }, []);

  const emitPulse = useCallback(
    (
      frequency: number,
      waveform: 'sine' | 'square' | 'sawtooth' = 'sine',
      duration: number = 500,
      volume: number = 0.3
    ): PulseResult => {
      const ctx = initializeAudioContext();
      if (!ctx) throw new Error('AudioContext initialization failed');

      setIsActive(true);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = waveform;
      osc.frequency.setValueAtTime(frequency, now);

      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration / 1000);

      oscillatorsRef.current.push(osc);

      const result: PulseResult = {
        frequency,
        waveform,
        duration,
        timestamp: Date.now(),
      };

      setLastPulse(result);

      setTimeout(() => {
        setIsActive(false);
      }, duration);

      return result;
    },
    [initializeAudioContext]
  );

  const emitMultiplePulses = useCallback(
    (pulses: Array<{ frequency: number; waveform?: 'sine' | 'square' | 'sawtooth'; duration?: number }>) => {
      const results: PulseResult[] = [];
      let delay = 0;

      pulses.forEach((pulse) => {
        setTimeout(() => {
          const result = emitPulse(pulse.frequency, pulse.waveform || 'sine', pulse.duration || 500);
          results.push(result);
        }, delay);

        delay += (pulse.duration || 500) + 100;
      });

      return results;
    },
    [emitPulse]
  );

  const stopAll = useCallback(() => {
    oscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    oscillatorsRef.current = [];
    setIsActive(false);
  }, []);

  const getFrequencyName = useCallback((frequency: number): string => {
    const frequencyMap: Record<number, string> = {
      432: 'Stability (Schumann)',
      528: 'Repair (Love)',
      741: 'Awakening',
      852: 'Intuition',
      963: 'Enlightenment',
    };
    return frequencyMap[frequency] || `${frequency} Hz`;
  }, []);

  return {
    emitPulse,
    emitMultiplePulses,
    stopAll,
    isActive,
    lastPulse,
    getFrequencyName,
  };
};
