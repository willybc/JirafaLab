// header.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IndexService } from '../../services/core/index.service';
import { TranslationService } from '../../services/core/translation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
	selector: 'app-header',
	imports: [TranslateModule],
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
	constructor(
		private router: Router,
		private indexService: IndexService,
		private translationService: TranslationService
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

	changeLanguage(lang: string): void {
		this.translationService.setLanguage(lang);
	}

	getCurrentLang(): string {
		return this.translationService.getCurrentLang();
	}
}
