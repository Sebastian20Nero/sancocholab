import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';

@Component({
  selector: 'app-signin-form',
  standalone: true, // ✅ CLAVE
  imports: [
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule, // ✅ CLAVE para [(ngModel)]
  ],
  templateUrl: './signin-form.component.html',
  styles: ``,
})
export class SigninFormComponent {
  @Output() submitLogin = new EventEmitter<{ email: string; password: string; remember: boolean }>();

  showPassword = false;
  isChecked = false;

  email = '';
  password = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    console.log('FORM VALUES =>', { email: this.email, password: this.password, remember: this.isChecked });

    this.submitLogin.emit({
      email: this.email.trim(),
      password: this.password,
      remember: this.isChecked,
    });
  }
}
