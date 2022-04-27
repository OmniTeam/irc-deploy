import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {GroupsService} from "../services/groups.service";


export class GroupValidator{

  static  validateGroup(groupsService: GroupsService) {
    return (control: AbstractControl): ValidationErrors | null => {
      return groupsService.getGroups().subscribe(data => {
            if(control.value){
              control.setErrors(null)
              if (data.map(a=>a.name).includes(control.value)) {
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
