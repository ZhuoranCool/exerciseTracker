import { Injectable } from "@angular/core"
import { Preferences } from "@capacitor/preferences"
import type { Exercise } from "../models/exercise.model"

@Injectable({
  providedIn: "root",
})
export class ExerciseService {
  private exercises: Exercise[] = []

  constructor() {
    this.loadExercises()
  }

  async addExercise(exercise: Exercise): Promise<void> {
    this.exercises.push(exercise)
    await this.saveExercises()
  }

  async updateExercise(updatedExercise: Exercise): Promise<void> {
    const index = this.exercises.findIndex((e) => e.id === updatedExercise.id)
    if (index !== -1) {
      this.exercises[index] = updatedExercise
      await this.saveExercises()
    }
  }

  async getTodayExercises(): Promise<Exercise[]> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return this.exercises.filter((e) => new Date(e.date) >= today)
  }

  async getExercisesForLastSevenDays(): Promise<Exercise[]> {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    sevenDaysAgo.setHours(0, 0, 0, 0)
    return this.exercises.filter((e) => new Date(e.date) >= sevenDaysAgo)
  }

  private async loadExercises(): Promise<void> {
    const { value } = await Preferences.get({ key: "exercises" })
    this.exercises = value ? JSON.parse(value) : []
  }

  private async saveExercises(): Promise<void> {
    this.exercises.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    await Preferences.set({
      key: "exercises",
      value: JSON.stringify(this.exercises),
    })
  }
}

