import { ProgramDay } from './types';

export const INITIAL_PROGRAM: ProgramDay[] = [
  {
    id: 'day-1',
    name: 'Ziua 1',
    focus: 'Umeri + Piept (Push principal)',
    isPushDay: true,
    exercises: [
      {
        id: 'lat-raises-d1',
        name: 'Ridicări laterale',
        muscleGroup: 'Umeri',
        notes: '1 ramp-up, TOP SET: 10–15 reps @RIR 0–1, 2 back-off: 15–25 reps @RIR 1–2',
        rampUpSets: '1 set',
        topSetTarget: { minReps: 10, maxReps: 15, targetRIR: 0 },
        backOffRule: '2 seturi x 15-25 reps @ RIR 1-2',
        isKeyLift: true,
        techniqueCues: { tempo: '3-1-1-1', rom: 'Până la nivelul umerilor', failure: 'Incapacitatea de a menține sus' },
        defaultSets: 4
      },
      {
        id: 'inc-press-d1',
        name: 'Presă înclinată aparat',
        muscleGroup: 'Piept',
        notes: 'ramp-up, TOP SET: 6–10 reps @RIR 0–1, 1 back-off: 8–12 reps @RIR 1–2',
        rampUpSets: '1 set',
        topSetTarget: { minReps: 6, maxReps: 10, targetRIR: 0 },
        backOffRule: '1 set x 8-12 reps @ RIR 1-2',
        isKeyLift: true,
        techniqueCues: { tempo: '4-0-1-0', rom: 'Full stretch', failure: 'Blocaj mecanic' },
        defaultSets: 3
      },
      {
        id: 'bench-press-d1',
        name: 'Bench press',
        muscleGroup: 'Piept',
        notes: '2 × 6–12 reps @RIR 1–2. NO top set.',
        rampUpSets: '1 set',
        backOffRule: '2 seturi x 6-12 reps @ RIR 1-2',
        isKeyLift: false,
        techniqueCues: { tempo: '3-1-1-0', rom: 'Atingere ușoară piept', failure: 'RIR 1 stop' },
        defaultSets: 3
      },
      {
        id: 'cable-fly-d1',
        name: 'Fluturări cablu inferior',
        muscleGroup: 'Piept',
        notes: '3 × 12–25 reps @RIR 2→1',
        rampUpSets: '0',
        backOffRule: '3 seturi x 12-25 reps @ RIR 2->1',
        isKeyLift: false,
        techniqueCues: { tempo: '2-0-1-2', rom: 'Contractie maximă', failure: 'Pierderea formei' },
        defaultSets: 3
      },
      {
        id: 'pushdown-d1',
        name: 'Pushdown',
        muscleGroup: 'Triceps',
        notes: 'MAX ONE isolated triceps exercise. ramp-up, TOP SET: 8–12 reps @RIR 0–1, 1 back-off: 12–20 reps @RIR 1–2',
        rampUpSets: '1 set',
        topSetTarget: { minReps: 8, maxReps: 12, targetRIR: 0 },
        backOffRule: '1 set x 12-20 reps @ RIR 1-2',
        isKeyLift: false,
        techniqueCues: { tempo: '3-0-1-1', rom: 'Extensie completă', failure: 'Incapacitatea de a bloca' },
        defaultSets: 3
      },
      {
        id: 'overhead-ext-d1',
        name: 'Overhead extension',
        muscleGroup: 'Triceps',
        notes: 'MAX ONE isolated triceps exercise. 2 × 10–15 reps @RIR 1–2. NO top set.',
        rampUpSets: '0',
        backOffRule: '2 seturi x 10-15 reps @ RIR 1-2',
        isKeyLift: false,
        techniqueCues: { tempo: '3-0-1-1', rom: 'Stretch maxim', failure: 'Eșec tehnic' },
        defaultSets: 2
      }
    ]
  },
  {
    id: 'day-2',
    name: 'Ziua 2',
    focus: 'Picioare (Cvadriceps + Adductori + Gambe)',
    exercises: [
      {
        id: 'squat-d2',
        name: 'Genuflexiune',
        muscleGroup: 'Picioare',
        notes: 'ramp-up, TOP SET: 5–8 reps @RIR 0–1, 1 back-off: 8–12 reps @RIR 1–2',
        rampUpSets: '2-3 seturi',
        topSetTarget: { minReps: 5, maxReps: 8, targetRIR: 0 },
        backOffRule: '1 set x 8-12 reps @ RIR 1-2',
        isKeyLift: true,
        techniqueCues: { tempo: '3-1-1-0', rom: 'Paralel/Sub paralel', failure: 'Pierderea stabilității' },
        defaultSets: 4
      },
      {
        id: 'split-squat-d2',
        name: 'Fandări / Split squat',
        muscleGroup: 'Picioare',
        notes: '2 × 8–15 reps @RIR 1–2',
        rampUpSets: '1 set',
        backOffRule: '2 seturi x 8-15 reps @ RIR 1-2',
        isKeyLift: false,
        techniqueCues: { tempo: '2-1-1-0', rom: 'Genunchi aproape de sol', failure: 'Dezechilibru' },
        defaultSets: 3
      },
      {
        id: 'leg-ext-d2',
        name: 'Extensii cvadriceps',
        muscleGroup: 'Picioare',
        notes: 'ramp-up, TOP SET: 10–15 reps @RIR 0–1, 2 back-off: 15–25 reps @RIR 1–2',
        rampUpSets: '1 set',
        topSetTarget: { minReps: 10, maxReps: 15, targetRIR: 0 },
        backOffRule: '2 seturi x 15-25 reps @ RIR 1-2',
        isKeyLift: false,
        techniqueCues: { tempo: '2-0-1-2', rom: 'Extensie completă', failure: 'Pierderea contractiei' },
        defaultSets: 4
      },
      {
        id: 'adductor-d2',
        name: 'Adductor machine',
        muscleGroup: 'Adductori',
        notes: '2 × 12–20 reps @RIR 2',
        rampUpSets: '0',
        backOffRule: '2 seturi x 12-20 reps @ RIR 2',
        isKeyLift: false,
        techniqueCues: { tempo: '2-1-1-2', rom: 'Adducție completă', failure: 'Incapacitatea de a închide' },
        defaultSets: 2
      },
      {
        id: 'standing-calf-d2',
        name: 'Standing calf raise',
        muscleGroup: 'Gambe',
        notes: '3 × 10–20 reps @RIR 2→1',
        rampUpSets: '0',
        backOffRule: '3 seturi x 10-20 reps @ RIR 2->1',
        isKeyLift: false,
        techniqueCues: { tempo: '2-2-1-1', rom: 'Full stretch', failure: 'Epuizare locală' },
        defaultSets: 3
      },
      {
        id: 'seated-calf-d2',
        name: 'Seated calf raise',
        muscleGroup: 'Gambe',
        notes: '3 × 12–25 reps @RIR 2→1',
        rampUpSets: '0',
        backOffRule: '3 seturi x 12-25 reps @ RIR 2->1',
        isKeyLift: false,
        techniqueCues: { tempo: '2-2-1-1', rom: 'Full range', failure: 'Epuizare locală' },
        defaultSets: 3
      }
    ]
  },
  {
    id: 'day-3',
    name: 'Ziua 3',
    focus: 'Spate + Umăr posterior + Biceps + Piept ușor',
    exercises: [
      {
        id: 'lat-pull-d3',
        name: 'Tracțiuni / Lat pulldown',
        muscleGroup: 'Spate',
        notes: 'TOP SET: 6–10 reps @RIR 0–1, 1 back-off: 8–12 reps @RIR 1–2',
        rampUpSets: '1 set',
        topSetTarget: { minReps: 6, maxReps: 10, targetRIR: 0 },
        backOffRule: '1 set x 8-12 reps @ RIR 1-2',
        isKeyLift: true,
        techniqueCues: { tempo: '2-0-1-2', rom: 'Bară sub bărbie', failure: 'Ridicare umeri' },
        defaultSets: 3
      },
      {
        id: 'row-d3',
        name: 'Ramat (bară / aparat)',
        muscleGroup: 'Spate',
        notes: 'TOP SET: 6–8 reps @RIR 0–1, 1 back-off: 8–12 reps @RIR 1–2',
        rampUpSets: '1 set',
        topSetTarget: { minReps: 6, maxReps: 8, targetRIR: 0 },
        backOffRule: '1 set x 8-12 reps @ RIR 1-2',
        isKeyLift: true,
        techniqueCues: { tempo: '2-0-1-2', rom: 'Atingere abdomen', failure: 'Balans excesiv' },
        defaultSets: 3
      },
      {
        id: 'cable-row-d3',
        name: 'Ramat cablu',
        muscleGroup: 'Spate',
        notes: '2 × 10–15 reps @RIR 1–2',
        rampUpSets: '0',
        backOffRule: '2 seturi x 10-15 reps @ RIR 1-2',
        isKeyLift: false,
        techniqueCues: { tempo: '2-0-1-1', rom: 'Coatele în spate', failure: 'Pierderea extensiei' },
        defaultSets: 2
      },
      {
        id: 'rear-delt-d3',
        name: 'Umăr posterior',
        muscleGroup: 'Umeri',
        notes: '5 × 12–25 reps @RIR 2→1',
        rampUpSets: '0',
        backOffRule: '5 seturi x 12-25 reps @ RIR 2->1',
        isKeyLift: false,
        techniqueCues: { tempo: '2-0-1-1', rom: 'Abducție completă', failure: 'Pierderea controlului' },
        defaultSets: 5
      },
      {
        id: 'preacher-curl-d3',
        name: 'Curl coate sprijinite',
        muscleGroup: 'Biceps',
        notes: 'ramp-up, TOP SET: 8–12 reps @RIR 0–1, 1 back-off: 12–20 reps @RIR 1–2',
        rampUpSets: '1 set',
        topSetTarget: { minReps: 8, maxReps: 12, targetRIR: 0 },
        backOffRule: '1 set x 12-20 reps @ RIR 1-2',
        isKeyLift: false,
        techniqueCues: { tempo: '3-0-1-1', rom: 'Extensie completă', failure: 'Incapacitatea de a urca' },
        defaultSets: 3
      },
      {
        id: 'chest-light-d3',
        name: 'Piept ușor',
        muscleGroup: 'Piept',
        notes: '2 × 12–15 reps @RIR 3',
        rampUpSets: '0',
        backOffRule: '2 seturi x 12-15 reps @ RIR 3',
        isKeyLift: false,
        techniqueCues: { tempo: '3-0-1-0', rom: 'Control total', failure: 'NU se atinge eșecul' },
        defaultSets: 2
      }
    ]
  },
  {
    id: 'day-4',
    name: 'Ziua 4',
    focus: 'Picioare (Femural + Fesieri + Lombar + Gambe)',
    exercises: [
      {
        id: 'rdl-d4',
        name: 'RDL',
        muscleGroup: 'Picioare',
        notes: 'ramp-up, TOP SET: 6–10 reps @RIR 0–1, 1 back-off: 8–12 reps @RIR 1–2',
        rampUpSets: '2 seturi',
        topSetTarget: { minReps: 6, maxReps: 10, targetRIR: 0 },
        backOffRule: '1 set x 8-12 reps @ RIR 1-2',
        isKeyLift: true,
        techniqueCues: { tempo: '4-1-1-0', rom: 'Sub genunchi', failure: 'Curbarea zonei lombare' },
        defaultSets: 4
      },
      {
        id: 'seated-curl-d4',
        name: 'Seated leg curl',
        muscleGroup: 'Picioare',
        notes: 'TOP SET: 10–15 reps @RIR 0–1, 1 back-off: 15–20 reps @RIR 1–2',
        rampUpSets: '1 set',
        topSetTarget: { minReps: 10, maxReps: 15, targetRIR: 0 },
        backOffRule: '1 set x 15-20 reps @ RIR 1-2',
        isKeyLift: false,
        techniqueCues: { tempo: '3-0-1-2', rom: 'Contracție maximă', failure: 'Incapacitatea de a flexa' },
        defaultSets: 3
      },
      {
        id: 'bent-curl-d4',
        name: 'Bent-over leg curl',
        muscleGroup: 'Picioare',
        notes: '2 × 12–20 reps @RIR 1–2',
        rampUpSets: '0',
        backOffRule: '2 seturi x 12-20 reps @ RIR 1-2',
        isKeyLift: false,
        techniqueCues: { tempo: '2-0-1-1', rom: 'Range complet', failure: 'Arsură musculară' },
        defaultSets: 2
      },
      {
        id: 'hip-thrust-d4',
        name: 'Hip thrust',
        muscleGroup: 'Fesieri',
        notes: '2 × 8–12 reps @RIR 1–2',
        rampUpSets: '1 set',
        backOffRule: '2 seturi x 8-12 reps @ RIR 1-2',
        isKeyLift: false,
        techniqueCues: { tempo: '2-1-1-1', rom: 'Extensie bazin', failure: 'Pierderea contracției' },
        defaultSets: 3
      },
      {
        id: 'glute-focus-d4',
        name: 'Glute-focused supplementary',
        muscleGroup: 'Fesieri',
        notes: '2 × 10–15 reps @RIR 1–2',
        rampUpSets: '0',
        backOffRule: '2 seturi x 10-15 reps @ RIR 1-2',
        isKeyLift: false,
        techniqueCues: { tempo: '2-1-1-1', rom: 'Range optim', failure: 'Eșec tehnic' },
        defaultSets: 2
      },
      {
        id: 'back-ext-d4',
        name: 'Back extension',
        muscleGroup: 'Lombar',
        notes: '1–2 × 10–15 reps @RIR 2–3',
        rampUpSets: '0',
        backOffRule: '1-2 seturi x 10-15 reps @ RIR 2-3',
        isKeyLift: false,
        techniqueCues: { tempo: '3-0-1-1', rom: 'Fără hiperextensie', failure: 'Oboseală lombară' },
        defaultSets: 2
      },
      {
        id: 'standing-calf-d4',
        name: 'Standing calf raise',
        muscleGroup: 'Gambe',
        notes: 'Reguli identice Ziua 2: 3 × 10–20 reps @RIR 2→1',
        rampUpSets: '0',
        backOffRule: '3 seturi x 10-20 reps @ RIR 2->1',
        isKeyLift: false,
        techniqueCues: { tempo: '2-2-1-1', rom: 'Full range', failure: 'Epuizare locală' },
        defaultSets: 3
      }
    ]
  },
  {
    id: 'day-5',
    name: 'Ziua 5',
    focus: 'Brațe + Volum umeri',
    exercises: [
      {
        id: 'preacher-curl-d5',
        name: 'Curl sprijinit',
        muscleGroup: 'Biceps',
        notes: 'TOP SET: 8–12 reps @RIR 0–1, 1 back-off: 12–20 reps @RIR 1–2',
        rampUpSets: '1 set',
        topSetTarget: { minReps: 8, maxReps: 12, targetRIR: 0 },
        backOffRule: '1 set x 12-20 reps @ RIR 1-2',
        isKeyLift: false,
        techniqueCues: { tempo: '3-0-1-1', rom: 'Extensie completă', failure: 'Eșec concentric' },
        defaultSets: 3
      },
      {
        id: 'incline-curl-d5',
        name: 'Incline DB curl',
        muscleGroup: 'Biceps',
        notes: '2 × 10–15 reps @RIR 1–2',
        rampUpSets: '0',
        backOffRule: '2 seturi x 10-15 reps @ RIR 1-2',
        isKeyLift: false,
        techniqueCues: { tempo: '2-1-1-0', rom: 'Stretch maxim', failure: 'Pierderea formei' },
        defaultSets: 2
      },
      {
        id: 'hammer-curl-d5',
        name: 'Hammer curl',
        muscleGroup: 'Biceps',
        notes: '2 × 8–12 reps @RIR 1–2',
        rampUpSets: '0',
        backOffRule: '2 seturi x 8-12 reps @ RIR 1-2',
        isKeyLift: false,
        techniqueCues: { tempo: '2-0-1-0', rom: 'Grip neutru', failure: 'Balans' },
        defaultSets: 2
      },
      {
        id: 'pushdown-d5',
        name: 'Pushdown',
        muscleGroup: 'Triceps',
        notes: 'TOP SET: 8–12 reps @RIR 0–1, 1 back-off: 12–20 reps @RIR 1–2',
        rampUpSets: '1 set',
        topSetTarget: { minReps: 8, maxReps: 12, targetRIR: 0 },
        backOffRule: '1 set x 12-20 reps @ RIR 1-2',
        isKeyLift: false,
        techniqueCues: { tempo: '3-0-1-1', rom: 'Extensie completă', failure: 'Incapacitatea de a bloca' },
        defaultSets: 3
      },
      {
        id: 'overhead-ext-d5',
        name: 'Overhead extension',
        muscleGroup: 'Triceps',
        notes: '2 × 10–15 reps @RIR 1–2',
        rampUpSets: '0',
        backOffRule: '2 seturi x 10-15 reps @ RIR 1-2',
        isKeyLift: false,
        techniqueCues: { tempo: '3-0-1-1', rom: 'Stretch maxim', failure: 'Eșec tehnic' },
        defaultSets: 2
      },
      {
        id: 'lat-raise-cable-d5',
        name: 'Ridicări laterale cablu low-to-high',
        muscleGroup: 'Umeri',
        notes: 'Volum suplimentar. 3 × 15–25 reps @RIR 1–2. NO top set.',
        rampUpSets: '0',
        backOffRule: '3 seturi x 15-25 reps @ RIR 1-2',
        isKeyLift: false,
        isSupportVolume: true,
        techniqueCues: { tempo: '2-0-1-1', rom: 'Tensiune constantă', failure: 'Limitarea ROM' },
        defaultSets: 3
      }
    ]
  }
];