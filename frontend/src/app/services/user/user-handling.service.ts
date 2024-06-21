import { Injectable } from '@angular/core';
import {UserFormInterface} from "../../interfaces/user-interface";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {UserRequestingService} from "./user-requesting.service";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class UserHandlingService {
  isActive$ = new BehaviorSubject<boolean>(false);
  currentUserUid$ = new BehaviorSubject<string | null>(null);

  constructor(private router: Router, private userRequestingService: UserRequestingService, private toasterService: ToastrService) {
    this.currentUserUid$.subscribe(value => {
      if (value) {
        this.isUserExists(value);
      }
    })
  }

  isUserExists(uid: string) {
    this.userRequestingService.doseUserExists(uid).subscribe(value => {
      if (!value) {
        this.router.navigate(['/']).then();
      }
    })
  }

  createUser(user: UserFormInterface) {
    this.userRequestingService.createNewUser(user).subscribe({
      next: (response) => {
        this.currentUserUid$.next(response.content)
        this.toasterService.success(response.message)
        this.router.navigate(['/chat/', response.content])
      },
      error: (error) => {
        this.toasterService.error(error.error, error.status)
      }
    })
  }
}
