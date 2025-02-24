import { Component, type OnInit, ViewChild, type ElementRef, type AfterViewInit } from "@angular/core"
import  { ExerciseService } from "../services/exercise.service"
import { Exercise } from "../models/exercise.model"
import { Chart, registerables } from "chart.js"
import { IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
Chart.register(...registerables)

@Component({
  selector: "app-history",
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Exercise History</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h2>Last 7 Days Report</h2>
      <canvas #chart></canvas>

      <h3>Exercise History</h3>
      <ion-list>
        <ion-item *ngFor="let exercise of exercises">
          <ion-label>
            <h2>{{ exercise.type }}</h2>
            <p>Duration: {{ exercise.duration }} minutes</p>
            <p>Date: {{ exercise.date | date:'medium' }}</p>
            <p>Location: {{ exercise.location }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
})
export class HistoryPage implements OnInit, AfterViewInit {
  @ViewChild("chart") private chartRef!: ElementRef
  exercises: Exercise[] = []

  constructor(private exerciseService: ExerciseService) {}

  async ngOnInit() {
    this.exercises = await this.exerciseService.getExercisesForLastSevenDays()
    console.log(this.exercises)
    this.createChart()
  }

  ngAfterViewInit() {
    
  }

  createChart() {
    if (this.chartRef && this.chartRef.nativeElement) {
      const ctx = this.chartRef.nativeElement.getContext("2d")
      const dailyExercises = this.groupExercisesByDay()

      new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(dailyExercises),
          datasets: [
            {
              label: "Total Exercise Duration (minutes)",
              data: Object.values(dailyExercises).map((exercises) =>
                exercises.reduce((total, exercise) => total + exercise.duration, 0),
              ),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Total Duration (minutes)",
              },
            },
            x: {
              title: {
                display: true,
                text: "Date",
              },
            },
          },
        },
      })
    }
  }

  groupExercisesByDay(): { [key: string]: Exercise[] } {
    return this.exercises.reduce((groups: { [key: string]: Exercise[] }, exercise) => {
      const date = new Date(exercise.date).toLocaleDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(exercise)
      return groups
    }, {})
  }
}

