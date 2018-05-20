import { DataService } from './data/data.service';
import { Data } from './data/data';
import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    constructor(private dataService: DataService, private data: Data) {
    }


    error:any;

    ngOnInit() {
       this.dataService.getAll()
            .subscribe(
                (response => {
                    this.data.storage = response
                }),
                (error => this.error = error) );
    }
}
