import { compareTasks, isValidTaskState } from '@app/domain';
import { filter as filterSync } from '@app/domain/filter';
import { Stats, StatsParams, StoreState, Task, TasksFilterParams, TaskState } from '@app/types';
import { isTruthy } from '@app/utils/assert';
import { getSelectors } from '@ngrx/router-store';
import { createFeatureSelector, createSelector, select } from '@ngrx/store';
import * as Comlink from 'comlink';
import { pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const tasks = createFeatureSelector<StoreState['tasks']>('tasks');
export const router = createFeatureSelector<StoreState['router']>('router');
export const { selectRouteParam } = getSelectors(router);
export const currentTaskId = selectRouteParam('taskId');
export const currentTasksState = createSelector(selectRouteParam('state'), (value) => {
  if (typeof value !== 'string') return 'all' as const;
  value = value.split(';')[0];
  if (!value || !isValidTaskState(value)) return 'all' as const;
  return value as TaskState;
});
export const taskById = createSelector(
  tasks,
  (tasks: StoreState['tasks'], props: { taskId: string }) => tasks.values[props.taskId]
);
export const currentTask = createSelector(currentTaskId, tasks, (id, tasks) => (id ? tasks.values[id] : undefined));
export const currentStateTasks = createSelector(tasks, currentTasksState, (tasks, state) =>
  tasks.ids
    .map((id) => {
      const task = tasks.values[id];
      return state === 'all' ? task : task?.state === state ? task : undefined;
    })
    .filter(isTruthy)
    .sort(compareTasks)
);

const filterWorker = new Worker(new URL('../workers/filter.worker.ts', import.meta.url), { type: 'module' });
const filter = Comlink.wrap<(f: TasksFilterParams, v: Task[]) => Task[]>(filterWorker);

export const currentStateTasksWithFilter = (range: TasksFilterParams) =>
  pipe(
    select(currentStateTasks),
    switchMap((tasks) => filter(range, tasks))
  );

export const currentTaskWithFilter = (range: TasksFilterParams) =>
  createSelector(currentTask, (task) => (task ? filterSync({ ...range, taskId: task.id }, [task])[0] : undefined));

const statsWorker = new Worker(new URL('../workers/stats.worker.ts', import.meta.url), { type: 'module' });
const stats = Comlink.wrap<(f: StatsParams, v: Task[]) => Stats>(statsWorker);

export const currentStateTasksStats = (params: StatsParams) =>
  pipe(
    select(tasks),
    switchMap((tasks) => stats(params, [...Object.values(tasks.values)]))
  );

export const theme = createFeatureSelector<StoreState['theme']>('theme');
