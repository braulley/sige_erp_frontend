import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { TablesRoutingModule } from './tables-routing.module';
import { TablesComponent } from './tables.component';
import { PageHeaderModule } from './../../shared';
import { ChartsModule as Ng2Charts } from 'ng2-charts';


@NgModule({
    imports: [CommonModule, TablesRoutingModule, PageHeaderModule, NgbModule, Ng2Charts],
    declarations: [TablesComponent]
})
export class TablesModule {}
