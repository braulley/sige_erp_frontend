import { element } from 'protractor';
import { DataService } from './../../data/data.service';
import { Data } from './../../data/data';
import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {

    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    data_inicio: any;
    data_fim: any;
    datas: Array<any> = [];
    receita: Array<any> = [];
    despesa: Array<any> = [];
    totalDespesas: any = 0;
    totalReceitas: any = 0;
    lucroPrejuizo: any = 0;
    rh: any;
    Rh: any;
    totalVendas: Number = 0;
    vendas: any;
    temp: Number = 0;
    estoque: Array<any> = [];
    dataInicio = new Date(2017, 5, 23);
    calculoEstoque: Array<any> = [];


    dataFim = new Date();
    totalEstoque: Number = 0;

    relatorioGeral: any = { receita : 0 , despesa: 0, rh: 0, logistica: 0, vendas: 0, compras: 0, financeiro: 0}

    resultadoReceita: any = 0;
    resultadoDespesa: any = 0;
    error:any;

    constructor(private dataService : DataService, private data: Data) {
        this.sliders.push(
            {
                imagePath: 'assets/images/slider1.jpg',
                label: 'First slide label',
                text:
                    'Nulla vitae elit libero, a pharetra augue mollis interdum.'
            },
            {
                imagePath: 'assets/images/slider2.jpg',
                label: 'Second slide label',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
            },
            {
                imagePath: 'assets/images/slider3.jpg',
                label: 'Third slide label',
                text:
                    'Praesent commodo cursus magna, vel scelerisque nisl consectetur.'
            }
        );

        this.alerts.push(
            {
                id: 1,
                type: 'success',
                message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
            },
            {
                id: 2,
                type: 'warning',
                message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Voluptates est animi quibusdam praesentium quam, et perspiciatis,
                consectetur velit culpa molestias dignissimos
                voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
            }
        );
    }

    ngOnInit() {
        this.dataService.getAll()
            .subscribe(
                (response => {
                    this.datas = response;

                    this.datas.forEach( element => {
                        let date = new Date(2018,5,31);
                        date.setMonth(date.getMonth() - 6);
                        element.data_registro = new Date(element.data_registro);

                        if(element.data_registro > date){
                            if(element.categoria == 'despesas'){
                                if(element.setor == 'rh'){
                                    this.relatorioGeral.rh = parseFloat(this.relatorioGeral.rh);
                                    this.relatorioGeral.rh += parseFloat(element.valor);
                                }if(element.setor == 'logistica'){
                                    this.relatorioGeral.logistica = parseFloat(this.relatorioGeral.logistica);
                                    this.relatorioGeral.logistica += parseFloat(element.valor);
                                }if(element.setor == 'vendas'){
                                    this.relatorioGeral.vendas = parseFloat(this.relatorioGeral.vendas);
                                    this.relatorioGeral.vendas += parseFloat(element.valor);
                                }if(element.setor == 'compras'){
                                    this.relatorioGeral.compras = parseFloat(this.relatorioGeral.compras);
                                    this.relatorioGeral.compras += parseFloat(element.valor);
                                }if(element.setor == 'financeiro'){
                                    this.relatorioGeral.financeiro = parseFloat(this.relatorioGeral.financeiro);
                                    this.relatorioGeral.financeiro += parseFloat(element.valor);
                                }
                                this.resultadoDespesa += parseFloat(element.valor);
                            }if(element.categoria == 'receitas'){
                                this.resultadoReceita += parseFloat(element.valor);
                                this.relatorioGeral.receita += parseFloat(element.valor);
                            }
                        }
                    });

                    var tam = this.datas.length;
                    this.dataService.getRh()
                        .subscribe((response => {
                            this.rh = response;
                            this.rh.forEach(element => {
                                let srtx = element.DATA_ADMISSAO;
                                let srty = element.DATA_DEMISSAO;
                                let x = srtx.split('/');
                                let y = srty.split('/');
                                element.DATA_ADMISSAO = new Date(x[2], x[1], x[0]);
                                element.DATA_DEMISSAO = new Date(y[2], y[1], y[0]);
                                let dats = this.dataInicio;
                                let admAno = dats.getMonth();

                                let inicio = this.dataInicio.getMonth();

                                while (dats <= element.DATA_DEMISSAO) {
                                    tam++;
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

                                    admAno++;
                                    this.datas.push(obj);
                                }
                            });

                            this.rh.foreach(element => {
                                this.relatorioGeral.rh += element.valor;
                            });
                        }),
                        (error => this.error = error));

                        this.dataService.getEstoque()
                        .subscribe((response => {
                            this.estoque = response;
                            this.estoque.forEach(element => {
                                element.preco = element.preco.split('R$ ');
                                element.preco = parseFloat(element.preco[1]);
                                element.quantidade = parseInt(element.quantidade);
                                this.temp = element.preco * element.quantidade;
                                this.calculoEstoque.push(this.temp);
                            });
                            this.calculoEstoque.forEach(element => {
                                element = parseFloat(element);
                                this.totalEstoque += element;
                                this.relatorioGeral.logistica+= element;
                            });
                        }), (error => this.error = error));

                        this.dataService.getVendas()
                            .subscribe((response => {
                                this.vendas = response;
                                this.vendas.forEach(element => {
                                    element.valor = parseFloat(element.valor);
                                    this.totalVendas += element.valor;
                                    this.relatorioGeral.receita += element.valor;
                                });
                            }),
                        (error => this.error = error));


                    this.datas.sort(function(a, b){
                        if (new Date(a.data_registro ) < new Date(b.data_registro))
                            return -1;
                        if (new Date(a.data_registro) > new Date(b.data_registro))
                            return 1;
                        return 0;
                    });
                   for(let i=0; i< this.datas.length; i++){
                        if(this.datas[i].categoria == 'despesas'){
                            this.despesa.push(this.datas[i]);
                            this.totalDespesas += parseFloat(this.datas[i].valor);
                        }if(this.datas[i].categoria == 'receitas'){
                            this.receita.push(this.datas[i]);
                            this.totalReceitas += parseFloat(this.datas[i].valor);
                        }
                   }
                   this.totalReceitas = this.relatorioGeral.receita;


                   this.relatorioGeral.despesa += this.relatorioGeral.rh;
                   this.relatorioGeral.despesa += this.relatorioGeral.compras;
                   this.relatorioGeral.despesa += this.relatorioGeral.financeiro;
                   this.relatorioGeral.despesa += this.relatorioGeral.logistica;
                   this.relatorioGeral.despesa += this.relatorioGeral.vendas;

                   this.totalDespesas = this.relatorioGeral.despesa;
                   this.lucroPrejuizo = this.totalReceitas - this.totalDespesas;
                   const despesaGrafico = [
                        parseFloat(this.relatorioGeral.despesa).toFixed(2)
                   ];
                   const receitaGrafico = [
                        parseFloat(this.relatorioGeral.receita).toFixed(2)
                   ];

                   const cloneDespesas = JSON.parse(JSON.stringify(this.barChartDataDespesas));
                   console.log('cloneDespesas',cloneDespesas);
                   cloneDespesas[0].data = despesaGrafico;
                   cloneDespesas[1].data = receitaGrafico;
                    this.barChartDataDespesas = cloneDespesas;

                    const rhGrafico = [
                        this.relatorioGeral.rh,
                        this.relatorioGeral.vendas,
                        this.relatorioGeral.financeiro,
                        this.relatorioGeral.compras,
                        this.relatorioGeral.logistica

                    ];
                    const comprasGrafico = [

                    ];
                    const financeiroGrafico = [

                    ];
                    const vendasGrafico = [

                    ];
                    const LogisticaGrafico = [

                    ];
                    console.log('rhGrafico',rhGrafico);
                    const clonex = JSON.parse(JSON.stringify(this.lineChartData));
                    console.log('cloneDespesas',clonex);
                    clonex[0].data = rhGrafico;
                    this.lineChartData = clonex;

                }),
                (error => this.error = error) );
    }


    // bar chart
    public barChartOptionsDespesas: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabelsDespesas: string[] = [
        'Despesas x Receitas'
    ];
    public barChartTypeDespesas: string = 'bar';
    public barChartLegendDespesas: boolean = true;

    public barChartDataDespesas: any[] = [
        { data: [65], label: 'Despesas' },
        { data: [28], label: 'Receitas' }
    ];

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

    // lineChart
    public lineChartData: Array<any> = [
        { data: [65, 59, 80, 81, 56 ], label: 'Despesas' },
    ];
    public lineChartLabels: Array<any> = [
        'Rh',
        'Vendas',
        'Financeiro',
        'Compras',
        'Logística'
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
            /*backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'*/
        }
    ];
        public lineChartLegend: boolean = true;
        public lineChartType: string = 'line';

        // events
        public chartClicked(e: any): void {
            // console.log(e);
        }

        public chartHovered(e: any): void {
            // console.log(e);
        }
}
