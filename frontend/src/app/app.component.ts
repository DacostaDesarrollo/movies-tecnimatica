import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NbThemeModule } from '@nebular/theme';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NbThemeModule],
  template: '<router-outlet></router-outlet>',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
