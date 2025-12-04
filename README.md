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

**OMDB API Key:** Configurada en `appsettings.json`
