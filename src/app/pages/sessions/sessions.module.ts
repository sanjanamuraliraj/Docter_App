import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SessionsPageRoutingModule } from './sessions-routing.module';

import { SessionsPage } from './sessions.page';
import { SessionComponent } from 'src/app/components/session/session.component';
import { AddWorkplaceModalComponent } from 'src/app/components/add-workplace-modal/add-workplace-modal.component';
import { AddQualificationModalComponent } from 'src/app/components/add-qualification-modal/add-qualification-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    SessionsPageRoutingModule
  ],
  declarations: [SessionsPage],
  entryComponents: [SessionComponent, AddWorkplaceModalComponent, AddQualificationModalComponent]
})
export class SessionsPageModule {}
