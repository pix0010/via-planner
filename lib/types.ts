export type Status = 'todo' | 'in_progress' | 'blocked' | 'done';
export type Impact = 'H' | 'M' | 'L';
export type Effort = 'H' | 'M' | 'L';

export type Metric = {
  id: string;
  name: string;
  target: number;
  current: number;
  unit?: string;
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
};

export type Milestone = {
  id: string;
  title: string;
  due: string; // ISO date
  tasks: Task[];
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
};

export type PlannerState = {
  version: number;
  objectives: Objective[];
  selectedObjectiveId?: string;
  filters: {
    objectiveId?: string;
    tags: string[];
  };
  hasHydrated: boolean;
};

