# GamePlatform - Plataforma de Juegos

## Descripción general

GamePlatform es una plataforma web modular (módulo **0613**) que combina dos visiones técnicas en una sola aplicación:

- **CRM de gestión**: panel de administración para gestionar usuarios, juegos y analíticas de sesiones, accesible a admins y gestores.
- **Plataforma de juegos**: interfaz para que los jugadores accedan a los juegos publicados, jueguen y registren sus sesiones con análisis emocional en tiempo real.

Ambas visiones conviven en el mismo proyecto Laravel: el CRM utiliza Inertia.js con React para una experiencia SPA sin API separada, mientras que los juegos externos se comunican con la plataforma a través de una API REST autenticada con Sanctum.

---

## Tecnologías utilizadas y su función

### Backend

- **Laravel 13** — Framework principal: enrutamiento, autenticación, control de accesos, lógica de negocio y API REST.
- **PHP 8.3** — Lenguaje del servidor.
- **PostgreSQL** — Base de datos relacional principal que almacena usuarios, juegos, sesiones de juego y eventos emocionales.
- **Eloquent ORM** — Mapeo objeto-relacional para la gestión de entidades y sus relaciones.
- **Laravel Sanctum** — Autenticación stateful para la web (CRM) y basada en tokens para la API REST (juegos externos).
- **Inertia.js v2** — Capa de conexión entre Laravel y React que permite construir el CRM como SPA sin necesidad de una API separada.

### Frontend CRM

- **React 18** — Librería de UI para las páginas del CRM (vistas de admin, gestor y jugador).
- **Tailwind CSS** — Framework de utilidades CSS para el diseño y maquetación de la interfaz.
- **Ziggy** — Genera las rutas de Laravel disponibles en JavaScript para usarlas desde los componentes React.

### Juegos (cliente externo)

- **Three.js** — Motor 3D que potencia los juegos (p. ej. Runner3D).
- **Vue 3 + Vite** — Framework y bundler del juego Runner3D, ejecutado como aplicación independiente.
- **face-api.js** — Librería de detección de emociones que opera íntegramente en el navegador del usuario, sin enviar imágenes al servidor. Detecta 7 expresiones faciales (`neutral`, `happy`, `sad`, `angry`, `surprised`, `disgusted`, `fearful`) cada 3 segundos usando la webcam, y envía únicamente la etiqueta de emoción dominante, su nivel de confianza y el segundo de juego en que ocurrió a `POST /api/emotions`.

### Microservicio (fase futura)

- **Python + DeepFace** — Microservicio de reconocimiento facial para verificación de identidad de usuarios.
- **Docker** — Contenedor de aislamiento para el microservicio de reconocimiento facial.

---

## Arquitectura del proyecto

El proyecto se divide en tres capas bien diferenciadas que se comunican de forma clara:

1. **CRM (web.php + React/Inertia)** — Interfaz de gestión accesible a admins y gestores. Las rutas web responden con componentes React renderizados mediante Inertia. La sesión es gestionada por Laravel de forma tradicional (cookie de sesión).

2. **API REST (api.php + Sanctum)** — Conjunto de endpoints JSON consumidos por los juegos externos. Sin estado de sesión web; requieren token Bearer de Sanctum para autenticarse.

3. **Clientes (juegos Three.js/Vue)** — Aplicaciones independientes que se cargan en un iframe dentro de la plataforma y se comunican exclusivamente con la API REST.

```
[Navegador]
    ├── CRM (Inertia/React) ──→ [Laravel web.php] ──→ [PostgreSQL]
    └── Juego (Three.js/Vue) ──→ [Laravel api.php] ──→ [PostgreSQL]
                                         │
                                   [Python/Docker]
                                  (facial recognition)
```

Esta separación garantiza que el CRM y los juegos puedan evolucionar de forma independiente sin acoplamiento entre sí.

---

## Base de datos

### Entidades principales

- **users** — Usuarios de la plataforma. Contienen los campos: nombre, email, contraseña y `role` (valores: `admin`, `gestor`, `jugador`). El rol determina los permisos y las vistas accesibles.

- **games** — Juegos registrados en la plataforma. Incluyen título, descripción, estado de publicación (`published`), URL o ruta del juego (p. ej. `http://localhost:5173`), y referencia al usuario creador.

