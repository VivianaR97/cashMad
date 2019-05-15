# CashMad
Es el proyecto final del curso de programación FullStack-JavaScript cursado en comunidadIT Argentina. Utiliza las tecnologías de nodeJs conjunto con las librerías de express para el servidor y mongoDB como base de datos.

La intención es generar una plataforma virtual para la gestión autónoma del dinero y visualizando en manera de gráficas los ingresos y egresos del usuario final.

# Apartados
1. Metas
Este apartado o módulo de la web busca brindarle al usuario final una motivación para utilizar la aplicación y poder conseguir resultados rápidamente.

2. Ingresos
El apartado de ingresos genera una tabla por medio de peticiones de consulta AJAX y le muestra al usuario sus últimos 5 ingresos, adicional de que tiene la gráfica del ingreso promedio en el año.

3. Egresos
El apartado de egresos genera una tabla por medio de peticiones de consulta AJAX y le muestra al usuario sus últimos 5 egresos mostrado por sus diferentes categorías. La gráfica en forma de barras muestra el total en ($) gastado por el usuario en las diferentes categorías; seguido tiene una visualización en % de sus gastos según la categoría.

# Correr CashMad
- Descarga el proyecto.

- Crea una base de datos mongoDB de nombre "cashmad" y agrega las colecciones:
* usuarios
* metas
* ingresos
* egresos

- En la terminal coloca "npm update".
- Terminado el proceso, corre el servidor en el puerto 3000, colocando "npm start".

Así tendrás cashMad corriendo y podrás comenzar a utilizar todas sus funcionalidades. Estoy en proceso de aprendizaje, cualquier comentario o feedback que me quieras hacer, es bien recibido!

# A futuro:
- Ejecución de código más prolija y con estándares de seguridad más altos.
- Posibilidad de subir una fotografía en el campo "meta".
- Validadores de fechas para colocar ingresos/egresos de fechas actuales y no futuras ni muy pasadas.
- Uso de objetos de tipo json para la vuelta de datos servidor-cliente para así evitar bugs futuros.