import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {UsersService} from "../services/users.service";


export class UsernameValidator{

    static  validateUsername(userService: UsersService) {
        return (control: AbstractControl): ValidationErrors | null => {
            return userService.getUsers()
                .subscribe(data => {
                        if(control.value){
                          control.setErrors(null)
                          if (data.map(a=>a.username).includes(control.value)) {
                            return control.setErrors({'alreadyExist': true})
                          } else {
                            return null;
                          }
                        }
                    },
                    (error) => {
                        console.log(error);
                    }
                );
        }
    }
}
