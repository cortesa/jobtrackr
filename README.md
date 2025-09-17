# Jobtrackr

Seguimiento de procesos de selección con Next.js, TypeScript y SQLite usando Drizzle ORM.

## Requisitos previos

- Node.js 18 o superior
- npm (se recomienda la versión incluida con Node)

## Inicio rápido

```bash
npm install
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## Scripts disponibles

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: genera la build de producción.
- `npm run start`: ejecuta la build generada.
- `npm run lint`: ejecuta ESLint con la configuración del proyecto.
- `npm run test`: ejecuta la suite de tests con Vitest.
- `npm run db:push`: aplica el esquema actual a la base de datos SQLite mediante drizzle-kit.

## Base de datos

- El esquema se define en `db/schema.ts`.
- Las migraciones generadas por Drizzle se guardan en `drizzle/`.
- La base de datos local se ubica en `sqlite/jobtrackr.db` (se crea automáticamente).

Para aplicar el esquema a la base de datos:

```bash
npm run db:push
```

## Testing

El proyecto utiliza [Vitest](https://vitest.dev/) junto con Testing Library para tests de componentes. Un ejemplo de test se encuentra en `tests/project-card.test.tsx`.

## Acciones del servidor

Las mutaciones del dominio se implementan como Server Actions en `app/actions/`, con respuestas tipadas siguiendo el patrón `{ ok: boolean, data?: any }` y revalidación automática de la caché de proyectos.
