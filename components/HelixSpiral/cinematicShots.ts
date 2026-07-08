export interface ChapterPersonality {
  fogColor: string;
  fogDensity: number;
  lightTint: string;
  particleColor: string;
  bloomPulse: number;
  ambientShift: string;
}

export interface CinematicShot {
  id: number;
  position: [number, number, number];
  lookAt: [number, number, number];
  focusDistance: number;
  focalLength: number;
  bloomBoost: number;
  fStop: number;
  personality: ChapterPersonality;
}

// Diamond Y positions (index i): (i - 3.5) * 1.5
// i=0 → -5.25  i=1 → -3.75  i=2 → -2.25  i=3 → -0.75
// i=4 →  0.75  i=5 →  2.25  i=6 →  3.75  i=7 →  5.25
//
// Narrative arc: Logo (beacon) → 7 problem chapters (alternating ±X swings)
// Camera alternates hard left/right for maximum cinematic impact.
export const CINEMATIC_SHOTS: CinematicShot[] = [
  {
    // 0 — SGC Logo: Camera centred — beacon emerging from darkness
    id: 0, position: [0, -5.25, 10], lookAt: [0, -5.25, 0],
    focusDistance: 0.006, focalLength: 0.018, bloomBoost: 0.9, fStop: 1.5,
    personality: {
      fogColor: "#0F0A00", fogDensity: 0.022,
      lightTint: "#EFDBA0", particleColor: "#C7A23A",
      bloomPulse: 1.4, ambientShift: "#150C00",
    },
  },
  {
    // 1 — Excel/Tally: HARD LEFT — first problem surfaces
    id: 1, position: [-9, -3.75, 10], lookAt: [0, -3.75, 0],
    focusDistance: 0.007, focalLength: 0.022, bloomBoost: 0.55, fStop: 2.0,
    personality: {
      fogColor: "#07090E", fogDensity: 0.030,
      lightTint: "#C7A23A", particleColor: "#8A6A1E",
      bloomPulse: 0.7, ambientShift: "#07090E",
    },
  },
  {
    // 2 — Manual 20hrs: HARD RIGHT — urgency escalates
    id: 2, position: [9, -2.25, 10], lookAt: [0, -2.25, 0],
    focusDistance: 0.0074, focalLength: 0.028, bloomBoost: 0.6, fStop: 2.0,
    personality: {
      fogColor: "#130900", fogDensity: 0.036,
      lightTint: "#EFDBA0", particleColor: "#C7A23A",
      bloomPulse: 0.8, ambientShift: "#0E0702",
    },
  },
  {
    // 3 — 6PM missed calls: LEFT CLOSE — intimate, personal
    id: 3, position: [-6, -0.75, 7.5], lookAt: [0, -0.75, 0],
    focusDistance: 0.0067, focalLength: 0.020, bloomBoost: 0.5, fStop: 2.0,
    personality: {
      fogColor: "#0A0806", fogDensity: 0.026,
      lightTint: "#C7A23A", particleColor: "#8A6A1E",
      bloomPulse: 0.55, ambientShift: "#080604",
    },
  },
  {
    // 4 — Commission disputes: WIDE RIGHT — maximum tension
    id: 4, position: [8, 0.75, 11], lookAt: [0, 0.75, 0],
    focusDistance: 0.0074, focalLength: 0.030, bloomBoost: 0.65, fStop: 2.0,
    personality: {
      fogColor: "#0C0A06", fogDensity: 0.034,
      lightTint: "#EFDBA0", particleColor: "#C7A23A",
      bloomPulse: 0.75, ambientShift: "#0A0804",
    },
  },
  {
    // 5 — Month-old reports: UPPER LEFT — weight of the problem
    id: 5, position: [-7, 2.25, 9], lookAt: [0, 2.25, 0],
    focusDistance: 0.0067, focalLength: 0.024, bloomBoost: 0.55, fStop: 2.0,
    personality: {
      fogColor: "#080604", fogDensity: 0.026,
      lightTint: "#C7A23A", particleColor: "#8A6A1E",
      bloomPulse: 0.6, ambientShift: "#070502",
    },
  },
  {
    // 6 — AED 150k filing: HARD RIGHT HIGH — punishing stakes
    id: 6, position: [9, 3.75, 9.5], lookAt: [0, 3.75, 0],
    focusDistance: 0.0074, focalLength: 0.032, bloomBoost: 0.75, fStop: 2.0,
    personality: {
      fogColor: "#110900", fogDensity: 0.038,
      lightTint: "#EFDBA0", particleColor: "#C7A23A",
      bloomPulse: 0.85, ambientShift: "#0D0800",
    },
  },
  {
    // 7 — Your time: UPPER LEFT PULLBACK — resolution arc, earned calm
    id: 7, position: [-5, 5.25, 10], lookAt: [0, 5.25, 0],
    focusDistance: 0.008, focalLength: 0.018, bloomBoost: 0.7, fStop: 2.0,
    personality: {
      fogColor: "#140A00", fogDensity: 0.030,
      lightTint: "#EFDBA0", particleColor: "#C7A23A",
      bloomPulse: 0.9, ambientShift: "#0F0800",
    },
  },
];
