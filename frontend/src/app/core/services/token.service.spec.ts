import { TestBed } from '@angular/core/testing';
import { TokenService } from './token.service';
import { StorageService } from '../../shared/services/storage.service';

/**
 * 🧪 UNIT TESTS PARA TokenService
 *
 * Este archivo contiene pruebas unitarias para verificar que TokenService
 * funciona correctamente. Los unit tests prueban cada método de forma aislada.
 *
 * ESTRUCTURA DE UN TEST:
 * - describe(): Agrupa tests relacionados
 * - beforeEach(): Se ejecuta ANTES de cada test (setup)
 * - it(): Un test específico
 * - expect(): Verifica que algo sea verdad
 */

describe('TokenService', () => {
  let service: TokenService;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  /**
   * beforeEach se ejecuta ANTES de cada test
   * Aquí configuramos el entorno de prueba
   */
  beforeEach(() => {
    // Creamos un "spy" (mock) del StorageService
    // Un spy es un objeto falso que simula el comportamiento del real
    const spy = jasmine.createSpyObj('StorageService', [
      'setItem',
      'getItem',
      'removeItem',
      'clear'
    ]);

    // Configuramos el módulo de testing
    TestBed.configureTestingModule({
      providers: [
        TokenService,
        { provide: StorageService, useValue: spy } // Usamos nuestro spy en lugar del real
      ]
    });

    // Obtenemos instancias del servicio y el spy
    service = TestBed.inject(TokenService);
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  /**
   * Test básico: verifica que el servicio se crea correctamente
   */
  it('should be created', () => {
    expect(service).toBeTruthy(); // Verifica que service existe
  });

  /**
   * GRUPO DE TESTS: saveToken()
   */
  describe('saveToken', () => {
    it('should call storageService.setItem with correct parameters', () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';

      service.saveToken(mockToken);

      // Verificamos que se llamó al método correcto con los parámetros correctos
      expect(storageServiceSpy.setItem).toHaveBeenCalledWith('auth_token', mockToken);
      expect(storageServiceSpy.setItem).toHaveBeenCalledTimes(1); // Solo una vez
    });
  });

  /**
   * GRUPO DE TESTS: getToken()
   */
  describe('getToken', () => {
    it('should return token from storage', () => {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test';

      // Configuramos el spy para que retorne el token cuando se llame
      storageServiceSpy.getItem.and.returnValue(mockToken);

      const result = service.getToken();

      expect(result).toBe(mockToken);
      expect(storageServiceSpy.getItem).toHaveBeenCalledWith('auth_token');
    });

    it('should return null when no token exists', () => {
      // Configuramos el spy para que retorne null
      storageServiceSpy.getItem.and.returnValue(null);

      const result = service.getToken();

      expect(result).toBeNull();
    });
  });

  /**
   * GRUPO DE TESTS: removeToken()
   */
  describe('removeToken', () => {
    it('should call storageService.removeItem with correct key', () => {
      service.removeToken();

      expect(storageServiceSpy.removeItem).toHaveBeenCalledWith('auth_token');
      expect(storageServiceSpy.removeItem).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * GRUPO DE TESTS: saveUser()
   */
  describe('saveUser', () => {
    it('should save user email to storage', () => {
      const name = 'Test User';
      const email = 'test@example.com';

      service.saveUser(name, email);

      expect(storageServiceSpy.setItem).toHaveBeenCalledWith('current_user', { name, email });
    });
  });

  /**
   * GRUPO DE TESTS: getUser()
   */
  describe('getUser', () => {
    it('should return user from storage', () => {
      const mockUser = { name: 'Test User', email: 'test@example.com' };
      storageServiceSpy.getItem.and.returnValue(mockUser);

      const result = service.getUser();

      expect(result).toEqual(mockUser);
      expect(storageServiceSpy.getItem).toHaveBeenCalledWith('current_user');
    });

    it('should return null when no user exists', () => {
      storageServiceSpy.getItem.and.returnValue(null);

      const result = service.getUser();

      expect(result).toBeNull();
    });
  });

  /**
   * GRUPO DE TESTS: removeUser()
   */
  describe('removeUser', () => {
    it('should remove user from storage', () => {
      service.removeUser();

      expect(storageServiceSpy.removeItem).toHaveBeenCalledWith('current_user');
    });
  });

  /**
   * GRUPO DE TESTS: isAuthenticated()
   * Este es más complejo porque depende de isTokenExpired
   */
  describe('isAuthenticated', () => {
    it('should return false when no token exists', () => {
      storageServiceSpy.getItem.and.returnValue(null);

      const result = service.isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return true when token exists and is not expired', () => {
      // Token válido que expira en el futuro (1 hora)
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600;
      const validToken = createMockToken({ exp: futureTimestamp });

      storageServiceSpy.getItem.and.returnValue(validToken);

      const result = service.isAuthenticated();

      expect(result).toBe(true);
    });

    it('should return false when token is expired', () => {
      // Token que expiró hace 1 hora
      const pastTimestamp = Math.floor(Date.now() / 1000) - 3600;
      const expiredToken = createMockToken({ exp: pastTimestamp });

      storageServiceSpy.getItem.and.returnValue(expiredToken);

      const result = service.isAuthenticated();

      expect(result).toBe(false);
    });

    it('should return false when token is malformed', () => {
      storageServiceSpy.getItem.and.returnValue('invalid-token');

      const result = service.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  /**
   * GRUPO DE TESTS: getTokenExpiration()
   */
  describe('getTokenExpiration', () => {
    it('should return expiration date for valid token', () => {
      const futureTimestamp = Math.floor(Date.now() / 1000) + 3600;
      const validToken = createMockToken({ exp: futureTimestamp });

      storageServiceSpy.getItem.and.returnValue(validToken);

      const result = service.getTokenExpiration();

      expect(result).toBeInstanceOf(Date);
      expect(result?.getTime()).toBe(futureTimestamp * 1000);
    });

    it('should return null when no token exists', () => {
      storageServiceSpy.getItem.and.returnValue(null);

      const result = service.getTokenExpiration();

      expect(result).toBeNull();
    });

    it('should return null for invalid token', () => {
      storageServiceSpy.getItem.and.returnValue('invalid-token');

      const result = service.getTokenExpiration();

      expect(result).toBeNull();
    });
  });
});

/**
 * 🛠️ HELPER FUNCTION
 * Crea un token JWT falso para testing
 */
function createMockToken(payload: any): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = 'fake-signature';

  return `${header}.${encodedPayload}.${signature}`;
}
