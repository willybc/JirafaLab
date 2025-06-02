import { Component, Type, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactoComponent } from './sections/contacto/contacto.component';
import { PortadaComponent } from './sections/portada/portada.component';
import { ScientificComponent } from './sections/scientific/scientific.component';
import { ServiciosContinuosComponent } from './sections/servicios-continuos/servicios-continuos.component';
import { ServiciosOneTimeComponent } from './sections/servicios-one-time/servicios-one-time.component';
import { TextComponent } from './sections/text/text.component';
import { IndexService } from '../../services/core/index.service';
import { Subscription } from 'rxjs';

interface SectionItem {
	componentKey: string;
}

const desktopItemsConfig: SectionItem[] = [
	{ componentKey: 'app-portada' },
	{ componentKey: 'app-servicios-one-time' },
	{ componentKey: 'app-servicios-continuos' },
	{ componentKey: 'app-scientific' },
	{ componentKey: 'app-text' },
	{ componentKey: 'app-contacto' },
];

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	items: SectionItem[] = [];

	componentMap: Record<string, Type<any>> = {
		'app-portada': PortadaComponent,
		'app-servicios-one-time': ServiciosOneTimeComponent,
		'app-servicios-continuos': ServiciosContinuosComponent,
		'app-scientific': ScientificComponent,
		'app-text': TextComponent,
		'app-contacto': ContactoComponent,
	};

	length: number = 0;
	index: number = 0;
	translate: number = 0;

	private modeChangeSubscription!: Subscription;
	private navigationSubscription!: Subscription;

	constructor(
		private indexService: IndexService,
		private cdRef: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.modeChangeSubscription = this.indexService.isDesktop$
			.pipe()
			.subscribe(isDesktop => {
				this.handleModeChange(isDesktop);
			});

		this.navigationSubscription =
			this.indexService.navigateToKey$.subscribe(targetKey => {
				const targetIndex = this.items.findIndex(
					item => item.componentKey === targetKey
				);
				if (targetIndex !== -1) {
					this.navigate(targetIndex);
				}
			});
	}

	ngOnDestroy() {
		if (this.modeChangeSubscription) {
			this.modeChangeSubscription.unsubscribe();
		}
		if (this.navigationSubscription) {
			this.navigationSubscription.unsubscribe();
		}
	}

	/**
	 * Navega a la sección especificada por el índice.
	 * @param targetIndex - El índice de la sección destino.
	 */
	navigate(targetIndex: number) {
		const currentModeIsDesktop = this.indexService.getCurrentDesktopMode(); // Obtiene modo actual

		if (
			targetIndex < 0 ||
			targetIndex >= this.length ||
			targetIndex === this.index
		) {
			if (targetIndex !== this.index) {
				console.warn(`Navegación inválida: ${targetIndex}`);
			}
			return;
		}

		this.index = targetIndex;

		this.indexService.setIndex(this.index);

		if (currentModeIsDesktop) {
			// Lógica de navegación para Desktop
			const sectionId = `section-${this.index}`;
			const targetSection = document.getElementById(sectionId);
			if (targetSection) {
				targetSection.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			}
		} else {
			// Lógica de navegación para Mobile
			this.translate = this.index * -100;
		}
	}

	handleModeChange(isDesktop: boolean, isInitialLoad: boolean = false): void {
		// 1. Selecciona la configuración de items apropiada
		const previousItems = this.items; // Guarda referencia por si acaso
		this.items = isDesktop
			? [...desktopItemsConfig]
			: // Por el momento dejo esto así
				[...desktopItemsConfig];
		this.length = this.items.length;

		// 2. Resetear al índice 0 si el modo cambió (no en la carga inicial si ya era 0)
		// O si los items cambiaron y el índice viejo queda fuera.
		const needsReset =
			!isInitialLoad || this.index >= this.length || this.index !== 0;
		if (needsReset && this.index !== 0) {
			// Resetear solo si no estamos ya en 0 o es necesario
			this.index = 0;
		}
		// Siempre informa al servicio del índice actual (sea 0 o el que fuera)
		this.indexService.setIndex(this.index);

		// 3. Notifica a Angular que 'items' puede haber cambiado
		this.cdRef.detectChanges();

		// 4. Aplica los estilos visuales usando setTimeout para esperar al DOM
		setTimeout(() => {
			this.resetVisualStyles(isDesktop); // Pasamos el modo actual
		}, 0); // Timeout 0 espera al siguiente ciclo de renderizado
	}

	/**
	 * Aplica los estilos visuales (transform o scroll) según el modo actual.
	 * @param previousModeWasDesktop - Indica cuál era el modo ANTES del cambio.
	 */
	resetVisualStyles(previousModeWasDesktop: boolean) {
		const mainEl = document.getElementById('container_main');
		if (mainEl) {
			//anime.remove(mainEl);
			const currentModeIsDesktop =
				this.indexService.getCurrentDesktopMode(); // Obtiene el modo actual

			if (currentModeIsDesktop) {
				// Ahora es Desktop
				if (!previousModeWasDesktop || mainEl.style.transform) {
					// Si veníamos de mobile o había transform
					mainEl.style.transform = 'none';
				}
				this.translate = 0;
				const targetSection = document.getElementById(
					`section-${this.index}`
				);
				if (targetSection) {
					targetSection.scrollIntoView({
						behavior: 'auto',
						block: 'start',
					});
				}
			} else {
				// Ahora es Mobile
				this.translate = this.index * -100;
				mainEl.style.transform = `translateY(${this.translate}vh)`;
				if (previousModeWasDesktop) {
					// Si veníamos de desktop
					window.scrollTo({ top: 0, behavior: 'auto' });
				}
			}
		}
	}
}
