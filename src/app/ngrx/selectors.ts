import { compareTasks, isTask } from '@app/domain';
import { TasksFilterParams, StoreState, Task } from '@app/types';
import { getSelectors } from '@ngrx/router-store';
import { createFeatureSelector, createSelector, select } from '@ngrx/store';
import * as Comlink from 'comlink';
import { pipe } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const tasks = createFeatureSelector<StoreState, StoreState['tasks']>('tasks');
export const router = createFeatureSelector<StoreState, StoreState['router']>('router');
export const { selectRouteParam } = getSelectors(router);
export const currentTaskId = selectRouteParam('taskId');
export const currentTasksState = selectRouteParam('state');
export const taskById = createSelector(
  tasks,
  (tasks: StoreState['tasks'], props: { taskId: string }) => tasks.values[props.taskId]
);
export const currentTask = createSelector(currentTaskId, tasks, (id, tasks) => (id ? tasks.values[id] : undefined));
export const currentStateTasks = createSelector(tasks, currentTasksState, (tasks, state) => {
  return tasks.ids
    .map((id) => (state === 'all' ? tasks.values[id] : tasks.values[id].state === state ? tasks.values[id] : undefined))
    .filter(isTask)
    .sort(compareTasks);
});

const worker = new Worker('../workers/filter.worker.ts', { type: 'module' });
const stats = Comlink.wrap<(f: TasksFilterParams, v: Task[]) => Task[]>(worker);

export const currentStateTasksWithRange = (range: TasksFilterParams) => {
  return pipe(
    select(currentStateTasks),
    switchMap((tasks) => stats(range, tasks))
  );
};
export const theme = createFeatureSelector<StoreState['theme']>('theme');
