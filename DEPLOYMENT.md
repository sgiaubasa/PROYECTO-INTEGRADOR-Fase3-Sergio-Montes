# Guía de Deployment en Vercel para Monorepo Full-Stack

---

- **Proyecto**: Proyecto Integrador EIT
- **Arquitectura**: Monorepo Full-Stack
- **Autor**: Lic. Sergio Regalado Alessi

---

## Tabla de Contenidos

- [Resumen](#resumen)
- [Introducción](#introducción)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Archivos de Configuración](#archivos-de-configuración)
- [Configuración de Vercel](#configuración-de-vercel)
- [Variables de Entorno](#variables-de-entorno)
- [Proceso de Deployment](#proceso-de-deployment)
- [Referencias](#referencias)

---

## Resumen

Esta guía documenta el deployment de un proyecto monorepo full-stack en Vercel, integrando un backend RESTful (Express.js + MongoDB) con un frontend SPA (React + Vite).

La configuración permite desplegar ambas aplicaciones como un único proyecto, aprovechando funciones serverless para el backend y CDN global para el frontend.

**Beneficios Clave:**
- Deployment unificado de frontend y backend
- Sin problemas de CORS (dominio compartido)
- Escalado automático basado en demanda
- Integración continua con GitHub
- Gestión centralizada de variables de entorno

---

## Introducción

Este documento guía el proceso de configuración, deployment y mantenimiento de un proyecto monorepo en Vercel, basándose en las mejores prácticas de la [documentación oficial de Vercel para Monorepos](https://vercel.com/docs/monorepos).

## Arquitectura del Proyecto

### Componentes del Sistema

#### 1. Backend API (Serverless Function)

**Tecnología Base**: Express.js + Node.js
**Modelo de Deployment**: Función Serverless de Vercel (`@vercel/node`)

**Responsabilidades:**
- Implementación de lógica de negocio
- Comunicación con MongoDB Atlas
- Integración con servicios SMTP para notificaciones
- Validación de datos con Joi
- Gestión de uploads de archivos con Multer

**Endpoints Disponibles:**
- `GET/POST /api/products` - Gestión de productos
- `GET/POST /api/institutions` - Gestión de instituciones
- `POST /api/inquiry` - Formulario de contacto

#### 2. Frontend SPA (Static Site)

**Tecnología Base**: React + Vite
**Modelo de Deployment**: Sitio Estático en CDN (`@vercel/static-build`)


**Responsabilidades:**
- Enrutamiento del lado del cliente con React Router
- Consumo de API RESTful del backend
- Gestión de estado de la aplicación
- Validación de formularios con Formik + Yup

**Páginas Principales:**
- `/` - Página principal
- `/products` - Catálogo de productos
- `/about` - Información institucional
- `/contact` - Formulario de contacto

### Dominio Compartido

Backend y frontend comparten el mismo dominio (`proyecto.vercel.app`):
- Sin problemas de CORS
- Simplifica autenticación (misma cookie domain)
- URLs limpias: `/api/products` vs `https://api.proyecto.com/products`
- SSL unificado

---

## Requisitos Previos

### 1. GitHub

- ✅ Repositorio creado con branch `main` actualizado
- ✅ Permisos de lectura/escritura
- ✅ Integración con Vercel autorizada

### 2. Vercel

- ✅ Cuenta activa (https://vercel.com)
- ✅ Vinculada con GitHub
- ✅ Permisos de deployment

### 3. MongoDB Atlas

- ✅ Cluster creado
- ✅ **Network Access**: Agregar `0.0.0.0/0` para permitir IPs dinámicas de Vercel
  - Ubicación: MongoDB Atlas → Network Access → Add IP Address
- ✅ Usuario con permisos de lectura/escritura
- ✅ Base de datos "eit-f3-project"
- ✅ Connection String obtenido:
  ```
  mongodb+srv://<username>:<password>@<cluster>.mongodb.net/eit-f3-project
  ```

### 4. Servicio SMTP

Para envío de emails (formulario de contacto):

- ✅ Host SMTP (ej: `smtp.gmail.com`)
- ✅ Puerto (`587` para TLS o `465` para SSL)
- ✅ Usuario SMTP
- ✅ Contraseña SMTP
- ✅ Email receptor de notificaciones

---

## Estructura del Proyecto

### Árbol de Directorios

```
PROYECTO-INTEGRADOR-EIT/
│
├── backend/                    # Aplicación Backend (Express)
│   ├── src/
│   │   ├── app.js             # Entry point (exporta app Express)
│   │   ├── config/            # Configuraciones (DB, JSON, Static)
│   │   ├── controllers/       # Controladores de rutas
│   │   ├── models/            # Modelos de Mongoose
│   │   ├── routes/            # Definición de rutas
│   │   ├── services/          # Lógica de negocio
│   │   ├── utils/             # Utilidades (mailer, uploader)
│   │   └── validators/        # Validaciones con Joi
│   ├── public/                # Archivos públicos (imágenes)
│   ├── package.json
│   └── eslint.config.js
│
├── frontend/                   # Aplicación Frontend (React + Vite)
│   ├── src/
│   │   ├── index.jsx          # Entry point de React
│   │   ├── api/               # Servicios de API
│   │   ├── components/        # Componentes reutilizables
│   │   ├── contexts/          # React Contexts
│   │   ├── hooks/             # Custom Hooks
│   │   ├── pages/             # Páginas/Vistas
│   │   ├── scss/              # Estilos globales
│   │   └── svg/               # Componentes SVG
│   ├── public/                # Archivos estáticos (favicon, css, etc)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
├── vercel.json                # Configuración de Vercel
├── .vercelignore              # Archivos a ignorar en deployment
├── package.json               # Scripts del monorepo (raíz)
├── .gitignore                 # Archivos ignorados por Git
└── DEPLOYMENT.md              # Este documento
```

---

## Archivos de Configuración

### 1. `vercel.json` (Raíz del Proyecto)

Define cómo Vercel construye y enruta el proyecto:

| Sección   | Descripción                                                              |
| --------- | ------------------------------------------------------------------------ |
| `version` | Versión de la API de Vercel (siempre `2`)                                |
| `builds`  | Define construcción del monorepo (backend serverless, frontend estático) |
| `routes`  | Enrutamiento: `/api/*` → backend, resto → frontend                       |
| `distDir` | Directorio de salida del build de Vite (relativo a `frontend/`)          |

### 2. `package.json` (Raíz del Proyecto)

Scripts del monorepo:

| Script                | Descripción                                           |
| --------------------- | ----------------------------------------------------- |
| `npm run install:all` | Instala dependencias del monorepo, backend y frontend |
| `npm run dev`         | Ejecuta backend y frontend en modo desarrollo         |
| `npm run build`       | Construye backend y frontend                          |
| `npm run lint`        | Ejecuta linters en backend y frontend                 |


### 3. `.vercelignore`

Excluye archivos innecesarios del deployment:

---

## Configuración de Vercel

### Paso 1: Acceder al Dashboard

1. Acceda a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Inicie sesión con GitHub
3. Seleccione el team o cuenta personal

### Paso 2: Importar Repositorio

1. Click en **"Add New..."** → **"Project"**
2. Busque su repositorio en "Import Git Repository"
3. Click en **"Import"**

### Paso 3: Configuración del Proyecto

**⚠️ CRÍTICO**: Esta configuración es clave para el funcionamiento del monorepo.

| Setting              | Valor                     | Importancia |
| -------------------- | ------------------------- | ----------- |
| **Project Name**     | `proyecto-integrador-eit` | Informativo |
| **Framework Preset** | **Other**                 | CRÍTICO     |
| **Root Directory**   | **(VACÍO)**               | CRÍTICO     |
| **Build Command**    | (Vacío)                   | Automático  |
| **Output Directory** | (Vacío)                   | Automático  |
| **Install Command**  | (Vacío)                   | Automático  |

**¿Por qué Root Directory vacío?**

Según la [documentación de Vercel](https://vercel.com/docs/monorepos), si se especifica un Root Directory, Vercel **ignora** `vercel.json`. Con Root Directory vacío:
1. Lee `vercel.json` en la raíz
2. Sigue instrucciones de `builds` y `routes`
3. Construye backend y frontend correctamente


### Paso 4: Configurar Variables de Entorno

**⚠️ IMPORTANTE**: Configure antes del deployment inicial.

**Importar desde `.env`:**

1. Click en **"Environment Variables"**
2. Click en **"Import .env"** y seleccione su archivo local
3. **Elimine** antes de importar:
   - `PORT` (Vercel lo asigna dinámicamente)
   - `HOST` (Vercel lo configura automáticamente)
4. Click en **"Add"**

---

## Variables de Entorno

Configure en Vercel (Dashboard → Project Settings → Environment Variables):

| Variable         | Tipo   | Descripción                                  | Ejemplo                                            | Ambient |
| ---------------- | ------ | -------------------------------------------- | -------------------------------------------------- | ------- |
| `NODE_ENV`       | String | Nombre de entorno                            | `production`                                       | All     |
| `FRONTEND_HOST`  | String | Host                                         | `https://proyecto-integrador-eit-three.vercel.app` | All     |
| `MONGODB_URI`    | String | String de conexión a MongoDB Atlas           | `mongodb+srv://user:pass@<cluster>/eit-f3-project` | All     |
| `SMTP_HOST`      | String | Host del servidor SMTP                       | `smtp-relay.brevo.com`                             | All     |
| `SMTP_PORT`      | Number | Puerto del servidor SMTP (587 TLS o 465 SSL) | `587`                                              | All     |
| `SMTP_USER`      | Email  | Email completo de la cuenta SMTP             | `user@smtp-brevo.com`                              | All     |
| `SMTP_PASS`      | String | Contraseña de aplicación (no la personal)    | `password`                                         | All     |
| `SMTP_RECIPIENT` | Email  | Email para recibir mensajes de contacto      | `info@example.com`                                 | All     |

**Nota**: No configurar `PORT` ni `HOST` en Vercel. Estas variables son manejadas automáticamente por la plataforma.

---

## Proceso de Deployment

El deployment en Vercel es automático e integrado con GitHub. Cada commit desencadena un deployment automático.

### Dashboard de Vercel

**Acceso**: [Dashboard](https://vercel.com/dashboard) → Proyecto → "Deployments"

**Estados:**

| Estado       | Descripción                     | Duración |
| ------------ | ------------------------------- | -------- |
| **Queued**   | En cola                         | 0-30 seg |
| **Building** | Construyendo backend y frontend | 1-3 min  |
| **Ready**    | Completado y activo             | -        |
| **Error**    | Falló (revisar logs)            | -        |

**Tiempo total**: 1-5 minutos (primer deployment más lento, posteriores usan caché)

### Verificación Post-Deployment

Probar las siguientes URLs:

**Frontend (SPA):**
```
https://proyecto.vercel.app/
https://proyecto.vercel.app/products
https://proyecto.vercel.app/about
https://proyecto.vercel.app/contact
```

**Backend (API):**
```
https://proyecto.vercel.app/api/products
https://proyecto.vercel.app/api/institutions/first
https://proyecto.vercel.app/api/inquiry/send-mail
```

**Archivos Estáticos del Backend:**
```
https://proyecto.vercel.app/api/public/images/institutions/logo.png
https://proyecto.vercel.app/api/public/images/products/default.jpg
```

**Archivos Estáticos del Frontend:**
```
https://proyecto.vercel.app/favicon.ico
```

**⚠️ Verificaciones Críticas:**
- ✅ Las rutas del frontend (SPA) no devuelven 404
- ✅ Las imágenes del backend cargan desde `/api/public/images/`
- ✅ Los archivos estáticos del frontend (CSS, JS, favicon) cargan correctamente
- ✅ La API responde correctamente en `/api/*`
- ✅ Solo se sirven archivos con extensiones permitidas: `js`, `css`, `ico`, `png`, `jpg`, `jpeg`, `ttf`, `svg`

---

## Referencias
- **Monorepos**: https://vercel.com/docs/monorepos
- **Build Configuration**: https://vercel.com/docs/build-output-api/v3
- **Serverless Functions**: https://vercel.com/docs/functions/serverless-functions
- **Environment Variables**: https://vercel.com/docs/projects/environment-variables