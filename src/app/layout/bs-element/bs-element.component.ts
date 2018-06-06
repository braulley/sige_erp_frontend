import { forEach } from '@angular/router/src/utils/collection';
import { element } from 'protractor';
import { DataService } from './../../data/data.service';
import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { PageService } from '../page/page.service';
import { FormBuilder, FormGroup } from '@angular/forms';


const now = new Date();


@Component({
    selector: 'app-bs-element',
    templateUrl: './bs-element.component.html',
    styleUrls: ['./bs-element.component.scss'],
    animations: [routerTransition()]
})
export class BsElementComponent implements OnInit {

    error: any;
    teste: any = [];
    //{ data_pagamento: new Date(), valor: 0 }
    totalDespesasValor: any;
    totalReceitasValor: any;
    totalLucroPrejuizo: any;
    totalDespesas: any = 0.00;
    totalReceitas: any = 0.00;
    totalPagar: any = 0.00;
    piex: any = { rhx: 0, vendax: 0, financeirox: 0, comprax: 0, logisticax: 0 }
    despesas: Array<any> = [];
    receitas: Array<any> = [];
    estoque: Array<any> = [];
    datas: Array<any> = [];
    rh: any;
    Rh: any;
    vendas: any;
    calculoEstoque: Array<any> = [];
    totalEstoque: Number = 0;
    totalVendas: Number = 0;
    temp: Number = 0;
    dataInicio = new Date(2017, 5, 23);
    dataFim = new Date();
    pager: any = {};
    pagedItems: any[];
    itemDespesa: Array<any> = [];
    itemReceita: Array<any> = [];
    data_inicio: any;
    data_fim: any;
    hide: boolean = true;
    show: boolean = false;
    graphicReceita: Array<any> = [];
    graphicDespesa: Array<any> = [];
    percent: number[] = [];
    percentMargem: number[] = [];
    despesaSelect: Array<any> = [];
    receitaSelect: Array<any> = [];
    aPagarSelect: Array<any> = [];
    modo_despesa: any;
    public checkboxGroupForm: FormGroup;


    constructor(private pageService: PageService, private dataService: DataService, private formBuilder: FormBuilder) { }
    model;
    ngOnInit() {
        this.checkboxGroupForm = this.formBuilder.group({
            left: true,
            middle: false,
            right: false
        });

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

                                    admAno++;
                                    this.datas.push(obj);
                                }

