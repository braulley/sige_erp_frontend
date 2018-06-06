import { element } from 'protractor';
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
    datas: Array<any> = [];
    datasRh: Array<any> = [];
    datasVendas: Array<any> = [];
    datasLogistica: Array<any> = [{data_registro: new Date()}];
    grafico: Array<any> = [];

    // paged items
    pagedItems: any[];
    allItem: any;

    totalVendas: any = 0;
    totalDespesas: any = 0;
    totalSalarios: any = 0;
    error:any;

    constructor(public data: DataService, private pageService: PageService) {
    }


    public randomDate(start, end) {
        let day = Math.random() * (end.getDate() - start.getDate())
        var date = new Date(start.getFullYear(),start.getMonth(),day);
        return date;
    }

    ngOnInit() {
       var dataHoje = new Date();
       var hoje = new Date();
       hoje.setMonth(hoje.getMonth() -6);

       this.data.getRh()
       .subscribe(( response => {
           this.datasRh = response;
           this.datasRh.forEach(element => {
            element.SALARIO = parseFloat(element.SALARIO);
            this.totalSalarios += element.SALARIO;
        });
       }
       ),(error => this.error = error) );

       var self = this;
       this.data.getEstoque()
        .subscribe( (response => {
            this.datasLogistica = response;
            let startDate = new Date(2017, 5, 6);
            this.datasLogistica.forEach( function(element, index)  {
                element.data_registro = new Date();
                let split = element.preco.split('R$');
                split = parseFloat(split[1]);
                element.preco = split;
                console.log('element',typeof(element.preco), typeof(element.quantidade));
                if(index < 19){
                    element.data_registro = new Date(2017,5,6); ;
                }else if(index >=19 && index <38 ) {
                    element.data_registro = new Date(2017,6,6);
                }else if(index >=38 && index <57){
                    element.data_registro =  new Date(2017,7,6);
                }else if(index >=57 && index <76){
                    element.data_registro =  new Date(2017,8,6);
                }else if(index >=76 && index <95){
                    element.data_registro =  new Date(2017,9,6);
                }else if(index >=95 && index <114){
                    element.data_registro =  new Date(2017,10,6);
                }else if(index >=114 && index <133){
                    element.data_registro =  new Date(2017,11,6);
                }else if(index >=133 && index <152){
                    element.data_registro =  new Date(2017,12,6);
                }else if(index >=152 && index <171){
                    element.data_registro =  new Date(2018,1,6);
                }else if(index >=171 && index <190){
                    element.data_registro =  new Date(2018,2,6);
                }else if(index >=190 && index <209){
                    element.data_registro =  new Date(2018,3,6);
                }else {
                    element.data_registro = new Date(2018,4,6);
                }
            });

        }), (error => this.error = error));

       this.data.getVendas()
            .subscribe(( response => {
                this.datasVendas = response;
                this.datasVendas.forEach(element => {
                    element.valor = parseFloat(element.valor);
                    this.totalVendas += element.valor;
                });
            }
            ),(error => this.error = error) );


       this.data.getAll()
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
                this.datas.forEach(element => {
                    element.data_registro = new Date(element.data_registro);
                    element.valor = parseFloat(element.valor);
                    if(element.categoria == 'receitas' && (element.data_registro >= hoje && element.data_registro <= dataHoje)){
                        this.totalVendas += element.valor;
                    }if(element.categoria == 'despesas' && (element.data_registro >= hoje && element.data_registro <= dataHoje)){
                        this.totalDespesas += element.valor;
                    }
                });
                //this.setPage(1);
            }),
            (error => this.error = error) );
    }

/*
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
*/

    // Pie
    public pieChartLabels: string[] = [
        'Vendas',
        'Gastos'
    ];
    public pieChartData: number[] = [300, 500];
    public pieChartType: string = 'pie';


    public gerarLucro(): void {
        let total =  parseFloat(this.totalSalarios + this.totalVendas) ;
        let desp =  parseFloat(this.totalDespesas);

       // let soma = parseInt(total) +

        // Only Change 3 values
        const data = [
            total
        ];
        const data2 = [
            desp
        ];
        const clone = JSON.parse(JSON.stringify(this.pieChartData));

        //console.log('clone',clone)
        clone[0] = data;
        clone[1]= data2;
        this.pieChartData = clone;
        /**
         * (My guess), for Angular to recognize the change in the dataset
         * it has to change the dataset variable directly,
         * so one way around it, is to clone the data, change it and then
         * assign it;
         */
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
        { data: [65], label: 'Vendas 6 Meses' },
        { data: [28], label: 'Gastos Meses' }
    ];

    public randomize(): void {
        let total =  parseFloat(this.totalSalarios + this.totalVendas).toFixed(2) ;
        let desp =  parseFloat(this.totalDespesas).toFixed(2);
        // Only Change 3 values
        const data = [
            total
        ];
        const data2 = [
            desp
        ]
        const clone = JSON.parse(JSON.stringify(this.barChartData));
        console.log('data',data);
        console.log('data2',data2);
        console.log('clone',clone)
        console.log()
        clone[0].data = data;
        clone[1].data = data2;
        console.log(clone[1].data);
        this.barChartData = clone;
        console.log('barChartData',this.barChartData);
        /**
         * (My guess), for Angular to recognize the change in the dataset
         * it has to change the dataset variable directly,
         * so one way around it, is to clone the data, change it and then
         * assign it;
         */
    }

    // lineChart
    public lineChartData: Array<any> = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
        { data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C' }
    ];
    public lineChartLabels: Array<any> = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July'
    ];
    public lineChartOptions: any = {
        responsive: true
    };
    public lineChartColors: Array<any> = [
        {
            // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        {
            // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        {
            // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';
}
