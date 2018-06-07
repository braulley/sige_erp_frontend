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
                            });
                        }), (error => this.error = error));

                        this.dataService.getVendas()
                            .subscribe((response => {
                                this.vendas = response;
                                this.vendas.forEach(element => {
                                    element.valor = parseFloat(element.valor);
                                    this.totalVendas += element.valor;
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
                   this.lucroPrejuizo = this.totalReceitas - this.totalDespesas;



                   //const cloneDespesas = JSON.parse(JSON.stringify(this.barChartDataDespesas));
                  //cloneDespesas[0].data = data;
                    //this.barChartDataDespesas = cloneDespesas;
                }),
                (error => this.error = error) );
    }

    gerar(){
        for(let j =0; j <  this.datas.length; j++){
            this.datas[j].data_registro = new Date(this.datas[j].data_registro);
            this.data_inicio = new Date(this.data_inicio);
            this.data_fim = new Date(this.data_fim);
            if(( this.data_inicio >= this.datas[j].data_registro ) && (this.datas[j].data_registro <= this.data_fim) ){
                if(this.datas[j].categoria == 'despesas'){

                    if(this.datas[j].setor == 'rh'){
                        this.relatorioGeral.rh = parseFloat(this.relatorioGeral.rh);
                        this.relatorioGeral.rh += parseFloat(this.datas[j].valor);
                    }if(this.datas[j].setor == 'logistica'){
                        this.relatorioGeral.logistica = parseFloat(this.relatorioGeral.logistica);
                        this.relatorioGeral.logistica += parseFloat(this.datas[j].valor);
                    }if(this.datas[j].setor == 'vendas'){
                        this.relatorioGeral.vendas = parseFloat(this.relatorioGeral.vendas);
                        this.relatorioGeral.vendas += parseFloat(this.datas[j].valor);
                    }if(this.datas[j].setor == 'compras'){
                        this.relatorioGeral.compras = parseFloat(this.relatorioGeral.compras);
                        this.relatorioGeral.compras += parseFloat(this.datas[j].valor);
                    }

                    this.resultadoDespesa += parseFloat(this.datas[j].valor);
                }if(this.datas[j].categoria == 'receitas'){
                    this.resultadoReceita += parseFloat(this.datas[j].valor);
                }
            }
        }
    }

    // bar chart
    public barChartOptionsDespesas: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabelsDespesas: string[] = [
        'Dezembro 2018',
        'Janeiro 2018',
        'Fevereiro 2018',
        'Março 2018',
        'Abril 2018',
        'Maio 2018'
    ];
    public barChartTypeDespesas: string = 'bar';
    public barChartLegendDespesas: boolean = true;

    public barChartDataDespesas: any[] = [
        { data: [65, 59, 80, 81, 56, 55], label: 'Despesas' },
        { data: [28, 48, 40, 19, 86, 27], label: 'Receitas' }
    ];
    filterReceita(filter) {
        return filter === 'despesas';
    }
    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

    public randomize(): void {
        // Only Change 3 values
        const data = [
            Math.round(Math.random() * 100),
            59,
            80,
            Math.random() * 100,
            56,
            Math.random() * 100,
            40
        ];

        /**
         * (My guess), for Angular to recognize the change in the dataset
         * it has to change the dataset variable directly,
         * so one way around it, is to clone the data, change it and then
         * assign it;
         */
    }
}
