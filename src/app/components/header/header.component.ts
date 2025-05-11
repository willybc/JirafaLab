// header.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IndexService } from '../../services/core/index.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})

export class HeaderComponent {
	constructor(
		private router: Router,
		private indexService: IndexService
	) {}

	navigateToSection(key: string) {
		const isHome = this.router.url === '/';

		if (isHome) {
			// Ya estamos en Home, emite la navegación
			this.indexService.requestDirectNavigation(key);
		} else {
			// Guarda la navegación pendiente y redirige
			this.indexService.setPendingSection(key);
			this.router.navigate(['/']);
		}
	}
}
