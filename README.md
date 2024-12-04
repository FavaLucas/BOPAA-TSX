BOPAA-TSA

Front + Back que consumen datos de una Api externa (Gempresa) para crear un Indice Bursatil (TSX), mostrarlo en pantalla con distintos graficos y luego almacenarlo en la Api.


PARA CORRER EL PROYECTO DESDE DOCKER

1- Frenar MySQL desde los servicios. Administrador de Tareas/Servicios/Finalizar Tareas
2- Abrir Docker Descktop
3- En VSCode poner en el AppModule el True el Synchronize
4- Correr docker-compose up
5- Para frenarlo Ctrl + C

6- En caso de hacer cambios Correr, segun corresponda: 
	-docker-compose build frontend --no-cache
	-docker-compose build backend--no-cache



PARA CORRER EL PROYECTO DESDE LA PC LOCAL
1- Reiniciar MySQL 8.3 desde la configuracion 
2- En VSCode poner el AppModule el False en Synchronize
3- Inicializar la Base de Datos 
4- Correr comando:
	-Frontend: npm run dev
	-Backend: npm run statr:dev
