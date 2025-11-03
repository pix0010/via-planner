export type Status = 'todo' | 'in_progress' | 'blocked' | 'done';
export type Impact = 'H' | 'M' | 'L';
export type Effort = 'H' | 'M' | 'L';

export type Metric = {
  id: string;
  name: string;
  target: number;
  current: number;
  unit?: string;
  description?: string;
  leading?: boolean;
};

export type Task = {
  id: string;
  title: string;
  status: Status;
  impact?: Impact;
  effort?: Effort;
  tags?: string[];
  links?: string[];
  note?: string;
  okrId?: string;
  experimentId?: string;
};

export type Milestone = {
  id: string;
  title: string;
  due: string; // ISO date
  tasks: Task[];
  okrId?: string;
};

export type Objective = {
  id: string;
  title: string; // куда идём
  why: string; // зачем
  owner?: string;
  start?: string;
  end?: string;
  status?: Status;
  metrics?: Metric[];
  milestones: Milestone[];
  themeId?: string;
};

export type PlannerState = {
  version: number;
  // Strategy layer
  strategy: Strategy;
  objectives: Objective[];
  experiments: Experiment[];
  zoom: 'H0' | 'H1' | 'H2' | 'H3';
  selectedObjectiveId?: string;
  filters: {
    objectiveId?: string;
    themeId?: string;
    okrId?: string;
    experimentId?: string;
    tags: string[];
  };
  hasHydrated: boolean;
};

export type KeyResult = {
  id: string;
  title: string;
  target: number | string;
  current: number | string;
  unit?: string;
  confidence?: number; // 0..1
  status?: Status;
};

export type OKR = {
  id: string;
  objective: string;
  owner?: string;
  quarter: string; // e.g., "2025-Q4"
  keyResults: KeyResult[];
  status?: Status;
};

export type StrategicTheme = {
  id: string;
  title: string;
  narrative: string;
  owner?: string;
  okrs: OKR[];
};

export type ExperimentStage = 'idea' | 'draft' | 'running' | 'completed';
export type ExperimentOutcome = 'win' | 'neutral' | 'loss';

export type Experiment = {
  id: string;
  hypothesis: string;
  objectiveId?: string;
  krId?: string;
  stage: ExperimentStage;
  outcome?: ExperimentOutcome;
  evidence?: string;
  start?: string;
  end?: string;
};

export type Strategy = {
  id: string;
  thesis: string;
  mission: string; // Markdown
  vision: string; // Markdown
  horizon: { h1_year: number; h2_year: number; h3_year: number };
  northStar: Metric;
  guardrails: Metric[];
  themes: StrategicTheme[];
};
