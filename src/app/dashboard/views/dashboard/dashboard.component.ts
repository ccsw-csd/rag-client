import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/DasboardStats';
import { DialogService } from 'primeng/dynamicdialog';
import { PromptViewComponent } from 'src/app/prompt/views/prompt-view/prompt-view.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  data: DashboardStats;
  
  options: any;

  dataTags: any;
  dataAuthors: any;
  dataViews: any;

  trasnlateLabelsMap = {};


  constructor(
    private dashboardService: DashboardService,
    private dialogService: DialogService,
    private translateService: TranslateService,
  ) { }

  ngOnInit() {


    this.dashboardService.getStats().subscribe((data: DashboardStats) => {

        this.computeStats(data);

    });


  }

  getData(label: string) : number {
    if (this.data == null || this.data.statsData == null) return 0;

    let filterData = this.data.statsData.filter(item => item.label == label);
    
    if (filterData == null || filterData.length != 1) return 0;

    return filterData[0].value;
  }


    private computeStats(data: DashboardStats) : void {

        this.data = data;

        const documentStyle = getComputedStyle(document.documentElement);
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.options = {
            indexAxis: 'y',
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                display: false
                },
                tooltip: {
                    callbacks: {
                      title: (context) => this.trasnlateLabels(context[0].label),
                    },
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };


        let labelLimit = 35;
        if (window.innerWidth > 1000) labelLimit = 50;
        if (window.innerWidth > 1500) labelLimit = 70;


        this.dataTags = this.extractChartData(data.topTags, 35);
        this.dataAuthors = this.extractChartData(data.topAuthors, 35);
        this.dataViews = this.extractChartData(data.topViews, labelLimit);

    }

    trasnlateLabels(label: string) : string {
        return this.trasnlateLabelsMap[label];
    }

    extractChartData(dataArray: any[], labelLimit: number) : any {

        const documentStyle = getComputedStyle(document.documentElement);

        const colors = [documentStyle.getPropertyValue('--blue-300')+'80',
                        documentStyle.getPropertyValue('--green-400')+'80',
                        documentStyle.getPropertyValue('--cyan-300')+'80',
                        documentStyle.getPropertyValue('--indigo-300')+'80',
                        documentStyle.getPropertyValue('--pink-300')+'80',
                        documentStyle.getPropertyValue('--teal-300')+'80',
                        documentStyle.getPropertyValue('--orange-600')+'80',
                        documentStyle.getPropertyValue('--red-400')+'80',
                        documentStyle.getPropertyValue('--bluegray-300')+'80',
                        documentStyle.getPropertyValue('--yellow-300')+'80'];

        const borderColors = [documentStyle.getPropertyValue('--blue-500'),
                        documentStyle.getPropertyValue('--green-600'),
                        documentStyle.getPropertyValue('--cyan-500'),
                        documentStyle.getPropertyValue('--indigo-500'),
                        documentStyle.getPropertyValue('--pink-500'),
                        documentStyle.getPropertyValue('--teal-500'),
                        documentStyle.getPropertyValue('--orange-800'),
                        documentStyle.getPropertyValue('--red-600'),
                        documentStyle.getPropertyValue('--bluegray-500'),
                        documentStyle.getPropertyValue('--yellow-500')];

        let labels = [];
        let values = [];

        dataArray.forEach(element => {

            let label = element.label;
            if (label.length > labelLimit) label = label.substring(0, labelLimit) + '...';

            labels.push(label);
            values.push(element.value);

            this.trasnlateLabelsMap[label] = element.label;
        });

        for (let i = labels.length; i <= 10; i++) {
            labels.push('');
            values.push(0);
        }

        let dataSet = {
            labels: labels,
            datasets: [
                {
                    label: '',
                    data: values,
                    backgroundColor: colors,
                    borderColor: borderColors,
                    borderWidth: 1
                }
            ]
        };

        return dataSet;       
    }

    onDataSelect(event : any) : any {
        let index = event.element.index;

        let item = this.data.topViews[index];

        let ref = this.dialogService.open(PromptViewComponent, {
            header: this.translateService.instant('edit-prompt.title-view'),
            width: '95vw',
            height: '95vh',
            contentStyle: { overflow: 'auto' },
            baseZIndex: 10000,
            maximizable: false,
            closable: false,
            data: item
          });

    }
}
