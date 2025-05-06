-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: sistema_gestion_agricola
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ciclo_cultivo`
--

DROP TABLE IF EXISTS `ciclo_cultivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ciclo_cultivo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `periodo_inicio` date NOT NULL,
  `periodo_final` date NOT NULL,
  `novedades` text,
  `usuario_id` int DEFAULT NULL,
  `estado` enum('habilitado','deshabilitado') NOT NULL DEFAULT 'habilitado',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `ciclo_cultivo_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciclo_cultivo`
--

LOCK TABLES `ciclo_cultivo` WRITE;
/*!40000 ALTER TABLE `ciclo_cultivo` DISABLE KEYS */;
INSERT INTO `ciclo_cultivo` VALUES (1,'Ciclo Primavera','Ciclo de cultivo para primavera','2025-03-01','2025-06-30','Ninguna',1,'habilitado','2025-04-22 17:40:51'),(2,'Ciclo Verano','Ciclo de cultivo para verano','2025-07-01','2025-09-30','Ninguna',2,'habilitado','2025-04-22 17:40:51'),(3,'Ciclo Otoño','Ciclo de cultivo para otoño','2025-10-01','2025-12-31','Ninguna',3,'habilitado','2025-04-22 17:40:51'),(4,'Ciclo Invierno','Ciclo de cultivo para invierno','2026-01-01','2026-03-31','Ninguna',4,'habilitado','2025-04-22 17:40:51'),(5,'Ciclo Anual','Ciclo de cultivo durante todo el año','2025-01-01','2025-12-31','Requiere monitoreo constante',5,'habilitado','2025-04-22 17:40:51'),(6,'Ciclo Semestral','Ciclo de cultivo para el primer semestre','2025-01-01','2025-06-30','Ninguna',6,'habilitado','2025-04-22 17:40:51'),(7,'Ciclo Bianual','Ciclo de cultivo cada dos años','2025-01-01','2026-12-31','Requiere planificación',7,'habilitado','2025-04-22 17:40:51'),(8,'Ciclo Mensual','Ciclo de cultivo mensual','2025-03-01','2025-03-31','Alta rotación',8,'habilitado','2025-04-22 17:40:51'),(9,'nose','cual','2025-05-04','2025-05-29','sdadad',1,'habilitado','2025-05-05 20:54:23'),(10,'coco','no eñor','2025-05-05','2025-05-30','sdadwds',1,'habilitado','2025-05-05 20:56:25');
/*!40000 ALTER TABLE `ciclo_cultivo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cultivos`
--

DROP TABLE IF EXISTS `cultivos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cultivos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `ubicacion` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `usuario_id` int DEFAULT NULL,
  `tamano` varchar(50) NOT NULL,
  `estado` enum('habilitado','deshabilitado') NOT NULL DEFAULT 'habilitado',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `cultivos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cultivos`
--

LOCK TABLES `cultivos` WRITE;
/*!40000 ALTER TABLE `cultivos` DISABLE KEYS */;
INSERT INTO `cultivos` VALUES (1,'Tomate','Fruta','tomate.jpg','Invernadero 1','Cultivo de tomates',1,'200','habilitado','2025-04-22 17:40:51'),(2,'Lechuga','Verdura','lechuga.jpg','Campo 2','Cultivo de lechugas',2,'100','habilitado','2025-04-22 17:40:51'),(3,'Maíz','Cereal','maiz.jpg','Campo 3','Cultivo de maíz',3,'150','habilitado','2025-04-22 17:40:51'),(4,'Papa','Tubérculo','papa.jpg','Campo 4','Cultivo de papas',4,'250','habilitado','2025-04-22 17:40:51'),(5,'Café','Bebida','cafe.jpg','Plantación 1','Cultivo de café',5,'300','habilitado','2025-04-22 17:40:51'),(6,'Trigo','Cereal','trigo.jpg','Campo 5','Cultivo de trigo',6,'200','habilitado','2025-04-22 17:40:51'),(7,'Cebolla','Verdura','cebolla.jpg','Campo 6','Cultivo de cebollas',7,'120','habilitado','2025-04-22 17:40:51'),(8,'Fresa','Fruta','fresa.jpg','Invernadero 2','Cultivo de fresas',8,'50','habilitado','2025-04-22 17:40:51'),(9,'curcuma','Verdura','cultivo-default.jpg','ninguna','ninguna',1,'21','habilitado','2025-05-05 20:11:02');
/*!40000 ALTER TABLE `cultivos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insumos`
--

DROP TABLE IF EXISTS `insumos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insumos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `unidad_medida` enum('peso','volumen','superficie','concentración','litro','kilo') NOT NULL,
  `valor_unitario` decimal(10,2) NOT NULL,
  `cantidad` int NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `descripcion` text NOT NULL,
  `usuario_id` int DEFAULT NULL,
  `estado` enum('habilitado','deshabilitado') NOT NULL DEFAULT 'habilitado',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_usuario_id` (`usuario_id`),
  CONSTRAINT `fk_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `insumos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insumos`
--

LOCK TABLES `insumos` WRITE;
/*!40000 ALTER TABLE `insumos` DISABLE KEYS */;
INSERT INTO `insumos` VALUES (1,'Fertilizante','Químico','fertilizante.jpg','kilo',10.00,95,950.00,'Fertilizante para cultivos',1,'habilitado','2025-04-22 17:40:51'),(2,'Pesticida','Químico','pesticida.jpg','litro',20.00,47,940.00,'Pesticida para cultivos',2,'habilitado','2025-04-22 17:40:51'),(3,'Herbicida','Químico','herbicida.jpg','litro',15.00,200,3000.00,'Herbicida para control de malezas',2,'habilitado','2025-04-22 17:40:51'),(4,'Semillas de Maíz','Semilla','semillas_maiz.jpg','kilo',50.00,25,1250.00,'Semillas de maíz híbrido',3,'habilitado','2025-04-22 17:40:51'),(5,'Insecticida','Químico','insecticida.jpg','litro',25.00,95,2375.00,'Insecticida para control de plagas',4,'habilitado','2025-04-22 17:40:51'),(6,'Abono Orgánico','Orgánico','abono_organico.jpg','kilo',8.00,500,4000.00,'Abono orgánico para mejorar la tierra',5,'habilitado','2025-04-22 17:40:51'),(7,'Riego por Goteo','Equipo','riego_goteo.jpg','kilo',200.00,10,2000.00,'Sistema de riego por goteo',6,'habilitado','2025-04-22 17:40:51'),(8,'cuan','noco','insumo-default.jpg','volumen',1234.00,20,24680.00,'nocosq',1,'habilitado','2025-05-05 21:19:09');
/*!40000 ALTER TABLE `insumos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producciones`
--

DROP TABLE IF EXISTS `producciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `ubicacion` varchar(100) NOT NULL,
  `descripcion` text NOT NULL,
  `usuario_id` int DEFAULT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `estado` enum('habilitado','deshabilitado') NOT NULL DEFAULT 'habilitado',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `cultivo_id` int DEFAULT NULL,
  `ciclo_id` int DEFAULT NULL,
  `insumos_ids` text,
  `sensores_ids` text,
  `fecha_de_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `inversion` decimal(10,2) DEFAULT NULL,
  `meta_ganancia` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `cultivo_id` (`cultivo_id`),
  KEY `ciclo_id` (`ciclo_id`),
  CONSTRAINT `producciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `producciones_ibfk_2` FOREIGN KEY (`cultivo_id`) REFERENCES `cultivos` (`id`) ON DELETE SET NULL,
  CONSTRAINT `producciones_ibfk_3` FOREIGN KEY (`ciclo_id`) REFERENCES `ciclo_cultivo` (`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_meta_ganancia` CHECK ((`meta_ganancia` >= `inversion`))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producciones`
--

LOCK TABLES `producciones` WRITE;
/*!40000 ALTER TABLE `producciones` DISABLE KEYS */;
INSERT INTO `producciones` VALUES (1,'Producción de Tomates 2025','Orgánica','tomate_produccion.jpg','Invernadero 1','Producción de tomates orgánicos',1,500.00,'habilitado','2025-04-22 17:40:51',1,1,'1,3','1,5',NULL,NULL,NULL,NULL),(2,'Producción de Maíz Verano','Tradicional','maiz_produccion.jpg','Campo 3','Producción de maíz para temporada de verano',3,1200.00,'habilitado','2025-04-22 17:40:51',3,2,'1,4,6','2,7',NULL,NULL,NULL,NULL),(3,'Producción de Fresas','Hidropónica','fresa_produccion.jpg','Invernadero 2','Producción de fresas en sistema hidropónico',8,300.00,'habilitado','2025-04-22 17:40:51',8,8,'2,5,7','3,8',NULL,NULL,NULL,NULL),(4,'Producción de Café Premium','Orgánica','cafe_produccion.jpg','Plantación 1','Producción de café de alta calidad',5,800.00,'habilitado','2025-04-22 17:40:51',5,5,'6,7','4,5',NULL,NULL,NULL,NULL),(5,'jordan','Tradicional','Untitled.jpg','ninguna','ninguna',1,1.00,'habilitado','2025-05-05 18:09:47',2,2,'1,4,5','3',NULL,NULL,NULL,NULL),(6,'jordan','Tradicional','produccion-default.jpg','ninguna','ninguna',1,1.00,'habilitado','2025-05-05 20:49:29',2,3,'1,4','2,4,3',NULL,NULL,NULL,NULL),(7,'jordan','Tradicional','produccion-default.jpg','ninguna','ninguna',2,1.00,'habilitado','2025-05-05 23:34:55',2,2,'2,5','3,6',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `producciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensores`
--

DROP TABLE IF EXISTS `sensores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sensores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_sensor` enum('Sensor de contacto','Sensor de distancia','Sensores de luz') NOT NULL,
  `nombre_sensor` varchar(100) NOT NULL,
  `unidad_medida` enum('Temperatura','Distancia','Presión') NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `descripcion` text NOT NULL,
  `tiempo_escaneo` enum('Sensores lentos','Sensores de velocidad media','Sensores rápidos') NOT NULL,
  `usuario_id` int DEFAULT NULL,
  `estado` enum('habilitado','deshabilitado') NOT NULL DEFAULT 'habilitado',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_sensor_usuario_id` (`usuario_id`),
  CONSTRAINT `fk_sensor_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `sensores_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensores`
--

LOCK TABLES `sensores` WRITE;
/*!40000 ALTER TABLE `sensores` DISABLE KEYS */;
INSERT INTO `sensores` VALUES (1,'Sensor de contacto','Sensor 1','Temperatura','sensor1.jpg','Sensor de temperatura de contacto','Sensores lentos',1,'habilitado','2025-04-22 17:40:51'),(2,'Sensor de distancia','Sensor 2','Distancia','sensor2.jpg','Sensor de distancia láser','Sensores rápidos',2,'habilitado','2025-04-22 17:40:51'),(3,'Sensores de luz','Sensor 3','Temperatura','sensor3.jpg','Sensor de intensidad lumínica','Sensores de velocidad media',3,'habilitado','2025-04-22 17:40:51'),(4,'Sensor de contacto','Sensor 4','Presión','sensor4.jpg','Sensor de presión atmosférica','Sensores rápidos',4,'habilitado','2025-04-22 17:40:51'),(5,'Sensor de contacto','Sensor 5','Presión','sensor5.jpg','Sensor de humedad del suelo','Sensores lentos',5,'habilitado','2025-04-22 17:40:51'),(6,'Sensor de contacto','Sensor 6','Temperatura','sensor6.jpg','Sensor de humedad ambiental','Sensores de velocidad media',6,'habilitado','2025-04-22 17:40:51'),(7,'Sensor de contacto','Sensor 7','Temperatura','sensor7.jpg','Sensor de temperatura infrarrojo','Sensores rápidos',7,'habilitado','2025-04-22 17:40:51'),(8,'Sensor de contacto','Sensor 8','Presión','sensor8.jpg','Sensor de pH del suelo','Sensores lentos',8,'habilitado','2025-04-22 17:40:51'),(9,'Sensor de contacto','cheche','Temperatura','sensor-default.jpg','ncsa','Sensores de velocidad media',1,'habilitado','2025-05-05 21:16:39');
/*!40000 ALTER TABLE `sensores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo_documento` enum('ti','cc','ppt','ce','pep') NOT NULL,
  `numero_documento` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `rol` enum('superadmin','admin','apoyo','visitante') NOT NULL,
  `estado` enum('habilitado','deshabilitado') NOT NULL DEFAULT 'habilitado',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_documento` (`numero_documento`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'cc','1234567890','Juan Perez','555-1234','juan.perez@example.com','admin','habilitado','2025-04-22 17:40:51'),(2,'ti','0987654321','Maria Gomez','555-5678','maria.gomez@example.com','visitante','habilitado','2025-04-22 17:40:51'),(3,'cc','1122334455','Carlos Ramirez','555-9876','carlos.ramirez@example.com','superadmin','habilitado','2025-04-22 17:40:51'),(4,'ti','2233445566','Ana Torres','555-8765','ana.torres@example.com','apoyo','habilitado','2025-04-22 17:40:51'),(5,'ppt','3344556677','Luis Martinez','555-7654','luis.martinez@example.com','admin','habilitado','2025-04-22 17:40:51'),(6,'cc','4455667788','Elena Suarez','555-6543','elena.suarez@example.com','visitante','habilitado','2025-04-22 17:40:51'),(7,'ti','5566778899','Pedro Lopez','555-5432','pedro.lopez@example.com','apoyo','habilitado','2025-04-22 17:40:51'),(8,'ppt','6677889900','Sofia Castro','555-4321','sofia.castro@example.com','superadmin','habilitado','2025-04-22 17:40:51'),(9,'cc','1137059587','jordan valencia patiño','3011186124','jordanvalenciap@gmail.com','admin','habilitado','2025-05-05 21:13:46');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-05 19:53:13
