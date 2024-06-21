import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from "ngx-toastr";
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { NotFoundPageComponent } from './components/pages/not-found-page/not-found-page.component';
import { ChatPageComponent } from './components/pages/chat-page/chat-page.component';
import { SignOnPageComponent } from './components/pages/sign-on-page/sign-on-page.component';
import { ChatSectionComponent } from './components/pages/chat-page/chat-section/chat-section.component';
import { UsersListSectionComponent } from './components/pages/chat-page/users-list-section/users-list-section.component';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomePageComponent,
    NotFoundPageComponent,
    ChatPageComponent,
    SignOnPageComponent,
    ChatSectionComponent,
    UsersListSectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    ReactiveFormsModule,
    // ToastrModule added
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
