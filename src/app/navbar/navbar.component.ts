import { Component } from '@angular/core';
import { ThemeService } from 'app/theme.service';

@Component({
  selector: 'rxp-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  get theme(): string {
    return this.themeService.theme;
  }

  set theme(value: string) {
    this.themeService.theme = value;
  }

  constructor(private themeService: ThemeService) {}

  toggleTheme(): void {
    if (this.themeService.theme === 'rxp-light-theme') {
      this.themeService.theme = 'rxp-dark-theme';
    } else {
      this.themeService.theme = 'rxp-light-theme';
    }
  }
}