                                /*this.datas.forEach(element => {
                                    if(element.categoria == "despesas"){
                                      this.itemDespesa.push(element);
                                    }
                                });*/
                            });
                        }),
                            (error => this.error = error));

                    this.datas.forEach(element => {
                        element.valor = parseFloat(element.valor).toFixed(2);
                        if (element.categoria == 'receitas') {
                            this.receitaSelect.push(element);
                            this.totalReceitas += element.valor;
                            this.totalReceitas = parseFloat(this.totalReceitas) + parseFloat(element.valor);
                        } else if (element.categoria == 'despesas') {
                            this.despesaSelect.push(element);
                            this.totalDespesas = parseFloat(this.totalDespesas) + parseFloat(element.valor);
                        } else {
                            this.aPagarSelect.push(element);
                            this.totalPagar = parseFloat(this.totalPagar) + parseFloat(element.valor);
                        }
                    });
                    console.log('totalReceitas',this.totalReceitas);
                    console.log('totalDespesas',this.totalDespesas);
                    let caixa = parseFloat(this.totalReceitas) - parseFloat(this.totalDespesas);
                    console.log('caixa',caixa);
                    const dataCaixa = [
                        caixa
                    ];
                    const cloneCaixa = JSON.parse(JSON.stringify(this.barChartDataCaixa));
                    cloneCaixa[0].data = dataCaixa;
                    this.barChartDataCaixa = cloneCaixa;
                    console.log('barChartDataCaixa',this.barChartDataCaixa);

                    let s = parseFloat(this.totalPagar).toPrecision(4);
                    s  = s.toString();
                    this.totalPagar = parseFloat(s);
                    const dataDespesaPagar = [
                        this.totalPagar
                    ];

                    const clonePagar = JSON.parse(JSON.stringify(this.barChartDataPagar));
                    clonePagar[0].data = dataDespesaPagar;
                    this.barChartDataPagar = clonePagar;
                    this.setPageDespesa(1);
                    this.setPageReceita(1);
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
            }), (error => this.error = error));

        this.dataService.getRh()
            .subscribe((response => {
                this.rh = response;
            }),
                (error => this.error = error));
    }


    setPageDespesa(page: number) {

        this.itemDespesa = this.datas.filter(data =>
            data.categoria == 'despesas'
        );
        this.itemDespesa.sort(function (a, b) {
            if (new Date(a.data_pagamento) > new Date(b.data_pagamento))
                return -1;
            if (new Date(a.data_pagamento) < new Date(b.data_pagamento))
                return 1;
            return 0;
        });

        this.pager = this.pageService.getPager(this.itemDespesa.length, page);

        this.pagedItems = this.itemDespesa.slice(this.pager.startIndex, this.pager.endIndex + 1);
        this.despesas = this.pagedItems;
    }

    setPageReceita(page: number) {

        this.itemReceita = this.datas.filter(data =>
            data.categoria == 'receitas'
        );
        this.itemReceita.sort(function (a, b) {
            if (new Date(a.data_registro) > new Date(b.data_registro))
                return -1;
            if (new Date(a.data_registro) < new Date(b.data_registro))
                return 1;
            return 0;
        });

        this.pager = this.pageService.getPager(this.itemReceita.length, page);

        this.pagedItems = this.itemReceita.slice(this.pager.startIndex, this.pager.endIndex + 1);
        this.receitas = this.pagedItems;
    }

    gerar() {
        if (this.modo_despesa == "1") {
            this.totalReceitasValor = 0.00;
            this.totalDespesasValor = 0.00;
            this.totalLucroPrejuizo = 0.00;
            let di = new Date(this.data_inicio.year, this.data_inicio.month - 1, this.data_inicio.day);
            let df = new Date(this.data_fim.year, this.data_fim.month - 1, this.data_fim.day);
            let rec = this.receitaSelect;
            let des = this.despesaSelect;
            let dia, mes, ano, r, d;
            rec.forEach(element => {
                r = new Date(element.data_registro);
                element.data_registro = new Date(r.getFullYear(), r.getMonth(), r.getDate());
                element.valor = parseFloat(element.valor);
                if (element.data_registro >= di && element.data_registro <= df) {
                    this.totalReceitasValor += element.valor;
                }
            });
            des.forEach(element => {
                d = new Date(element.data_pagamento);
                element.data_pagamento = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                element.valor = parseFloat(element.valor);
                if (element.data_pagamento >= di && element.data_pagamento <= df) {
                    this.totalDespesasValor += element.valor;
                }
            });
            this.totalReceitasValor = parseFloat(this.totalReceitasValor).toPrecision(4);
            this.totalDespesasValor = parseFloat(this.totalDespesasValor).toPrecision(4);
            this.totalLucroPrejuizo = this.totalReceitasValor - this.totalDespesasValor;
            this.totalLucroPrejuizo = parseFloat(this.totalLucroPrejuizo).toPrecision(4);

            // Only Change 3 values
            const dataReceita = [
                this.totalReceitasValor
            ];
            const dataDespesa = [
                this.totalDespesasValor
            ];

            const clone = JSON.parse(JSON.stringify(this.barChartDataFluxo));
            clone[0].data = dataReceita;
            clone[1].data = dataDespesa;
            console.log('0', clone[0].data);
            console.log('1', clone[1].data);
            this.barChartDataFluxo = clone;

            let lucroLiquido, receitaTotal;

            des.forEach(element => {
                element.valor = parseInt(element.valor);
                if (element.data_pagamento >= di && element.data_pagamento <= df) {

                    if (element.setor == "vendas") {
                        this.piex.vendax += parseInt(element.valor);
                    } if (element.setor == "compras") {
                        this.piex.comprax += parseInt(element.valor);
                    } if (element.setor == "rh") {
                        this.piex.rhx += parseInt(element.valor);
                    } if (element.setor == "logistica") {
                        this.piex.logisticax += parseInt(element.valor);
                    } if (element.setor == "financeiro") {
                        this.piex.financeirox += parseInt(element.valor);
                    }

                }
            });
            this.piex.total = this.piex.vendax + this.piex.comprax + this.piex.rhx + this.piex.logisticax + this.piex.financeirox;
            let temp;
            temp = (this.piex.vendax / this.piex.total) * 100;
            temp = temp.toString();
            let percentVenda = parseInt(temp);
            temp = (this.piex.comprax / this.piex.total) * 100;
            temp = temp.toString();
            let percentCompras = parseInt(temp);
            temp = (this.piex.rhx / this.piex.total) * 100;
            temp = temp.toString();
            let percentRh = parseInt(temp);
            temp = (this.piex.logisticax / this.piex.total) * 100;
            temp = temp.toString();
            let percentLogistica = parseInt(temp);
            temp = (this.piex.financeirox / this.piex.total) * 100;
            temp = temp.toString();
            let percentFinanceiro = parseInt(temp);
            this.percent = [percentVenda, percentCompras, percentRh, percentLogistica, percentFinanceiro];
            this.pieChartData = this.percent;

            this.totalLucroPrejuizo = ((this.totalReceitasValor - this.totalDespesasValor) / this.totalReceitasValor) * 100;
            let x = this.totalLucroPrejuizo.toString();
            this.totalLucroPrejuizo = parseInt(x);
            this.percentMargem = [this.totalLucroPrejuizo];
            this.pieChartDataMargem = this.percentMargem;
            this.hide = false;
        }
        if(this.modo_despesa == "2"){
            this.show = true;
        }
    }

    // bar chart Receitas/Despesas
    public barChartOptionsFluxo: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabelsFluxo: string[] = [
        'Fluxo de Caixa'
    ];
    public barChartTypeFluxo: string = 'bar';
    public barChartLegendFluxo: boolean = true;

    public barChartDataFluxo: any[] = [
        { data: [65], label: 'Receitas' },
        { data: [28], label: 'Despesas' }
    ];



    // bar chart A Pagar
    public barChartOptionsPagar: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabelsPagar: string[] = [
        'Valores'
    ];
    public barChartTypePagar: string = 'bar';
    public barChartLegendPagar: boolean = true;

    public barChartDataPagar: any[] = [
        { data: [760300], label: 'Contas a Pagar' }
    ];

    // bar chart em Caixa
    public barChartOptionsCaixa: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabelsCaixa: string[] = [
        '2006'
    ];
    public barChartTypeCaixa: string = 'bar';
    public barChartLegendCaixa: boolean = true;

    public barChartDataCaixa: any[] = [
        { data: [65, 59, 80, 81, 56, 55, 40], label: 'Disponível no Caixa' }
    ];
    /*
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
        const clone = JSON.parse(JSON.stringify(this.barChartData));
        clone[0].data = data;
        this.barChartData = clone;
        /**
         * (My guess), for Angular to recognize the change in the dataset
         * it has to change the dataset variable directly,
         * so one way around it, is to clone the data, change it and then
         * assign it;

}*/

    // Pie
    public pieChartLabels: string[] = [
        'Vendas',
        'Compras',
        'RH',
        'Logística',
        'Financeiro'
    ];
    public pieChartData: number[] = [300, 500, 100, 50, 56];
    public pieChartType: string = 'pie';

    // Pie Margem
    public pieChartLabelsMargem: string[] = [
        'Margem de Lucro'
    ];
    public pieChartDataMargem: number[] = [300, 500, 100, 50, 56];
    public pieChartTypeMargem: string = 'pie';
}
