import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { EChartsOption } from 'echarts';
import { BarChart, LineChart, PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { GroupFacade } from '../../aplication/group.facade';
import { ExitGroup } from '../../core/guards/exit-group.guard';
import { Group, User } from '../../core/interfaces/search-group.interface';
import { PdfService } from '../../core/stores/pdf.service';
import { TokensService } from '../../core/stores/tokens.service';
import { DataGroup } from './table.interface';
echarts.use([BarChart, GridComponent, CanvasRenderer, LineChart, TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout]);



@Component({
  selector: 'app-data-group',
  templateUrl: './data-group.component.html',
  styleUrls: ['./data-group.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    RouterModule,
    MatPaginatorModule,
    MatButtonModule,
    CommonModule,
    NgxEchartsDirective,
  ],
  providers: [provideEchartsCore({ echarts })],
})
export class DataGroupComponent implements OnInit, ExitGroup {
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef)
  private readonly groupService: GroupFacade = inject(GroupFacade);
  private readonly tokenService: TokensService = inject(TokensService);
  private readonly pdfService: PdfService = inject(PdfService);

  weightByCompetence: { [id: number]: number } = {
    1: 0.0238,
    3: 0.0238,
    11: 0.0238,
    12: 0.0238,
    14: 0.0238,
    16: 0.0238,
    17: 0.0238,
    2: 0.0476,
    4: 0.0476,
    15: 0.0476,
    13: 0.0476,
    5: 0.0714,
    6: 0.0714,
    7: 0.0714,
    8: 0.0714,
    9: 0.0714,
    10: 0.0714,
    18: 0.0714,
    19: 0.0714,
    20: 0.0714,
  };
  weightByCapacity1: { [id: number]: number } = {
    1: 0.0455,
    2: 0.0909,
    3: 0.0455,
    4: 0.0909,
    5: 0.1364,
    6: 0.1364,
    7: 0.1364,
    11: 0.0455,
    12: 0.0455,
    14: 0.0455,
    15: 0.0909,
    16: 0.0455,
    17: 0.0455,
  };
  weightByCapacity2: { [id: number]: number } = {
    8: 0.15,
    9: 0.15,
    10: 0.15,
    13: 0.1,
    18: 0.15,
    19: 0.15,
    20: 0.15,
  };
  listGrafic: string[] = [];

  chartOption!: EChartsOption;
  chartOptionCap1!: EChartsOption;
  chartOptionCap2!: EChartsOption;
  chartOptionComp!: EChartsOption;

  displayedColumns: string[] = [
    'name',
    'lastName',
    'grade',
    'section',
    'createAt',
    'capacity1',
    'capacity2',
    'competence',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataGroup: DataGroup[] = [];
  dataList: User[] = [];
  dataTable!: MatTableDataSource<DataGroup>;
  totalScoreCompetence: number[] = [];
  totalScoreCapacity1: number[] = [];
  totalScoreCapacity2: number[] = [];
  competences: string[] = [];
  capacity1: string[] = [];
  capacity2: string[] = [];
  groupName!: string;
  totalScores: number[] = [];
  isDataView: boolean = true;
  isGraficsView: boolean = false;

  ngOnInit() {
    this.groupService.getGroup().subscribe({
      next: (resp: Group[]) => {
        console.log(resp);
        this.groupName = resp[0].nameGroup;
        this.dataList = resp[0].users;
        let nameList: string[] = [];
        let points: number[] = [];


        for (let i = 0; i < this.dataList.length; i++) {
          let totalScoreCompetence = 0;
          let totalScoreCapacity1 = 0;
          let totalScoreCapacity2 = 0;
          let totalScore = 0;
          nameList.push(this.dataList[i].name);

          for (let j = 0; j < this.dataList[i].answer.length; j++) {
            const qId = this.dataList[i].answer[j].question.id;
            totalScore += this.dataList[i].answer[j].answerTF;
            const weightCompetence: number = this.getWeightByCompetence(qId);
            totalScoreCompetence +=
              this.dataList[i].answer[j].answerTF * weightCompetence;
            if (this.weightByCapacity1[qId]) {
              const weightCapacity1: number = this.getWeightByCapacity(qId);
              totalScoreCapacity1 +=
                this.dataList[i].answer[j].answerTF * weightCapacity1;
            }
            if (this.weightByCapacity2[qId]) {
              const weightCapacity2: number = this.getWeightByCapacity(qId);
              totalScoreCapacity2 +=
                this.dataList[i].answer[j].answerTF * weightCapacity2;
            }
          }
          this.totalScoreCompetence.push(
            Math.round(totalScoreCompetence * 100) / 100
          );
          this.totalScoreCapacity1.push(
            Math.round(totalScoreCapacity1 * 100) / 100
          );
          this.totalScoreCapacity2.push(
            Math.round(totalScoreCapacity2 * 100) / 100
          );
          points.push(totalScore);
          this.competences.push(this.getLetter(this.totalScoreCompetence[i]));
          this.capacity1.push(this.getLetter(this.totalScoreCapacity1[i]));
          this.capacity2.push(this.getLetter(this.totalScoreCapacity2[i]));
        }

        this.chartOption = {
          xAxis: {
            type: 'category',
            data: this.dataList.map((_,i) => i+1)
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: points,
              type: 'bar',
            },
          ],
        };

        let countLettersC1: number[] = this.countLetter(this.capacity1);
        let countLettersC2: number[] = this.countLetter(this.capacity2);
        let countLettersComp: number[] = this.countLetter(this.competences);

        //let countOfAD = countLettersC1[0] + countLettersC2[0] + countLettersComp[0];
        //let countOfA = countLettersC1[1] + countLettersC2[1] + countLettersComp[1];
        //let countOfB = countLettersC1[2] + countLettersC2[2] + countLettersComp[2];
        //let countOfC = countLettersC1[3] + countLettersC2[3] + countLettersComp[3];

        this.chartOptionCap1 = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '10%',
            left: 'center'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: ['40%', '90%'],
              center: ['50%', '80%'],
              startAngle: 180,
              endAngle: 360,
              data: [
                { value: countLettersC1[0], name: 'AD' },
                { value: countLettersC1[1], name: 'A' },
                { value: countLettersC1[2], name: 'B' },
                { value: countLettersC1[3], name: 'C' }
              ]
            }
          ]
        };

        this.chartOptionCap2 = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '10%',
            left: 'center'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: ['40%', '90%'],
              center: ['50%', '80%'],
              startAngle: 180,
              endAngle: 360,
              data: [
                { value: countLettersC2[0], name: 'AD' },
                { value: countLettersC2[1], name: 'A' },
                { value: countLettersC2[2], name: 'B' },
                { value: countLettersC2[3], name: 'C' }
              ]
            }
          ]
        };

        this.chartOptionComp = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '10%',
            left: 'center'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: ['40%', '90%'],
              center: ['50%', '80%'],
              startAngle: 180,
              endAngle: 360,
              data: [
                { value: countLettersComp[0], name: 'AD' },
                { value: countLettersComp[1], name: 'A' },
                { value: countLettersComp[2], name: 'B' },
                { value: countLettersComp[3], name: 'C' }
              ]
            }
          ]
        };


        this.pdfService.accessGroupName = this.groupName;
        this.pdfService.accessData = this.dataList;
        this.pdfService.accessC1 = this.capacity1;
        this.pdfService.accessC2 = this.capacity2;
        this.pdfService.accessComp = this.competences;

        this.dataList.forEach((user,index) => {
          this.dataGroup.push({
            user: user,
            c1: this.capacity1[index],
            c2: this.capacity2[index],
            comp: this.competences[index]
          })
        })
        this.dataTable = new MatTableDataSource<DataGroup>(this.dataGroup);
        this.dataTable.paginator = this.paginator;
      },
      error: (err) => {
        console.log('este es el error: ', err);
      },
    });
  }

  getWeightByCompetence(id: number): number {
    return this.weightByCompetence[id];
  }

  getWeightByCapacity(id: number): number {
    return this.weightByCapacity1[id]
      ? this.weightByCapacity1[id]
      : this.weightByCapacity2[id];
  }

  getLetter(score: number): string {
    if (score <= 0.5) return 'C';
    if (score > 0.5 && score <= 0.65) return 'B';
    if (score > 0.65 && score <= 0.85) return 'A';
    if (score > 0.85) return 'AD';
    throw new Error(`Score fuera de rango: ${score}`);
  }

  clearTokens() {
    this.tokenService.accessToken = "";
    this.tokenService.refreshToken = "";
  }

  exitGroup(): boolean {
    return confirm('¿Desea salir del grupo actual?')
  }

  selectData(): void {
    this.isDataView = true;
    this.isGraficsView = false;
    this.dataTable = new MatTableDataSource<DataGroup>(this.dataGroup);
    this.cdr.detectChanges();
    if (this.paginator) {
      this.dataTable.paginator = this.paginator;
    }
  }

  selectGrafics(): void {
    this.isDataView = false;
    this.isGraficsView = true;
  }

  generatePdf() {
    this.pdfService.generatePDF();
  }

  countLetter(arrLetter: string[]): number[] {
    let countAD: number = 0;
    let countA: number = 0;
    let countB: number = 0;
    let countC: number = 0;

    arrLetter.forEach(v => {
      if (v === "AD") countAD++;
      if (v === "A") countA++;
      if (v === "B") countB++;
      if (v === "C") countC++;
    })

    return Array(countAD, countA, countB, countC)
  }
}
