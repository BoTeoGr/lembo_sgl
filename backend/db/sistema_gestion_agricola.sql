-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS sistema_gestion_agricola;
USE sistema_gestion_agricola;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_documento ENUM('ti', 'cc', 'ppt') NOT NULL COMMENT 'Tipo de documento: ti=Tarjeta de identidad, cc=Cédula de ciudadanía, ppt=Permiso de protección temporal',
    numero_documento VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    rol ENUM('superadmin', 'admin', 'apoyo', 'visitante') NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_correo CHECK (correo LIKE '%@%.%')
);

-- Tabla de Sensores
CREATE TABLE IF NOT EXISTS sensores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_sensor VARCHAR(50) NOT NULL UNIQUE COMMENT 'Identificador único del sensor',
    tipo_sensor ENUM('Sensor de contacto', 'Sensor de distancia', 'Sensores de luz') NOT NULL,
    nombre_sensor VARCHAR(100) NOT NULL,
    unidad_medida ENUM('Temperatura', 'Distancia', 'Presión') NOT NULL,
    imagen VARCHAR(255) COMMENT 'Ruta de la imagen del sensor',
    descripcion TEXT NOT NULL,
    tiempo_escaneo ENUM('Sensores lentos', 'Sensores de velocidad media', 'Sensores rápidos') NOT NULL,
    usuario_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de Insumos
CREATE TABLE IF NOT EXISTS insumos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_insumo VARCHAR(50) NOT NULL UNIQUE COMMENT 'Identificador único del insumo',
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    imagen VARCHAR(255) COMMENT 'Ruta de la imagen del insumo',
    unidad_medida ENUM('peso', 'volumen', 'superficie', 'Concentración') NOT NULL,
    valor_unitario DECIMAL(10, 2) NOT NULL,
    cantidad INT NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    descripcion TEXT NOT NULL,
    usuario_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    CONSTRAINT chk_valor_total CHECK (valor_total = valor_unitario * cantidad)
);

-- Tabla de registro de lecturas de sensores (opcional, para futuras funcionalidades)
CREATE TABLE IF NOT EXISTS lecturas_sensores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sensor_id INT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    fecha_lectura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sensor_id) REFERENCES sensores(id) ON DELETE CASCADE
);

-- Tabla de historial de uso de insumos (opcional, para futuras funcionalidades)
CREATE TABLE IF NOT EXISTS historial_insumos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    insumo_id INT NOT NULL,
    cantidad_usada INT NOT NULL,
    fecha_uso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT,
    descripcion TEXT,
    FOREIGN KEY (insumo_id) REFERENCES insumos(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_sensores_tipo ON sensores(tipo_sensor);
CREATE INDEX idx_insumos_tipo ON insumos(tipo);
CREATE INDEX idx_usuarios_rol ON usuarios(rol);

-- Procedimiento almacenado para actualizar el valor total de un insumo
DELIMITER //
CREATE PROCEDURE actualizar_valor_total(IN p_insumo_id INT)
BEGIN
    UPDATE insumos 
    SET valor_total = valor_unitario * cantidad
    WHERE id = p_insumo_id;
END //
DELIMITER ;

-- Trigger para actualizar automáticamente el valor total cuando cambia el valor unitario o la cantidad
DELIMITER //
CREATE TRIGGER before_insumo_update
BEFORE UPDATE ON insumos
FOR EACH ROW
BEGIN
    SET NEW.valor_total = NEW.valor_unitario * NEW.cantidad;
END //
DELIMITER ;

-- Trigger para establecer el valor total al insertar un nuevo insumo
DELIMITER //
CREATE TRIGGER before_insumo_insert
BEFORE INSERT ON insumos
FOR EACH ROW
BEGIN
    SET NEW.valor_total = NEW.valor_unitario * NEW.cantidad;
END //
DELIMITER ;