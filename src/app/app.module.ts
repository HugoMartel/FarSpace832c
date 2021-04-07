import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Module import
import { MaterialModule } from './material';
import { GameComponent } from './game/game.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ProjectComponent } from './project/project.component';
import { HowToPlayComponent } from './how-to-play/how-to-play.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { WindowRefService } from './services/window-ref.service';
@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    FooterComponent,
    HeaderComponent,
    ProjectComponent,
    HowToPlayComponent,
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    WindowRefService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
