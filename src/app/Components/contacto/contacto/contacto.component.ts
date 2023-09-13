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
  
    const nombre = nombreInput.value;
    const email = emailInput.value;
    const mensaje = mensajeTextarea.value;
  
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

 