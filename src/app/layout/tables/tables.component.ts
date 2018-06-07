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
    datasLogistica: Array<any> = [];
    receitasVendas: Array<any> = [{data_registro: new Date(), total: 0.00}];
    graficoLogistica: Array<any> = [];
    graficoVendas: Array<any> = [];

    graficoLogisticaData: Array<any> = [];
    graficoVendasData: Array<any> = [];

    graficoVendasLogistica: Array<any> = [];

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
                        if(element.categoria == 'receitas'){
                            this.receitasVendas.push(element);
                            this.totalVendas += element.valor;
                        }if(element.categoria == 'despesas'){
                            this.totalDespesas += element.valor;
                        }
                    });

                    this.data.getEstoque()
                    .subscribe( (response => {
                        this.datasLogistica = response;
                        let startDate = new Date(2017, 5, 6);
                        this.datasLogistica.forEach( function(element, index)  {
                            let split = element.preco.split('R$');
                            split = parseFloat(split[1]);
                            element.preco = split;
                            if(index < 19){
                                element.data_registro = new Date(2017,5,6);
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

                        let date = new Date(2017,3,6);


                        for(let i =0 ; i< 12; i++){
                            date = new Date(date.getFullYear(),date.getMonth() + 1, date.getDate());

                            var logistica: any = {
                                data: new Date(),
                                total: 0
                            }

                            logistica.data = date;
                            logistica.total = 0.00;
                            this.graficoLogisticaData.push(logistica.data);

                            for(let j = 0; j< this.datasLogistica.length; j++){
                                if((date.getFullYear() ===  this.datasLogistica[j].data_registro.getFullYear())
                                    &&(date.getMonth() === this.datasLogistica[j].data_registro.getMonth())){
                                    logistica.total += parseFloat(this.datasLogistica[j].preco);
                                }
                            }
                            logistica.total = (logistica.total * 50);
                            let temp =  parseFloat(logistica.total).toFixed(2);
                            temp = temp.toString();
                            let x = parseFloat(temp);
                            this.graficoLogistica.push(x);
                        }

                        let d = new Date(2017,3,6);



                        for(let i =0; i< 12 ; i++){
                            d = new Date(d.getFullYear(),d.getMonth() + 1, d.getDate());

                            let venda: any ={
                                data: new Date(),
                                total: 0
                            }

                            venda.data = d;
                            venda.total = 0.00;

                            this.graficoVendasData.push(venda.data);

                            for(let j = 0; j< this.receitasVendas.length; j++){
                                if((d.getFullYear() ===  this.receitasVendas[j].data_registro.getFullYear())
                                    &&(d.getMonth() === this.receitasVendas[j].data_registro.getMonth())){
                                    venda.total += parseFloat(this.receitasVendas[j].valor);
                                }
                            }
                            let temp =  parseFloat(venda.total).toFixed(2);
                            temp = temp.toString();
                            let x = parseFloat(temp);
                            this.graficoVendas.push(x);
                        }

                        for(let i =0 ; i<12; i++){
                            this.graficoVendasLogistica[i] = this.graficoVendas[i] - this.graficoLogistica[i];
                            this.graficoVendasLogistica[i] = parseFloat(this.graficoVendasLogistica[i]).toFixed(2);
                            this.graficoVendasLogistica[i] = this.graficoVendasLogistica[i].toString();
                            this.graficoVendasLogistica[i] = parseFloat(this.graficoVendasLogistica[i]);
                        }
                        console.log('graficoVendasLogistica',this.graficoVendasLogistica)

                        // Only Change 3 values
                        const grafLogistica = [
                            this.graficoLogistica
                        ];
                        const grafVendas = [
                            this.graficoVendas
                        ];
                        const grafVendasLogistica = [
                            this.graficoLogisticaData
                        ];

                        var somaLogistica = this.graficoLogistica.reduce(function (accumulator, currentValue) {
                            return accumulator + currentValue;
                        }, 0);
                        somaLogistica = parseFloat(somaLogistica).toFixed(2);
                        somaLogistica = somaLogistica.toString();
                        somaLogistica = parseFloat(somaLogistica);

                        const sumLogistica = [
                            somaLogistica
                        ];

                        var somaVendas = this.graficoVendas.reduce(function (accumulator, currentValue) {
                            return accumulator + currentValue;
                        }, 0);
                        somaVendas = parseFloat(somaVendas).toFixed(2);
                        somaVendas = somaVendas.toString();
                        somaVendas = parseFloat(somaVendas);

                        const sumVendas = [
                            somaVendas
                        ];

                        const clonex = JSON.parse(JSON.stringify(this.barChartData));
                        clonex[0].data = sumLogistica;
                        clonex[1].data = sumVendas;
                        console.log('clonex',clonex);
                        this.barChartData = clonex;



                        //Line Chart
                        const clone = JSON.parse(JSON.stringify(this.lineChartData));
                        clone[0].data = grafLogistica[0];
                        clone[1].data = grafVendas[0];
                        this.lineChartData = clone;


                    }), (error => this.error = error));
            }),
            (error => this.error = error) );

       this.data.getVendas()
            .subscribe(( response => {
                this.datasVendas = response;
                this.datasVendas.forEach(element => {
                    element.valor = parseFloat(element.valor);
                    this.totalVendas += element.valor;
                });
            }
            ),(error => this.error = error) );
    }

     // bar chart
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = [
        '2006',
    ];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    public barChartData: any[] = [
        { data: [65], label: 'Logística' },
        { data: [28], label: 'Vendas' }
    ];


    // lineChart
    public lineChartData: Array<any> = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Logística' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Vendas' }
    ];
    public lineChartLabels: Array<any> = [
        'Junho17',
        'Julho17',
        'Agosto17',
        'Setembro17',
        'Outubro17',
        'Novembro17',
        'Dezembro17',
        'Janeiro18',
        'Fevereiro18',
        'Março18',
        'Abril18',
        'Maio18'
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
       /* {
            // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }*/
    ];
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';
}
