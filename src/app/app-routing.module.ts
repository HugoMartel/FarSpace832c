import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRoute, ParamMap } from '@angular/router';

import { GameComponent } from './game/game.component';
import { ProjectComponent } from './project/project.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'home', component: GameComponent },
  { path: 'project', component: ProjectComponent },
  { path: 'howtoplay', component: HowToPlayComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
