import { Milliseconds } from '@app/domain/date';

export enum TaskState {
  active = 'active',
  finished = 'finished',
  dropped = 'dropped',
}

export type RouteTaskState = TaskState | 'all';

export type TaskId = string;

export type Task = {
  id: TaskId;
  name: string;
  state: TaskState;
  sessions: Session[];
};

export type Session = {
  start: Milliseconds;
  end?: Milliseconds;
};

export type Theme = 'light' | 'dark';

export type TimeSpanIndex = string[];

export type TaskIndexes = {
  year: TimeSpanIndex;
  yearMonth: TimeSpanIndex;
  yearMonthDate: TimeSpanIndex;
};

export type TasksFilterParams = {
  from?: Date;
  to?: Date;
  search?: string;
  taskId?: TaskId;
  durationSort?: 'longestFirst' | 'shortestFirst';
};

export type RangeWidth = 'hour' | 'day' | 'month' | 'year';

export type StatsParams = {
  timelineStep: RangeWidth;
};
export type Stats = {
  today: {
    duration: number;
    diff: number;
  };
  thisWeek: {
    duration: number;
    diff: number;
  };
  thisYear: {
    duration: number;
    diff: number;
  };
  timeline: {
    barWidthInMs: number;
    bars: Map<number, { start: Date; end: Date; tasks: Set<Task['id']>; duration: number }>;
    uPlotData: number[][];
  };
};
