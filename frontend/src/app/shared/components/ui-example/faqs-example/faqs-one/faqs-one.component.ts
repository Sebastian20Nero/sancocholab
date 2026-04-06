import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FaqItemOneComponent } from '../../../faqs/faq-item-one/faq-item-one.component';

@Component({
  selector: 'app-faqs-one',
  imports: [
    CommonModule,
    FaqItemOneComponent,
  ],
  templateUrl: './faqs-one.component.html',
  styles: ``
})
export class FaqsOneComponent {

  faqs = [
    {
      title: 'Como ingreso al sistema?',
      content:
        'Usa tu correo y contrasena asignados por el administrador. Si es tu primer ingreso, verifica que el backend y la base de datos esten arriba.',
    },
    {
      title: 'Que hago si no carga el frontend?',
      content:
        'Confirma que el frontend este corriendo con npm run start y que la API responda en la URL configurada para tu entorno.',
    },
    {
      title: 'Puedo ajustar los datos de ejemplo?',
      content:
        'Si. Los datos visibles en modales, perfiles y vistas de demostracion pueden reemplazarse por informacion real del negocio.',
    },
    {
      title: 'Que revisar antes de desplegar?',
      content:
        'Asegura variables de entorno correctas, backend accesible, build de frontend exitoso y rutas de API coherentes para el servidor.',
    },
  ];

  openIndex: number | null = 0;

  toggleAccordion(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }
}
