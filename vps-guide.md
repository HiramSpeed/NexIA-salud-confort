
# Manual de Configuración Servidor VPS - Salud & Confort Celaya

## 1. Configuración de CyberPanel
1. Acceder a CyberPanel vía `https://your-ip:8090`.
2. Crear un sitio web (subdominio) para `renta.saludyconfortcelaya.com`.
3. Seleccionar la versión de PHP 8.1+ y habilitar el soporte de Node.js en el gestor de aplicaciones.

## 2. Entorno Node.js y OpenLiteSpeed
1. Instalar dependencias mediante SSH: `npm install`.
2. Configurar el Contexto de OpenLiteSpeed para actuar como Reverse Proxy hacia el puerto de Node (e.g., 3000).
3. Habilitar la compresión Gzip y Brotli.
4. **Optimización de Imágenes**: OpenLiteSpeed gestiona automáticamente la conversión a WebP mediante el módulo LSCache. Asegúrese de que el plugin de caché esté activo.

## 3. Seguridad y Firewall
1. Ejecutar: `firewall-cmd --permanent --add-port=80/tcp`, `firewall-cmd --permanent --add-port=443/tcp`.
2. Cerrar puertos innecesarios (e.g., 25, 110, 143 si no usa correo local).
3. Configurar Fail2Ban para proteger el acceso SSH.
4. **Almacenamiento de Documentos**: Crear un directorio `/home/private_docs/` con permisos `700` para el usuario de la app, fuera del `public_html`.

## 4. Backups Automatizados
1. En CyberPanel > Backups > Create Backup.
2. Programar una tarea Cron semanal: `0 3 * * 0 /usr/local/CyberCP/bin/python /usr/local/CyberCP/plancron/backup.py`.
