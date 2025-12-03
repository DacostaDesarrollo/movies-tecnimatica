import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NbActionsModule, NbContextMenuModule, NbIconModule, NbLayoutModule, NbMenuModule, NbSidebarModule, NbUserModule } from '@nebular/theme';

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
    RouterOutlet
  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss'
})
export class PagesComponent {
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
    { title: 'Cerrar Sesión', icon: 'log-out-outline' }
  ];

  user = {
    name: 'Usuario',
    picture: 'https://i.pravatar.cc/150?img=3'
  };
}
