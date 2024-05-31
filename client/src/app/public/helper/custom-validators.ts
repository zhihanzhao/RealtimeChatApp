import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
    static passwordMatching(control: AbstractControl): ValidationErrors | null{
        const password = control.get('password')?.value;
        const passwordConfirm = control.get('passwordConfirm')?.value;

        if((password === passwordConfirm && password !== null && passwordConfirm !== null)){
            return null;
        } else {
            return { passwordNotMatching : true};
        }

    }
}