import { Component, OnInit } from '@angular/core';
import { Message } from '../../model/Message';
import { NavigatorService } from 'src/app/core/services/navigator.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChatService } from '../../services/chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messages: Message[];
  question: string = 'Como puedo realizar la vinculación de paciente? Dame un listado de campos que debo rellenar';
  asking: boolean = false;

  
  constructor(
    private navigatorService: NavigatorService,
    private authService: AuthService,
    private chatService: ChatService,
  ) {
  }


  ngOnInit(): void {


    this.messages = [
      {id:null, user: true, author:'Pablo Jiménez Martínez', date: new Date(), content: 'Cuantos Casos de Uso hay en el documento de Trabajo de Final de Grado? Haz un breve resumen de cada uno de ellos'},
      {id:null, user: false, author:'AI Bot', date: new Date(), content: 'En el documento de Trabajo de Final de Grado se describen varios casos de uso en el contexto del aplicativo móvil y web destinado al seguimiento de pacientes con trastorno mental grave (TMG). Los casos de uso principales se detallan a continuación:\n\n1. **Acceso a la aplicación**: Este caso de uso permite que los usuarios (pacientes y profesionales sanitarios) accedan al sistema mediante la introducción de sus credenciales. Se asegura que solo los usuarios autorizados puedan entrar y interactuar con el aplicativo.\n\n2. **Navegación**: Describe cómo los usuarios pueden moverse a través de las diferentes secciones de la aplicación. Esto incluye la visualización de menús, la selección de opciones y la navegación entre distintas pantallas y funcionalidades.\n\n3. **Notificaciones**: Este caso abarca el envío de recordatorios al usuario sobre la toma de medicación y la realización de cuestionarios. Es fundamental para asegurar la adherencia al tratamiento y la recolección de datos necesarios para el seguimiento.\n\n4. **Perfil del usuario**: Permite a los usuarios ver y actualizar su información personal y médica dentro de la aplicación. Esto puede incluir detalles como historial médico, medicamentos actuales y contactos de emergencia.\n\n5. **Cuestionarios**: Los usuarios responden a preguntas específicas asignadas por el personal sanitario. Estas preguntas están diseñadas para evaluar diferentes aspectos de la salud mental y física del paciente.\n\n6. **Agenda**: Muestra eventos, talleres o citas a los cuales el paciente puede asistir. Proporciona detalles y resúmenes de estas actividades, ayudando a los usuarios a mantenerse organizados y comprometidos con su tratamiento.\n\n7. **Foro**: Facilita un espacio de interacción donde los usuarios pueden hacer preguntas, responder a consultas de otros y participar en discusiones. Este caso de uso fomenta el apoyo comunitario y la interacción social entre los usuarios.\n\n8. **Medicación**: Notifica a los usuarios sobre las medicaciones que deben tomar, permitiendo además confirmar la toma de estas. Es crucial para el manejo efectivo de la medicación y el seguimiento de la adherencia.\n\n9. **Diario**: Los usuarios pueden registrar notas personales sobre su día a día, síntomas o cualquier otro aspecto que consideren relevante. Este diario puede ser revisado luego por profesionales de la salud para un mejor entendimiento del estado del paciente.\n\nCada uno de estos casos de uso contribuye al objetivo general del aplicativo de proporcionar un seguimiento integral y personalizado a pacientes con TMG, mejorando la comunicación entre pacientes y profesionales de la salud y facilitando una mejor gestión del tratamiento.'},
      {id:null, user: true, author:'Pablo Jiménez Martínez', date: new Date(), content: 'Como puedo realizar la vinculación de paciente? Dame un listado de campos que debo rellenar'},
      {id:null, user: false, author:'AI Bot', date: new Date(), content: 'Para realizar la vinculación de un paciente en el sistema, debes rellenar los siguientes campos en el formulario correspondiente:\n\n### Campos para la Vinculación de Paciente:\n1. **NIF**: Documento de identificación único del paciente (campo de texto).\n2. **Sexo**: Sexo del paciente (selector).\n3. **Edad**: Edad del paciente (campo numérico).\n4. **Nombre**: Nombre del paciente (campo de texto).\n5. **Apellidos**: Apellidos del paciente (campo de texto).\n6. **Correo electrónico**: Correo electrónico del paciente (campo de texto).\n7. **Teléfono**: Teléfono del paciente (campo de texto).\n8. **SIP**: Número de la tarjeta sanitaria individual del paciente (campo numérico).\n9. **H. Clínica**: Número de la historia clínica del paciente (campo numérico).\n\nEstos campos deben ser completados para formalizar la vinculación del paciente. Asegúrate de que todos los campos obligatorios, que están marcados con un asterisco (*), sean llenados correctamente para proceder con el registro en el sistema.'},
    ];

  }

  onQuestionSubmit(event: any) : void {
    
    let textQuestion = this.question;
    this.question = '';
    
    if (textQuestion != null && textQuestion.length > 0) {

      let collectionId = this.authService.getProperty("selected-collection").id;
      this.asking = true;

      this.messages.push({
        id: null,
        user: true, 
        author: this.authService.getUserInfo().firstName+' '+this.authService.getUserInfo().lastName,
        content: textQuestion,
        date: new Date()
      });
      
      this.chatService.sendMessage(collectionId, textQuestion).subscribe({
        next: res => {
          this.messages.push(res);
          this.asking = false;
        },
        error: err => {
          console.error(err);
        }
      });

    }


  }


  getAbbreviatedName(name: string): string {
    if (name.length <= 2) return name;

    return name.split(' ').map((n) => n.charAt(0)).join('').substring(0, 2);
  }

}
