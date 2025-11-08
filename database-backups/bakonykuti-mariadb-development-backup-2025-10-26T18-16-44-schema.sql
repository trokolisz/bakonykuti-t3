-- Enhanced Database Backup
-- Database: bakonykuti-mariadb
-- Environment: development
-- Type: schema
-- Generated: 2025-10-26T18:16:44.372Z
-- Host: localhost:3306

DROP DATABASE IF EXISTS `bakonykuti-mariadb`;
CREATE DATABASE IF NOT EXISTS `bakonykuti-mariadb`;
USE `bakonykuti-mariadb`;

-- Table: __drizzle_migrations
DROP TABLE IF EXISTS `__drizzle_migrations`;
CREATE TABLE `__drizzle_migrations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `hash` text NOT NULL,
  `created_at` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Table: bakonykuti-t3_account
DROP TABLE IF EXISTS `bakonykuti-t3_account`;
CREATE TABLE `bakonykuti-t3_account` (
  `userId` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `providerAccountId` varchar(255) NOT NULL,
  `refresh_token` text DEFAULT NULL,
  `access_token` text DEFAULT NULL,
  `expires_at` int(11) DEFAULT NULL,
  `token_type` varchar(255) DEFAULT NULL,
  `scope` varchar(255) DEFAULT NULL,
  `id_token` text DEFAULT NULL,
  `session_state` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`provider`,`providerAccountId`),
  KEY `account_userId_idx` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Table: bakonykuti-t3_document
DROP TABLE IF EXISTS `bakonykuti-t3_document`;
CREATE TABLE `bakonykuti-t3_document` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(256) NOT NULL,
  `category` varchar(256) NOT NULL,
  `date` timestamp NOT NULL,
  `file_url` varchar(1024) NOT NULL,
  `file_size` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Table: bakonykuti-t3_event
DROP TABLE IF EXISTS `bakonykuti-t3_event`;
CREATE TABLE `bakonykuti-t3_event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(256) NOT NULL,
  `thumbnail` varchar(2056) NOT NULL,
  `content` text DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` varchar(256) NOT NULL DEFAULT 'community',
  `created_by` varchar(256) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Table: bakonykuti-t3_file
DROP TABLE IF EXISTS `bakonykuti-t3_file`;
CREATE TABLE `bakonykuti-t3_file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `original_name` varchar(512) NOT NULL,
  `filename` varchar(512) NOT NULL,
  `file_path` varchar(1024) NOT NULL,
  `public_url` varchar(1024) NOT NULL,
  `mime_type` varchar(128) NOT NULL,
  `file_size` int(11) NOT NULL,
  `upload_type` varchar(64) NOT NULL,
  `uploaded_by` varchar(255) DEFAULT NULL,
  `associated_entity` varchar(64) DEFAULT NULL,
  `associated_entity_id` int(11) DEFAULT NULL,
  `is_orphaned` tinyint(1) NOT NULL DEFAULT 0,
  `last_accessed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `file_path_idx` (`file_path`(768)),
  KEY `upload_type_idx` (`upload_type`),
  KEY `uploaded_by_idx` (`uploaded_by`),
  KEY `associated_entity_idx` (`associated_entity`,`associated_entity_id`),
  KEY `orphaned_idx` (`is_orphaned`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Table: bakonykuti-t3_image
DROP TABLE IF EXISTS `bakonykuti-t3_image`;
CREATE TABLE `bakonykuti-t3_image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(1024) NOT NULL,
  `title` varchar(256) NOT NULL DEFAULT '',
  `carousel` tinyint(1) NOT NULL DEFAULT 0,
  `gallery` tinyint(1) NOT NULL DEFAULT 1,
  `image_size` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `visible` tinyint(1) NOT NULL DEFAULT 1,
  `local_path` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Table: bakonykuti-t3_news
DROP TABLE IF EXISTS `bakonykuti-t3_news`;
CREATE TABLE `bakonykuti-t3_news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(256) NOT NULL,
  `thumbnail` varchar(2056) NOT NULL,
  `content` text DEFAULT NULL,
  `creator_name` varchar(256) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Table: bakonykuti-t3_page
DROP TABLE IF EXISTS `bakonykuti-t3_page`;
CREATE TABLE `bakonykuti-t3_page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(256) NOT NULL,
  `content` text NOT NULL,
  `slug` varchar(256) NOT NULL,
  `last_modified` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Table: bakonykuti-t3_session
DROP TABLE IF EXISTS `bakonykuti-t3_session`;
CREATE TABLE `bakonykuti-t3_session` (
  `sessionToken` varchar(255) NOT NULL,
  `userId` varchar(255) NOT NULL,
  `expires` timestamp NOT NULL,
  PRIMARY KEY (`sessionToken`),
  KEY `session_userId_idx` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Table: bakonykuti-t3_user
DROP TABLE IF EXISTS `bakonykuti-t3_user`;
CREATE TABLE `bakonykuti-t3_user` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `emailVerified` timestamp NULL DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Table: bakonykuti-t3_verificationToken
DROP TABLE IF EXISTS `bakonykuti-t3_verificationToken`;
CREATE TABLE `bakonykuti-t3_verificationToken` (
  `identifier` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires` timestamp NOT NULL,
  PRIMARY KEY (`identifier`,`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

