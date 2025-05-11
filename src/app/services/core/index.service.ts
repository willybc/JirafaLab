import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, fromEvent } from 'rxjs';
import {
	debounceTime,
	map,
	distinctUntilChanged,
	startWith,
} from 'rxjs/operators';
@Injectable({
	providedIn: 'root',
})
export class IndexService {
	private indexSubject = new BehaviorSubject<number>(0);
	public index$ = this.indexSubject.asObservable();

	public indexSubjectService = new BehaviorSubject<number>(0);
	public indexService$ = this.indexSubjectService.asObservable();

	private initialDesktopState =
		typeof window !== 'undefined' ? window.innerWidth >= 853 : false;
	private isDesktopSubject = new BehaviorSubject<boolean>(
		this.initialDesktopState
	);

	private navigateToKeySource = new Subject<string>();
	navigateToKey$ = this.navigateToKeySource.asObservable();

	public pendingSectionKey: string | null = null;

	isDesktop$ = this.isDesktopSubject.asObservable();

	constructor() {
		// Escuchar cambios de tamaño de ventana (solo si estamos en el navegador)
		if (typeof window !== 'undefined') {
			fromEvent(window, 'resize')
				.pipe(
					debounceTime(75),
					map(() => window.innerWidth >= 853),
					startWith(this.initialDesktopState),
					distinctUntilChanged()
				)
				.subscribe(isNowDesktop => {
					this.setDesktopMode(isNowDesktop);
				});
		}
	}

	setDesktopMode(isDesktop: boolean) {
		if (isDesktop !== this.isDesktopSubject.value) {
			this.isDesktopSubject.next(isDesktop);
		}
	}

	getCurrentDesktopMode(): boolean {
		return this.isDesktopSubject.value;
	}

	setIndex(index: number): void {
		this.indexSubject.next(index);
	}

	getIndex(): number {
		return this.indexSubject.value;
	}

	setIndexService(index: number): void {
		this.indexSubjectService.next(index);
	}

	getIndexService(): number {
		return this.indexSubjectService.value;
	}

	/**
	 * Llamado por Header cuando la navegación es DIRECTA (ya estamos en Home).
	 * Emite la key para que HomeComponent la escuche.
	 */
	requestDirectNavigation(componentKey: string) {
		this.navigateToKeySource.next(componentKey);
	}

	// Establece una key de sección pendiente para ser recogida por HomeComponent al iniciar.
	setPendingSection(key: string | null): void {
		this.pendingSectionKey = key;
	}

	getAndClearPendingSection(): string | null {
		const key = this.pendingSectionKey;
		if (key) {
			this.pendingSectionKey = null; // Limpia después de leer
		}
		return key;
	}
}
