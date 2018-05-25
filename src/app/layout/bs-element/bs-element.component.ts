import { forEach } from '@angular/router/src/utils/collection';
import { element } from 'protractor';
import { DataService } from './../../data/data.service';
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

    error: any;
    totalDespesas: number;
    despesa: any;
    estoque: Array<any> = [];
    datas: any;
    rh:any;
    vendas: any;
    calculoEstoque: Array<any> = [];
    totalEstoque: Number = 0;
    totalVendas: Number = 0;
    temp: Number = 0;
    constructor(private dataService: DataService) {}
    model;
    ngOnInit() {
        this.dataService.getAll()
            .subscribe(
                (response => {
                    this.datas = response;
                    this.datas.sort(function(a, b){
                        if (new Date(a.data_registro ) < new Date(b.data_registro))
                            return -1;
                        if (new Date(a.data_registro) > new Date(b.data_registro))
                            return 1;
                        return 0;
                    });
                }),
                (error => this.error = error) );

       this.dataService.getEstoque()
            .subscribe( (response => {
                this.estoque = response;
                this.estoque.forEach(element => {
                    element.preco = element.preco.split('R$ ');
                    element.preco = parseFloat(element.preco[1]);
                    element.quantidade = parseInt(element.quantidade);
                    this.temp = element.preco * element.quantidade;
                    this.calculoEstoque.push(this.temp);
                });
                this.calculoEstoque.forEach( element => {
                    element = parseFloat(element);
                    this.totalEstoque += element;
                });
        }), (error => this.error = error) );

        this.dataService.getVendas()
            .subscribe((response => {
                this.vendas = response;
                this.vendas.forEach(element => {
                    element.valor = parseFloat(element.valor);
                    this.totalVendas += element.valor;
                    console.log('totalVendas',this.totalVendas)
                });
            }),(error => this.error = error) );
    }

    // bar chart
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = [
        'últimos 12 Meses'
    ];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    public barChartData: any[] = [
        //{ data: [65, 59, 80, 81, 56, 55, 40], label: 'Vendas' },
        //{ data: [28, 48, 40, 19, 86, 27, 90], label: 'Logística' }
        { data: [65], label: 'Vendas' },
        { data: [150404], label: 'Logística' }
    ];

    public randomize(): void {
        // Only Change 3 values
        console.log('totalVendas',this.totalVendas);
        const data = [
            this.totalEstoque.toFixed(2)
        ];
        const data2 = [
            this.totalVendas.toFixed(2)
        ]
        const clone = JSON.parse(JSON.stringify(this.barChartData));
        clone[0].data = data;
        clone[1].data = data2;
        console.log('clone',clone);
        this.barChartData = clone;
        /**
         * (My guess), for Angular to recognize the change in the dataset
         * it has to change the dataset variable directly,
         * so one way around it, is to clone the data, change it and then
         * assign it;
         */
    }
}
