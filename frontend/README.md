# Movies Tecnimatica - Frontend

Aplicación Angular 17 para búsqueda de películas y gestión de favoritos.

---

## 🚀 Quick Start

### Desarrollo
```bash
npm install
npm start
```
La aplicación estará disponible en `http://localhost:4200/`

### Build
```bash
npm run build
```

---

## 🧪 Testing

### Unit Tests (No requiere backend)
```bash
# Ejecutar tests en watch mode
npm test

# Ejecutar una vez con cobertura
npm run test:unit
```
**Estado:** ✅ 51 tests pasando | Coverage: 31.46%

### E2E Tests (Requiere backend corriendo)

**⚠️ IMPORTANTE:** Los tests E2E necesitan que el backend esté corriendo en `http://localhost:5000`

```bash
# Terminal 1: Levantar backend
cd ../backend
dotnet run

# Terminal 2: Ejecutar E2E tests
npm run test:e2e:ui      # Con interfaz (recomendado)
npm run test:e2e         # Headless
npm run test:e2e:headed  # Con navegador visible
npm run test:report      # Ver último reporte
```

**Estado:** ✅ 14 tests E2E creados (auth + movies)

📖 **Guías de Testing:**
- [QUICK-E2E-GUIDE.md](./QUICK-E2E-GUIDE.md) - Guía rápida de E2E
- [TESTING-README.md](./TESTING-README.md) - Documentación completa
- [MANUAL-TESTING.md](./MANUAL-TESTING.md) - Checklist de pruebas manuales

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/               # Servicios y modelos core
│   │   ├── guards/         # Auth guard
│   │   ├── interceptors/   # HTTP interceptors
│   │   ├── models/         # Interfaces TypeScript
│   │   └── services/       # AuthService, TokenService, etc.
│   ├── features/           # Módulos de funcionalidad
│   │   ├── auth/           # Login, Register
│   │   └── pages/          # Search, Favorites
│   └── shared/             # Componentes compartidos
│       ├── components/     # MovieCard, etc.
│       └── services/       # StorageService
├── environments/           # Configuración de entornos
└── styles/                 # Estilos globales
```

---

## 🛠️ Tecnologías

- **Framework:** Angular 17 (Standalone Components)
- **UI Library:** Nebular Theme
- **HTTP Client:** Angular HttpClient
- **State Management:** RxJS (BehaviorSubject)
- **Routing:** Angular Router
- **Forms:** Reactive Forms
- **Testing:** Jasmine + Karma (Unit), Playwright (E2E)

---

## 📝 Scripts Disponibles

### Desarrollo
- `npm start` - Dev server con proxy al backend
- `npm run build` - Build de producción
- `npm run watch` - Build en modo watch

### Testing
- `npm test` - Unit tests (watch mode)
- `npm run test:unit` - Unit tests (una vez, con coverage)
- `npm run test:e2e` - E2E tests (headless)
- `npm run test:e2e:ui` - E2E tests (con UI)
- `npm run test:e2e:headed` - E2E tests (navegador visible)
- `npm run test:report` - Ver reporte de E2E

---

## 🔧 Configuración

### Proxy al Backend
El archivo `src/proxy.conf.json` redirige `/api` a `http://localhost:5000`:

```json
{
  "/api": {
    "target": "http://localhost:5000",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": {
      "^/api": ""
    }
  }
}
```

### Environment
Configurado en `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: '/api'
};
```

---

## 🎯 Funcionalidades

### Autenticación
- ✅ Registro de usuarios
- ✅ Login con JWT
- ✅ Logout
- ✅ Auth Guard protegiendo rutas
- ✅ Interceptor para agregar token automáticamente
- ✅ Validación de expiración de token

### Búsqueda de Películas
- ✅ Búsqueda por título (OMDb API)
- ✅ Paginación de resultados
- ✅ Vista en grid responsivo
- ✅ Indicadores visuales de películas favoritas

### Favoritos
- ✅ Agregar películas a favoritos
- ✅ Listar favoritos con paginación
- ✅ Eliminar de favoritos
- ✅ Sincronización con backend

---

## 🐛 Troubleshooting

### Error: "Cannot connect to backend"
**Solución:** Asegúrate que el backend esté corriendo en `http://localhost:5000`
```bash
cd ../backend
dotnet run
```

### Error: "Tests E2E fallan"
**Causa:** El backend no está corriendo

**Solución:** Ver [QUICK-E2E-GUIDE.md](./QUICK-E2E-GUIDE.md) para instrucciones detalladas

### Error: "Port 4200 already in use"
**Solución:**
```bash
lsof -ti:4200 | xargs kill -9
npm start
```

---

## 📚 Documentación Adicional

- [TESTING-GUIDE.md](./TESTING-GUIDE.md) - Conceptos de testing
- [TESTING-README.md](./TESTING-README.md) - Guía completa de testing
- [MANUAL-TESTING.md](./MANUAL-TESTING.md) - Checklist de pruebas manuales
- [QUICK-E2E-GUIDE.md](./QUICK-E2E-GUIDE.md) - Guía rápida de E2E tests
- [E2E-FIXES.md](./E2E-FIXES.md) - Solución de problemas E2E

---

## 🤝 Contribuir

1. Crear feature branch: `git checkout -b feature/nueva-funcionalidad`
2. Hacer cambios y commits
3. Ejecutar tests: `npm run test:unit`
4. Push y crear Pull Request

---

## 📄 Licencia

MIT © 2024 Movies Tecnimatica
