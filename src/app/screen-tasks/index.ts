import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {RouterModule} from '@angular/router'
import {
    MatButtonModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule
} from '@angular/material'
import {ScrollingModule} from '@angular/cdk/scrolling'
import {NgScrollbarModule} from 'ngx-scrollbar'

import {ScreenTasksComponent} from './component'
import {ButtonTaskActionsModule} from '@app/button-task-actions'
import {TaskStatePipeModule} from '@app/pipes/task-state.pipe'
import {FormatDurationPipeModule} from '@app/pipes/format-duration.pipe'
import {TaskDurationPipeModule} from '@app/pipes/task-duration.pipe'

export {ScreenTasksComponent}

@NgModule({
    declarations: [ScreenTasksComponent],
    entryComponents: [ScreenTasksComponent],
    exports: [ScreenTasksComponent],
    imports: [
        CommonModule,
        TaskStatePipeModule,
        FormatDurationPipeModule,
        TaskDurationPipeModule,
        RouterModule,
        ScrollingModule,
        NgScrollbarModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        ButtonTaskActionsModule
    ]
})
export class ScreenTasksModule {}