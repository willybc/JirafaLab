import { Component, Type } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactoComponent } from './sections/contacto/contacto.component';
import { PortadaComponent } from './sections/portada/portada.component';
import { ScientificComponent } from './sections/scientific/scientific.component';
import { ServiciosContinuosComponent } from './sections/servicios-continuos/servicios-continuos.component';
import { ServiciosOneTimeComponent } from './sections/servicios-one-time/servicios-one-time.component';
import { TextComponent } from './sections/text/text.component';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [
		CommonModule
	],
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	componentMap: Record<string, Type<any>> = {
		'app-portada': PortadaComponent,
		'app-scientific': ScientificComponent,
		'app-text': TextComponent,
		'app-servicios-one-time': ServiciosOneTimeComponent,
		'app-servicios-continuos': ServiciosContinuosComponent,
		'app-contacto': ContactoComponent,
	};

	componentKeys = [
		'app-portada',
		'app-scientific',
		'app-text',
		'app-servicios-one-time',
		'app-servicios-continuos',
		'app-contacto',
	];
}
