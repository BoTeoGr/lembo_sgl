-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 14-05-2025 a las 00:41:40
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sistema_gestion_agricola`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciclo_cultivo`
--

CREATE TABLE `ciclo_cultivo` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `periodo_inicio` date NOT NULL,
  `periodo_final` date NOT NULL,
  `novedades` text DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `estado` enum('habilitado','deshabilitado') NOT NULL DEFAULT 'habilitado',
  `fecha_creacion` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ciclo_cultivo`
--

INSERT INTO `ciclo_cultivo` (`id`, `nombre`, `descripcion`, `periodo_inicio`, `periodo_final`, `novedades`, `usuario_id`, `estado`, `fecha_creacion`) VALUES
(1, 'Ciclo Primavera', 'Ciclo de cultivo para primavera', '2025-03-01', '2025-06-30', 'Ninguna', 1, 'habilitado', '2025-04-22 17:40:51'),
(2, 'Ciclo Verano', 'Ciclo de cultivo para verano', '2025-07-01', '2025-09-30', 'Ninguna', 2, 'habilitado', '2025-04-22 17:40:51'),
(3, 'Ciclo Otoño', 'Ciclo de cultivo para otoño', '2025-10-01', '2025-12-31', 'Ninguna', 3, 'habilitado', '2025-04-22 17:40:51'),
(4, 'Ciclo Invierno', 'Ciclo de cultivo para invierno', '2026-01-01', '2026-03-31', 'Ninguna', 4, 'habilitado', '2025-04-22 17:40:51'),
(5, 'Ciclo Anual', 'Ciclo de cultivo durante todo el año', '2025-01-01', '2025-12-31', 'Requiere monitoreo constante', 5, 'habilitado', '2025-04-22 17:40:51'),
(6, 'Ciclo Semestral', 'Ciclo de cultivo para el primer semestre', '2025-01-01', '2025-06-30', 'Ninguna', 6, 'habilitado', '2025-04-22 17:40:51'),
(7, 'Ciclo Bianual', 'Ciclo de cultivo cada dos años', '2025-01-01', '2026-12-31', 'Requiere planificación', 7, 'habilitado', '2025-04-22 17:40:51'),
(8, 'Ciclo Mensual', 'Ciclo de cultivo mensual', '2025-03-01', '2025-03-31', 'Alta rotación', 8, 'habilitado', '2025-04-22 17:40:51'),
(9, 'nose', 'cual', '2025-05-04', '2025-05-29', 'sdadad', 1, 'habilitado', '2025-05-05 20:54:23'),
(10, 'coco', 'no eñor', '2025-05-05', '2025-05-30', 'sdadwds', 1, 'habilitado', '2025-05-05 20:56:25'),
(11, 'nuevo', 'm', '2025-05-06', '2025-05-28', 'm', 1, 'habilitado', '2025-05-06 14:19:36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cultivos`
--

CREATE TABLE `cultivos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `ubicacion` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `tamano` varchar(50) NOT NULL,
  `estado` enum('habilitado','deshabilitado') NOT NULL DEFAULT 'habilitado',
  `fecha_creacion` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cultivos`
--

