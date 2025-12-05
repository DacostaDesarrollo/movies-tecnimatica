# Movies Tecnimatica

Aplicación full-stack para búsqueda y gestión de películas favoritas.

## Requisitos

- Node.js 18+
- .NET 8
- Docker (PostgreSQL)

## Instalación

### Base de datos

```bash
docker-compose up -d
```

### Backend

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

**Configurar OMDB API Key:**
1. Obtener API key gratuita en https://www.omdbapi.com/apikey.aspx
2. Abrir `backend/appsettings.json`
3. Reemplazar el valor vacío en la sección `OMDb`:
```json
"OMDb": {
  "ApiKey": "tu-api-key-aqui",
  "BaseUrl": "https://www.omdbapi.com/"
}
```

El backend estará en `http://localhost:5232`

### Frontend

```bash
cd frontend
npm install
ng serve
```

El frontend estará en `http://localhost:4200`

## Funcionalidades

- Registro y autenticación de usuarios con JWT
- Búsqueda de películas mediante OMDB API
- Gestión de favoritos (agregar/eliminar)
- Interfaz responsive con Nebular UI

## Testing

### Frontend

```bash
cd frontend
npm run test:unit    # Tests unitarios (56 tests)
npm run test:e2e:ui  # Tests E2E (11 tests)
```

### Backend

```bash
cd backend.Tests
dotnet test          # Tests unitarios (17 tests)
```

## Tecnologías

**Frontend:** Angular 17, Nebular UI, RxJS  
**Backend:** .NET 8, EF Core, PostgreSQL  
**Testing:** Jasmine, Karma, Playwright, xUnit

## Credenciales

Crear cuenta nueva desde la interfaz de registro.

**OMDB API Key:** Configurada en `appsettings.json` (obtener en https://www.omdbapi.com/apikey.aspx)

## Decisiones de Arquitectura

### Decisiones Tomadas

**Arquitectura en Capas:**
- **Backend:** Separación clara entre Controllers, Services, DTOs y Models para mantener responsabilidades únicas
- **Frontend:** Arquitectura modular con separación de features, core services y componentes compartidos
- **Testing:** Tests unitarios y E2E separados, con cobertura del 53.93% en frontend y 100% de los casos críticos en backend


### Posibles Mejoras Futuras

**Escalabilidad:**

- Implementar gestor de estado (NgRx/Akita) para manejar estado global de forma más estructurada
- Mejora el diseño y experiencia de usuario me centre en la funcionalidad en el backend y frontend
- en el fronend mas separacion de componentes para reutilización de los mismos
- Paginación en búsqueda de películas y lista de favoritos implementado scroll infinito
- Implementar rate limiting en endpoints del backend


**Seguridad:**
- Implementar refresh tokens para mejorar seguridad de JWT
- Agregar validación de fortaleza de contraseña en backend
- Agregar sanitización adicional de inputs contra XSS/SQL injection

**Funcionalidades:**


- Filtros avanzados de búsqueda (año, género, rating)
- Listas personalizadas de películas (no solo favoritos)
- Sistema de recomendaciones basado en favoritos
- Compartir listas de favoritos entre usuarios
- Calificaciones y reseñas personales

**Testing:**
- Aumentar cobertura de tests unitarios
- Agregar tests de integración entre backend y base de datos real
- CI/CD con GitHub Actions para ejecutar tests automáticamente

**DevOps:**
- Containerizar backend con Docker (actualmente solo DB)
- Implementar Docker Compose completo para todo el stack

