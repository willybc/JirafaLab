import {
	Component,
	OnInit,
	AfterViewInit,
	OnDestroy,
	ElementRef,
	ViewChildren,
	QueryList,
	ChangeDetectorRef,
	HostListener,
	Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	trigger,
	state,
	style,
	animate,
	transition,
} from '@angular/animations';

@Component({
	selector: 'app-scientific',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './scientific.component.html',
	styleUrls: ['./scientific.component.scss'],
	animations: [
		trigger('animateTitle', [
			state(
				'hidden',
				style({ opacity: 0, transform: 'translateY(-30px)' })
			),
			state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
			transition('hidden <=> visible', [animate('500ms ease-out')]),
		]),
	],
})
export class ScientificComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChildren('animatableCard', { read: ElementRef })
	cards!: QueryList<ElementRef>;
	@ViewChildren('animatableTitle', { read: ElementRef })
	titleElement!: QueryList<ElementRef>;

	titleAnimationStates = new Map<HTMLElement, 'hidden' | 'visible'>();
	private observer!: IntersectionObserver;
	private resizeTimeout: any;

	constructor(
		private cdRef: ChangeDetectorRef,
		private renderer: Renderer2
	) {}

	ngOnInit() {}

	ngAfterViewInit() {
		if (this.cards && this.titleElement) {
			this.setupIntersectionObserver();
			this.recheckElementsVisibility();
		}
	}

	@HostListener('window:resize', ['$event'])
	onWindowResize(event?: Event) {
		clearTimeout(this.resizeTimeout);
		this.resizeTimeout = setTimeout(() => {
			this.recheckElementsVisibility();
		}, 150);
	}

	recheckElementsVisibility() {
		if (!this.cards || !this.titleElement) return;

		const checkElement = (elementRef: ElementRef, isCard: boolean) => {
			const element = elementRef.nativeElement as HTMLElement;
			const isCurrentlyVisible = this.isElementInViewport(element);

			if (isCard) {
				if (isCurrentlyVisible) {
					if (!element.classList.contains('is-visible')) {
						this.renderer.addClass(element, 'is-visible');
					}
				} else {
					if (element.classList.contains('is-visible')) {
						this.renderer.removeClass(element, 'is-visible');
					}
				}
			} else {
				// Para el título (usando animación de Angular)
				const currentState = this.titleAnimationStates.get(element);
				if (isCurrentlyVisible) {
					if (currentState !== 'visible') {
						this.titleAnimationStates.set(element, 'visible');
					}
				} else {
					if (currentState !== 'hidden') {
						this.titleAnimationStates.set(element, 'hidden');
					}
				}
			}
		};

		this.cards.forEach(cardRef => checkElement(cardRef, true));
		this.titleElement.forEach(titleRef => checkElement(titleRef, false));

		this.cdRef.detectChanges();
	}

	isElementInViewport(el: HTMLElement): boolean {
		if (!el) return false;
		const rect = el.getBoundingClientRect();
		const verticalInView = rect.top < window.innerHeight && rect.bottom > 0;
		const horizontalInView =
			rect.left < window.innerWidth && rect.right > 0;
		return verticalInView && horizontalInView;
	}

	setupIntersectionObserver() {
		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 0.1,
		};

		this.observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				const element = entry.target as HTMLElement;
				const isCard = Array.from(this.cards).some(
					c => c.nativeElement === element
				);

				if (isCard) {
					if (entry.isIntersecting) {
						if (!element.classList.contains('is-visible')) {
							this.renderer.addClass(element, 'is-visible');
						}
					} else {
						if (
							element.classList.contains('is-visible') &&
							!this.isElementInViewport(element)
						) {
							// Solo quitar si realmente está fuera, para el caso de resize
							this.renderer.removeClass(element, 'is-visible');
						}
					}
				} else {
					// Para el título
					const currentState = this.titleAnimationStates.get(element);
					if (entry.isIntersecting) {
						if (currentState !== 'visible') {
							this.titleAnimationStates.set(element, 'visible');
							this.cdRef.detectChanges(); // Necesario para el título
						}
					} else {
						if (
							currentState !== 'hidden' &&
							!this.isElementInViewport(element)
						) {
							this.titleAnimationStates.set(element, 'hidden');
							this.cdRef.detectChanges(); // Necesario para el título
						}
					}
				}
			});
		}, options);

		// Inicializar y observar
		this.cards.forEach(cardRef => {
			// El estado inicial (sin 'is-visible') es manejado por CSS
			this.observer.observe(cardRef.nativeElement);
		});
		this.titleElement.forEach(titleRef => {
			this.titleAnimationStates.set(titleRef.nativeElement, 'hidden');
			this.observer.observe(titleRef.nativeElement);
		});
	}

	getTitleAnimationState(element: HTMLElement): 'hidden' | 'visible' {
		return this.titleAnimationStates.get(element) || 'hidden';
	}

	ngOnDestroy() {
		clearTimeout(this.resizeTimeout);
		if (this.observer) {
			if (this.cards) {
				this.cards.forEach(cardRef => {
					if (cardRef.nativeElement)
						this.observer.unobserve(cardRef.nativeElement);
				});
			}
			if (this.titleElement) {
				this.titleElement.forEach(titleRef => {
					if (titleRef.nativeElement)
						this.observer.unobserve(titleRef.nativeElement);
				});
			}
			this.observer.disconnect();
		}
	}
}
