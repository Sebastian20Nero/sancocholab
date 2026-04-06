import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FaqItemTwoComponent } from "../../../faqs/faq-item-two/faq-item-two.component";

@Component({
  selector: 'app-faqs-two',
  imports: [
    CommonModule,
    FaqItemTwoComponent
],
  templateUrl: './faqs-two.component.html',
  styles: ``
})
export class FaqsTwoComponent {

  accordionTwoData = [
    {
      title: 'Como levanto el proyecto en local?',
      content: 'Copia .env.example a .env, levanta backend y base de datos con los scripts operativos y luego corre el frontend con npm run start.'
    },
    {
      title: 'Como verifico que la API esta funcionando?',
      content: 'Abre la ruta /docs en local o revisa los logs del contenedor api para confirmar que NestJS inicio correctamente.'
    },
    {
      title: 'Que hago si Docker falla?',
      content: 'Usa los scripts de recuperacion del proyecto para reiniciar el stack y validar el estado de Docker Desktop.'
    },
    {
      title: 'Como configuro el servidor?',
      content: 'En produccion define CORS_ORIGINS, desactiva Swagger si no lo necesitas y asegúrate de que el frontend consuma la API por /api o por tu dominio real.'
    },
    {
      title: 'Se pierde la base de datos al actualizar?',
      content: 'No, mientras no elimines los volúmenes Docker. Las actualizaciones normales con git pull y docker compose up no deberían borrar datos.'
    },
    {
      title: 'Como comparto el proyecto con mi equipo?',
      content: 'Sube la rama al repositorio y comparte la guia rapida local junto con el nombre de la rama que deben descargar.'
    },
    {
      title: 'Puedo personalizar esta interfaz?',
      content: 'Si. Puedes ajustar textos, modales, branding y componentes visuales sin alterar la lógica principal del sistema.'
    }
  ];

  openIndexFirstGroup: number | null = 0;
  openIndexSecondGroup: number | null = 0;

  get firstGroup() {
    return this.accordionTwoData.slice(0, 3);
  }

  get secondGroup() {
    return this.accordionTwoData.slice(3, 7);
  }

  toggleFirstGroup(index: number): void {
    this.openIndexFirstGroup = this.openIndexFirstGroup === index ? null : index;
  }

  toggleSecondGroup(index: number): void {
    this.openIndexSecondGroup = this.openIndexSecondGroup === index ? null : index;
  }
}
