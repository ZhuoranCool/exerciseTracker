import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { UserService } from "../services/user.service"
import { IonicModule } from "@ionic/angular"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Device } from '@capacitor/device';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: "app-login",
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Welcome</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <h2>Please enter your username</h2>
      <ion-item>
        <ion-label position="floating">Username</ion-label>
        <ion-input [(ngModel)]="username"></ion-input>
      </ion-item>
      <ion-button expand="block" (click)="login()" [disabled]="!username">
        Start
      </ion-button>
    </ion-content>
  `,
})
export class LoginComponent {
  username = ""
  deviceId: string | null = null;


  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  async login() {
    await this.userService.setUsername(this.username)
    const info = await Device.getId();
    this.deviceId = info.identifier;
    console.log('Device UUID:', this.deviceId);
    this.router.navigate(["/home"])
  }
}

