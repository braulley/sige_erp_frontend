import { DataService } from './../../data/data.service';
import { PageService } from '../page/page.service';
import { Data } from './../../data/data';
import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    animations: [routerTransition()]
})
export class FormComponent implements OnInit {
    private allItems: any[];
    receitas:any [];
    pager: any = {};
    pagedItems: any[];
    allItem: any;

    error:any;

    constructor(private pageService: PageService, private dataService: DataService ) {
    }

    ngOnInit() {
        this.dataService.getAll().subscribe(
            (response => {
                this.allItems = response;
                this.setPage(1);
            }),
            (error => this.error = error) );
    }

    setPage(page: number) {

        this.allItem =  this.allItems.filter( data =>
            data.categoria == 'receitas'
        );
        console.log('receitas', this.allItem );

        this.pager = this.pageService.getPager(this.allItem .length, page);

        this.pagedItems = this.allItem.slice(this.pager.startIndex, this.pager.endIndex + 1);
        this.receitas = this.pagedItems;
    }
}
