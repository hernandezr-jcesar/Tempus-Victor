# Tempus Victor

## Requerimientos
-Tener Instalado MySQL  
-El usuario y contraseña del workbench para agregarlos al link de conexion de prisma:  
  En este caso, el URL se establece mediante una variable de entorno que se define en .env; lo siguiente es la forma por defecto para crear el URL de conexión con la base de datos:   
  ```
    mysql://USER:PASSWORD@HOST:PORT/DATABASE
```
  El siguiente URL es el que se utilizó para el desarrollo actual, contiene la contraseña definida en la instalación de MySQL, el puerto de acceso por defecto y el nombre de la base de datos a crear.  
  ```
    DATABASE_URL="mysql://root:password@localhost:3306/tempus_victor_db?schema=public"  
  ```
  Es necesario migrar el esquema a la base de datos; para asignar el modelo de datos al esquema de la base de datos, se debe utilizar:  
  ```
    $ npx prisma migrate dev --name init
```
  Este comando hace dos cosas:  
  •	Crea un nuevo archivo de migración SQL para esta migración.  
  •	Ejecuta el archivo de migración SQL contra la base de datos.  
  Ya con esto se tiene la base de datos creada en MySQL, corriendo y actualizada a las necesidades actuales  

  Para correr el sistema Tempus Victor se tienen que seguir los siguientes comandos en consola dentro de la carpeta respectiva.  
  
**Backend:**  		
```
$ npm install
$ npm run build
$ npm run start  
 ```
**Frontend:**
```
$ npm install
$ npm run start  
 ```
De esta forma se puede acceder al sistema por medio de cualquier navegador web en   
http://localhost:8081/  
