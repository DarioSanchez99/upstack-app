<div align="center">

# Upstack

**Plataforma SaaS de monitorización de endpoints HTTP — dashboards en tiempo real, alertas y billing**

![React](https://img.shields.io/badge/React%2018-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

Frontend de Upstack, una plataforma SaaS para monitorizar endpoints HTTP. Muestra el estado en tiempo real de cada monitor, el historial de comprobaciones, estadísticas de uptime y permite gestionar la suscripción con Stripe.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Estilos | Tailwind CSS + shadcn/ui |
| Routing | React Router v6 |
| Estado servidor | TanStack Query v5 |
| Estado cliente | Zustand |
| HTTP | Axios (interceptor JWT) |
| Formularios | React Hook Form + Zod |
| Gráficas | Recharts |
| Notificaciones | Sonner |
| Iconos | Lucide React |
| Deploy | Vercel |

---

## Requisitos previos

- Node.js 20+
- npm 10+
- Instancia del [Upstack API](https://github.com/DarioSanchez99/upstack-api) en ejecución

---

## Configuración local

```bash
# 1. Clonar el repositorio
git clone https://github.com/DarioSanchez99/upstack-app.git
cd upstack-app

# 2. Instalar dependencias
npm install

# 3. Variables de entorno
cp .env.example .env
# Editar .env y configurar VITE_API_URL

# 4. Servidor de desarrollo
npm run dev
```

Aplicación disponible en: `http://localhost:5173`

---

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base del Upstack API | `http://localhost:3000` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Clave pública de Stripe | `pk_live_...` |

---

## Páginas y rutas

| Ruta | Página | Auth |
|---|---|---|
| `/` | Redirige a `/dashboard` o `/login` | — |
| `/login` | Inicio de sesión | No |
| `/register` | Registro | No |
| `/dashboard` | Panel principal | Sí |
| `/monitors` | Lista de monitores | Sí |
| `/monitors/new` | Crear monitor | Sí |
| `/monitors/:id` | Detalle del monitor | Sí |
| `/monitors/:id/edit` | Editar monitor | Sí |
| `/settings` | Configuración del perfil | Sí |
| `/settings/billing` | Planes y facturación | Sí |
| `/status/:slug` | Página de estado pública | No |

---

## Build de producción

```bash
npm run build
npm run preview
```

---

## Deploy en Vercel

1. Conectar el repositorio en [vercel.com](https://vercel.com)
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Añadir las variables de entorno en la configuración del proyecto

---

## Licencia

MIT
