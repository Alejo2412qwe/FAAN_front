import { Component } from '@angular/core';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {

  enviarCorreo() {
    const nombreInput = document.getElementById('nombre') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const mensajeTextarea = document.getElementById('mensaje') as HTMLTextAreaElement;

    const nombre = nombreInput.value.trim(); // Elimina espacios en blanco al principio y al final
    const email = emailInput.value.trim();
    const mensaje = mensajeTextarea.value.trim();

    // Verificar que los campos no estén vacíos
    if (nombre === '' || email === '' || mensaje === '') {
      alert('Por favor, complete todos los campos antes de enviar el correo.');
      return; // Detener la ejecución si hay campos vacíos
    }

    const asunto = 'Mensaje de contacto de ' + nombre;
    const cuerpo = 'Nombre: ' + nombre + '\n' +
      'Email: ' + email + '\n' +
      'Mensaje: ' + mensaje;

    const mailtoURL = 'mailto:cabrerapedro32@gmail.com' +
      '?subject=' + encodeURIComponent(asunto) +
      '&body=' + encodeURIComponent(cuerpo);

    window.location.href = mailtoURL;

    // Limpiar los campos después de enviar el correo
    nombreInput.value = '';
    emailInput.value = '';
    mensajeTextarea.value = '';
  }


}

