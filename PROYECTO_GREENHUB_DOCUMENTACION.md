# 🌿 GreenHub Labs - Sistema de Automatización Agrícola Inteligente

## 📋 Índice

1. [Visión General del Proyecto](#visión-general-del-proyecto)
2. [Propósito y Objetivos](#propósito-y-objetivos)
3. [Funcionalidades Principales](#funcionalidades-principales)
4. [Arquitectura del Sistema](#arquitectura-del-sistema)
5. [Módulos y Características Técnicas](#módulos-y-características-técnicas)
6. [Tecnologías Utilizadas](#tecnologías-utilizadas)
7. [Estructura del Proyecto](#estructura-del-proyecto)
8. [Instalación y Configuración](#instalación-y-configuración)
9. [Roadmap y Futuras Mejoras](#roadmap-y-futuras-mejoras)

---

## 🎯 Visión General del Proyecto

**GreenHub Labs** es una plataforma web avanzada para la gestión integral de sistemas agrícolas automatizados que combina **Internet de las Cosas (IoT)**, **Inteligencia Artificial (IA)** y **energías renovables** para optimizar la producción agrícola de forma sostenible y eficiente.

### Concepto Central

El proyecto busca democratizar la agricultura inteligente proporcionando una interfaz web moderna y accesible que permita a agricultores, jardineros urbanos y entusiastas de la agricultura gestionar sus cultivos de manera automatizada, con monitoreo en tiempo real y recomendaciones basadas en IA.

---

## 🚀 Propósito y Objetivos

### Objetivo Principal

Crear un ecosistema digital completo que transforme la agricultura tradicional en un sistema inteligente, sostenible y altamente productivo mediante la automatización y el análisis de datos.

### Objetivos Específicos

#### 🌱 **Optimización Agrícola**

- Maximizar el rendimiento de cultivos mediante riego inteligente
- Reducir el desperdicio de agua a través de sensores de humedad del suelo
- Optimizar el uso de recursos energéticos con paneles solares y gestión de baterías
- Proporcionar recomendaciones basadas en IA para mejorar la productividad

#### 🔧 **Automatización Integral**

- Sistema de riego automático basado en condiciones ambientales
- Control automático de puertas de gallineros sincronizado con el amanecer/atardecer
- Gestión climática de invernaderos
- Programación flexible de tareas agrícolas

#### 📊 **Monitoreo y Análisis**

- Seguimiento en tiempo real de múltiples parámetros ambientales
- Análisis histórico de datos para identificar patrones
- Predicciones de rendimiento de cultivos
- Alertas proactivas para prevenir problemas

#### 🌍 **Sostenibilidad**

- Integración con energías renovables (paneles solares)
- Gestión eficiente del agua
- Reducción de la huella de carbono
- Promoción de prácticas agrícolas ecológicas

---

## 🛠️ Funcionalidades Principales

### 🏠 **Panel de Control Central**

- **Dashboard principal** con vista general del sistema
- **Estado en tiempo real** de todos los nodos IoT
- **Indicadores de salud** del sistema (red, energía, sensores)
- **Alertas críticas** y notificaciones importantes
- **Recomendaciones de IA** basadas en el estado actual

### 🌾 **Gestión de Huerto**

#### 📍 **Gestión de Bancales (Plots)**

- Creación y administración de parcelas de cultivo
- Asignación de sensores IoT a cada bancal
- Monitoreo de métricas por parcela:
  - Humedad del suelo (%)
  - Temperatura ambiente (°C)
  - Nivel de batería del nodo
  - Generación de energía solar (W)
- Estado del sistema de riego por zona

#### 🌱 **Gestión de Cultivos**

- Catálogo completo de plantas y cultivos
- Seguimiento del ciclo de vida de cada cultivo
- Planificación de siembra y cosecha
- Estimación de rendimiento
- Recomendaciones específicas por tipo de planta
- Sistema de rotación de cultivos

#### 💧 **Sistema de Riego Inteligente**

- **Control automático** basado en sensores de humedad
- **Gestión de zonas** de riego independientes
- **Programación flexible** con múltiples horarios
- **Control manual** para situaciones especiales
- **Métricas detalladas**:
  - Consumo diario de agua
  - Presión del sistema
  - Flujo de agua por zona
  - Estado de válvulas

#### 📅 **Planificador de Siembra**

- Calendario agrícola personalizado
- Recomendaciones estacionales
- Compatibilidad entre cultivos
- Optimización del espacio disponible

### 🐔 **Gestión de Gallinero**

#### 🐓 **Gestión de Aves**

- Registro y seguimiento de gallinas
- Control de producción de huevos
- Monitoreo de salud animal
- Gestión de alimentación automática

#### 🌡️ **Control Ambiental**

- Monitoreo de temperatura y humedad
- Ventilación automática
- Control de iluminación
- Detección de anomalías ambientales

#### 🚪 **Automatización de Puertas**

- Apertura/cierre automático basado en horarios
- Sincronización con amanecer/atardecer
- Control manual remoto
- Sensores de seguridad

### 📊 **Sistema de Monitoreo**

#### 📡 **Red de Sensores IoT**

- **Nodos distribuidos** con conectividad mesh
- **Sensores múltiples** por nodo:
  - Humedad del suelo
  - Temperatura ambiente
  - pH del suelo
  - Luminosidad
  - Presión atmosférica
- **Comunicación inalámbrica** entre nodos
- **Auto-diagnóstico** y reporte de fallos

#### 🚨 **Sistema de Alertas**

- Alertas críticas en tiempo real
- Notificaciones por múltiples canales
- Configuración personalizable de umbrales
- Escalación automática de problemas

#### 🌤️ **Estación Meteorológica**

- Datos climáticos locales
- Predicciones meteorológicas
- Integración con servicios externos
- Ajuste automático de sistemas basado en clima

### 🤖 **Automatización Avanzada**

#### 💧 **Reglas de Riego**

- **Motor de reglas configurable** con múltiples condiciones:
  - Humedad del suelo
  - Temperatura ambiente
  - Hora del día
  - Día de la semana
  - Condiciones meteorológicas
- **Acciones programables**:
  - Iniciar/detener riego
  - Ajustar duración
  - Enviar notificaciones
  - Modificar programaciones

#### ⏰ **Sistema de Programaciones**

- Horarios complejos con múltiples frecuencias
- Condiciones de ejecución personalizables
- Integración con datos meteorológicos
- Sistema de prioridades

### 🧠 **Inteligencia Artificial y Analíticas**

#### 🔮 **Predicciones Inteligentes**

- Predicción de necesidades de riego
- Estimación de rendimiento de cultivos
- Detección temprana de problemas
- Optimización de recursos

#### 📈 **Análisis de Rendimiento**

- Métricas de productividad
- Análisis de tendencias históricas
- Comparativas entre períodos
- Informes automatizados

#### 🤖 **Asistente IA**

- Chatbot inteligente para consultas
- Recomendaciones personalizadas
- Diagnóstico automático de problemas
- Sugerencias de mejora

### 🔋 **Gestión Energética**

#### ☀️ **Sistema Solar**

- Monitoreo de paneles solares
- Optimización de la generación
- Predicción de producción energética
- Mantenimiento preventivo

#### 🔋 **Gestión de Baterías**

- Estado de carga en tiempo real
- Ciclos de carga/descarga
- Pronóstico de autonomía
- Alertas de mantenimiento

#### ⚡ **Optimización Energética**

- Balanceado automático de cargas
- Programación inteligente de equipos
- Ahorro energético basado en IA
- Reportes de eficiencia

### 🔗 **Integraciones Externas**

#### 🏠 **Hogar Inteligente**

- Home Assistant
- Google Assistant
- Amazon Alexa
- Control por voz

#### 🔌 **Plataformas IoT**

- Arduino Cloud
- Particle
- ThingSpeak
- MQTT

#### 💬 **Comunicaciones**

- Slack, Discord, Telegram
- WhatsApp Business
- Email automático
- SMS críticos

---

## 🏗️ Arquitectura del Sistema

### Frontend (Web Application)

- **Framework**: Next.js 15.3.5 con App Router
- **UI Framework**: React 19 con TypeScript
- **Estilizado**: Tailwind CSS 4.0
- **Componentes UI**: shadcn/ui con Radix UI
- **Internacionalización**: next-intl (Español/Inglés)
- **Estado**: React Query para gestión de datos
- **Patrones**: Atomic Design para componentes

### Arquitectura de Componentes

#### **Patrón Atomic Design**

```
components/
├── atoms/           # Elementos básicos (botones, inputs, indicadores)
├── molecules/       # Combinaciones funcionales (cards, forms)
├── organisms/       # Secciones complejas (listas, headers)
└── ui/             # shadcn/ui base components
```

#### **Domain-Driven Design (DDD)**

```
contexts/
└── shared/
    ├── domain/           # Lógica de negocio
    ├── presentation/     # Componentes y UI
    └── infrastructure/   # Servicios externos
```

### Backend Architecture (Planificada)

- **API REST/GraphQL** para comunicación con IoT
- **Base de datos** para históricos y configuración
- **Message Broker** (MQTT) para IoT communication
- **AI Engine** para procesamiento de recomendaciones
- **Weather API** integration

### IoT Network Architecture

- **Mesh Network** con nodos distribuidos
- **LoRaWAN/WiFi** para comunicación
- **Edge Computing** en nodos principales
- **Solar Power** con gestión de baterías

---

## 📁 Estructura del Proyecto

### Directorios Principales

```
web/
├── app/                    # Next.js App Router
│   ├── [lang]/            # Rutas internacionalizadas
│   │   ├── garden/        # Módulo de huerto
│   │   ├── automation/    # Automatización
│   │   ├── monitoring/    # Monitoreo
│   │   ├── analytics/     # Analíticas
│   │   └── settings/      # Configuraciones
│   └── globals.css        # Estilos globales
├── contexts/              # Lógica de negocio (DDD)
│   └── shared/
│       ├── domain/        # Configuración y tipos
│       └── presentation/  # Componentes reutilizables
├── locales/              # Archivos de traducción
│   ├── en.json           # Inglés
│   └── es.json           # Español
└── public/               # Assets estáticos
```

### Módulos por Funcionalidad

#### 🌱 **Garden Module**

- `plots/` - Gestión de bancales
- `crops/` - Gestión de cultivos
- `irrigation/` - Sistema de riego
- `planting-planner/` - Planificador
- `rotation/` - Rotación de cultivos

#### 🤖 **Automation Module**

- `irrigation-rules/` - Reglas de riego
- `schedules/` - Programaciones
- `valves/` - Control de válvulas
- `manual-control/` - Control manual

#### 📊 **Monitoring Module**

- `sensors/` - Red de sensores
- `alerts/` - Sistema de alertas
- `weather/` - Estación meteorológica
- `cameras/` - Sistema de cámaras
- `history/` - Datos históricos

#### 🧠 **Analytics Module**

- `predictions/` - Predicciones IA
- `yield-estimation/` - Estimación rendimiento
- `performance/` - Análisis rendimiento
- `ai-assistant/` - Asistente IA
- `reports/` - Reportes inteligentes

---

## 🌱 Especificaciones Funcionales Detalladas

### 🎯 Funcionalidades Esenciales (MVP)

#### **Gestión de Huerto**

- ✅ **Registro por bancal**: Sistema completo de seguimiento de cultivos por zona
- ✅ **Monitoreo multi-sensor**: Humedad, temperatura, luz, pH del suelo
- ✅ **Riego inteligente**: Automático por humedad o programado por cultivo
- ✅ **Registro de eventos**: Siembra, cosecha, riego, tratamientos
- ✅ **Sistema de alertas**: Valores anómalos, problemas de riego, fallos de sensores

#### **Gestión de Gallinero**

- ✅ **Control ambiental**: Temperatura, humedad, calidad del aire (NH3, CO2)
- ✅ **Gestión de puesta**: Registro automático/manual de huevos por gallina
- ✅ **Automatización de puerta**: Control por horario o sensor de luz
- ✅ **Detección de presencia**: Sensores para verificar gallinas antes del cierre
- ✅ **Monitoreo consumo**: Agua y pienso automático

### 🧠 Inteligencia Artificial y Predicciones

#### **Análisis Predictivo**

- 🔮 **Predicción de riego**: Algoritmos basados en histórico + datos meteorológicos
- 📈 **Visualización evolutiva**: Gráficas de crecimiento y salud por cultivo
- 🌦️ **Integración climática**: APIs de OpenWeather, AEMET para predicciones
- 📊 **Estimación de rendimiento**: IA para calcular cosecha esperada
- 📅 **Planificador automático**: Sugerencias de siembra por zona/clima/temporada
- 🐛 **Detección temprana**: Plagas y enfermedades mediante visión artificial

#### **Optimización Energética**

- 🌙 **Modo nocturno**: Ahorro energético en nodos durante la noche
- 🔋 **Gestión inteligente**: Optimización de carga solar y uso de batería
- ⚡ **Corte preventivo**: Protección automática por batería baja

### 💡 Características Avanzadas

#### **Sistemas de Control**

- 🧪 **Medición de pH**: Sensores específicos para cultivos exigentes
- 📷 **Cámaras por bancal**: Timelapse, visión nocturna con IR
- 🎛️ **Control de válvulas**: Gestión independiente por zonas de riego
- 🧯 **Lógica anti-riego**: Prevención automática si ha llovido recientemente
- 📌 **Control manual**: "Riega el bancal 3 ahora" desde la app
- 📦 **Gestión de compost**: Seguimiento de residuos orgánicos
- 📱 **Códigos QR**: Información rápida por bancal

#### **Monitoreo Avanzado de Gallinero**

- 📅 **Ciclos de puesta**: Análisis de patrones reproductivos por gallina
- 📉 **Alertas de producción**: Notificaciones por baja en puesta
- 📦 **Conteo automático**: Sistema de pesaje para huevos
- 🎥 **Videovigilancia**: Cámara con visión nocturna y detección de intrusos
- 🔔 **Seguridad perimetral**: Sensores de movimiento para depredadores
- 🦊 **Detección de amenazas**: Alertas por zorros, jabalíes, etc.

### 📲 Plataforma y Usuario

#### **Dashboard Interactivo**

- 🧭 **Mapa 3D**: Visualización interactiva de bancales y gallinero
- 📊 **Panel de control**: Estado en tiempo real con métricas clave
- ⏱️ **Histórico completo**: Datos temporales por bancal y sistema
- 🐣 **Seguimiento individual**: Perfil detallado por gallina
- 👤 **Sistema multiusuario**: Roles de admin, observador, operador

#### **Automatización e IA**

- 🤖 **Asistente LLM**: "¿Qué cultivo plantar ahora?" con respuestas contextuales
- 🧠 **Clasificación automática**: IA para identificar cultivos, plagas, enfermedades
- 💬 **Notificaciones multi-canal**: Telegram, email, push notifications
- 🔁 **Integración domótica**: Home Assistant, Google Assistant, Alexa

### 🎁 Gamificación y Engagement

#### **Sistema de Logros**

- 🏆 **Retos mensuales**: Objetivos de plantación, ahorro de agua, producción
- 📅 **Registro anual**: Comparativas año a año de productividad
- 📷 **Álbum automático**: Timelapse fotográfico del huerto
- 🥇 **Ranking de eficiencia**: Competición entre usuarios o zonas

---

## 🏗️ Arquitectura Técnica Detallada

### 📡 Sistema de Comunicación IoT

#### **Arquitectura de Red**

- **Nodo central**: Cada bancal con Raspberry Pi independiente
- **Comunicación**: Kafka como bus de eventos distribuido
- **Topología**: Mesh network con redundancia
- **Protocolos**: MQTT over WiFi/LoRaWAN

#### **Schema de Topics Kafka**

| Topic                   | Dirección       | Emisor    | Frecuencia     | Descripción                |
| ----------------------- | --------------- | --------- | -------------- | -------------------------- |
| `system.health`         | Backend → Nodos | Backend   | 5 min          | Ping global de salud       |
| `bancal-{id}.heartbeat` | Nodo → Backend  | Raspberry | Respuesta ping | Estado y sensores          |
| `bancal-{id}.comandos`  | Backend → Nodo  | Backend   | Bajo demanda   | Riego, modo noche, etc.    |
| `bancal-{id}.eventos`   | Nodo → Backend  | Raspberry | Eventos        | Alertas, fallos, actividad |
| `bancal-{id}.log`       | Nodo → Backend  | Raspberry | Debug          | Logs técnicos              |

#### **Mensaje de Ejemplo - Heartbeat**

```json
{
  "id": "bancal-01",
  "timestamp": "2025-07-08T18:55:01Z",
  "modo": "normal",
  "sensores": {
    "humedad": 34,
    "temperatura": 24.5,
    "luz": 230,
    "ph": 6.8,
    "bateria": 84
  },
  "actuadores": {
    "riego": "inactivo",
    "valvula_estado": "cerrada"
  },
  "sistema": {
    "uptime": 86400,
    "memoria_libre": 75,
    "red_calidad": 98
  }
}
```

#### **Lógica de Autonomía**

```typescript
class NodoInteligente {
  private ultimaSaludBackend = Date.now();

  onKafkaMessage("system.health", () => {
    this.ultimaSaludBackend = Date.now();
    this.publicarHeartbeat();
  });

  verificarConexion() {
    const tiempoSinBackend = Date.now() - this.ultimaSaludBackend;
    if (tiempoSinBackend > 10 * 60 * 1000) {
      this.entrarEnModoAutonomo();
    }
  }

  modoAutonomo() {
    // Decisiones locales críticas:
    // - Riego por humedad mínima
    // - Protección por temperatura extrema
    // - Conservación energética
  }
}
```

### 🔋 Gestión Energética Avanzada

#### **Sistema Solar Inteligente**

- **Paneles adaptivos**: Seguimiento solar automático
- **Predicción energética**: IA para estimar generación diaria
- **Gestión de carga**: Priorización de sistemas críticos
- **Backup automático**: Conmutación a red eléctrica si es necesario

#### **Algoritmo de Optimización**

```typescript
class GestorEnergetico {
  optimizarConsumo() {
    const energiaDisponible = this.calcularEnergiaSolar();
    const demandaSistemas = this.obtenerDemanda();

    if (energiaDisponible < demandaSistemas) {
      this.activarModoAhorro();
      this.priorizarSistemasCriticos();
    }
  }

  modoAhorro() {
    // - Reducir frecuencia de sensores no críticos
    // - Suspender cámaras durante el día
    // - Optimizar ciclos de riego
    // - Hibernar sistemas secundarios
  }
}
```

---

## 💻 Tecnologías Utilizadas

### Frontend (Actual)

- **Next.js 15.3.5** - React Framework con App Router
- **React 19** - Biblioteca de UI con concurrent features
- **TypeScript 5** - Tipado estático y desarrollo seguro
- **Tailwind CSS 4** - Framework de estilos utility-first

### UI & Components

- **shadcn/ui** - Sistema de componentes moderno
- **Radix UI** - Primitivos accesibles y componibles
- **Lucide React** - Iconografía consistente
- **Class Variance Authority** - Gestión de variantes CSS

### Estado y Datos

- **TanStack React Query** - Gestión de estado servidor
- **React Hook Form** - Formularios performantes
- **Zod** - Validación de schemas TypeScript-first

### Internacionalización

- **next-intl** - Internacionalización completa
- **Soporte bilingüe** - Español e Inglés nativo

### Herramientas de Desarrollo

- **ESLint 9** - Linting con flat config
- **Prettier** - Formateo automático (singleQuote, trailingComma)
- **TypeScript** - Desarrollo tipado

### Backend (Planificado)

- **NestJS** - Framework Node.js escalable
- **PostgreSQL** - Base de datos relacional principal
- **Redis** - Cache y sesiones
- **Kafka** - Message broker para IoT
- **Docker** - Containerización completa

### IoT & Hardware

- **Raspberry Pi 4** - Nodos de procesamiento
- **Sensores digitales** - I2C/SPI para precisión
- **LoRaWAN** - Comunicación de largo alcance
- **Solar + LiPo** - Sistema energético híbrido

### AI & Machine Learning

- **Python + FastAPI** - Microservicios de IA
- **TensorFlow/PyTorch** - Modelos predictivos
- **OpenCV** - Visión artificial
- **Scikit-learn** - Análisis de datos

### Integración y APIs

- **OpenWeather API** - Datos meteorológicos
- **AEMET API** - Meteorología nacional española
- **Telegram Bot API** - Notificaciones
- **Home Assistant** - Integración domótica

---

## ⚙️ Instalación y Configuración

### Requisitos Previos

- Node.js 18+ o Bun
- pnpm (recomendado) o npm
- Git

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd web

# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev

# Compilar para producción
pnpm build
```

### Variables de Entorno

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
MQTT_BROKER_URL=mqtt://localhost:1883
DATABASE_URL=postgresql://user:password@localhost:5432/greenhub
```

### Configuración de Idiomas

El sistema soporta español e inglés por defecto. Los archivos de traducción se encuentran en `/locales/`:

- `/locales/en.json` - Traducciones en inglés
- `/locales/es.json` - Traducciones en español

---

## ⚙️ Pipeline CI/CD y Arquitectura de Desarrollo

### 🧠 Arquitectura por Componentes

#### **1. Backend (NestJS)**

**Repositorio**: `backend-huerto`

**Pipeline (GitHub Actions)**:

- 🔍 Linter y tests (`eslint`, `jest`)
- 🧪 Tests de integración con base de datos
- 📦 Build (`npm run build`)
- 🐳 Dockerización automática
- ☁️ Subida a GitHub Container Registry
- 🚀 Deploy automático a producción

```yaml
# .github/workflows/backend.yml
name: Backend CI/CD

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
      - uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/user/backend-huerto:latest
```

#### **2. Frontend (Next.js)**

**Repositorio**: `frontend-web` (actual)

**Pipeline**:

- ✅ Linting con ESLint flat config
- ✅ Formateo con Prettier
- ✅ Type checking con TypeScript
- ✅ Build optimizado para producción
- ✅ Deploy automático (Vercel/Netlify)

#### **3. Raspberry Nodes**

**Repositorio**: `raspberry-node`

**Pipeline CI**:

- ✅ Lint y test de sensores
- ✅ Cross-compilation para ARM
- 📦 Package en `.tar.gz`
- 🐙 Release automático en GitHub

**CD en Raspberry**:

```bash
# Script de auto-actualización
#!/bin/bash
LATEST=$(curl -s https://api.github.com/repos/user/raspberry-node/releases/latest | jq -r .tag_name)
if [ "$LATEST" != "$CURRENT_VERSION" ]; then
  curl -L "https://github.com/user/raspberry-node/releases/download/$LATEST/node.tar.gz" -o update.tar.gz
  tar -xzf update.tar.gz
  systemctl restart greenhub-node
fi
```

### 🔄 Flujo de Actualización Automática

#### **Backend → Nodos**

El backend puede enviar comandos de actualización vía Kafka:

```json
{
  "tipo": "actualizar_firmware",
  "version": "v1.3.0",
  "url": "https://github.com/user/raspberry-node/releases/download/v1.3.0/node.tar.gz",
  "checksum": "sha256:abc123..."
}
```

#### **Proceso de Actualización Segura**

```typescript
class UpdateManager {
  async procesarActualizacion(comando: UpdateCommand) {
    // 1. Verificar checksum
    const isValid = await this.verificarChecksum(comando.url, comando.checksum);
    if (!isValid) return;

    // 2. Descargar en background
    await this.descargarFirmware(comando.url);

    // 3. Backup del sistema actual
    await this.crearBackup();

    // 4. Aplicar actualización
    await this.aplicarUpdate();

    // 5. Verificar funcionalidad
    const isWorking = await this.testSistema();
    if (!isWorking) {
      await this.restaurarBackup();
    }
  }
}
```

### 🧰 Herramientas y Servicios

#### **Monitorización y Observabilidad**

| Componente   | Herramienta          | Propósito                       |
| ------------ | -------------------- | ------------------------------- |
| **Logs**     | ELK Stack            | Agregación de logs distribuidos |
| **Métricas** | Prometheus + Grafana | Monitoreo de sistema y hardware |
| **Alertas**  | AlertManager         | Notificaciones automáticas      |
| **APM**      | Jaeger               | Tracing distribuido             |
| **Uptime**   | UptimeRobot          | Monitoreo de disponibilidad     |

#### **Infraestructura como Código**

**Repositorio**: `infra-huerto`

```yaml
# docker-compose.yml
version: '3.8'
services:
  kafka:
    image: confluentinc/cp-kafka:latest
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
    volumes:
      - kafka-data:/var/lib/kafka/data

  backend:
    image: ghcr.io/user/backend-huerto:latest
    depends_on:
      - kafka
      - postgres
    environment:
      DATABASE_URL: postgres://user:pass@postgres:5432/greenhub
      KAFKA_BROKERS: kafka:9092
```

#### **Seguridad y Autenticación**

- 🔐 **mTLS** entre nodos y backend
- 🗝️ **JWT** para autenticación de usuarios
- 🛡️ **RBAC** (Role-Based Access Control)
- 🔒 **Vault** para gestión de secretos
- 🚫 **Rate limiting** en APIs

### 📊 Métricas y KPIs

#### **Desarrollo**

- **Lead Time**: < 2 horas desde commit a producción
- **MTTR**: < 15 minutos para rollback
- **Deployment Frequency**: Multiple veces al día
- **Change Failure Rate**: < 5%

#### **Sistema**

- **Uptime**: > 99.9% para componentes críticos
- **Latencia API**: < 200ms P95
- **Throughput IoT**: > 1000 mensajes/segundo
- **Autonomía Energética**: > 7 días sin sol

---

## 🚀 Roadmap y Futuras Mejoras

### Fase 1: MVP Core (Actual)

- ✅ Interfaz web responsiva
- ✅ Sistema de navegación completo
- ✅ Componentes base (Atomic Design)
- ✅ Internacionalización
- ✅ Estructura modular

### Fase 2: Backend Integration

- 🔄 API REST para gestión de datos
- 🔄 Base de datos con modelos IoT
- 🔄 Sistema de autenticación
- 🔄 MQTT broker para IoT

### Fase 3: IoT Implementation

- 📋 Hardware de nodos IoT
- 📋 Sensores y actuadores
- 📋 Protocolo de comunicación
- 📋 Gestión de energía solar

### Fase 4: AI & Analytics

- 📋 Motor de recomendaciones IA
- 📋 Modelos predictivos
- 📋 Análisis de patrones
- 📋 Optimización automática

### Fase 5: Advanced Features

- 📋 Aplicación móvil
- 📋 Integración con drones
- 📋 Computer Vision para detección de plagas
- 📋 Marketplace de productos agrícolas

### Fase 6: Escalabilidad

- 📋 Multi-tenant architecture
- 📋 Cloud deployment
- 📋 Enterprise features
- 📋 API pública para terceros

---

## 📈 Beneficios Esperados

### Para Agricultores

- **Reducción del 30-50%** en consumo de agua
- **Incremento del 20-40%** en productividad
- **Automatización del 80%** de tareas rutinarias
- **Monitoreo 24/7** sin intervención manual

### Para el Medio Ambiente

- Uso eficiente de recursos naturales
- Reducción de desperdicios
- Energía 100% renovable
- Prácticas agrícolas sostenibles

### Para la Industria

- Democratización de la agricultura inteligente
- Reducción de barreras de entrada
- Escalabilidad desde pequeños huertos hasta granjas comerciales
- Estándares abiertos para IoT agrícola

---

## 🤝 Contribución al Proyecto

GreenHub Labs representa una visión innovadora de la agricultura del futuro, combinando tecnología de vanguardia con sostenibilidad ambiental. El proyecto está diseñado para ser escalable, modular y accesible, permitiendo que tanto aficionados como profesionales puedan beneficiarse de la automatización agrícola inteligente.

La arquitectura sólida basada en Next.js, TypeScript y patrones de diseño modernos garantiza una base técnica robusta para el crecimiento continuo del sistema, mientras que la integración planificada con IoT e IA posiciona el proyecto a la vanguardia de la revolución agrícola digital.
