//Entidad departamento
CREATE TABLE departamento(
id_departamento SERIAL PRIMARY KEY,
nom_departamento VARCHAR(50) NOT NULL
);

CREATE TABLE persona(
id_persona SERIAL PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
cedula VARCHAR(10) NOT NULL,
id_departamento INTEGER,

CONSTRAINT fk_departamento FOREIGN KEY (id_departamento) REFERENCES departamento(id_departamento)
);

CREATE TABLE producto(
id_producto SERIAL PRIMARY KEY,
tipo_producto VARCHAR(150) Not NULL
);

CREATE TABLE producto_entregado(
id_producto_entregado SERIAL PRIMARY KEY,
id_persona_retiro INTEGER NOT NULL,
id_persona_entrega INTEGER NOT NULL,
id_producto INTEGER NOT NULL,
cantidad INTEGER NOT NULL CHECK(cantidad >0),
fecha_entrega TIMESTAMP NOT NULL,

CONSTRAINT fk_persona_retiro FOREIGN KEY (id_persona_retiro) REFERENCES persona(id_persona),
CONSTRAINT fk_persona_entrega FOREIGN KEY (id_persona_entrega) REFERENCES persona(id_persona),
CONSTRAINT fk_producto FOREIGN KEY (id_producto) REFERENCES producto(id_producto)

);



ALTER TABLE producto ADD CONSTRAINT producto_tipo_unique UNIQUE (tipo_producto);