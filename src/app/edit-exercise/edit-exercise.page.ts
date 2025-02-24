import { Component, type OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { ExerciseService } from "../services/exercise.service"
import type { Exercise } from "../models/exercise.model"
import { IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

@Component({
  selector: "app-edit-exercise",
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Edit Exercise</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form (ngSubmit)="updateExercise()" *ngIf="exercise">
        <ion-item>
          <ion-label position="floating">Exercise Type</ion-label>
          <ion-input [(ngModel)]="exercise.type" name="type" required></ion-input>
        </ion-item>
        
        <ion-item>
          <ion-label position="floating">Duration (minutes)</ion-label>
          <ion-input type="number" [(ngModel)]="exercise.duration" name="duration" required></ion-input>
        </ion-item>
        
        <ion-item>
          <ion-label>Date & Time</ion-label>
          <ion-datetime displayFormat="MMM DD, YYYY HH:mm" [(ngModel)]="exercise.date" name="date" required></ion-datetime>
        </ion-item>
        
        <ion-item>
          <ion-label>Location</ion-label>
          <ion-select [(ngModel)]="exercise.location" name="location" required>
            <ion-select-option value="indoor">Indoor</ion-select-option>
            <ion-select-option value="outdoor">Outdoor</ion-select-option>
          </ion-select>
        </ion-item>
        
        <ion-button expand="block" type="submit">Update Exercise</ion-button>
      </form>
    </ion-content>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class EditExercisePage implements OnInit {
  exercise: Exercise | null = null

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private exerciseService: ExerciseService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id")
    if (id) {
      this.loadExercise(id)
    }
  }

  async loadExercise(id: string) {
    const exercises = await this.exerciseService.getTodayExercises()
    this.exercise = exercises.find((e) => e.id === id) || null
  }

  async updateExercise() {
    if (this.exercise) {
      await this.exerciseService.updateExercise(this.exercise)
      this.router.navigate(["/home"])
    }
  }
}

