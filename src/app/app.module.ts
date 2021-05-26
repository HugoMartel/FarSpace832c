import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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


import { WindowRefService } from './services/window-ref.service';
import { MenuService } from './services/menu/menu.service';
import { MatrixService } from './services/game/gestion/matrix.service';
import { TerrainService } from './services/game/gestion/terrain.service';
import { GestionMousePickerService } from './services/game/gestion/gestion-mouse-picker.service';
import { GestionMeshLoaderService } from './services/game/gestion/gestion-mesh-loader.service';
import { GestionSlidesService } from './services/game/gestion/gestion-slides.service';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    FooterComponent,
    HeaderComponent,
    ProjectComponent,
    HowToPlayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    WindowRefService,
    MatrixService,
    TerrainService,
    MenuService,
    GestionMousePickerService,
    GestionMeshLoaderService,
    GestionSlidesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
