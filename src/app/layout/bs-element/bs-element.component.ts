import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

const now = new Date();


@Component({
    selector: 'app-bs-element',
    templateUrl: './bs-element.component.html',
    styleUrls: ['./bs-element.component.scss'],
    animations: [routerTransition()]
})
export class BsElementComponent implements OnInit {

    constructor() {}
    model;
    ngOnInit() {}
}
