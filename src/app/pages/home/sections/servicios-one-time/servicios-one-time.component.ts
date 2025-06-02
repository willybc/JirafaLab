import {
	Component,
	OnInit,
	AfterViewInit,
	OnDestroy,
	ElementRef,
	ViewChild,
	ChangeDetectorRef,
	HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
	trigger,
	state,
	style,
	animate,
	transition,
} from '@angular/animations';


@Component({
	selector: 'app-servicios-one-time',
	standalone: true,
	imports: [CommonModule, TranslateModule],
	templateUrl: './servicios-one-time.component.html',
	styleUrl: './servicios-one-time.component.scss',
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

export class ServiciosOneTimeComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('animatableTitle', { read: ElementRef, static: false })
	titleElementRef!: ElementRef;

	titleAnimationState: 'hidden' | 'visible' = 'hidden';
	private observer!: IntersectionObserver;
	private resizeTimeout: any;

	constructor(private cdRef: ChangeDetectorRef) {}

	ngOnInit() {}

	ngAfterViewInit() {
		if (this.titleElementRef && this.titleElementRef.nativeElement) {
			this.setupIntersectionObserver();
			this.recheckTitleVisibility();
		}
	}

	@HostListener('window:resize', ['$event'])
	onWindowResize(event?: Event) {
		clearTimeout(this.resizeTimeout);
		this.resizeTimeout = setTimeout(() => {
			if (this.titleElementRef && this.titleElementRef.nativeElement) {
				this.recheckTitleVisibility();
			}
		}, 150);
	}

	recheckTitleVisibility() {
		if (!this.titleElementRef || !this.titleElementRef.nativeElement)
			return;

		const element = this.titleElementRef.nativeElement as HTMLElement;
		const isCurrentlyVisible = this.isElementInViewport(element);
		let changed = false;

		if (isCurrentlyVisible) {
			if (this.titleAnimationState !== 'visible') {
				this.titleAnimationState = 'visible';
				changed = true;
			}
		} else {
			if (this.titleAnimationState !== 'hidden') {
				this.titleAnimationState = 'hidden';
				changed = true;
			}
		}

		if (changed) {
			this.cdRef.detectChanges();
		}
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
		if (!this.titleElementRef || !this.titleElementRef.nativeElement)
			return;

		const options = {
			root: null,
			rootMargin: '0px',
			threshold: 0.1,
		};

		this.observer = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.target === this.titleElementRef.nativeElement) {
					let changed = false;
					if (entry.isIntersecting) {
						if (this.titleAnimationState !== 'visible') {
							this.titleAnimationState = 'visible';
							changed = true;
						}
					} else {
						if (
							this.titleAnimationState !== 'hidden' &&
							!this.isElementInViewport(
								entry.target as HTMLElement
							)
						) {
							this.titleAnimationState = 'hidden';
							changed = true;
						}
					}
					if (changed) {
						this.cdRef.detectChanges();
					}
				}
			});
		}, options);

		this.observer.observe(this.titleElementRef.nativeElement);
	}

	getTitleAnimationState(element: HTMLElement): 'hidden' | 'visible' {
		return this.titleAnimationState;
	}

	ngOnDestroy() {
		clearTimeout(this.resizeTimeout);
		if (this.observer) {
			if (this.titleElementRef && this.titleElementRef.nativeElement) {
				this.observer.unobserve(this.titleElementRef.nativeElement);
			}
			this.observer.disconnect();
		}
	}
}
