import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from "./components/pages/home-page/home-page.component";
import {SignOnPageComponent} from "./components/pages/sign-on-page/sign-on-page.component";
import {ChatPageComponent} from "./components/pages/chat-page/chat-page.component";
import {NotFoundPageComponent} from "./components/pages/not-found-page/not-found-page.component";

const routes: Routes = [
  {path: '', component: HomePageComponent, title: 'home'},
  {path: 'sign-on', component: SignOnPageComponent, title: 'sign on'},
  {path: 'chat/:uid', component: ChatPageComponent, title: 'chat'},
  {path: '**', component: NotFoundPageComponent, title: '404 - not found'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
