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
                        console.log('rh',this.relatorioGeral.rh);
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
        console.log('relatorioGeral',this.relatorioGeral);

        for(let j =0; j <  this.barChartData.length; j++){
            if(j == 0){
                this.barChartData[j].data = this.resultadoReceita;
            }
            else{
                this.barChartData[j].data = this.resultadoDespesa;
            }
        }



    }

    // bar chart
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = [
        'Fluxo de Caixa'
    ];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

    public barChartData: any[] = [
        { data: '' , label: 'Receitas' },
        { data: '', label: 'Despesas' }
    ];

    filterReceita(filter) {
        return filter === 'despesas';
    }
    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}
