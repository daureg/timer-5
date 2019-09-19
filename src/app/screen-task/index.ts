import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'
import {
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatTooltipModule
} from '@angular/material'
import {RouterModule} from '@angular/router'
import {NgScrollbarModule} from 'ngx-scrollbar'


import {ScreenTaskComponent} from './component'
export {ScreenTaskComponent}

import {ButtonTaskActionsModule} from '@app/button-task-actions'
import {FormatDurationPipeModule} from '@app/pipes/format-duration.pipe'
import {TaskDurationPipeModule} from '@app/pipes/task-duration.pipe'
import {ButtonSessionActionsModule} from '@app/button-session-actions'

@NgModule({
    declarations: [ScreenTaskComponent],
    entryComponents: [ScreenTaskComponent],
    exports: [ScreenTaskComponent],
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatTableModule,
        MatTooltipModule,
        NgScrollbarModule,
        FormatDurationPipeModule,
        TaskDurationPipeModule,
        ButtonTaskActionsModule,
        ButtonSessionActionsModule
    ]
})
export class ScreenTaskModule {}