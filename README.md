# REFA-GALLEGOS 

Bienvenido al repositorio oficial del sistema web para **Refaccionaria Gallegos**. Esta aplicación está diseñada para optimizar, automatizar y gestionar los procesos internos de la refaccionaria a través de una interfaz accesible y un backend eficiente.

## Tecnologías Utilizadas

Este proyecto está construido bajo un entorno de JavaScript, utilizando las siguientes herramientas:

* **Backend:** Node.js 
* **Gestor de Paquetes:** npm
* **Frontend:** HTML5, CSS y JavaScript (Archivos estáticos)

## Estructura del Proyecto

El repositorio tiene la siguiente estructura principal:

* **`/public`**: Contiene todos los archivos estáticos de la interfaz de usuario. Aquí se encuentra el `index.html` principal, junto con los estilos y scripts del lado del cliente.
* **`server.js`**: Es el punto de entrada de la aplicación. Aquí se configura el servidor web, se definen las rutas principales y se maneja la lógica central del backend.
* **`package.json`**: Archivo de configuración que gestiona las dependencias instaladas en el proyecto y los scripts de ejecución de Node.

## Instalación y Ejecución Local

Para levantar este proyecto en tu entorno local, sigue estos pasos:

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/REFA-GALLEGOS.git](https://github.com/tu-usuario/REFA-GALLEGOS.git)
    ```

2.  **Navega al directorio del proyecto:**
    ```bash
    cd REFA-GALLEGOS
    ```

3.  **Instala las dependencias:**
    ```bash
    npm install
    ```

4.  **Inicia el servidor:**
    ```bash
    node server.js
    ```
    *(Nota: Si configuraste un script de inicio, también puedes usar `npm start` o `npm run dev`)*

5.  **Abre la aplicación:**
    Ve a tu navegador web e ingresa a `http://localhost:3000` (o el puerto que hayas definido en el archivo `server.js`).

## Equipo de Desarrollo

Este sistema de software fue planificado y desarrollado en equipo por:

* César (Frapu)
* Jorge Cabrera
* Daniel Huerta
* Diego Gallegos

---

**Notas Adicionales:** *Asegúrate de configurar cualquier variable de entorno local (como conexiones a bases de datos de inventario) que el `server.js` pueda requerir antes de ejecutar la aplicación.*
