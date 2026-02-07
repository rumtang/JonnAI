import { CameraConfig } from './types';

export const CAMERA_POSITIONS: Record<string, CameraConfig> = {
  'start':             { pos: { x: 0, y: 0, z: 1200 },   lookAt: { x: 0, y: 0, z: 0 },    ms: 2000 },
  'linear-side':       { pos: { x: 0, y: 80, z: 500 },   lookAt: { x: 0, y: 0, z: 0 },    ms: 2500 },
  'linear-close':      { pos: { x: 0, y: 40, z: 350 },   lookAt: { x: 0, y: 0, z: 0 },    ms: 1500 },
  'pull-back':         { pos: { x: 200, y: 200, z: 700 }, lookAt: { x: 0, y: 0, z: 0 },    ms: 3000 },
  'exploded':          { pos: { x: 0, y: 100, z: 600 },   lookAt: { x: 0, y: 0, z: 0 },    ms: 3500 },
  'knowledge-focus':   { pos: { x: -200, y: 120, z: 350 }, lookAt: null,                     ms: 2500 },
  'agent-focus':       { pos: { x: 150, y: -60, z: 300 }, lookAt: null,                      ms: 2500 },
  'escalation-focus':  { pos: { x: -120, y: 180, z: 300 }, lookAt: null,                     ms: 2500 },
  'full-reveal':       { pos: { x: 0, y: 50, z: 550 },   lookAt: { x: 0, y: 0, z: 0 },    ms: 3000 },
};
