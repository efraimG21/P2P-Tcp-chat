import { Component } from '@angular/core';
import {UserHandlingService} from "../../services/user/user-handling.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(protected userHandlingService: UserHandlingService, protected activatedRoute: ActivatedRoute) {
  }

  onLogout(): void {
    this.userHandlingService.isActive$.next(false);
    this.userHandlingService.currentUserUid$.next(null);
  }
}
