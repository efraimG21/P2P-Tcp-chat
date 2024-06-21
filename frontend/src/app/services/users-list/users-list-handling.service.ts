import { Injectable } from '@angular/core';
import {UserInterface} from "../../interfaces/user-interface";
import {BehaviorSubject} from "rxjs";
import {UserHandlingService} from "../user/user-handling.service";
import {UsersListRequestingService} from "./users-list-requesting.service";

@Injectable({
  providedIn: 'root'
})
export class UsersListHandlingService {
  knownUserList$ = new BehaviorSubject<UserInterface[]>([])
  unknownUserList$ = new BehaviorSubject<UserInterface[]>([])
  private userList$ = new BehaviorSubject<UserInterface[]>([])

  constructor(private userHandlingService: UserHandlingService,
              private usersListRequestingService: UsersListRequestingService) {
    this.userHandlingService.currentUserUid$.subscribe(currentUserUid => {
      if (currentUserUid) {
        this.usersListRequestingService.getSortedUsersList(currentUserUid).subscribe(usersLists => {
            this.userList$.next(usersLists.users)
            this.knownUserList$.next(usersLists.knownUsers)
            this.unknownUserList$.next(usersLists.unknownUsers)
          }
        );
      }
    })

  }

  addUserToList(user: UserInterface) {
    const userList = this.userList$.getValue()
    const unknownUserList = this.unknownUserList$.getValue()
    const knownUserList = this.knownUserList$.getValue()

    console.log('user: ',user, 'list: ',userList)
    const userExists = userList.find(
      value => value._id.toString() === user._id.toString()
    );

    if (userExists) {
      return;
    }
    if (!unknownUserList.includes(user)) {
      this.userList$.next([...userList, user])
      this.unknownUserList$.next([...unknownUserList, user]);
    } else {
      this.knownUserList$.next([...knownUserList, user]);
    }
  }

  removeUserFromList(uid: string) {
    const userList = this.userList$.getValue();
    const knownUserList = this.knownUserList$.getValue();
    const unknownUserList = this.unknownUserList$.getValue();

    const userIndex = userList.findIndex((user) => user._id === uid);
    const knownUserIndex = knownUserList.findIndex((user) => user._id === uid);
    const unknownUserIndex = unknownUserList.findIndex((user) => user._id === uid);

    if (userIndex !== -1) {
      userList.splice(userIndex, 1);
      this.userList$.next(userList);
    }

    if (knownUserIndex !== -1) {
      knownUserList.splice(knownUserIndex, 1);
      this.knownUserList$.next(knownUserList);
    }

    if (unknownUserIndex !== -1) {
      unknownUserList.splice(unknownUserIndex, 1);
      this.unknownUserList$.next(unknownUserList);
    }
  }

  moveUserToKnownList(uid: string) {
    const knownUserList = this.knownUserList$.getValue();
    const unknownUserList = this.unknownUserList$.getValue();
    const userIndex = unknownUserList.findIndex((user) => user._id.toString() === uid);
    const user = unknownUserList[userIndex];

    if (userIndex !== -1) {
      unknownUserList.splice(userIndex, 1);
      this.unknownUserList$.next(unknownUserList);
    }

    this.knownUserList$.next([user, ...knownUserList])
  }

}
