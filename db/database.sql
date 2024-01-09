CREATE DATABASE convocatoria;

USE convocatoria;

CREATE TABLE modelos(
    id_modelo INT AUTO_INCREMENT PRIMARY KEY(),
    tipo VARCHAR(15) NOT NULL,
    nombre VARCHAR(30) NOT NULL,
    archivo VARCHAR(100) NOT NULL,
    datos JSON NOT NULL,
    parametros JSON NOT NULL,
    grafico VARCHAR(50) NOT NULL,
    creado DATE NOT NULL,
);