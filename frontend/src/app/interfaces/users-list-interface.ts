import {UserInterface} from "./user-interface";

export interface UsersListInterface {
  users: UserInterface[];
  unknownUsers: UserInterface[];
  knownUsers: UserInterface[];
}

