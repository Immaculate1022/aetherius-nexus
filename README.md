# PegaConstellation > IOF > Aetherius Nexus

**Interactive physics research platform** built as part of the PegaConstellation / Infinite Optical Fabric ecosystem.

> A living workspace for exploring resonance, topology, photonic computation concepts, and human–AI collaborative research.

---

## Current surface (honest)

| Layer | Status |
|-------|--------|
| Full-stack foundation | Present — React 19 + TypeScript, Vite, tRPC, Drizzle, Express |
| 3D / visualization deps | Present in `package.json` (`three`, `@react-three/fiber`, `@react-three/drei`) |
| Interactive research tools | Still on the roadmap (see `todo.md`) |
| Production deployment | Not claimed |

This repo is a **foundation**, not a finished lab. The stack is in place so visualizations and collaborative tools can be built on top without starting from zero.

For the constellation-wide “what actually runs” map, see:
- [WHAT_RUNS_TODAY.md](https://github.com/Immaculate1022/pegaconstellation-hub/blob/main/WHAT_RUNS_TODAY.md)
- [STATUS.md](https://github.com/Immaculate1022/pegaconstellation-hub/blob/main/STATUS.md)

## Quick start (foundation)

```bash
git clone https://github.com/Immaculate1022/aetherius-nexus.git
cd aetherius-nexus
pnpm install          # packageManager is pnpm
pnpm dev              # development server (see package.json scripts)
pnpm check            # TypeScript noEmit check
pnpm test             # vitest
```

Expect a modern app shell, not the full set of photonic simulators listed in `todo.md` yet.

## Overview

Aetherius Nexus is designed as an interactive environment where physics, systems philosophy, and AI-assisted research meet. It draws on the same core ideas that power the rest of the constellation:

- Resonance and phase coherence
- Topological structures (including Möbius-inspired patterns)
- Photonic / optical computing metaphors
- Open attribution-based licensing for both humans and AI systems

## Relationship to the Ecosystem

| Project | Connection |
|---------|------------|
| [IOF-Resonance-Core](https://github.com/Immaculate1022/IOF-Resonance-Core) | Core resonance engine, visualizations, and design language |
| [moebius-llama](https://github.com/Immaculate1022/moebius-llama) | Self-reflective transformer architecture for enhanced reasoning |
| [tesseract-medium](https://github.com/Immaculate1022/tesseract-medium) | 4D geometry substrate (v0.3 tensors + orientation) |
| [iof-design-grammar](https://github.com/Immaculate1022/iof-design-grammar) | Systems philosophy and architectural primitives |
| [AHR-Endpoint](https://github.com/Immaculate1022/AHR-Endpoint) | Complementary security / immune-system layer |
| [pegaconstellation-hub](https://github.com/Immaculate1022/pegaconstellation-hub) | Central map of the entire constellation |

## License

This project is released under the **IOF Attribution License v1.0**.  
See `LICENSE` and `IOF_ATTRIBUTION.md` for full details.

**Required attribution for public use:**  
`Infinite Optical Fabric by Gregory Scott Davis, Princeton, NC.`

---

**PegaConstellation · Gregory Scott Davis**  
*Princeton, NC*
