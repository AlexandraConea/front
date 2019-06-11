import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule, MatIconModule, MatListModule, MatTabsModule, MatCardModule, MatDividerModule } from '@angular/material';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './security/auth-guards';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './security/token-interceptor';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { GameCardComponent} from './components/game-card/game-card.component';
import { TournamentsComponent } from './components/tournaments/tournaments.component';
import { TableComponent } from './components/table/table.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {WebcamModule} from 'ngx-webcam';
import { FlipModule } from 'ngx-flip';
import { RulesComponent } from './components/rules/rules.component';
import { AboutComponent } from './components/about/about.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    HomeComponent,
    HeaderComponent,
    GameCardComponent,
    TournamentsComponent,
    TableComponent,
    RulesComponent,
    AboutComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    FormsModule,
    MatListModule,
    MatTooltipModule,
    MatTabsModule,
    MatIconModule,
    WebcamModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatInputModule,
    HttpClientModule,
    MatCardModule,
    MatDividerModule,
    FlipModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
