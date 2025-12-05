import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/user.model';

/**
 * 🧪 UNIT TESTS PARA AuthService
 *
 * Este servicio es más complejo porque:
 * 1. Hace llamadas HTTP
 * 2. Usa otros servicios (TokenService, Router)
 * 3. Maneja estados (BehaviorSubject)
 *
 * Usaremos HttpTestingController para simular las respuestas del backend
 */

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenServiceSpy: jasmine.SpyObj<TokenService>;
  let routerSpy: jasmine.SpyObj<Router>;
  const API_URL = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    // Creamos spies para TokenService y Router
    const tokenSpy = jasmine.createSpyObj('TokenService', [
      'saveToken',
      'saveUser',
      'getToken',
      'getUser',
      'removeToken',
      'removeUser',
      'clear' // Agregamos clear
    ]);

    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule // Módulo especial para testing HTTP
      ],
      providers: [
        AuthService,
        { provide: TokenService, useValue: tokenSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController); // Controller para verificar peticiones HTTP
    tokenServiceSpy = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Por defecto, simulamos que no hay usuario guardado
    tokenServiceSpy.getToken.and.returnValue(null);
    tokenServiceSpy.getUser.and.returnValue(null);
  });

  /**
   * afterEach: Se ejecuta DESPUÉS de cada test
   * Verificamos que no haya peticiones HTTP pendientes
   */
  afterEach(() => {
    httpMock.verify(); // Verifica que todas las peticiones HTTP esperadas se hicieron
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * TESTS DE INICIALIZACIÓN
   */
  describe('Initialization', () => {
    it('should load user from storage on creation', () => {
      // Recreamos el servicio con datos en storage
      const mockToken = 'mock-token';
      const mockUser = { name: 'Test User', email: 'test@example.com' };

      tokenServiceSpy.getToken.and.returnValue(mockToken);
      tokenServiceSpy.getUser.and.returnValue(mockUser);

      // Creamos una nueva instancia del servicio
      const newService = new AuthService(
        TestBed.inject(HttpClientTestingModule) as any,
        tokenServiceSpy,
        routerSpy
      );

      // Verificamos que se haya intentado cargar el usuario
      expect(tokenServiceSpy.getToken).toHaveBeenCalled();
      expect(tokenServiceSpy.getUser).toHaveBeenCalled();
    });
  });

  /**
   * TESTS PARA register()
   */
  describe('register', () => {
    it('should send POST request to /auth/register', () => {
      const registerData: RegisterRequest = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'Password123!'
      };

      const mockResponse: AuthResponse = {
        message: 'Usuario registrado exitosamente',
        token: 'mock-jwt-token',
        name: 'New User',
        email: 'newuser@example.com'
      };

      // Ejecutamos el método
      service.register(registerData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      // Verificamos que se hizo la petición HTTP correcta
      const req = httpMock.expectOne(`${API_URL}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerData);

      // Simulamos la respuesta del servidor
      req.flush(mockResponse);

      // Verificamos que se guardaron token y usuario
      expect(tokenServiceSpy.saveToken).toHaveBeenCalledWith(mockResponse.token);
      expect(tokenServiceSpy.saveUser).toHaveBeenCalledWith(mockResponse.name, mockResponse.email);
    });

    it('should handle registration error', () => {
      const registerData: RegisterRequest = {
        name: 'Existing User',
        email: 'existing@example.com',
        password: 'Password123!'
      };

      const errorMessage = 'El email ya está registrado';

      service.register(registerData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${API_URL}/register`);

      // Simulamos un error del servidor
      req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
    });
  });

  /**
   * TESTS PARA login()
   */
  describe('login', () => {
    it('should send POST request to /auth/login', () => {
      const loginData: LoginRequest = {
        email: 'user@example.com',
        password: 'Password123!'
      };

      const mockResponse: AuthResponse = {
        message: 'Login exitoso',
        token: 'mock-jwt-token',
        name: 'Test User',
        email: 'user@example.com'
      };

      service.login(loginData).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginData);

      req.flush(mockResponse);

      expect(tokenServiceSpy.saveToken).toHaveBeenCalledWith(mockResponse.token);
      expect(tokenServiceSpy.saveUser).toHaveBeenCalledWith(mockResponse.name, mockResponse.email);
    });

    it('should handle login error for invalid credentials', () => {
      const loginData: LoginRequest = {
        email: 'user@example.com',
        password: 'WrongPassword'
      };

      service.login(loginData).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${API_URL}/login`);
      req.flush('Credenciales inválidas', { status: 401, statusText: 'Unauthorized' });
    });

    it('should update currentUser$ observable after successful login', (done) => {
      const loginData: LoginRequest = {
        email: 'user@example.com',
        password: 'Password123!'
      };

      const mockResponse: AuthResponse = {
        message: 'Login exitoso',
        token: 'mock-jwt-token',
        name: 'Test User',
        email: 'user@example.com'
      };

      // Suscribimos al observable ANTES de hacer login
      service.currentUser$.subscribe(user => {
        if (user) { // Solo verificamos cuando hay usuario
          expect(user.email).toBe(mockResponse.email);
          expect(user.token).toBe(mockResponse.token);
          done(); // Marca el test como completado
        }
      });

      service.login(loginData).subscribe();

      const req = httpMock.expectOne(`${API_URL}/login`);
      req.flush(mockResponse);
    });
  });

  /**
   * TESTS PARA logout()
   */
  describe('logout', () => {
    it('should call tokenService.clear()', () => {
      service.logout();

      expect(tokenServiceSpy.clear).toHaveBeenCalled();
    });

    it('should navigate to login page', () => {
      service.logout();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should clear currentUser$ observable', (done) => {
      // Primero seteamos un usuario
      const mockToken = 'mock-token';
      const mockUser = { name: 'Test User', email: 'test@example.com' };

      tokenServiceSpy.getToken.and.returnValue(mockToken);
      tokenServiceSpy.getUser.and.returnValue(mockUser);

      // Hacemos logout
      service.logout();

      // Verificamos que currentUser$ emite null
      service.currentUser$.subscribe(user => {
        expect(user).toBeNull();
        done();
      });
    });
  });

  /**
   * TESTS PARA getCurrentUser()
   */
  describe('getCurrentUser', () => {
    it('should return current user from observable', (done) => {
      const mockUser = {
        name: 'Test User',
        email: 'test@example.com',
        token: 'mock-token'
      };

      // Simulamos un login
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'Password123!'
      };

      const mockResponse: AuthResponse = {
        message: 'Login exitoso',
        token: 'mock-token',
        name: 'Test User',
        email: 'test@example.com'
      };

      service.login(loginData).subscribe();

      const req = httpMock.expectOne(`${API_URL}/login`);
      req.flush(mockResponse);

      // Verificamos que getCurrentUser retorna el usuario correcto
      const currentUser = service.getCurrentUser();
      expect(currentUser).toEqual(mockUser);
      done();
    });

    it('should return null when no user is logged in', () => {
      const currentUser = service.getCurrentUser();
      expect(currentUser).toBeNull();
    });
  });
});