- **game_sessions** — Registro de cada partida jugada. Almacena el usuario que jugó, el juego, el instante de inicio, el instante de fin, la duración calculada y la puntuación obtenida.

- **emotion_events** — Eventos emocionales capturados durante una sesión de juego. Almacenan el tipo de emoción detectada, el nivel de confianza (0–1) y el segundo del juego en que ocurrió el evento.

### Relaciones Eloquent

```
User         hasMany    Games           (como creador)
User         hasMany    GameSessions
Game         belongsTo  User            (creador)
Game         hasMany    GameSessions
GameSession  belongsTo  User
GameSession  belongsTo  Game
GameSession  hasMany    EmotionEvents
EmotionEvent belongsTo  GameSession
```

---

## Sistema de autenticación

La plataforma utiliza dos mecanismos de autenticación según el tipo de cliente:

**CRM (sesión web)**
Implementado con **Laravel Breeze** en su variante Inertia/React. Los usuarios se autentican mediante formulario de login y Laravel mantiene la sesión mediante cookie. Las rutas de `web.php` verifican la sesión en cada petición.

**API REST (tokens)**
Implementado con **Laravel Sanctum**. Los juegos externos obtienen un token de acceso al autenticar al jugador y lo envían en cada petición como `Authorization: Bearer {token}`. Sanctum también soporta autenticación por cookie para peticiones del mismo dominio.

**Middleware CheckRole**
El middleware `CheckRole` protege las rutas según el rol del usuario autenticado. Se aplica tanto en rutas web como en rutas de la API, rechazando peticiones de usuarios sin el rol requerido.

**Policies de Game**
Las policies de `Game` proporcionan control de permisos granular: por ejemplo, un gestor solo puede editar o eliminar los juegos que él mismo creó, mientras que un admin puede operar sobre cualquier juego.

---

## Roles y permisos

| Acción | Admin | Gestor | Jugador |
|---|---|---|---|
| Gestionar usuarios | ✓ | ✗ | ✗ |
| CRUD de juegos | ✓ | ✓* | ✗ |
| Publicar / despublicar juegos | ✓ | ✓ | ✗ |
| Ver juegos publicados | ✗ | ✗ | ✓ |
| Jugar y registrar sesiones | ✗ | ✗ | ✓ |

*El Gestor solo puede editar y eliminar sus propios juegos, no los de otros gestores ni los del admin.

---

## API REST

### Autenticación

Todas las rutas de la API requieren autenticación. Se acepta:

- **Header Bearer**: `Authorization: Bearer {token}` — para clientes externos (juegos).
- **Cookie de sesión**: para peticiones realizadas desde el mismo dominio.

### Endpoints

#### Sesiones de juego

```
POST   /api/sessions/start      — Inicia una nueva sesión de juego
POST   /api/sessions/{id}/end   — Finaliza una sesión de juego existente
GET    /api/sessions            — Lista todas las sesiones del usuario autenticado
```

#### Eventos de emoción

```
POST   /api/emotions            — Registra un evento emocional en una sesión activa
```

### Ejemplo: iniciar sesión de juego

```json
POST /api/sessions/start
Authorization: Bearer {token}
Content-Type: application/json

{
  "game_id": 1
}

Response 201:
{
  "session_id": 42,
  "game_id": 1,
  "started_at": "2025-03-24T10:00:00Z",
  "message": "Sesión iniciada"
}
```

### Ejemplo: registrar emoción

```json
POST /api/emotions
Authorization: Bearer {token}
Content-Type: application/json

{
  "session_id": 42,
  "emotion": "happy",
  "confidence": 0.9234,
  "elapsed_seconds": 15
}
```

---

## Gestión de juegos

El flujo completo de gestión de un juego es el siguiente:

1. Un **Gestor** o **Admin** crea un juego desde el panel CRM, indicando título, descripción y la URL donde está alojado el juego (p. ej. `http://localhost:5173` para Runner3D en desarrollo).
2. El creador puede editar los datos del juego y cambiar su estado de publicación (publicado / no publicado) en cualquier momento.
3. El **Jugador** únicamente ve en su panel los juegos que están en estado publicado.
4. Al acceder a un juego, Laravel carga la URL del juego dentro de un **iframe** embebido en la plataforma, manteniendo al usuario dentro del entorno de GamePlatform.
5. El juego (Three.js / Vue) se comunica con la plataforma **exclusivamente a través de la API REST**, enviando eventos de inicio y fin de sesión y eventos emocionales capturados por face-api.js.

