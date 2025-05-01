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
    unidad_medida ENUM('peso', 'volumen', 'superficie', 'concentración', 'litro', 'kilo', 'metro', 'gramo', 'mililitro', 'unidad', 'bolsa') NOT NULL,
    valor_unitario DECIMAL(10, 2) NOT NULL,
    cantidad INT NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    descripcion TEXT NOT NULL,
    usuario_id INT,
    estado ENUM('habilitado', 'deshabilitado') NOT NULL DEFAULT 'habilitado',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de Producciones
CREATE TABLE IF NOT EXISTS producciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    identificador VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    imagen VARCHAR(255) NOT NULL,
    ubicacion VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    usuario_id INT,
    estado ENUM('habilitado', 'deshabilitado') NOT NULL DEFAULT 'habilitado',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cultivo_id INT,
    ciclo_id INT,
    insumos_ids TEXT,
    sensores_ids TEXT,
    personal_ids TEXT,
    inversion_total	decimal(10,2),
    meta_ganancias	decimal(10,2),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (cultivo_id) REFERENCES cultivos(id) ON DELETE SET NULL,
    FOREIGN KEY (ciclo_id) REFERENCES ciclo_cultivo(id) ON DELETE SET NULL
);

-- Tabla de relación Producción-Insumos
CREATE TABLE IF NOT EXISTS produccion_insumos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produccion_id INT NOT NULL,
    insumo_id INT NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (produccion_id) REFERENCES producciones(id) ON DELETE CASCADE,
    FOREIGN KEY (insumo_id) REFERENCES insumos(id) ON DELETE CASCADE
);

-- Tabla de relación Producción-Sensores
CREATE TABLE IF NOT EXISTS produccion_sensores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produccion_id INT NOT NULL,
    sensor_id INT NOT NULL,
    FOREIGN KEY (produccion_id) REFERENCES producciones(id) ON DELETE CASCADE,
    FOREIGN KEY (sensor_id) REFERENCES sensores(id) ON DELETE CASCADE
);

