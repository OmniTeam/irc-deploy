import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {UserService} from '../services/user.service';

export class UsernameValidator{

    static  validateUsername(userService: UserService) {
        return (control: AbstractControl): ValidationErrors | null => {
            return userService.getUsers()
                .subscribe(data => {
                        control.setErrors(null)
                        if (data.results.map(a=>a.username).includes(control.value)) {
                            return control.setErrors({'alreadyExist': true})
                        } else {
                            return null;
                        }
                    },
                    (error) => {
                        console.log(error);
                    }
                );
        }
    }
}