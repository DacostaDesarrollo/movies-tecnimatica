import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MovieCardComponent } from './movie-card.component';
import { Movie } from '../../../core/models/movie.model';
import { NbCardModule, NbButtonModule, NbIconModule, NbThemeModule, NbIconLibraries } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';

/**
 * 🧪 UNIT TESTS PARA MovieCardComponent
 *
 * Testing de componentes incluye:
 * 1. Verificar que el componente se crea
 * 2. Verificar que los @Input se reciben correctamente
 * 3. Verificar que los @Output emiten eventos
 * 4. Verificar que el template se renderiza correctamente
 * 5. Verificar interacciones del usuario (clicks, etc)
 *
 * NUEVOS CONCEPTOS:
 * - fixture: Wrapper del componente con métodos útiles
 * - DebugElement: Permite buscar elementos en el DOM
 * - detectChanges(): Fuerza la detección de cambios en el template
 */

describe('MovieCardComponent', () => {
  let component: MovieCardComponent;
  let fixture: ComponentFixture<MovieCardComponent>;
  let compiled: HTMLElement; // Referencia al HTML compilado

  // Mock de una película para testing
  const mockMovie: Movie = {
    ImdbID: 'tt0111161',
    Title: 'The Shawshank Redemption',
    Year: '1994',
    Type: 'movie',
    Poster: 'https://example.com/poster.jpg',
    IsFavorite: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MovieCardComponent, // Componente standalone
        NbCardModule,
        NbButtonModule,
        NbIconModule,
        NbEvaIconsModule, // Agregamos eva icons
        NbThemeModule.forRoot() // Necesario para Nebular
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;

    // Inicializamos el input movie para evitar undefined
    component.movie = mockMovie;
  });  /**
   * TEST BÁSICO: Creación del componente
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * TESTS DE @INPUT
   */
  describe('Input Properties', () => {
    it('should accept movie input', () => {
      component.movie = mockMovie;
      fixture.detectChanges(); // Actualizamos el template

      expect(component.movie).toEqual(mockMovie);
    });

    it('should have default mode as "add"', () => {
      expect(component.mode).toBe('add');
    });

    it('should accept mode input', () => {
      component.mode = 'remove';
      fixture.detectChanges();

      expect(component.mode).toBe('remove');
    });
  });

  /**
   * TESTS DE RENDERIZADO
   */
  describe('Template Rendering', () => {
    beforeEach(() => {
      component.movie = mockMovie;
      component.mode = 'add';
      fixture.detectChanges();
    });

    it('should display movie title', () => {
      const titleElement = compiled.querySelector('.movie-title');
      expect(titleElement?.textContent).toContain(mockMovie.Title);
    });

    it('should display movie year', () => {
      const yearElement = compiled.querySelector('.movie-year');
      expect(yearElement?.textContent).toContain(mockMovie.Year);
    });

    it('should display movie poster image', () => {
      const imgElement = compiled.querySelector('.movie-poster img') as HTMLImageElement;
      expect(imgElement.src).toContain(mockMovie.Poster);
      expect(imgElement.alt).toBe(mockMovie.Title);
    });

    it('should display placeholder image when poster is "N/A"', () => {
      component.movie = { ...mockMovie, Poster: 'N/A' };
      fixture.detectChanges();

      const imgElement = compiled.querySelector('.movie-poster img') as HTMLImageElement;
      expect(imgElement.src).toContain('assets/no-poster.png');
    });

    it('should show favorite badge when movie is favorite and mode is "add"', () => {
      component.movie = { ...mockMovie, IsFavorite: true };
      component.mode = 'add';
      fixture.detectChanges();

      const badge = compiled.querySelector('.favorite-badge');
      expect(badge).toBeTruthy();
    });

    it('should NOT show favorite badge when movie is not favorite', () => {
      component.movie = { ...mockMovie, IsFavorite: false };
      fixture.detectChanges();

      const badge = compiled.querySelector('.favorite-badge');
      expect(badge).toBeFalsy();
    });

    it('should NOT show favorite badge in "remove" mode even if favorite', () => {
      component.movie = { ...mockMovie, IsFavorite: true };
      component.mode = 'remove';
      fixture.detectChanges();

      const badge = compiled.querySelector('.favorite-badge');
      expect(badge).toBeFalsy();
    });

    it('should add "is-favorite" class when movie is favorite', () => {
      component.movie = { ...mockMovie, IsFavorite: true };
      fixture.detectChanges();

      const card = compiled.querySelector('.movie-card');
      expect(card?.classList.contains('is-favorite')).toBe(true);
    });
  });

  /**
   * TESTS DE BOTONES
   */
  describe('Button Display Logic', () => {
    it('should show "Agregar" button when mode is "add" and not favorite', () => {
      component.movie = { ...mockMovie, IsFavorite: false };
      component.mode = 'add';
      fixture.detectChanges();

      const buttons = compiled.querySelectorAll('button');
      const addButton = Array.from(buttons).find(btn =>
        btn.textContent?.includes('Agregar a Favoritos')
      );

      expect(addButton).toBeTruthy();
      expect(addButton?.disabled).toBe(false);
    });

    it('should show "En Favoritos" button (disabled) when movie is favorite', () => {
      component.movie = { ...mockMovie, IsFavorite: true };
      component.mode = 'add';
      fixture.detectChanges();

      const buttons = compiled.querySelectorAll('button');
      const favoriteButton = Array.from(buttons).find(btn =>
        btn.textContent?.includes('En Favoritos')
      );

      expect(favoriteButton).toBeTruthy();
      expect(favoriteButton?.disabled).toBe(true);
    });

    it('should show "Eliminar" button when mode is "remove"', () => {
      component.movie = mockMovie;
      component.mode = 'remove';
      fixture.detectChanges();

      const buttons = compiled.querySelectorAll('button');
      const removeButton = Array.from(buttons).find(btn =>
        btn.textContent?.includes('Eliminar')
      );

      expect(removeButton).toBeTruthy();
    });
  });

  /**
   * TESTS DE @OUTPUT (Eventos)
   */
  describe('Event Emitters', () => {
    it('should emit addToFavorites when "Agregar" button is clicked', () => {
      component.movie = { ...mockMovie, IsFavorite: false };
      component.mode = 'add';
      fixture.detectChanges();

      // Espiamos el EventEmitter
      spyOn(component.addToFavorites, 'emit');

      // Buscamos y clickeamos el botón
      const buttons = compiled.querySelectorAll('button');
      const addButton = Array.from(buttons).find(btn =>
        btn.textContent?.includes('Agregar a Favoritos')
      ) as HTMLButtonElement;

      addButton.click();

      // Verificamos que se emitió el evento con la película correcta
      expect(component.addToFavorites.emit).toHaveBeenCalledWith(mockMovie);
    });

    it('should emit removeFromFavorites when "Eliminar" button is clicked', () => {
      component.movie = mockMovie;
      component.mode = 'remove';
      fixture.detectChanges();

      spyOn(component.removeFromFavorites, 'emit');

      const buttons = compiled.querySelectorAll('button');
      const removeButton = Array.from(buttons).find(btn =>
        btn.textContent?.includes('Eliminar')
      ) as HTMLButtonElement;

      removeButton.click();

      expect(component.removeFromFavorites.emit).toHaveBeenCalledWith(mockMovie);
    });

    it('should call onAddToFavorites when button is clicked', () => {
      component.movie = { ...mockMovie, IsFavorite: false };
      component.mode = 'add';
      fixture.detectChanges();

      spyOn(component, 'onAddToFavorites');

      const buttons = compiled.querySelectorAll('button');
      const addButton = Array.from(buttons).find(btn =>
        btn.textContent?.includes('Agregar a Favoritos')
      ) as HTMLButtonElement;

      addButton.click();

      expect(component.onAddToFavorites).toHaveBeenCalled();
    });
  });

  /**
   * TESTS DE MÉTODOS
   */
  describe('Component Methods', () => {
    it('should handle image error by setting placeholder', () => {
      const mockEvent = {
        target: {
          src: ''
        }
      } as any;

      component.handleImageError(mockEvent);

      expect(mockEvent.target.src).toBe('assets/no-poster.png');
    });
  });

  /**
   * TESTS DE INTEGRACIÓN
   */
  describe('Integration Tests', () => {
    it('should update display when movie input changes', () => {
      component.movie = mockMovie;
      fixture.detectChanges();

      let titleElement = compiled.querySelector('.movie-title');
      expect(titleElement?.textContent).toContain('The Shawshank Redemption');

      // Cambiamos la película
      const newMovie: Movie = {
        ...mockMovie,
        Title: 'The Godfather',
        Year: '1972'
      };

      component.movie = newMovie;
      fixture.detectChanges();

      titleElement = compiled.querySelector('.movie-title');
      expect(titleElement?.textContent).toContain('The Godfather');
    });

    it('should switch button when mode changes', () => {
      component.movie = mockMovie;
      component.mode = 'add';
      fixture.detectChanges();

      let buttons = compiled.querySelectorAll('button');
      let addButton = Array.from(buttons).find(btn =>
        btn.textContent?.includes('Agregar')
      );
      expect(addButton).toBeTruthy();

      // Cambiamos a modo "remove"
      component.mode = 'remove';
      fixture.detectChanges();

      buttons = compiled.querySelectorAll('button');
      const removeButton = Array.from(buttons).find(btn =>
        btn.textContent?.includes('Eliminar')
      );
      expect(removeButton).toBeTruthy();
    });
  });
});