-- Tabla de relación Producción-Personal
CREATE TABLE IF NOT EXISTS produccion_personal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produccion_id INT NOT NULL,
    usuario_id INT NOT NULL,
    FOREIGN KEY (produccion_id) REFERENCES producciones(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de Lecturas de Sensores por Producción
CREATE TABLE IF NOT EXISTS lecturas_sensores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produccion_id INT NOT NULL,
    sensor_id INT NOT NULL,
    fecha_lectura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valor DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (produccion_id) REFERENCES producciones(id) ON DELETE CASCADE,
    FOREIGN KEY (sensor_id) REFERENCES sensores(id) ON DELETE CASCADE
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

-- Usuarios reales de ejemplo para pruebas
INSERT INTO usuarios (id, tipo_documento, numero_documento, nombre, telefono, correo, rol, estado) VALUES
(1, 'cc', '100000001', 'Mateo Ramírez', '+57 300000001', 'mateo.ramirez@mail.com', 'admin', 'habilitado'),
(2, 'cc', '100000002', 'Laura Gómez', '+57 300000002', 'laura.gomez@mail.com', 'apoyo', 'habilitado'),
(3, 'cc', '100000003', 'Carlos Torres', '+57 300000003', 'carlos.torres@mail.com', 'apoyo', 'habilitado'),
(4, 'cc', '100000004', 'Diana Salazar', '+57 300000004', 'diana.salazar@mail.com', 'apoyo', 'habilitado'),
(5, 'cc', '100000005', 'Andrés Pérez', '+57 300000005', 'andres.perez@mail.com', 'apoyo', 'habilitado'),
(6, 'cc', '100000006', 'Valentina Ruiz', '+57 300000006', 'valentina.ruiz@mail.com', 'apoyo', 'habilitado'),
(7, 'cc', '100000007', 'Jorge Castillo', '+57 300000007', 'jorge.castillo@mail.com', 'apoyo', 'habilitado'),
(8, 'cc', '100000008', 'Sofía Herrera', '+57 300000008', 'sofia.herrera@mail.com', 'apoyo', 'habilitado'),
(9, 'cc', '100000009', 'Miguel López', '+57 300000009', 'miguel.lopez@mail.com', 'apoyo', 'habilitado'),
(10, 'cc', '100000010', 'Paula Medina', '+57 300000010', 'paula.medina@mail.com', 'apoyo', 'habilitado'),
(11, 'cc', '100000011', 'Camilo Vargas', '+57 300000011', 'camilo.vargas@mail.com', 'apoyo', 'habilitado'),
(12, 'cc', '100000012', 'Mariana Ortiz', '+57 300000012', 'mariana.ortiz@mail.com', 'apoyo', 'habilitado'),
(13, 'cc', '100000013', 'Ricardo Jiménez', '+57 300000013', 'ricardo.jimenez@mail.com', 'apoyo', 'habilitado'),
(14, 'cc', '100000014', 'Natalia Castro', '+57 300000014', 'natalia.castro@mail.com', 'apoyo', 'habilitado'),
(15, 'cc', '100000015', 'Esteban Silva', '+57 300000015', 'esteban.silva@mail.com', 'apoyo', 'habilitado');

-- Insert data into cultivos table
INSERT INTO cultivos (nombre, tipo, imagen, ubicacion, descripcion, usuario_id, tamano) VALUES
('Tomate', 'Fruta', 'tomate.jpg', 'Invernadero 1', 'Cultivo de tomates tipo chonto para consumo nacional y exportación, con manejo integrado de plagas y riego por goteo.', 1,200),
('Lechuga', 'Verdura', 'lechuga.jpg', 'Campo 2', 'Lechuga crespa cultivada bajo invernadero, con fertilización orgánica y control biológico de plagas.', 2,100),
('Maíz', 'Cereal', 'maiz.jpg', 'Campo 3', 'Maíz amarillo híbrido de alto rendimiento, sembrado en rotación con soya y fertilización balanceada.', 3,150),
('Papa', 'Tubérculo', 'papa.jpg', 'Campo 4', 'Papa criolla cultivada en suelos volcánicos, con monitoreo de humedad y manejo de enfermedades.', 4,250),
('Café', 'Bebida', 'cafe.jpg', 'Plantación 1', 'Café arábica de altura, secado al sol y seleccionado manualmente para exportación premium.', 5,300),
('Trigo', 'Cereal', 'trigo.jpg', 'Campo 5', 'Trigo blando para panificación, con siembra mecanizada y cosecha en época seca.', 6,200),
('Cebolla', 'Verdura', 'cebolla.jpg', 'Campo 6', 'Cebolla cabezona blanca, producida con riego tecnificado y fertilización potásica.', 7,120),
('Fresa', 'Fruta', 'fresa.jpg', 'Invernadero 2', 'Fresa variedad Albion, cultivada en sustrato con fertirriego y control de temperatura.', 8,50),
('Zanahoria', 'Raíz', 'zanahoria.jpg', 'Parcela 2', 'Zanahoria Nantes, sembrada en camas elevadas para evitar encharcamiento y mejorar la aireación.', 2, 80),
('Banano', 'Fruta', 'banano.jpg', 'Finca El Paraíso', 'Banano Cavendish bajo certificación Rainforest Alliance, con manejo sostenible y control fitosanitario.', 3, 300),
('Cacao', 'Fruta', 'cacao.jpg', 'Finca Las Delicias', 'Cacao fino de aroma, fermentado en cajas de madera y secado al sol para chocolatería gourmet.', 4, 120),
('Aguacate', 'Fruta', 'aguacate.jpg', 'Huerta Central', 'Aguacate Hass exportable, con monitoreo satelital de humedad y control biológico de plagas.', 1, 200);

-- Insertar ciclos de cultivo con IDs específicos para relaciones de producciones
INSERT INTO ciclo_cultivo (id, nombre, descripcion, periodo_inicio, periodo_final, novedades, usuario_id) VALUES
(1, 'Ciclo Primavera', 'Ciclo de cultivo para primavera, enfocado en cultivos de hoja y raíces.', '2025-03-01', '2025-06-30', 'Se implementó riego por goteo y monitoreo de humedad con sensores de última generación.', 1),
(2, 'Ciclo Verano', 'Ciclo de cultivo para verano, ideal para frutales y cereales.', '2025-07-01', '2025-09-30', 'Incremento de fertilización nitrogenada y control preventivo de plagas.', 2),
(5, 'Ciclo Anual', 'Ciclo de cultivo durante todo el año para producción continua.', '2025-01-01', '2025-12-31', 'Implementación de agricultura de precisión y sensores de clima.', 5),
(8, 'Ciclo Mensual', 'Ciclo de cultivo mensual para cultivos de alta rotación.', '2025-03-01', '2025-03-31', 'Rotación intensiva y control de plagas con trampas biológicas.', 8),
(13, 'Ciclo Orgánico', 'Producción bajo certificación orgánica con mínimo uso de agroquímicos.', '2025-04-01', '2025-10-01', 'Rotación de cultivos, control biológico de plagas y fertilización natural.', 1),
(14, 'Ciclo Primavera-Verano', 'Ciclo de alta producción aprovechando la mayor radiación solar y temperaturas cálidas.', '2026-03-01', '2026-08-31', 'Aumento en la frecuencia de riego, fertilización foliar y control de malezas.', 3),
(15, 'Ciclo Experimental', 'Ensayo de nuevas variedades de maíz y técnicas de siembra directa, con monitoreo de variables climáticas.', '2025-05-15', '2025-11-15', 'Implementación de sensores innovadores, análisis de datos y validación de resultados.', 4),
(16, 'Ciclo Otoño-Invierno', 'Ciclo de siembra y cosecha adaptado a bajas temperaturas y lluvias frecuentes.', '2025-09-01', '2026-02-28', 'Aplicación de fungicidas preventivos, monitoreo de humedad y uso de variedades resistentes.', 2);

-- Insert data into ciclo_cultivo table
INSERT INTO ciclo_cultivo (nombre, descripcion, periodo_inicio, periodo_final, novedades, usuario_id) VALUES
('Ciclo Primavera', 'Ciclo de cultivo para primavera, enfocado en cultivos de hoja y raíces.', '2025-03-01', '2025-06-30', 'Se implementó riego por goteo y monitoreo de humedad con sensores de última generación.', 1),
('Ciclo Verano', 'Ciclo de cultivo para verano, ideal para frutales y cereales.', '2025-07-01', '2025-09-30', 'Incremento de fertilización nitrogenada y control preventivo de plagas.', 2),
('Ciclo Otoño', 'Ciclo de cultivo para otoño, con énfasis en tubérculos y hortalizas.', '2025-10-01', '2025-12-31', 'Se aplicaron fungicidas biológicos y se realizó rotación de cultivos.', 3),
('Ciclo Invierno', 'Ciclo de cultivo para invierno, adaptado a bajas temperaturas y lluvias frecuentes.', '2026-01-01', '2026-03-31', 'Uso de cobertores plásticos y monitoreo de temperatura con sensores.', 4),
('Ciclo Anual', 'Ciclo de cultivo durante todo el año para producción continua.', '2025-01-01', '2025-12-31', 'Implementación de agricultura de precisión y sensores de clima.', 5),
('Ciclo Semestral', 'Ciclo de cultivo para el primer semestre, enfocado en cultivos de rápido crecimiento.', '2025-01-01', '2025-06-30', 'Optimización de riego y uso de fertilizantes orgánicos.', 6),
('Ciclo Bianual', 'Ciclo de cultivo cada dos años, ideal para cultivos perennes.', '2025-01-01', '2026-12-31', 'Monitoreo satelital de parcelas y análisis de suelos avanzado.', 7),
('Ciclo Mensual', 'Ciclo de cultivo mensual para cultivos de alta rotación.', '2025-03-01', '2025-03-31', 'Rotación intensiva y control de plagas con trampas biológicas.', 8),
('Ciclo Otoño-Invierno', 'Ciclo de siembra y cosecha adaptado a bajas temperaturas y lluvias frecuentes.', '2025-09-01', '2026-02-28', 'Aplicación de fungicidas preventivos, monitoreo de humedad y uso de variedades resistentes.', 2),
('Ciclo Primavera-Verano', 'Ciclo de alta producción aprovechando la mayor radiación solar y temperaturas cálidas.', '2026-03-01', '2026-08-31', 'Aumento en la frecuencia de riego, fertilización foliar y control de malezas.', 3),
('Ciclo Experimental', 'Ensayo de nuevas variedades de maíz y técnicas de siembra directa, con monitoreo de variables climáticas.', '2025-05-15', '2025-11-15', 'Implementación de sensores innovadores, análisis de datos y validación de resultados.', 4),
('Ciclo Orgánico', 'Producción bajo certificación orgánica con mínimo uso de agroquímicos.', '2025-04-01', '2025-10-01', 'Rotación de cultivos, control biológico de plagas y fertilización natural.', 1);

-- Insert data into sensores table
INSERT INTO sensores (tipo_sensor, nombre_sensor, unidad_medida, imagen, descripcion, tiempo_escaneo, usuario_id) VALUES
('Sensor de contacto', 'Sensor 1', 'Temperatura', 'sensor1.jpg', 'Sensor de temperatura de contacto', 'Sensores lentos', 1),
('Sensor de distancia', 'Sensor 2', 'Distancia', 'sensor2.jpg', 'Sensor de distancia láser', 'Sensores rápidos', 2),
('Sensores de luz', 'Sensor 3', 'Temperatura', 'sensor3.jpg', 'Sensor de intensidad lumínica', 'Sensores de velocidad media', 3),
('Sensor de contacto', 'Sensor 4', 'Presión', 'sensor4.jpg', 'Sensor de presión atmosférica', 'Sensores rápidos', 4),
('Sensor de contacto', 'Sensor 5', 'Presión', 'sensor5.jpg', 'Sensor de humedad del suelo', 'Sensores lentos', 5),
('Sensor de contacto', 'Sensor 6', 'Temperatura', 'sensor6.jpg', 'Sensor de humedad ambiental', 'Sensores de velocidad media', 6),
('Sensor de contacto', 'Sensor 7', 'Temperatura', 'sensor7.jpg', 'Sensor de temperatura infrarrojo', 'Sensores rápidos', 7),
('Sensor de contacto', 'Sensor 8', 'Presión', 'sensor8.jpg', 'Sensor de pH del suelo', 'Sensores lentos', 8),
('Sensor de distancia', 'Sensor Ultrasónico', 'Distancia', 'ultrasonico.jpg', 'Sensor ultrasónico para medición precisa del nivel de agua en tanques.', 'Sensores rápidos', 1),
('Sensores de luz', 'Sensor de Radiación Solar', 'Temperatura', 'radiacion_solar.jpg', 'Sensor para monitoreo de radiación solar y temperatura ambiental.', 'Sensores de velocidad media', 2),
('Sensor de contacto', 'Sensor de Humedad de Hoja', 'Presión', 'humedad_hoja.jpg', 'Sensor para detección de humedad superficial en hojas de cultivo.', 'Sensores lentos', 3),
('Sensor de distancia', 'Sensor Láser', 'Distancia', 'laser.jpg', 'Sensor láser para medición de distancia entre plantas y monitoreo de crecimiento.', 'Sensores rápidos', 4);

-- Insert data into insumos table
INSERT INTO insumos (nombre, tipo, imagen, unidad_medida, valor_unitario, cantidad, valor_total, descripcion, usuario_id) VALUES
('Fertilizante', 'Químico', 'fertilizante.jpg', 'kilo', 10.00, 100, 1000.00, 'Fertilizante para cultivos', 1),
('Pesticida', 'Químico', 'pesticida.jpg', 'litro', 20.00, 50, 1000.00, 'Pesticida para cultivos', 2),
('Herbicida', 'Químico', 'herbicida.jpg', 'litro', 15.00, 200, 3000.00, 'Herbicida para control de malezas', 2),
('Semillas de Maíz', 'Semilla', 'semillas_maiz.jpg', 'kilo', 50.00, 30, 1500.00, 'Semillas de maíz híbrido', 3),
('Insecticida', 'Químico', 'insecticida.jpg', 'litro', 25.00, 100, 2500.00, 'Insecticida para control de plagas', 4),
('Abono Orgánico', 'Orgánico', 'abono_organico.jpg', 'kilo', 8.00, 500, 4000.00, 'Abono orgánico para mejorar la tierra', 5),
('Riego por Goteo', 'Equipo', 'riego_goteo.jpg', 'kilo', 200.00, 10, 2000.00, 'Sistema de riego por goteo', 6),
('Cal agrícola', 'Mineral', 'cal_agricola.jpg', 'kilo', 5.00, 400, 2000.00, 'Cal agrícola para corrección de suelos ácidos y mejora de la fertilidad.', 2),
('Fungicida', 'Químico', 'fungicida.jpg', 'litro', 30.00, 60, 1800.00, 'Fungicida sistémico para el control de enfermedades fúngicas en cultivos.', 3),
('Compost', 'Orgánico', 'compost.jpg', 'kilo', 3.50, 700, 2450.00, 'Compost orgánico producido localmente para mejorar la estructura del suelo.', 4),
('Plástico Mulch', 'Material', 'plastico_mulch.jpg', 'metro', 1.20, 1000, 1200.00, 'Plástico agrícola para cobertura de suelos y control de malezas.', 1);

-- Insertar datos de ejemplo en la tabla producciones
INSERT INTO producciones (id, identificador, nombre, tipo, imagen, ubicacion, descripcion, usuario_id, estado, fecha_creacion, cultivo_id, ciclo_id, insumos_ids, sensores_ids, personal_ids, inversion_total, meta_ganancias) VALUES
(1, 'PROD-09042025-0001', 'Producción de Tomates 2025', 'Orgánica', 'tomate_produccion.jpg', 'Invernadero 1', 'Producción de tomates orgánicos', 1, 'habilitado', NOW(), 1, 1, '1,3', '1,5', '2,3', 5000000.00, 7500000.00),
(2, 'PROD-09042025-0002', 'Producción de Maíz Verano', 'Tradicional', 'maiz_produccion.jpg', 'Campo 3', 'Producción de maíz para temporada de verano', 3, 'habilitado', NOW(), 3, 2, '1,4,6', '2,7', '4,5,6', 3500000.00, 5250000.00),
(3, 'PROD-09042025-0003', 'Producción de Fresas', 'Hidropónica', 'fresa_produccion.jpg', 'Invernadero 2', 'Producción de fresas en sistema hidropónico', 8, 'habilitado', NOW(), 8, 8, '2,5,7', '3,8', '7', 8000000.00, 12000000.00),
(4, 'PROD-09042025-0004', 'Producción de Café Premium', 'Orgánica', 'cafe_produccion.jpg', 'Plantación 1', 'Producción de café de alta calidad', 5, 'habilitado', NOW(), 5, 5, '6,7', '4,5', '8,9', 12000000.00, 18000000.00),
(5, 'PROD-09042025-0005', 'Producción de Zanahoria Premium', 'Orgánica', 'zanahoria_premium.jpg', 'Parcela 2', 'Producción de zanahorias seleccionadas para exportación a Europa.', 2, 'habilitado', NOW(), 9, 13, '8,9', '9,11', '10', 4500000.00, 6750000.00),
(6, 'PROD-09042025-0006', 'Producción de Banano Cavendish', 'Tradicional', 'banano_cavendish.jpg', 'Finca El Paraíso', 'Cosecha de banano Cavendish con riego tecnificado y control fitosanitario.', 3, 'habilitado', NOW(), 10, 14, '10,11', '10,12', '11,12', 9000000.00, 13500000.00),
(7, 'PROD-09042025-0007', 'Producción de Cacao Fino', 'Orgánica', 'cacao_fino.jpg', 'Finca Las Delicias', 'Producción de cacao para chocolatería artesanal y exportación.', 4, 'habilitado', NOW(), 11, 15, '12,13', '13,14', '13', 7000000.00, 10500000.00),
(8, 'PROD-09042025-0008', 'Producción de Aguacate Hass', 'Tradicional', 'aguacate_hass.jpg', 'Huerta Central', 'Producción de aguacate Hass con manejo integrado de plagas.', 1, 'habilitado', NOW(), 12, 16, '14,15', '15,16', '14,15', 10000000.00, 15000000.00);

-- Ejemplo de asignación de personal a producciones (IDs de usuario ficticios)
INSERT INTO produccion_personal (produccion_id, usuario_id) VALUES
(1, 2), (1, 3), -- Producción 1: usuarios 2 y 3
(2, 4), (2, 5), (2, 6), -- Producción 2: usuarios 4, 5 y 6
(3, 7), -- Producción 3: usuario 7
(4, 8), (4, 9), -- Producción 4: usuarios 8 y 9
(5, 10), -- Producción 5: usuario 10
(6, 11), (6, 12), -- Producción 6: usuarios 11 y 12
(7, 13), -- Producción 7: usuario 13
(8, 14), (8, 15); -- Producción 8: usuarios 14 y 15

ALTER TABLE insumos
ADD CONSTRAINT fk_usuario_id
FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
ON DELETE SET NULL;

ALTER TABLE sensores
ADD CONSTRAINT fk_sensor_usuario_id
FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
ON DELETE SET NULL;