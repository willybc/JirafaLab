import { Component, OnInit } from '@angular/core';
import {
	trigger,
	state,
	style,
	animate,
	transition,
} from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-portada',
	imports: [CommonModule],
	templateUrl: './portada.component.html',
	styleUrl: './portada.component.scss',
	animations: [
		trigger('slideInFromLeft', [
			state(
				'out',
				style({
					transform: 'translateX(-100%)',
					opacity: 0,
				})
			),
			state(
				'in',
				style({
					transform: 'translateX(0)',
					opacity: 1,
				})
			),
			transition('out => in', [animate('700ms ease-out')]),
		]),
	],
})
export class PortadaComponent implements OnInit {
	animationState: 'in' | 'out' = 'out';

	constructor() {}

	ngOnInit() {
		setTimeout(() => {
			this.animationState = 'in';
		}, 0);
	}
}
