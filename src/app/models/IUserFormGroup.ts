import { AbstractControl, FormGroup } from "@angular/forms";
import { IUser } from "./IUser";

export interface IUserFormGroup extends FormGroup {
  controls: {
    name: AbstractControl;
    email: AbstractControl;
    phone: AbstractControl;
    city: AbstractControl;
    image: AbstractControl;
  };
}