INSERT INTO `cultivos` (`id`, `nombre`, `tipo`, `imagen`, `ubicacion`, `descripcion`, `usuario_id`, `tamano`, `estado`, `fecha_creacion`) VALUES
(1, 'Tomate', 'Fruta', 'tomate.jpg', 'Invernadero 1', 'Cultivo de tomates', 1, '200', 'habilitado', '2025-04-22 17:40:51'),
(2, 'Lechuga', 'Verdura', 'lechuga.jpg', 'Campo 2', 'Cultivo de lechugas', 2, '100', 'habilitado', '2025-04-22 17:40:51'),
(3, 'Maíz', 'Cereal', 'maiz.jpg', 'Campo 3', 'Cultivo de maíz', 3, '150', 'habilitado', '2025-04-22 17:40:51'),
(4, 'Papa', 'Tubérculo', 'papa.jpg', 'Campo 4', 'Cultivo de papas', 4, '250', 'habilitado', '2025-04-22 17:40:51'),
(5, 'Café', 'Bebida', 'cafe.jpg', 'Plantación 1', 'Cultivo de café', 5, '300', 'habilitado', '2025-04-22 17:40:51'),
(6, 'Trigo', 'Cereal', 'trigo.jpg', 'Campo 5', 'Cultivo de trigo', 6, '200', 'habilitado', '2025-04-22 17:40:51'),
(7, 'Cebolla', 'Verdura', 'cebolla.jpg', 'Campo 6', 'Cultivo de cebollas', 7, '120', 'habilitado', '2025-04-22 17:40:51'),
(8, 'Fresa', 'Fruta', 'fresa.jpg', 'Invernadero 2', 'Cultivo de fresas', 8, '50', 'habilitado', '2025-04-22 17:40:51'),
(9, 'curcuma', 'Verdura', 'cultivo-default.jpg', 'ninguna', 'ninguna', 1, '21', 'habilitado', '2025-05-05 20:11:02'),
(10, 'prueba cultivo', 'grano', 'C:\\fakepath\\Acer_Wallpaper_04_3840x2400.jpg', 'zona 5', 'm', 1, '342', 'habilitado', '2025-05-06 19:39:07'),
(11, 'Manzana', 'Tubérculo', 'cultivo-default.jpg', 'zona 6', 'prueba de cultivo', 1, '230', 'habilitado', '2025-05-06 20:33:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `insumos`
--

CREATE TABLE `insumos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `unidad_medida` enum('peso','volumen','superficie','concentración','litro','kilo') NOT NULL,
  `valor_unitario` decimal(10,2) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `descripcion` text NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `estado` enum('habilitado','deshabilitado') NOT NULL DEFAULT 'habilitado',
  `fecha_creacion` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `insumos`
--

INSERT INTO `insumos` (`id`, `nombre`, `tipo`, `imagen`, `unidad_medida`, `valor_unitario`, `cantidad`, `valor_total`, `descripcion`, `usuario_id`, `estado`, `fecha_creacion`) VALUES
(1, 'Fertilizante', 'Químico', 'fertilizante.jpg', 'kilo', 10.00, 88, 950.00, 'Fertilizante para cultivos', 1, 'habilitado', '2025-04-22 17:40:51'),
(2, 'Pesticida', 'Químico', 'pesticida.jpg', 'litro', 20.00, 40, 940.00, 'Pesticida para cultivos', 2, 'habilitado', '2025-04-22 17:40:51'),
(3, 'Herbicida', 'Químico', 'herbicida.jpg', 'litro', 15.00, 148, 3000.00, 'Herbicida para control de malezas', 2, 'habilitado', '2025-04-22 17:40:51'),
(4, 'Semillas de Maíz', 'Semilla', 'semillas_maiz.jpg', 'kilo', 50.00, 17, 1250.00, 'Semillas de maíz híbrido', 3, 'habilitado', '2025-04-22 17:40:51'),
(5, 'Insecticida', 'Químico', 'insecticida.jpg', 'litro', 25.00, 89, 2375.00, 'Insecticida para control de plagas', 4, 'habilitado', '2025-04-22 17:40:51'),
(6, 'Abono Orgánico', 'Orgánico', 'abono_organico.jpg', 'kilo', 8.00, 460, 4000.00, 'Abono orgánico para mejorar la tierra', 5, 'habilitado', '2025-04-22 17:40:51'),
(7, 'Riego por Goteo', 'Equipo', 'riego_goteo.jpg', 'kilo', 200.00, 8, 2000.00, 'Sistema de riego por goteo', 6, 'habilitado', '2025-04-22 17:40:51'),
(8, 'cuan', 'noco', 'insumo-default.jpg', 'volumen', 1234.00, 20, 24680.00, 'nocosq', 1, 'habilitado', '2025-05-05 21:19:09'),
(9, 'prueba insumo', 'Fertilizante', 'C:\\fakepath\\Acer_Wallpaper_03_3840x2400.jpg', 'volumen', 2400.00, 230, 552000.00, 'm', 1, 'habilitado', '2025-05-06 19:38:24');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producciones`
--

CREATE TABLE `producciones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `ubicacion` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `estado` enum('habilitado','deshabilitado') NOT NULL DEFAULT 'habilitado',
  `fecha_creacion` timestamp NULL DEFAULT current_timestamp(),
  `cultivo_id` int(11) DEFAULT NULL,
  `ciclo_id` int(11) DEFAULT NULL,
  `insumos_ids` text DEFAULT NULL,
  `sensores_ids` text DEFAULT NULL,
  `fecha_de_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `inversion` decimal(10,2) DEFAULT NULL,
  `meta_ganancia` decimal(10,2) DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `producciones`
--

INSERT INTO `producciones` (`id`, `nombre`, `tipo`, `imagen`, `ubicacion`, `descripcion`, `usuario_id`, `cantidad`, `estado`, `fecha_creacion`, `cultivo_id`, `ciclo_id`, `insumos_ids`, `sensores_ids`, `fecha_de_inicio`, `fecha_fin`, `inversion`, `meta_ganancia`) VALUES
(1, 'Producción de Tomates 2025', 'Orgánica', 'tomate_produccion.jpg', 'Invernadero 1', 'Producción de tomates orgánicos', 1, 500.00, 'habilitado', '2025-04-22 22:40:51', 1, 1, '1,3', '1,5', '2025-04-22', '2025-07-22', 1500.00, 1950.00),
(2, 'Producción de Maíz Verano', 'Tradicional', 'maiz_produccion.jpg', 'Campo 3', 'Producción de maíz para temporada de verano', 3, 1200.00, 'habilitado', '2025-04-22 22:40:51', 3, 2, '1,4,6', '2,7', '2025-04-22', '2025-08-22', 2500.00, 3250.00),
(3, 'Producción de Fresas', 'Hidropónica', 'fresa_produccion.jpg', 'Invernadero 2', 'Producción de fresas en sistema hidropónico', 8, 300.00, 'habilitado', '2025-04-22 22:40:51', 8, 8, '2,5,7', '3,8', '2025-04-22', '2025-06-22', 1800.00, 2340.00),
(4, 'Producción de Café Premium', 'Orgánica', 'cafe_produccion.jpg', 'Plantación 1', 'Producción de café de alta calidad', 5, 800.00, 'habilitado', '2025-04-22 22:40:51', 5, 5, '6,7', '4,5', '2025-04-22', '2025-09-22', 3200.00, 4160.00),
(5, 'Producción de Trigo', 'Tradicional', 'produccion-default.jpg', 'Campo Norte', 'Cultivo de trigo para temporada de invierno', 1, 1000.00, 'habilitado', '2025-05-05 23:09:47', 2, 2, '1,4,5', '3', '2025-05-05', '2025-09-05', 1800.00, 2340.00),
(6, 'Producción de Papas', 'Tradicional', 'produccion-default.jpg', 'Campo Sur', 'Cultivo de papas de alta calidad', 1, 750.00, 'habilitado', '2025-05-06 01:49:29', 2, 3, '1,4', '2,4,3', '2025-05-05', '2025-08-05', 1200.00, 1560.00),
(7, 'Producción de Cebollas', 'Tradicional', 'produccion-default.jpg', 'Campo Este', 'Cultivo de cebollas para mercado local', 2, 500.00, 'habilitado', '2025-05-06 04:34:55', 2, 2, '2,5', '3,6', '2025-05-05', '2025-07-05', 950.00, 1235.00),
(8, 'Producción de Zanahorias', 'Tradicional', 'produccion-default.jpg', 'Area urbana', 'Cultivo de zanahorias orgánicas', 3, 300.00, 'habilitado', '2025-05-06 19:20:10', 4, 11, '1,2', '5,6', '2025-05-06', '2025-08-06', 750.00, 975.00),
(9, 'Producción de Lechugas', 'Hidropónica', 'produccion-default.jpg', 'Invernadero 3', 'Cultivo de lechugas en sistema hidropónico', 3, 200.00, 'habilitado', '2025-05-06 19:26:49', 4, 3, '1', '3', '2025-05-06', '2025-07-06', 600.00, 780.00),
(10, 'Producción de Espinacas', 'Orgánica', 'produccion-default.jpg', 'Area urbana', 'Cultivo de espinacas orgánicas', 5, 150.00, 'habilitado', '2025-05-06 23:07:15', 2, 3, '1', '7', '2025-05-06', '2025-07-06', 450.00, 585.00),
(11, 'Producción de Pimientos', 'Orgánica', 'produccion-default.jpg', 'Area urbana', 'Cultivo de pimientos orgánicos', 4, 250.00, 'habilitado', '2025-05-07 00:42:48', 3, 4, '5,2', '3', '2025-05-06', '2025-08-06', 850.00, 1105.00),
(12, 'Producción de Pepinos', 'Hidropónica', 'produccion-default.jpg', 'Area urbana', 'Cultivo de pepinos en sistema hidropónico', 2, 180.00, 'habilitado', '2025-05-07 01:23:14', 3, 2, '3,7', '4', '2025-05-06', '2025-08-06', 720.00, 936.00),
(13, 'Producción de Berenjenas', 'Tradicional', 'produccion-default.jpg', 'Area urbana', 'Cultivo de berenjenas para mercado local', 6, 220.00, 'habilitado', '2025-05-07 01:34:37', 11, 4, '4,5', '3,4,7', '2025-05-06', '2025-08-06', 680.00, 884.00),
(14, 'Preuba-13-05', 'Orgánica', 'produccion-default.jpg', 'Zona invernadero', 'm', 5, 1.00, 'habilitado', '2025-05-13 21:24:24', 2, 3, '1,2', '4', '2025-05-13', '2025-08-13', 160.00, 208.00),
(15, 'otra-prueba', 'Hidropónica', 'produccion-default.jpg', 'Zona invernadero', 'm', 4, 1.00, 'habilitado', '2025-05-13 21:34:04', 11, 7, '3', '3', '2025-05-13', '2025-08-13', 750.00, 975.00),
(16, 'produc-13-05-25-3', 'Hidropónica', 'produccion-default.jpg', 'Zona invernadero', 'm', 3, 1.00, 'habilitado', '2025-05-13 21:49:26', 8, 4, '6,1', '8', '2025-05-13', '2025-08-13', 170.00, 208.00),
(17, 'Ultima-prueba-13-05-4', 'Tradicional', 'produccion-default.jpg', 'Zona invernadero', 'm', 3, 1.00, 'habilitado', '2025-05-13 22:11:28', 2, 2, '4,5', '', '2025-05-13', '2025-08-13', 175.00, 227.50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `produccion_insumos`
--

CREATE TABLE `produccion_insumos` (
  `produccion_id` int(11) NOT NULL,
  `insumo_id` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `produccion_insumos`
--

INSERT INTO `produccion_insumos` (`produccion_id`, `insumo_id`, `cantidad`) VALUES
(16, 1, 1),
(16, 6, 20),
(17, 4, 3),
(17, 5, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sensores`
--

CREATE TABLE `sensores` (
  `id` int(11) NOT NULL,
  `tipo_sensor` enum('Sensor de contacto','Sensor de distancia','Sensores de luz') NOT NULL,
  `nombre_sensor` varchar(100) NOT NULL,
  `unidad_medida` enum('Temperatura','Distancia','Presión') NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `descripcion` text NOT NULL,
  `tiempo_escaneo` enum('Sensores lentos','Sensores de velocidad media','Sensores rápidos') NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `estado` enum('habilitado','deshabilitado') NOT NULL DEFAULT 'habilitado',
  `fecha_creacion` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sensores`
--

INSERT INTO `sensores` (`id`, `tipo_sensor`, `nombre_sensor`, `unidad_medida`, `imagen`, `descripcion`, `tiempo_escaneo`, `usuario_id`, `estado`, `fecha_creacion`) VALUES
(1, 'Sensor de contacto', 'Sensor prueba 1', 'Temperatura', 'Acer_Wallpaper_02_3840x2400.jpg', 'Sensor de temperatura de contacto', 'Sensores rápidos', 1, 'deshabilitado', '2025-04-22 17:40:51'),
(2, 'Sensor de distancia', 'Sensor 2', 'Distancia', 'sensor2.jpg', 'Sensor de distancia láser', 'Sensores rápidos', 2, 'habilitado', '2025-04-22 17:40:51'),
(3, 'Sensores de luz', 'Sensor 3', 'Temperatura', 'sensor3.jpg', 'Sensor de intensidad lumínica', 'Sensores de velocidad media', 3, 'habilitado', '2025-04-22 17:40:51'),
(4, 'Sensor de contacto', 'Sensor 4', 'Presión', 'sensor4.jpg', 'Sensor de presión atmosférica', 'Sensores rápidos', 4, 'habilitado', '2025-04-22 17:40:51'),
(5, 'Sensor de contacto', 'Sensor 5', 'Presión', 'sensor5.jpg', 'Sensor de humedad del suelo', 'Sensores lentos', 5, 'habilitado', '2025-04-22 17:40:51'),
(6, 'Sensor de contacto', 'Sensor 6', 'Temperatura', 'sensor6.jpg', 'Sensor de humedad ambiental', 'Sensores de velocidad media', 6, 'habilitado', '2025-04-22 17:40:51'),
(7, 'Sensor de contacto', 'Sensor 7', 'Temperatura', 'sensor7.jpg', 'Sensor de temperatura infrarrojo', 'Sensores rápidos', 7, 'habilitado', '2025-04-22 17:40:51'),
(8, 'Sensor de contacto', 'Sensor 8', 'Presión', 'sensor8.jpg', 'Sensor de pH del suelo', 'Sensores lentos', 8, 'habilitado', '2025-04-22 17:40:51'),
(9, 'Sensor de contacto', 'cheche', 'Temperatura', 'sensor-default.jpg', 'ncsa', 'Sensores de velocidad media', 1, 'habilitado', '2025-05-05 21:16:39'),
(10, 'Sensor de contacto', 'Probando sensores', 'Temperatura', 'C:\\fakepath\\Acer_Wallpaper_01_3840x2400.jpg', 'm', 'Sensores rápidos', 1, 'habilitado', '2025-05-06 19:36:11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `tipo_documento` enum('ti','cc','ppt','ce','pep') NOT NULL,
  `numero_documento` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `rol` enum('superadmin','admin','apoyo','visitante') NOT NULL,
  `estado` enum('habilitado','deshabilitado') NOT NULL DEFAULT 'habilitado',
  `fecha_creacion` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `tipo_documento`, `numero_documento`, `nombre`, `telefono`, `correo`, `rol`, `estado`, `fecha_creacion`) VALUES
(1, 'cc', '1234567890', 'Juan Perez Lozano', '555-1234', 'juan.perez@example.com', 'admin', 'habilitado', '2025-04-22 17:40:51'),
(2, 'ti', '0987654321', 'Maria Gomez', '555-5678', 'maria.gomez@example.com', 'visitante', 'habilitado', '2025-04-22 17:40:51'),
(3, 'cc', '1122334455', 'Carlos Ramirez', '555-9876', 'carlos.ramirez@example.com', 'superadmin', 'habilitado', '2025-04-22 17:40:51'),
(4, 'ti', '2233445566', 'Ana Torres', '555-8765', 'ana.torres@example.com', 'apoyo', 'habilitado', '2025-04-22 17:40:51'),
(5, 'ppt', '3344556677', 'Luis Martinez', '555-7654', 'luis.martinez@example.com', 'admin', 'habilitado', '2025-04-22 17:40:51'),
(6, 'cc', '4455667788', 'Elena Suarez', '555-6543', 'elena.suarez@example.com', 'visitante', 'habilitado', '2025-04-22 17:40:51'),
(7, 'ti', '5566778899', 'Pedro Lopez', '555-5432', 'pedro.lopez@example.com', 'apoyo', 'habilitado', '2025-04-22 17:40:51'),
(8, 'ppt', '6677889900', 'Sofia Castro', '555-4321', 'sofia.castro@example.com', 'superadmin', 'habilitado', '2025-04-22 17:40:51'),
(9, 'cc', '1137059587', 'jordan valencia patiño', '3011186124', 'jordanvalenciap@gmail.com', 'admin', 'habilitado', '2025-05-05 21:13:46'),
(10, 'cc', '1232134532', 'prueba usuario', '3045678979', 'prueba@gmail.com', 'admin', 'habilitado', '2025-05-06 19:37:30');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ciclo_cultivo`
--
ALTER TABLE `ciclo_cultivo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `cultivos`
--
ALTER TABLE `cultivos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `insumos`
--
ALTER TABLE `insumos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_usuario_id` (`usuario_id`);

--
-- Indices de la tabla `producciones`
--
ALTER TABLE `producciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `cultivo_id` (`cultivo_id`),
  ADD KEY `ciclo_id` (`ciclo_id`);

--
-- Indices de la tabla `produccion_insumos`
--
ALTER TABLE `produccion_insumos`
  ADD PRIMARY KEY (`produccion_id`,`insumo_id`),
  ADD KEY `insumo_id` (`insumo_id`);

--
-- Indices de la tabla `sensores`
--
ALTER TABLE `sensores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_sensor_usuario_id` (`usuario_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_documento` (`numero_documento`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ciclo_cultivo`
--
ALTER TABLE `ciclo_cultivo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `cultivos`
--
ALTER TABLE `cultivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `insumos`
--
ALTER TABLE `insumos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `producciones`
--
ALTER TABLE `producciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sensores`
--
ALTER TABLE `sensores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ciclo_cultivo`
--
ALTER TABLE `ciclo_cultivo`
  ADD CONSTRAINT `ciclo_cultivo_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `cultivos`
--
ALTER TABLE `cultivos`
  ADD CONSTRAINT `cultivos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `insumos`
--
ALTER TABLE `insumos`
  ADD CONSTRAINT `fk_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `insumos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `producciones`
--
ALTER TABLE `producciones`
  ADD CONSTRAINT `producciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `producciones_ibfk_2` FOREIGN KEY (`cultivo_id`) REFERENCES `cultivos` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `producciones_ibfk_3` FOREIGN KEY (`ciclo_id`) REFERENCES `ciclo_cultivo` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `produccion_insumos`
--
ALTER TABLE `produccion_insumos`
  ADD CONSTRAINT `produccion_insumos_ibfk_1` FOREIGN KEY (`produccion_id`) REFERENCES `producciones` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produccion_insumos_ibfk_2` FOREIGN KEY (`insumo_id`) REFERENCES `insumos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `sensores`
--
ALTER TABLE `sensores`
  ADD CONSTRAINT `fk_sensor_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `sensores_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
