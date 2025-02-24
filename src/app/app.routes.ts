import { Routes } from '@angular/router';
import { EditExercisePage } from './edit-exercise/edit-exercise.page';
import { HistoryPage } from './history/history.page';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: "home",
    loadComponent: () => import("./home/home.page").then((m) => m.HomePage),
  },
  {
    path: "edit-exercise/:id",
    loadComponent: () => import("./edit-exercise/edit-exercise.page").then((m) => m.EditExercisePage),
  },
  {
    path: "history",
    loadComponent: () => import("./history/history.page").then((m) => m.HistoryPage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