---

## Instalación y puesta en marcha

```bash
# 1. Clonar y entrar al directorio
cd LaravelPlatform

# 2. Instalar dependencias PHP
composer install

# 3. Instalar dependencias Node
npm install --legacy-peer-deps

# 4. Copiar variables de entorno
cp .env.example .env

# 5. Configurar .env
#    DB_CONNECTION=pgsql
#    DB_HOST=127.0.0.1
#    DB_PORT=5432
#    DB_DATABASE=nombre_de_la_base_de_datos
#    DB_USERNAME=usuario_postgres
#    DB_PASSWORD=contraseña_postgres

# 6. Generar clave de aplicación
php artisan key:generate

# 7. Ejecutar migraciones y seeders
php artisan migrate --seed

# 8. Compilar assets
npm run build

# 9. Iniciar servidor de desarrollo Laravel
php artisan serve

# 10. Iniciar Vite (assets React en caliente)
npm run dev
```

El CRM estará disponible en `http://127.0.0.1:8000`.

### Iniciar el juego Runner3D (en otra terminal)

```bash
cd ../Runner3D
npm install
npm run dev
```

Runner3D corre en `http://localhost:5174`. Asegúrate de que el juego en la base de datos tenga `location = http://localhost:5174`.

---

## Usuarios de prueba (seeder)

El seeder crea los siguientes usuarios para facilitar las pruebas:

| Email | Contraseña | Rol |
|---|---|---|
| admin@platform.com | password | Admin |
| gestor@platform.com | password | Gestor |
| jugador@platform.com | password | Jugador |

---

## Separación web / API

La distinción entre `routes/web.php` y `routes/api.php` es fundamental para la arquitectura del proyecto:

**`routes/web.php` (CRM)**
- Responde con vistas Inertia (HTML + hidratar React en el cliente).
- Gestiona la sesión web mediante cookie (`session` middleware).
- Protegido por el guard `web` de Laravel.
- Pensado para usuarios humanos que interactúan desde el navegador con el CRM.

**`routes/api.php` (API REST)**
- Responde exclusivamente con JSON.
- Sin estado de sesión web; cada petición se autentica por token o cookie SPA.
- Protegido por el guard `sanctum` de Laravel.
- Pensado para clientes externos como los juegos Three.js, aplicaciones móviles o integraciones de terceros.

Esta separación permite que ambos flujos coexistan sin interferencias, con middlewares, guards y manejo de errores diferenciados.

---

## Estructura del proyecto

```
LaravelPlatform/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/          — Controladores del CRM (gestión de usuarios y juegos)
│   │   │   ├── Player/         — Controladores del jugador (listado y acceso a juegos)
│   │   │   └── Api/            — Controladores de la API REST (sesiones y emociones)
│   │   └── Middleware/
│   │       └── CheckRole.php   — Middleware de control de acceso por rol
│   ├── Models/                 — Entidades Eloquent (User, Game, GameSession, EmotionEvent)
│   └── Policies/               — Políticas de autorización (GamePolicy, etc.)
├── database/
│   ├── migrations/             — Estructura de base de datos versionada con migraciones
│   └── seeders/                — Datos iniciales: usuarios de prueba y juegos de ejemplo
├── resources/js/
│   ├── Pages/
│   │   ├── Admin/              — Páginas React del CRM (admin y gestor)
│   │   └── Player/             — Páginas React del jugador
│   └── Layouts/                — Layouts compartidos entre páginas
└── routes/
    ├── web.php                 — Rutas de la aplicación web (CRM con Inertia)
    └── api.php                 — Endpoints de la API REST (para los juegos)
```

---

## Notas adicionales

- El análisis emocional se realiza **íntegramente en el cliente** mediante face-api.js, sin transmitir imágenes al servidor. Solo se envían los datos de la emoción detectada (etiqueta + confianza + segundo).
- El microservicio de reconocimiento facial con Python/DeepFace está planificado para una fase futura y se desplegará como contenedor Docker independiente.
- El proyecto está preparado para escalar: añadir nuevos juegos solo requiere registrarlos en el CRM con su URL.
