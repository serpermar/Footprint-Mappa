# Footprint Mappa

Descripción del Proyecto
Este repositorio contiene una web app y prototipo de ingeniería diseñado para transformar archivos log descentralizados de cumplimiento ambiental (CSVs) en informes PDF de auditoría de carbono de nivel corporativo, permitiendo la generación de documentos de huella de carbono (OCF y/o PCF) en formato PDF, y ha sido maquetado bajo las directrices de marca de Mappa e integrado en un esquema de co-branding con su socio industrial Relats.

## 1. Arquitectura y Alcance de la Solución
La solución se diseñó integrando los tres niveles de ambición del briefing para ofrecer una plataforma completa de generación de informes de huella de carbono. Incluye la ingesta y validación automatizada de datos ambientales mediante tipado estricto en TypeScript (Camino A), una interfaz interactiva alineada con la identidad visual de Mappa que permite personalizar el contenido del informe en tiempo real (Camino B), y una capa de inteligencia basada en IA capaz de analizar los datos cargados y generar recomendaciones de descarbonización adaptadas al contexto industrial de la organización (Camino C).

## 1.5. Integración de backend (API Xano) y modelo de datos

La aplicación utiliza una arquitectura desacoplada en la que la persistencia de datos se gestiona a través de una API REST en Xano, encargada de almacenar y servir la información relacionada con las auditorías de huella de carbono.

### Esquema de Tablas en Base de Datos
* **`reports_ocf` (Huella de carbono organizacional - ISO 14064-1):** Almacena métricas agregadas por planta industrial, clasificando las emisiones en Alcance 1 (directas), Alcance 2 (energía indirecta) y Alcance 3 (cadena de suministro).
* **`reports_pcf` (Huella de carbono de producto - ISO 14067):** Registra la huella de carbono asociada a unidades de producto específicas, cubriendo todo el ciclo de vida desde la materia prima hasta la salida de fábrica.
* 
### Endpoints principales de la API

* **`POST /api:uK5pIZol/save_report`**
    * **Descripción:** Guarda un informe de huella de organización (OCF).
    * **Parámetros del Payload (5 Inputs - JSON):**
        * `type` (text): Tipo de informe o categoría.
        * `entityOrProduct` (text): Nombre de la planta industrial o entidad evaluada.
        * `configuration` (json): Estructura relacional de las tablas y UI.
        * `data` (json): Datos tabulares brutos e históricos extraídos del CSV.
        * `updatedBy` (text): Identificador o nombre del auditor (mapeado a la columna `auditor_name`).
    * **Respuesta Exitosa:** `200 OK` devolviendo la entidad `reports_ocf1` con su ID auto-incrementado y el timestamp `created_at`.
      
* **`POST /api:uK5pIZol/save_report_pcf`**
    * **Descripción:** Guarda un informe de huella de producto (PCF).
    * **Parámetros del Payload (5 Inputs - JSON):**
        * Recibe los mismos 5 campos estructurados (`type`, `entityOrProduct`, `configuration`, `data`, `updatedBy`).
    * **Respuesta Exitosa:** `200 OK` devolviendo la entidad `reports_pcf1` procesada localmente en base al timestamp actual (`now`).
      

## 2. Distribución del Tiempo Invertido (16h)
- **Análisis funcional y definición de requisitos:**  1,5 h (10%)
- **Modelado de datos, procesamiento y validación de archivos CSV:**  4 h (25%)
- **Desarrollo de la interfaz de usuario y generación de informes PDF:**  6,5 h (40%)
- **Integración de servicios backend y funcionalidades basadas en IA:** 2,5 h (15%)
- **Despliegue, pruebas, optimización y documentación:** 1,5 h (10%)

## 3. Transparencia en el Uso de Inteligencia Artificial
El desarrollo se llevó a cabo bajo un modelo de ingeniería asistida por IA supervisada, combinando **Google Gemini (90%)** como copiloto táctico y **DeepSeek (10%)** para auditorías específicas.

### Qué hizo el desarrollador (Tú) vs. Qué se Delegó a la IA:
- **Responsabilidad del desarrollador (diseño y control):**
  * Definición de la arquitectura general del sistema, incluyendo el enfoque de procesamiento isomórfico para optimizar costes.
  * Diseño del flujo asíncrono para capturar visualizaciones desde el DOM y convertirlas en imágenes integradas en PDFs mediante @react-pdf/renderer.
  * Modelado de datos, configuración del backend en Xano.
  * Despliegue continuo en Vercel con gestión de variables de entorno
    
- **Uso de IA (aceleración y soporte técnico):**
  * **Google Gemini:** se utilizó para generar estructuras iniciales de código, tipado en TypeScript para modelos de carbono, ajustes de estilos compatibles con React-PDF y formateo regional.
  * **DeepSeek:** se empleó de forma puntual para auditorías de código, enfocadas en detectar posibles problemas de rendimiento, memoria o concurrencia en funciones asíncronas del backend.

## 4. Configurar variables de entorno
Este proyecto utiliza variables de entorno para gestionar configuraciones sensibles y dependientes del entorno de ejecución (desarrollo, producción, despliegue). Esto evita hardcodear URLs o credenciales dentro del código y facilita el despliegue en plataformas como Vercel.

Para que la aplicación funcione correctamente, es necesario crear un archivo .env.local en la raíz del proyecto
.env.local

y añadir la siguiente variable:
NEXT_PUBLIC_XANO_API_URL=https://x8ki-letl-twmt.n7.xano.io/api:uK5pIZol

Esta variable define la URL base de la API del backend. Al estar prefijada con NEXT_PUBLIC_, puede ser accedida desde el frontend de la aplicación.

## 5. Guía de Instalación Rápida Local
1. Clonar el repositorio de código:
   git clone https://github.com/tu-usuario/mappa-report-builder.git
   cd mappa-report-builder

2. Instalar el árbol de dependencias del proyecto:
   npm install

3. Levantar el entorno de desarrollo local:
   npm run dev

4. Validación en navegador: Acceder a http://localhost:3000 para interactuar con el panel de carga.

---
