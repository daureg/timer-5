import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  DialogEditSessionComponent,
  DialogEditSessionData,
} from '@app/dialog-edit-session/dialog-edit-session.component';
import { Prompt } from '@app/dialog-prompt/dialog-prompt.service';
import { StoreState } from '@app/domain/storage';
import { getTaskSession } from '@app/domain/task';
import { selectCurrentTaskId, selectCurrentTaskState, selectTaskById } from '@app/ngrx/selectors';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { nanoid as id } from 'nanoid';
import { exhaustMap, filter, switchMap, take, tap, withLatestFrom } from 'rxjs/operators';
import {
  createTask,
  createTaskIntent,
  deleteTask,
  renameTask,
  renameTaskIntent,
  updateSession,
  updateSessionIntent,
} from './actions';

@Injectable()
export class Effects {
  constructor(
    private actions$: Actions,
    private store: Store<StoreState>,
    private router: Router,
    private prompt: Prompt,
    private dialog: MatDialog
  ) {}

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createTaskIntent),
      switchMap(() => this.prompt.prompt('Create task', '', 'Task name')),
      switchMap((result) => (result ? [createTask({ taskId: id(), name: result })] : []))
    )
  );

  newTaskRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createTask),
        withLatestFrom(this.store.select(selectCurrentTaskState)),
        exhaustMap(([a, state]) => this.router.navigate(['tasks', state === 'all' ? 'all' : 'active', a.taskId]))
      ),
    { dispatch: false }
  );

  deleteTaskRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteTask),
        withLatestFrom(this.store.select(selectCurrentTaskState), this.store.select(selectCurrentTaskId)),
        filter(([, state]) => !!state),
        tap(([action, state, taskId]) => {
          if (action.taskId === taskId) this.router.navigate(['tasks', state]);
        })
      ),
    { dispatch: false }
  );

  renameTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(renameTaskIntent),
      switchMap((a) =>
        this.store.select(selectTaskById(a.taskId)).pipe(
          take(1),
          exhaustMap((task) => this.prompt.prompt('Rename task', task?.name, 'Task name')),
          switchMap((result) => (result ? [renameTask({ taskId: a.taskId, name: result })] : []))
        )
      )
    )
  );

  editSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSessionIntent),
      switchMap((a) =>
        this.store.select(selectTaskById(a.taskId)).pipe(
          take(1),
          exhaustMap((task) => {
            if (!task) return [];
            const session = getTaskSession(task, a.sessionIndex);
            return session
              ? this.dialog
                  .open<DialogEditSessionComponent, DialogEditSessionData, DialogEditSessionData>(
                    DialogEditSessionComponent,
                    { data: { start: session.start, end: session.end } }
                  )
                  .afterClosed()
                  .pipe(
                    switchMap((r) =>
                      r
                        ? [
                            updateSession({
                              taskId: task.id,
                              sessionIndex: task.sessions.indexOf(session),
                              start: r.start,
                              end: r.end,
                            }),
                          ]
                        : []
                    )
                  )
              : [];
          })
        )
      )
    )
  );
}
