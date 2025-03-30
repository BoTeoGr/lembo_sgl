-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS sistema_gestion_agricola;
USE sistema_gestion_agricola;
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_documento ENUM('ti', 'cc', 'ppt') NOT NULL,
    numero_documento VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    rol ENUM('superadmin', 'admin', 'apoyo', 'visitante') NOT NULL,
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
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de Insumos
CREATE TABLE IF NOT EXISTS insumos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    imagen VARCHAR(255),
    unidad_medida ENUM('peso', 'volumen', 'superficie', 'Concentración') NOT NULL,
    valor_unitario DECIMAL(10, 2) NOT NULL,
    cantidad INT NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    descripcion TEXT NOT NULL,
    usuario_id INT,
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