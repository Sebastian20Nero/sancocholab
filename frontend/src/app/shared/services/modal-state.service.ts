import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ModalStateService {
    // Signal to track if any modal is currently open
    isModalOpen = signal(false);

    openModal() {
        this.isModalOpen.set(true);
    }

    closeModal() {
        this.isModalOpen.set(false);
    }
}
