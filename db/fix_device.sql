-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: fix_device
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `devices` (
  `deviceId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(500) NOT NULL,
  `duration` int NOT NULL,
  PRIMARY KEY (`deviceId`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` VALUES (1,'test','test test',15),(2,'testing','test testing',100),(3,'okay','test ปัญหาที่เกิดขึ่้น',30),(4,'problem','A',20),(5,'a','B',40),(6,'b','B',40),(7,'d','D',30),(8,'operation failure','os failure',100),(9,'tool problem','E',60),(10,'nothing','F',10);
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fixes`
--

DROP TABLE IF EXISTS `fixes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fixes` (
  `fixId` int NOT NULL AUTO_INCREMENT,
  `deviceId` int NOT NULL,
  `userId` int NOT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`deviceId`,`userId`),
  UNIQUE KEY `fixId_UNIQUE` (`fixId`),
  KEY `fk_Fix_User1_idx` (`userId`),
  CONSTRAINT `fk_Fix_Device1` FOREIGN KEY (`deviceId`) REFERENCES `devices` (`deviceId`),
  CONSTRAINT `fk_Fix_User1` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fixes`
--

LOCK TABLES `fixes` WRITE;
/*!40000 ALTER TABLE `fixes` DISABLE KEYS */;
INSERT INTO `fixes` VALUES (2,1,4,1500.00),(3,2,4,500.00),(4,3,1,1000.00),(5,3,4,2000.00),(7,7,4,1500.00),(8,8,4,1500.00),(9,9,4,1500.00);
/*!40000 ALTER TABLE `fixes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `userName` varchar(50) NOT NULL,
  `userEmail` varchar(100) NOT NULL,
  `password` varchar(16) NOT NULL,
  `role` varchar(5) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `userEmail_UNIQUE` (`userEmail`),
  UNIQUE KEY `userName_UNIQUE` (`userName`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'user','test@example.com','user1234','user','2023-01-22 11:40:19','2023-01-22 11:42:12'),(3,'admin','admin@example.com','admin1234','admin','2023-01-22 11:41:04','2023-01-22 11:41:04'),(4,'user1','test1@example.com','abcd1234','user','2023-01-22 11:42:32','2023-01-22 11:42:32'),(6,'Test2','Test22@example.com','Test1234','admin','2023-01-22 14:12:46','2023-01-22 15:07:14'),(12,'Sfafsf','Test2@example.com','Test1234','admin','2023-01-22 15:01:39','2023-01-22 15:01:39'),(13,'Hello','hello@mail.com','hello123','user','2023-01-28 12:57:11','2023-01-28 12:57:11');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-01-28 14:42:01
