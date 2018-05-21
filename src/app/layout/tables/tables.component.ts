import { DataService } from './../../data/data.service';
import { PageService } from '../page/page.service';
import { Data } from './../../data/data';
import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';


@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.scss'],
    animations: [routerTransition()]
})
export class TablesComponent implements OnInit {

    // array of all items to be paged
    private allItems: any[];
    contas:any [];
    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];
    allItem: any;

    error:any;

    constructor(public data: DataService, private pageService: PageService) {
    }

    ngOnInit() {
       this.data.getAll()
        .subscribe(
            (response => {
                this.allItems = response;
                this.setPage(1);
            }),
            (error => this.error = error) );

    }


    setPage(page: number) {

        this.allItem =  this.allItems.filter( data =>
            data.categoria == 'despesas'
        );
        console.log('this.allItems', this.allItem );

        this.pager = this.pageService.getPager(this.allItem .length, page);

        this.pagedItems = this.allItem.slice(this.pager.startIndex, this.pager.endIndex + 1);
        this.contas = this.pagedItems;
       // console.log(this.contas);
    }
}
