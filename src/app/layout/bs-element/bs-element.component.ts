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
    totalDespesas: any = [{ data_pagamento: new Date(), valor: 0}];
    despesa: Array<any> = [];
    estoque: Array<any> = [];
    datas: Array<any> = [];
    rh:any;
    Rh:any;
    vendas: any;
    calculoEstoque: Array<any> = [];
    totalEstoque: Number = 0;
    totalVendas: Number = 0;
    temp: Number = 0;
    dataInicio = new Date(2017,5,23);
    dataFim = new Date();



    constructor(private dataService: DataService) {}
    model;
    ngOnInit() {
        this.dataService.getAll()
            .subscribe(
                (response => {
                    this.datas = response;
                    var tam = this.datas.length;

                    this.dataService.getRh()
                        .subscribe(( response => {
                            this.rh = response;
                            this.rh.forEach(element => {
                                let srtx = element.DATA_ADMISSAO;
                                let srty = element.DATA_DEMISSAO;
                                let x = srtx.split('/');
                                let y = srty.split('/');
                                element.DATA_ADMISSAO = new Date(x[2], x[1], x[0]);
                                element.DATA_DEMISSAO = new Date(y[2], y[1], y[0]);
                                let dats = this.dataInicio;
                                console.log('dats',dats);
                                let admAno = dats.getMonth();

                                let inicio = this.dataInicio.getMonth();

                                while(dats <= element.DATA_DEMISSAO ){
                                    tam ++;
                                    console.log('tam', tam);
                                    dats.setMonth(admAno);
                                    var obj = {
                                        id: tam,
                                        categoria: 'despesas',
                                        data_pagamento: dats,
                                        data_registro: '',
                                        data_vencimento: '',
                                        descricao: '',
                                        setor: 'Rh',
                                        nome: element.NOME,
                                        obeservacao1: '',
                                        observacao2: '',
                                        pago: 'sim',
                                        recebido: '',
                                        valor: element.SALARIO
                                    }

                                    admAno ++;
                                    this.datas.push(obj);
                                }

                            });


                            this.datas.forEach(element => {
                                if(element.categoria == "despesas"){
                                  this.despesa.push(element);
                                }
                            });

                            this.despesa.sort(function(a, b){
                                if (new Date(a.data_pagamento ) > new Date(b.data_pagamento))
                                    return -1;
                                if (new Date(a.data_pagamento) < new Date(b.data_pagamento))
                                    return 1;
                                return 0;
                            });
                            console.log('Despesas',this.despesa);
                        }),
                    (error => this.error = error) );
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
                   // console.log('totalVendas',this.totalVendas)
                });
            }),(error => this.error = error) );

        this.dataService.getRh()
            .subscribe(( response => {
                this.rh = response;
               /* this.datas.sort(function(a, b){
                    if (new Date(a.data_registro ) < new Date(b.data_registro))
                        return -1;
                    if (new Date(a.data_registro) > new Date(b.data_registro))
                        return 1;
                    return 0;
                });*/
               // console.log('Rh', this.rh);
            }),
            (error => this.error = error) );
    }



    // bar chart
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };

    loadChart(){
        for (let i = 0; i < this.despesa.length ; i++) {
            console.log('despesa',this.despesa[i]);
            this.totalDespesas[i].data_pagamento = this.despesa[i].data_pagamento;
            console.log('data_pagamento',this.totalDespesas[i].data_pagamento);
            /*for (let j = 1; j < this.despesa.length ; j++) {
                 if( (i!= j) && (this.despesa[i] == this.despesa[j])){
                     this.totalDespesas[i] = this.despesa[i] + this.despesa[j];
                 }
            }*/
        }
        /*for (let i = 0; i < 7 ; i++) {
            let j = 1 ;
            while(this.despesa[i].data_pagamento != this.despesa[i].data_pagamento ){
                this.despesa[i].valor += this.despesa[i].data_pagamento;
                j++;
            }
            //let data = JSON.stringify(this.despesa[i]);
           // let bar =  this.despesa[i].data_pagamento;
            //let t = bar.split('-');
            //console.log('t',t);
            //this.barChartLabels[i] = bar.toString();
            //console.log('barChartLabels',this.barChartLabels[i]);
        }*/
    }

    public barChartLabels: string[] = [
        '2006',
        '2007',
        '2008',
        '2009',
        '2010',
        '2011',
        '2012'
    ];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    public barChartData: any[] = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Despesas' },
        { data: [28, 48, 40, 19, 86, 27, 90], label: 'Receitas' }
    ];

    public randomize(): void {
        // Only Change 3 values
        this.loadChart();
        const data = [
            Math.round(Math.random() * 100),
            59,
            80,
            Math.random() * 100,
            56,
            Math.random() * 100,
            40
        ];
        const clone = JSON.parse(JSON.stringify(this.barChartData));
        clone[0].data = data;
        this.barChartData = clone;
        /**
         * (My guess), for Angular to recognize the change in the dataset
         * it has to change the dataset variable directly,
         * so one way around it, is to clone the data, change it and then
         * assign it;
         */
    }
}
