import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { TranslationService } from './services/core/translation.service';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, HeaderComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	title = 'jirafa-lab';

	constructor(private translationService: TranslationService) {}
}
