import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule as Ng2Charts } from 'ng2-charts';

import { BsElementRoutingModule } from './bs-element-routing.module';
import { BsElementComponent } from './bs-element.component';
import { PageHeaderModule } from './../../shared';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';



@NgModule({
    imports: [CommonModule,Ng2Charts, BsElementRoutingModule, PageHeaderModule,NgbModule, FormsModule],
    declarations: [BsElementComponent]
})
export class BsElementModule {}
