import { Component, type OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { UserService } from "../services/user.service"
import { ExerciseService } from "../services/exercise.service"
import { Exercise } from "../models/exercise.model"
import { IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
@Component({
  selector: "app-home",
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title>
          Exercise Tracker
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <div *ngIf="username">
        <h2>Hello, {{ username }}!</h2>
        
        <form (ngSubmit)="addExercise()">
          <ion-item>
            <ion-label position="floating">Exercise Type</ion-label>
            <ion-input [(ngModel)]="newExercise.type" name="type" required></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label position="floating">Duration (minutes)</ion-label>
            <ion-input type="number" [(ngModel)]="newExercise.duration" name="duration" required></ion-input>
          </ion-item>
          
          <ion-item>
            <ion-label>Date & Time</ion-label>
            <ion-datetime displayFormat="MMM DD, YYYY HH:mm" [(ngModel)]="newExercise.date" name="date" required></ion-datetime>
          </ion-item>
          
          <ion-item>
            <ion-label>Location</ion-label>
            <ion-select [(ngModel)]="newExercise.location" name="location" required>
              <ion-select-option value="indoor">Indoor</ion-select-option>
              <ion-select-option value="outdoor">Outdoor</ion-select-option>
            </ion-select>
          </ion-item>
          
          <ion-button expand="block" type="submit">Add Exercise</ion-button>
        </form>

        <h3>Today's Exercises</h3>
        <ion-list>
          <ion-item *ngFor="let exercise of todayExercises">
            <ion-label>
              <h2>{{ exercise.type }}</h2>
              <p>Duration: {{ exercise.duration }} minutes</p>
              <p>Time: {{ exercise.date | date:'shortTime' }}</p>
              <p>Location: {{ exercise.location }}</p>
            </ion-label>
            <ion-button slot="end" (click)="editExercise(exercise)">Edit</ion-button>
          </ion-item>
        </ion-list>
        <ion-button expand="block" (click)="viewHistory()">View Exercise History</ion-button>
      </div>
    </ion-content>
  `,
})
export class HomePage implements OnInit {
  username: string | null = null
  newExercise: Partial<Exercise> = {}
  todayExercises: Exercise[] = []

  constructor(
    private userService: UserService,
    private exerciseService: ExerciseService,
    private router: Router,
  ) {}

  async ngOnInit() {
    const isFirstTimeUser = await this.userService.isFirstTimeUser()
    if (isFirstTimeUser) {
      this.router.navigate(["/login"])
    } else {
      this.username = await this.userService.getUsername()
      this.loadTodayExercises()
    }
  }

  async addExercise() {
    if (this.newExercise.type && this.newExercise.duration && this.newExercise.date && this.newExercise.location) {
      const exercise: Exercise = {
        id: Date.now().toString(),
        type: this.newExercise.type,
        duration: this.newExercise.duration,
        date: this.newExercise.date,
        location: this.newExercise.location,
      }
      await this.exerciseService.addExercise(exercise)
      this.newExercise = {}
      this.loadTodayExercises()
    }
  }

  async loadTodayExercises() {
    this.todayExercises = await this.exerciseService.getTodayExercises()
  }

  editExercise(exercise: Exercise) {
    this.router.navigate(["/edit-exercise", exercise.id])
  }

  viewHistory() {
    this.router.navigate(["/history"])
  }
}

