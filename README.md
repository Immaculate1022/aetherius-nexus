# Aetherius Nexus

**Aetherius Nexus** is an experimental, browser-based space for exploring physics- and photonics-inspired visual models. It is part of the PegaConstellation / Infinite Optical Fabric (IOF) ecosystem and is for curious learners, researchers, and builders who want to inspect and adjust interactive 3D scenes rather than start from a blank project.

**Try it locally:** clone the repository, run `pnpm install` and `pnpm dev`, then open the local address printed by the server. The default page includes the current WebGL explorations and their controls.

## What you can explore today

The default experience contains interactive 3D visualizations for:

- a photonic-manifold-inspired surface, with frequency, curvature, and topology controls;
- a cosmological-bridge-inspired tunnel, with curvature and entanglement controls; and
- an MHRMA-inspired Möbius-strip visualization, with phase and resonance controls.

The project also includes a theory-library route at `/theory` and a research-assistant interface at `/assistant`.

## Quick start

You need a current Node.js installation and [pnpm](https://pnpm.io/). The repository declares pnpm as its package manager.

```bash
git clone https://github.com/Immaculate1022/aetherius-nexus.git
cd aetherius-nexus
pnpm install
pnpm dev
```

Open the local URL printed in the terminal (normally `http://localhost:3000`). Use the parameter panel on the default page to change the visualizations. You can also visit `/theory` for the included theory pages and `/assistant` for the assistant interface.

For local checks, run:

```bash
pnpm check
pnpm test
```

## Status and scope

Aetherius Nexus is an **experimental research-visualization project**, not a validated scientific simulator or a production deployment. The current client renders animated Three.js/WebGL scenes and exposes visual controls. These scenes are illustrative explorations of the project's concepts; their controls change rendering and animation behavior, and should not be treated as physical measurements, engineering predictions, or experimental results.

Several planned capabilities remain on the roadmap in [`todo.md`](todo.md), including additional simulator behavior, richer theory content, connected controls, and an LLM-backed assistant. The `/assistant` interface currently returns locally simulated, prewritten responses; it does not call an LLM backend. The topology selector's `klein` option is presently rendered as a torus approximation. See [`todo.md`](todo.md) for the project’s tracked work.

## Project context

Aetherius Nexus builds on the Infinite Optical Fabric framework. For the constellation-wide status map and current-project overview, see the [PegaConstellation hub](https://github.com/Immaculate1022/pegaconstellation-hub), including its [what runs today map](https://github.com/Immaculate1022/pegaconstellation-hub/blob/main/WHAT_RUNS_TODAY.md).

## License and attribution

This project is provided under the **IOF Attribution License v1.0**; see [`LICENSE`](LICENSE) for the complete terms. The license permits reproduction, modification, derivative works, hardware implementation, and AI/ML use, subject to its attribution requirement for public distributions, derivative works, and implementations.

Required attribution:

> Infinite Optical Fabric by Gregory Scott Davis, Princeton, NC.

See [`IOF_ATTRIBUTION.md`](IOF_ATTRIBUTION.md) for attribution guidance.

---

**PegaConstellation · Gregory Scott Davis**  
*Princeton, NC*
