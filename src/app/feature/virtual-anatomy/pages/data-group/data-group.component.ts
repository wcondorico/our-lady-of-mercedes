import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { Group, User } from '../../core/interfaces/search-group.interface';
import { GroupFacade } from '../../aplication/group.facade';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { EChartsOption } from 'echarts';
import { BarChart } from 'echarts/charts';
import { GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TokensService } from '../../core/stores/tokens.service';
import { ExitGroup } from '../../core/guards/exit-group.guard';
echarts.use([BarChart, GridComponent, CanvasRenderer, LineChart]);

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
export class DataGroupComponent implements OnInit,ExitGroup {
  private readonly groupService: GroupFacade = inject(GroupFacade);
  private readonly tokenService: TokensService = inject(TokensService)
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
  dataGroup: User[] = [];
  dataTable!: MatTableDataSource<User>;
  totalScoreCompetence: number[] = [];
  totalScoreCapacity1: number[] = [];
  totalScoreCapacity2: number[] = [];
  competences: string[] = [];
  capacity1: string[] = [];
  capacity2: string[] = [];
  groupName!: string;
  totalScores: number[] = [];
  grafics: boolean = true;

  ngOnInit() {
    this.groupService.getGroup().subscribe({
      next: (resp: Group[]) => {
        console.log(resp);
        this.groupName = resp[0].nameGroup;
        this.dataGroup = resp[0].users;
        let nameList: string[] = [];
        let points: number[] = [];
        this.dataTable = new MatTableDataSource<User>(this.dataGroup);
        this.dataTable.paginator = this.paginator;

        for (let i = 0; i < this.dataGroup.length; i++) {
          let totalScoreCompetence = 0;
          let totalScoreCapacity1 = 0;
          let totalScoreCapacity2 = 0;
          let totalScore = 0;
          nameList.push(this.dataGroup[i].name);

          for (let j = 0; j < this.dataGroup[i].answer.length; j++) {
            const qId = this.dataGroup[i].answer[j].question.id;
            totalScore += this.dataGroup[i].answer[j].answerTF;
            const weightCompetence: number = this.getWeightByCompetence(qId);
            totalScoreCompetence +=
              this.dataGroup[i].answer[j].answerTF * weightCompetence;
            if (this.weightByCapacity1[qId]) {
              const weightCapacity1: number = this.getWeightByCapacity(qId);
              totalScoreCapacity1 +=
                this.dataGroup[i].answer[j].answerTF * weightCapacity1;
            }
            if (this.weightByCapacity2[qId]) {
              const weightCapacity2: number = this.getWeightByCapacity(qId);
              totalScoreCapacity2 +=
                this.dataGroup[i].answer[j].answerTF * weightCapacity2;
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
            data: nameList
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: points,
              type: 'line',
            },
          ],
        };

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
}
