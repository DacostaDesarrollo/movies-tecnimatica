import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NbActionsModule, NbButtonModule, NbContextMenuModule, NbIconModule, NbLayoutModule, NbMenuModule, NbMenuService, NbSidebarModule, NbUserModule } from '@nebular/theme';
import { AuthService } from '../../core/services/auth.service';
import { Subject, takeUntil, filter } from 'rxjs';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [
    NbLayoutModule,
    NbSidebarModule,
    NbMenuModule,
    NbIconModule,
    NbActionsModule,
    NbUserModule,
    NbContextMenuModule,
    RouterOutlet,
    NbButtonModule
  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  menuItems = [
    {
      title: 'Buscar Películas',
      icon: 'search-outline',
      link: '/pages/search'
    },
    {
      title: 'Mis Favoritos',
      icon: 'heart-outline',
      link: '/pages/favorites'
    }
  ];

  userMenu = [
    { title: 'Cerrar Sesión', icon: 'log-out-outline', data: { action: 'logout' } }
  ];

  user = {
    name: 'Usuario',
    picture: 'https://i.pravatar.cc/150?img=67'
  };

  constructor(
    private authService: AuthService,
    private nbMenuService: NbMenuService
  ) {}

  ngOnInit(): void {
    // Suscribirse a los eventos del menú de usuario
    this.nbMenuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'user-menu'),
        takeUntil(this.destroy$)
      )
      .subscribe(({ item }) => {
        if (item.data?.action === 'logout') {
          this.onLogout();
        }
      });

    // Cargar datos del usuario actual
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user.name = user.email;
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
