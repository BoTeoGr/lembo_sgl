-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS sistema_gestion_agricola;
USE sistema_gestion_agricola;
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_documento ENUM('ti', 'cc', 'ppt', 'ce', 'pep' ) NOT NULL,
    numero_documento VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    rol ENUM('superadmin', 'admin', 'apoyo', 'visitante') NOT NULL,
    estado ENUM('habilitado', 'deshabilitado') NOT NULL DEFAULT 'habilitado',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Cultivos
CREATE TABLE IF NOT EXISTS cultivos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    imagen VARCHAR(255),
    ubicacion VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    usuario_id INT,
    tamano VARCHAR(50) NOT NULL,
    estado ENUM('habilitado', 'deshabilitado') NOT NULL DEFAULT 'habilitado',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de Ciclos de Cultivo
CREATE TABLE IF NOT EXISTS ciclo_cultivo (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    periodo_inicio DATE NOT NULL,
    periodo_final DATE NOT NULL,
    novedades TEXT,
    usuario_id INT,
    estado ENUM('habilitado', 'deshabilitado') NOT NULL DEFAULT 'habilitado',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de Sensores
CREATE TABLE IF NOT EXISTS sensores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_sensor ENUM('Sensor de contacto', 'Sensor de distancia', 'Sensores de luz') NOT NULL,
    nombre_sensor VARCHAR(100) NOT NULL,
    unidad_medida ENUM('Temperatura', 'Distancia', 'Presión') NOT NULL,
    imagen VARCHAR(255),
    descripcion TEXT NOT NULL,
    tiempo_escaneo ENUM('Sensores lentos', 'Sensores de velocidad media', 'Sensores rápidos') NOT NULL,
    usuario_id INT,
    estado ENUM('habilitado', 'deshabilitado') NOT NULL DEFAULT 'habilitado',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de Insumos
CREATE TABLE IF NOT EXISTS insumos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    imagen VARCHAR(255),
    unidad_medida ENUM('peso', 'volumen', 'superficie', 'concentración', 'litro', 'kilo') NOT NULL,
    valor_unitario DECIMAL(10, 2) NOT NULL,
    cantidad INT NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    descripcion TEXT NOT NULL,
    usuario_id INT,
    estado ENUM('habilitado', 'deshabilitado') NOT NULL DEFAULT 'habilitado',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Trigger para calcular automáticamente el valor total al insertar un insumo
DELIMITER //
CREATE TRIGGER before_insumo_insert
BEFORE INSERT ON insumos
FOR EACH ROW
BEGIN
    SET NEW.valor_total = NEW.valor_unitario * NEW.cantidad;
END //
DELIMITER ;

-- Trigger para actualizar automáticamente el valor total al modificar un insumo
DELIMITER //
CREATE TRIGGER before_insumo_update
BEFORE UPDATE ON insumos
FOR EACH ROW
BEGIN
    SET NEW.valor_total = NEW.valor_unitario * NEW.cantidad;
END //
DELIMITER ;

-- Índices básicos para mejorar el rendimiento
-- CREATE INDEX idx_cultivos_tipo ON cultivos(tipo);
-- CREATE INDEX idx_ciclo_cultivo_cultivo ON ciclo_cultivo(cultivo_id);

-- Insert data into usuarios table
INSERT INTO usuarios (tipo_documento, numero_documento, nombre, telefono, correo, rol) VALUES
('cc', '1234567890', 'Juan Perez', '555-1234', 'juan.perez@example.com', 'admin'),
('ti', '0987654321', 'Maria Gomez', '555-5678', 'maria.gomez@example.com', 'visitante'),
('cc', '1122334455', 'Carlos Ramirez', '555-9876', 'carlos.ramirez@example.com', 'superadmin'),
('ti', '2233445566', 'Ana Torres', '555-8765', 'ana.torres@example.com', 'apoyo'),
('ppt', '3344556677', 'Luis Martinez', '555-7654', 'luis.martinez@example.com', 'admin'),
('cc', '4455667788', 'Elena Suarez', '555-6543', 'elena.suarez@example.com', 'visitante'),
('ti', '5566778899', 'Pedro Lopez', '555-5432', 'pedro.lopez@example.com', 'apoyo'),
('ppt', '6677889900', 'Sofia Castro', '555-4321', 'sofia.castro@example.com', 'superadmin');

-- Insert data into cultivos table
INSERT INTO cultivos (nombre, tipo, imagen, ubicacion, descripcion, usuario_id, tamano) VALUES
('Tomate', 'Fruta', 'tomate.jpg', 'Invernadero 1', 'Cultivo de tomates', 1,200),
('Lechuga', 'Verdura', 'lechuga.jpg', 'Campo 2', 'Cultivo de lechugas', 2,100),
('Maíz', 'Cereal', 'maiz.jpg', 'Campo 3', 'Cultivo de maíz', 3,150),
('Papa', 'Tubérculo', 'papa.jpg', 'Campo 4', 'Cultivo de papas', 4,250),
('Café', 'Bebida', 'cafe.jpg', 'Plantación 1', 'Cultivo de café', 5,300),
('Trigo', 'Cereal', 'trigo.jpg', 'Campo 5', 'Cultivo de trigo', 6,200),
('Cebolla', 'Verdura', 'cebolla.jpg', 'Campo 6', 'Cultivo de cebollas', 7,120),
('Fresa', 'Fruta', 'fresa.jpg', 'Invernadero 2', 'Cultivo de fresas', 8,50);

-- Insert data into ciclo_cultivo table
INSERT INTO ciclo_cultivo (nombre, descripcion, periodo_inicio, periodo_final, novedades, usuario_id) VALUES
('Ciclo Primavera', 'Ciclo de cultivo para primavera', '2025-03-01', '2025-06-30', 'Ninguna', 1),
('Ciclo Verano', 'Ciclo de cultivo para verano', '2025-07-01', '2025-09-30', 'Ninguna', 2),
('Ciclo Otoño', 'Ciclo de cultivo para otoño', '2025-10-01', '2025-12-31', 'Ninguna', 3),
('Ciclo Invierno', 'Ciclo de cultivo para invierno', '2026-01-01', '2026-03-31', 'Ninguna', 4),
('Ciclo Anual', 'Ciclo de cultivo durante todo el año', '2025-01-01', '2025-12-31', 'Requiere monitoreo constante', 5),
('Ciclo Semestral', 'Ciclo de cultivo para el primer semestre', '2025-01-01', '2025-06-30', 'Ninguna', 6),
('Ciclo Bianual', 'Ciclo de cultivo cada dos años', '2025-01-01', '2026-12-31', 'Requiere planificación', 7),
('Ciclo Mensual', 'Ciclo de cultivo mensual', '2025-03-01', '2025-03-31', 'Alta rotación', 8);

-- Insert data into sensores table
INSERT INTO sensores (tipo_sensor, nombre_sensor, unidad_medida, imagen, descripcion, tiempo_escaneo, usuario_id) VALUES
('Sensor de contacto', 'Sensor 1', 'Temperatura', 'sensor1.jpg', 'Sensor de temperatura de contacto', 'Sensores lentos', 1),
('Sensor de distancia', 'Sensor 2', 'Distancia', 'sensor2.jpg', 'Sensor de distancia láser', 'Sensores rápidos', 2),
('Sensores de luz', 'Sensor 3', 'Temperatura', 'sensor3.jpg', 'Sensor de intensidad lumínica', 'Sensores de velocidad media', 3),
('Sensor de contacto', 'Sensor 4', 'Presión', 'sensor4.jpg', 'Sensor de presión atmosférica', 'Sensores rápidos', 4),
('Sensor de contacto', 'Sensor 5', 'Presión', 'sensor5.jpg', 'Sensor de humedad del suelo', 'Sensores lentos', 5),
('Sensor de contacto', 'Sensor 6', 'Temperatura', 'sensor6.jpg', 'Sensor de humedad ambiental', 'Sensores de velocidad media', 6),
('Sensor de contacto', 'Sensor 7', 'Temperatura', 'sensor7.jpg', 'Sensor de temperatura infrarrojo', 'Sensores rápidos', 7),
('Sensor de contacto', 'Sensor 8', 'Presión', 'sensor8.jpg', 'Sensor de pH del suelo', 'Sensores lentos', 8);

-- Insert data into insumos table
INSERT INTO insumos (nombre, tipo, imagen, unidad_medida, valor_unitario, cantidad, valor_total, descripcion, usuario_id) VALUES
('Fertilizante', 'Químico', 'fertilizante.jpg', 'kilo', 10.00, 100, 1000.00, 'Fertilizante para cultivos', 1),
('Pesticida', 'Químico', 'pesticida.jpg', 'litro', 20.00, 50, 1000.00, 'Pesticida para cultivos', 2),
('Herbicida', 'Químico', 'herbicida.jpg', 'litro', 15.00, 200, 3000.00, 'Herbicida para control de malezas', 2),
('Semillas de Maíz', 'Semilla', 'semillas_maiz.jpg', 'kilo', 50.00, 30, 1500.00, 'Semillas de maíz híbrido', 3),
('Insecticida', 'Químico', 'insecticida.jpg', 'litro', 25.00, 100, 2500.00, 'Insecticida para control de plagas', 4),
('Abono Orgánico', 'Orgánico', 'abono_organico.jpg', 'kilo', 8.00, 500, 4000.00, 'Abono orgánico para mejorar la tierra', 5),
('Riego por Goteo', 'Equipo', 'riego_goteo.jpg', 'kilo', 200.00, 10, 2000.00, 'Sistema de riego por goteo', 6);

ALTER TABLE insumos
ADD CONSTRAINT fk_usuario_id
FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
ON DELETE SET NULL;

ALTER TABLE sensores
ADD CONSTRAINT fk_sensor_usuario_id
FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
ON DELETE SET NULL;