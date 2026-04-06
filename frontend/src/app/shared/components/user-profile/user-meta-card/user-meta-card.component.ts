import { Component } from '@angular/core';
import { InputFieldComponent } from './../../form/input/input-field.component';
import { ModalService } from '../../../services/modal.service';

import { ModalComponent } from '../../ui/modal/modal.component';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-user-meta-card',
  imports: [
    ModalComponent,
    InputFieldComponent,
    ButtonComponent
],
  templateUrl: './user-meta-card.component.html',
  styles: ``
})
export class UserMetaCardComponent {

  constructor(public modal: ModalService) {}

  isOpen = false;
  openModal() { this.isOpen = true; }
  closeModal() { this.isOpen = false; }

  user = {
    firstName: 'SancochoLab',
    lastName: 'Equipo',
    role: 'Administrador',
    location: 'Bojaca, Colombia',
    avatar: '/images/user/owner.png',
    social: {
      facebook: 'https://www.facebook.com/',
      x: 'https://x.com/',
      linkedin: 'https://www.linkedin.com/',
      instagram: 'https://instagram.com/',
    },
    email: 'admin@sancocholab.com',
    phone: '+57 300 000 0000',
    bio: 'Panel administrativo de SancochoLab',
  };

  handleSave() {
    this.modal.closeModal();
  }
}
