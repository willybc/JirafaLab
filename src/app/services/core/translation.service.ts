import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
	providedIn: 'root',
})
export class TranslationService {
	private readonly LANG_KEY = 'user_lang';
	private readonly DEFAULT_LANG = 'es';

	constructor(private translate: TranslateService) {
		this.initLanguage();
	}

	private initLanguage(): void {
		this.translate.setDefaultLang(this.DEFAULT_LANG);
		const storedLang = localStorage.getItem(this.LANG_KEY);
		const browserLang = this.translate.getBrowserLang();

		if (storedLang) {
			this.translate.use(storedLang);
		} else if (browserLang && browserLang.match(/en|es/)) {
			this.translate.use(browserLang);
			localStorage.setItem(this.LANG_KEY, browserLang);
		} else {
			this.translate.use(this.DEFAULT_LANG);
			localStorage.setItem(this.LANG_KEY, this.DEFAULT_LANG);
		}
	}

	getCurrentLang(): string {
		return this.translate.currentLang || this.DEFAULT_LANG;
	}

	setLanguage(lang: string): void {
		if (lang === this.translate.currentLang) {
			return;
		}
		this.translate.use(lang).subscribe({
			next: () => {
				localStorage.setItem(this.LANG_KEY, lang);
			},
			error: err => {
				console.error(`Failed to change language to ${lang}:`, err);
			},
		});
	}
}
