import { AbstractControl } from '@angular/forms';
export class PasswordValidator {
  static MatchPassword(Control: AbstractControl) {
    const password = Control.get('password').value;
    const confirmPassword = Control.get('passwordConf').value;
    if (password != confirmPassword) {
      Control.get('passwordConf').setErrors({ MatchPassword: true });
    } else {
      return null;
    }
  }
}
