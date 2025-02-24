import { Injectable } from "@angular/core"
import { Preferences } from "@capacitor/preferences"

@Injectable({
  providedIn: "root",
})
export class UserService {
  private username: string | null = null

  constructor() {
    this.loadUsername()
  }

  async setUsername(username: string): Promise<void> {
    this.username = username
    await Preferences.set({ key: "username", value: username })
  }

  async getUsername(): Promise<string | null> {
    if (!this.username) {
      await this.loadUsername()
    }
    return this.username
  }

  private async loadUsername(): Promise<void> {
    const { value } = await Preferences.get({ key: "username" })
    this.username = value
  }

  async isFirstTimeUser(): Promise<boolean> {
    const username = await this.getUsername()
    return !username
  }
}

