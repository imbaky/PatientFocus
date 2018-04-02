import { AbstractControl } from '@angular/forms';
export class PasswordValidator {
  static MatchPassword(Control: AbstractControl) {
    const password = Control.get('password').value;
    const confirmPassword = Control.get('passwordConf').value;
    console.log(password);
    console.log(confirmPassword);
    if (password != confirmPassword) {
      Control.get('passwordConf').setErrors({ MatchPassword: true });
    } else {
      return null;
    }
  }
}
