-- Database Backup: bakonykuti-mariadb
-- Generated: 2025-10-01T15:46:31.813Z
-- Host: localhost:3306

DROP DATABASE IF EXISTS `bakonykuti-mariadb`;
CREATE DATABASE `bakonykuti-mariadb`;
USE `bakonykuti-mariadb`;

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

-- Data for table: bakonykuti-t3_document
INSERT INTO `bakonykuti-t3_document` (`id`, `title`, `category`, `date`, `file_url`, `file_size`) VALUES
(1, 'Álláshirdetés', 'Nyomtatvanyok', '2025-02-18 15:02:00', 'https://utfs.io/f/26L8Sk7UnuECwclnBlSheWP5jZyfGnp24M8Jrbm0t9vNAFka', '281659'),
(3, 'Képviselő testületi meghívó', 'Jegyzokonyvek', '2025-02-18 15:07:00', 'https://utfs.io/f/26L8Sk7UnuECfTzii6Hu3aru6LDUb0V8oGMOFt5cR72B1Qkq', '223325'),
(4, 'Álláshirdetés', 'Nyomtatvanyok', '2025-02-18 15:02:00', 'https://utfs.io/f/26L8Sk7UnuECwclnBlSheWP5jZyfGnp24M8Jrbm0t9vNAFka', '281659');

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

-- Data for table: bakonykuti-t3_event
INSERT INTO `bakonykuti-t3_event` (`id`, `title`, `thumbnail`, `content`, `date`, `type`, `created_by`, `created_at`) VALUES
(4, 'Vándortábor', 'https://utfs.io/f/26L8Sk7UnuECq2pOFiNJCQ9AGHKREYlXvOxeBMSyhi8IWTnu', '## Vándortáborok 

*Fedezz fel! Vezess! Inspirálj!*
## 
Nyáron kilencedik alkalommal indulnak útnak az egyhetes vándortáborok, melyekre január 30-tól lehet jelentkezni.
## 
Ennek érdekében szeretnénk felhívni a figyelmét egy kiváló ár-érték arányú táborozási lehetőségre, a Vándortábor Programra, melyekhez kedvező feltételeket kínálunk:
## 
A részvételi díj az utazási költséget kivéve mindent tartalmaz. A táborozók 49 000 forintért kapnak szállást, étkezést és programokat a 7 napos turnusokon.
## 
A csoportvezető pedagógusok a vándortáboros csoportvezetésért bruttó 150 000 forint díjazásban részesülnek. 
## 
A hátrányos helyzetû és a halmozottan hátrányos helyzetű gyerekek 50%-os kedvezménnyel vehetnek részt a táborokban, nekik a részvételi díj 24 500 forint.
## 
A pedagógusok és a kísérők 20 000 forintért végezhetik el a 30 órás akkreditált gyalogos, vízi vagy kerékpáros vándortábor-vezető képzést.
## 
A jelentkezés január 30. (csütörtök) 20:00-kor indul, a felhívás a szervezetek honlapjain érhetõ el:
## 
**[ErdeiVándor](https://www.erdeivandor.hu/jelentkezesi-felhivas/), [BringásVándor](https://www.bringasvandor.hu/bringasvandor/#jelentkezesi-felhivas), [VíziVándor](https://vizivandor.hu/palyazati-kiiras/), [Zarándoktábor](https://zarandoktabor.hu/jelentkezesi-felhivas)**
## 
Bõvebb információért látogasson el a honlapra: https://vandortabor.hu/

Vándotábor bemutató  [ITT](http://www.bakonykuti.hu/Hirdet/Vandortabor2025.pdf)', '2025-01-30 10:35:00', 'community', 'agota', '2025-01-24 15:37:30'),
(5, 'Batyus Farsang Bakonykútiban ', 'https://qh0hg1d52r.ufs.sh/f/26L8Sk7UnuECLskRArKbp6Sh14YX5LERKwtFsGya3UVgiH8Q', '## Batyus farsang Bakonykútiban idén is! 2025 február 22!

További részletek Bakonykúti Facebook oldalán. 
PDF: https://utfs.io/f/26L8Sk7UnuECiSMwjuCUKNa8DGOI0cYgHqmAjwClyd9ML7sr', '2025-02-22 15:00:00', 'community', 'agota', '2025-02-07 14:36:30'),
(7, 'A földönkívüli élet lehetősége a Naprendszerben és azon túl', 'https://utfs.io/f/26L8Sk7UnuEC3AgeVtGVEstpDrH4YmojWGN9uMyOIeCwJlKn', '## Talabér Gergely amatőrcsillagász előadása a BAKONYKÚTI KÖZÖSSÉGI HÁZBAN
További információ: https://utfs.io/f/26L8Sk7UnuECCJaSKDoD3h5BTWPtNcop4XHGVmvlbLQxAy71

Mindenkit szeretettel várunk!', '2025-03-27 08:57:00', 'community', 'agota', '2025-03-06 07:58:13'),
(8, 'Március 15. - Ünnepi megemlékezés', 'https://utfs.io/f/26L8Sk7UnuECM4JateSfVkXvqlZ4gba0UNI8zsDYxnhyrG2d', '
## 2025.03.15-én szombaton 9 és 11 óra között a Bakonykúti Közösségi Ház kávézóként üzemel.
## 
Ünnepi megemlékezésünkre mindenkit szeretettel várunk!
Bakonykúti Község Önkormányzata 
', '2025-03-15 07:00:00', 'community', 'agota', '2025-03-06 08:11:33'),
(9, 'Könyvjelző márciusban', 'https://utfs.io/f/26L8Sk7UnuEC1G9RUR789QX6bm0v4B8adyiMJAnfwWCDKkVO', '## Ahogyan minden hónapban, márciusban is szeretettel várnak a könyvbarátok minden érdeklődőt a bakonykúti könyvklubon, a Könyvjelzőn!
', '2025-03-13 15:00:00', 'community', 'agota', '2025-03-06 08:39:37');

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

-- Data for table: bakonykuti-t3_file
INSERT INTO `bakonykuti-t3_file` (`id`, `original_name`, `filename`, `file_path`, `public_url`, `mime_type`, `file_size`, `upload_type`, `uploaded_by`, `associated_entity`, `associated_entity_id`, `is_orphaned`, `last_accessed_at`, `created_at`, `updated_at`) VALUES
(1, 'Játszótér', '26L8Sk7UnuECn1bcfKypuwvx56J1US2AQWgyPYTDO7XGiend', 'public/https://utfs.io/f/26L8Sk7UnuECn1bcfKypuwvx56J1US2AQWgyPYTDO7XGiend', 'https://utfs.io/f/26L8Sk7UnuECn1bcfKypuwvx56J1US2AQWgyPYTDO7XGiend', 'application/octet-stream', 416300, 'gallery', NULL, 'image', 1, 1, NULL, '2024-12-06 17:14:05', '2025-01-18 14:08:26'),
(2, 'Játszótér2', '26L8Sk7UnuECw9AGByheWP5jZyfGnp24M8Jrbm0t9vNAFkaB', 'public/https://utfs.io/f/26L8Sk7UnuECw9AGByheWP5jZyfGnp24M8Jrbm0t9vNAFkaB', 'https://utfs.io/f/26L8Sk7UnuECw9AGByheWP5jZyfGnp24M8Jrbm0t9vNAFkaB', 'application/octet-stream', 0, 'gallery', NULL, 'image', 2, 1, NULL, '2024-12-06 17:14:05', '2025-06-14 07:55:14'),
(3, 'Polgármesteri hivatal', '26L8Sk7UnuECIaccBCbF3U6xf5SojbkZpQ2y7DV0lPOWMeCB', 'public/https://utfs.io/f/26L8Sk7UnuECIaccBCbF3U6xf5SojbkZpQ2y7DV0lPOWMeCB', 'https://utfs.io/f/26L8Sk7UnuECIaccBCbF3U6xf5SojbkZpQ2y7DV0lPOWMeCB', 'application/octet-stream', 0, 'gallery', NULL, 'image', 3, 1, NULL, '2024-12-06 17:14:05', '2025-01-11 09:54:38'),
(4, 'Baglyas', '26L8Sk7UnuECSheGIErBJwXMmcgpOnyY6qTPFChLG0Sl2ukN', 'public/https://utfs.io/f/26L8Sk7UnuECSheGIErBJwXMmcgpOnyY6qTPFChLG0Sl2ukN', 'https://utfs.io/f/26L8Sk7UnuECSheGIErBJwXMmcgpOnyY6qTPFChLG0Sl2ukN', 'application/octet-stream', 0, 'gallery', NULL, 'image', 5, 1, NULL, '2024-12-28 09:52:06', '2025-01-11 09:54:38'),
(5, 'Ady utca', '26L8Sk7UnuECXtmPDGcZENFc91oCB07LqidpvXmUWH4VeMwx', 'public/https://utfs.io/f/26L8Sk7UnuECXtmPDGcZENFc91oCB07LqidpvXmUWH4VeMwx', 'https://utfs.io/f/26L8Sk7UnuECXtmPDGcZENFc91oCB07LqidpvXmUWH4VeMwx', 'application/octet-stream', 0, 'gallery', NULL, 'image', 7, 1, NULL, '2024-12-30 16:34:50', '2025-01-18 15:28:56'),
(6, 'Honvedseg.jpg', '26L8Sk7UnuECwcWT6w9heWP5jZyfGnp24M8Jrbm0t9vNAFka', 'public/https://utfs.io/f/26L8Sk7UnuECwcWT6w9heWP5jZyfGnp24M8Jrbm0t9vNAFka', 'https://utfs.io/f/26L8Sk7UnuECwcWT6w9heWP5jZyfGnp24M8Jrbm0t9vNAFka', 'application/octet-stream', 0, 'gallery', NULL, 'image', 9, 1, NULL, '2025-01-01 14:58:44', '2025-01-11 09:54:38'),
(7, 'Bakonykuti_1424-2000.jpg', '26L8Sk7UnuECdDrxrx1Uhew93I0vo8azHPAfDN5B2qQFlKmt', 'public/https://utfs.io/f/26L8Sk7UnuECdDrxrx1Uhew93I0vo8azHPAfDN5B2qQFlKmt', 'https://utfs.io/f/26L8Sk7UnuECdDrxrx1Uhew93I0vo8azHPAfDN5B2qQFlKmt', 'application/octet-stream', 0, 'gallery', NULL, 'image', 14, 1, NULL, '2025-01-01 15:37:40', '2025-01-11 09:54:38'),
(8, 'Őzláb gomba', '26L8Sk7UnuECEXNJlBeDfCRWZAPiqY1BUG5V8Mz3t920HXwj', 'public/https://utfs.io/f/26L8Sk7UnuECEXNJlBeDfCRWZAPiqY1BUG5V8Mz3t920HXwj', 'https://utfs.io/f/26L8Sk7UnuECEXNJlBeDfCRWZAPiqY1BUG5V8Mz3t920HXwj', 'application/octet-stream', 181397, 'gallery', NULL, 'image', 20, 1, NULL, '2025-01-20 18:33:05', '2025-01-30 07:56:57'),
(9, 'Tavasz', '26L8Sk7UnuECj8eYgFvdVTPH1f4QNIYeZOKG0nqzEAJr6FLg', 'public/https://utfs.io/f/26L8Sk7UnuECj8eYgFvdVTPH1f4QNIYeZOKG0nqzEAJr6FLg', 'https://utfs.io/f/26L8Sk7UnuECj8eYgFvdVTPH1f4QNIYeZOKG0nqzEAJr6FLg', 'application/octet-stream', 0, 'gallery', NULL, 'image', 22, 1, NULL, '2025-01-21 08:07:55', '2025-01-30 07:56:42'),
(10, '26L8Sk7UnuEC3LDtQ4GVEstpDrH4YmojWGN9uMyOIeCwJlKn.jpg', '26L8Sk7UnuECreJYxZbVX5JwIdfPKubn4WEsNUiZezhFy3OY', 'public/https://utfs.io/f/26L8Sk7UnuECreJYxZbVX5JwIdfPKubn4WEsNUiZezhFy3OY', 'https://utfs.io/f/26L8Sk7UnuECreJYxZbVX5JwIdfPKubn4WEsNUiZezhFy3OY', 'application/octet-stream', 181397, 'gallery', NULL, 'image', 24, 1, NULL, '2025-01-22 20:10:54', '2025-01-22 20:10:54'),
(11, '1_kep.jpg', '26L8Sk7UnuECsKKSMqzBglwcTmdj90FZsYR7yQuMS3OeJ4B1', 'public/https://utfs.io/f/26L8Sk7UnuECsKKSMqzBglwcTmdj90FZsYR7yQuMS3OeJ4B1', 'https://utfs.io/f/26L8Sk7UnuECsKKSMqzBglwcTmdj90FZsYR7yQuMS3OeJ4B1', 'application/octet-stream', 0, 'gallery', NULL, 'image', 35, 1, NULL, '2025-01-24 15:49:12', '2025-01-24 16:04:50'),
(12, '2_kep.jpg', '26L8Sk7UnuECufbHLszmDBpZYSAVG1czbfeQOu9yK3WLdFln', 'public/https://utfs.io/f/26L8Sk7UnuECufbHLszmDBpZYSAVG1czbfeQOu9yK3WLdFln', 'https://utfs.io/f/26L8Sk7UnuECufbHLszmDBpZYSAVG1czbfeQOu9yK3WLdFln', 'application/octet-stream', 0, 'gallery', NULL, 'image', 36, 1, NULL, '2025-01-24 16:05:10', '2025-01-24 16:09:33'),
(13, '3a_kep.jpg', '26L8Sk7UnuECYBe5Hqn5diVuyFRbKC6l9PrQOtLBvmwhEopq', 'public/https://utfs.io/f/26L8Sk7UnuECYBe5Hqn5diVuyFRbKC6l9PrQOtLBvmwhEopq', 'https://utfs.io/f/26L8Sk7UnuECYBe5Hqn5diVuyFRbKC6l9PrQOtLBvmwhEopq', 'application/octet-stream', 0, 'gallery', NULL, 'image', 38, 1, NULL, '2025-01-30 07:43:56', '2025-01-30 07:46:59'),
(14, '4a_kep.JPG', '26L8Sk7UnuECSkosUXrBJwXMmcgpOnyY6qTPFChLG0Sl2ukN', 'public/https://utfs.io/f/26L8Sk7UnuECSkosUXrBJwXMmcgpOnyY6qTPFChLG0Sl2ukN', 'https://utfs.io/f/26L8Sk7UnuECSkosUXrBJwXMmcgpOnyY6qTPFChLG0Sl2ukN', 'application/octet-stream', 0, 'gallery', NULL, 'image', 39, 1, NULL, '2025-01-30 07:48:02', '2025-01-30 07:52:53'),
(15, '5a_kep.JPG', '26L8Sk7UnuEC23QYSOUnuECB16T3NaRGHbkgyItv9Smfci0q', 'public/https://utfs.io/f/26L8Sk7UnuEC23QYSOUnuECB16T3NaRGHbkgyItv9Smfci0q', 'https://utfs.io/f/26L8Sk7UnuEC23QYSOUnuECB16T3NaRGHbkgyItv9Smfci0q', 'application/octet-stream', 0, 'gallery', NULL, 'image', 40, 1, NULL, '2025-01-30 07:49:06', '2025-01-30 07:52:54'),
(16, '2025_02_22_Farsang plakát2.jpg', '26L8Sk7UnuECjq1lG6dVTPH1f4QNIYeZOKG0nqzEAJr6FLgy', 'public/https://utfs.io/f/26L8Sk7UnuECjq1lG6dVTPH1f4QNIYeZOKG0nqzEAJr6FLgy', 'https://utfs.io/f/26L8Sk7UnuECjq1lG6dVTPH1f4QNIYeZOKG0nqzEAJr6FLgy', 'application/octet-stream', 4146191, 'gallery', NULL, 'image', 41, 1, NULL, '2025-02-07 14:36:01', '2025-02-07 14:36:01'),
(17, '2025_02_22_Farsang plakát2.jpg', '26L8Sk7UnuECSBdC20rBJwXMmcgpOnyY6qTPFChLG0Sl2ukN', 'public/https://utfs.io/f/26L8Sk7UnuECSBdC20rBJwXMmcgpOnyY6qTPFChLG0Sl2ukN', 'https://utfs.io/f/26L8Sk7UnuECSBdC20rBJwXMmcgpOnyY6qTPFChLG0Sl2ukN', 'application/octet-stream', 4146191, 'gallery', NULL, 'image', 42, 1, NULL, '2025-02-08 08:09:49', '2025-02-08 08:09:49'),
(18, '2025_02_22_Farsang plakát2.jpg', '26L8Sk7UnuECLskRArKbp6Sh14YX5LERKwtFsGya3UVgiH8Q', 'public/https://utfs.io/f/26L8Sk7UnuECLskRArKbp6Sh14YX5LERKwtFsGya3UVgiH8Q', 'https://utfs.io/f/26L8Sk7UnuECLskRArKbp6Sh14YX5LERKwtFsGya3UVgiH8Q', 'application/octet-stream', 4146191, 'gallery', NULL, 'image', 43, 1, NULL, '2025-02-08 08:10:07', '2025-02-08 08:10:07'),
(19, 'kki_logo.png', '26L8Sk7UnuECXYNUyicZENFc91oCB07LqidpvXmUWH4VeMwx', 'public/https://utfs.io/f/26L8Sk7UnuECXYNUyicZENFc91oCB07LqidpvXmUWH4VeMwx', 'https://utfs.io/f/26L8Sk7UnuECXYNUyicZENFc91oCB07LqidpvXmUWH4VeMwx', 'application/octet-stream', 39712, 'gallery', NULL, 'image', 44, 1, NULL, '2025-02-18 13:58:10', '2025-02-18 13:58:10'),
(20, 'kki_logo.png', '26L8Sk7UnuECbdeKZYOWbPq5eHr31oBZJLQdxS6Gvi8k2mFj', 'public/https://utfs.io/f/26L8Sk7UnuECbdeKZYOWbPq5eHr31oBZJLQdxS6Gvi8k2mFj', 'https://utfs.io/f/26L8Sk7UnuECbdeKZYOWbPq5eHr31oBZJLQdxS6Gvi8k2mFj', 'application/octet-stream', 39712, 'gallery', NULL, 'image', 45, 1, NULL, '2025-02-18 13:59:35', '2025-02-18 13:59:35'),
(21, 'kki_logo.png', '26L8Sk7UnuECB6mwoILtiGAb1WuzdjMZ6rO9S2U8Ll3D75pI', 'public/https://utfs.io/f/26L8Sk7UnuECB6mwoILtiGAb1WuzdjMZ6rO9S2U8Ll3D75pI', 'https://utfs.io/f/26L8Sk7UnuECB6mwoILtiGAb1WuzdjMZ6rO9S2U8Ll3D75pI', 'application/octet-stream', 39712, 'gallery', NULL, 'image', 46, 1, NULL, '2025-02-18 14:00:00', '2025-02-18 14:00:00'),
(22, 'BKuti_cimer.jpg', '26L8Sk7UnuECKB4j75iwM9qkW1bhYdTcOEV5rUQnXmvG3JL7', 'public/https://utfs.io/f/26L8Sk7UnuECKB4j75iwM9qkW1bhYdTcOEV5rUQnXmvG3JL7', 'https://utfs.io/f/26L8Sk7UnuECKB4j75iwM9qkW1bhYdTcOEV5rUQnXmvG3JL7', 'application/octet-stream', 14982, 'gallery', NULL, 'image', 47, 1, NULL, '2025-02-18 14:04:43', '2025-02-18 14:04:43'),
(23, 'BKuti_cimer.jpg', '26L8Sk7UnuECkcbT70wPCJb48Ar2U9okYnfdSWvR5pDwstVe', 'public/https://utfs.io/f/26L8Sk7UnuECkcbT70wPCJb48Ar2U9okYnfdSWvR5pDwstVe', 'https://utfs.io/f/26L8Sk7UnuECkcbT70wPCJb48Ar2U9okYnfdSWvR5pDwstVe', 'application/octet-stream', 14982, 'gallery', NULL, 'image', 48, 1, NULL, '2025-02-18 14:08:08', '2025-02-18 14:08:08'),
(24, 'BKuti_cimer.jpg', '26L8Sk7UnuECoEXIdxAu3SMxWU2adZA8VJYKbfw6OtzGmPIQ', 'public/https://utfs.io/f/26L8Sk7UnuECoEXIdxAu3SMxWU2adZA8VJYKbfw6OtzGmPIQ', 'https://utfs.io/f/26L8Sk7UnuECoEXIdxAu3SMxWU2adZA8VJYKbfw6OtzGmPIQ', 'application/octet-stream', 14982, 'gallery', NULL, 'image', 49, 1, NULL, '2025-02-18 14:10:20', '2025-02-18 14:10:20'),
(25, 'BKuti_cimer.jpg', '26L8Sk7UnuECnHDiRUypuwvx56J1US2AQWgyPYTDO7XGiend', 'public/https://utfs.io/f/26L8Sk7UnuECnHDiRUypuwvx56J1US2AQWgyPYTDO7XGiend', 'https://utfs.io/f/26L8Sk7UnuECnHDiRUypuwvx56J1US2AQWgyPYTDO7XGiend', 'application/octet-stream', 14982, 'gallery', NULL, 'image', 50, 1, NULL, '2025-02-18 14:10:54', '2025-02-18 14:10:54'),
(26, 'Földönkívüli.jpg', '26L8Sk7UnuECcHNLIyMGlVyP5pWMY6DoSU8zQmEbCBJ0Nt2O', 'public/https://utfs.io/f/26L8Sk7UnuECcHNLIyMGlVyP5pWMY6DoSU8zQmEbCBJ0Nt2O', 'https://utfs.io/f/26L8Sk7UnuECcHNLIyMGlVyP5pWMY6DoSU8zQmEbCBJ0Nt2O', 'application/octet-stream', 0, 'gallery', NULL, 'image', 51, 1, NULL, '2025-03-06 07:49:11', '2025-03-06 15:03:10'),
(27, '26L8Sk7UnuECcHNLIyMGlVyP5pWMY6DoSU8zQmEbCBJ0Nt2O.webp', '26L8Sk7UnuECo5yHF8Au3SMxWU2adZA8VJYKbfw6OtzGmPIQ', 'public/https://utfs.io/f/26L8Sk7UnuECo5yHF8Au3SMxWU2adZA8VJYKbfw6OtzGmPIQ', 'https://utfs.io/f/26L8Sk7UnuECo5yHF8Au3SMxWU2adZA8VJYKbfw6OtzGmPIQ', 'application/octet-stream', 138360, 'gallery', NULL, 'image', 52, 1, NULL, '2025-03-06 07:55:06', '2025-03-06 07:55:06'),
(28, 'UFO.jpeg', '26L8Sk7UnuECXSrDiHqcZENFc91oCB07LqidpvXmUWH4VeMw', 'public/https://utfs.io/f/26L8Sk7UnuECXSrDiHqcZENFc91oCB07LqidpvXmUWH4VeMw', 'https://utfs.io/f/26L8Sk7UnuECXSrDiHqcZENFc91oCB07LqidpvXmUWH4VeMw', 'application/octet-stream', 221100, 'gallery', NULL, 'image', 53, 1, NULL, '2025-03-06 07:56:23', '2025-03-06 07:56:23'),
(29, 'UFO.jpg', '26L8Sk7UnuEC3AgeVtGVEstpDrH4YmojWGN9uMyOIeCwJlKn', 'public/https://utfs.io/f/26L8Sk7UnuEC3AgeVtGVEstpDrH4YmojWGN9uMyOIeCwJlKn', 'https://utfs.io/f/26L8Sk7UnuEC3AgeVtGVEstpDrH4YmojWGN9uMyOIeCwJlKn', 'application/octet-stream', 221424, 'gallery', NULL, 'image', 54, 1, NULL, '2025-03-06 07:57:27', '2025-03-06 07:57:27'),
(30, '2025_03_15_Pilvax Kávéház.jpg', '26L8Sk7UnuECM4JateSfVkXvqlZ4gba0UNI8zsDYxnhyrG2d', 'public/https://utfs.io/f/26L8Sk7UnuECM4JateSfVkXvqlZ4gba0UNI8zsDYxnhyrG2d', 'https://utfs.io/f/26L8Sk7UnuECM4JateSfVkXvqlZ4gba0UNI8zsDYxnhyrG2d', 'application/octet-stream', 123252, 'gallery', NULL, 'image', 55, 1, NULL, '2025-03-06 08:07:10', '2025-03-06 08:07:10'),
(31, '2025_03_15_Pilvax Kávéház.jpg', '26L8Sk7UnuECAQF3xuRG0hVAdNUJ9M2RYupFQZcsWLlTxwzk', 'public/https://utfs.io/f/26L8Sk7UnuECAQF3xuRG0hVAdNUJ9M2RYupFQZcsWLlTxwzk', 'https://utfs.io/f/26L8Sk7UnuECAQF3xuRG0hVAdNUJ9M2RYupFQZcsWLlTxwzk', 'application/octet-stream', 123252, 'gallery', NULL, 'image', 56, 1, NULL, '2025-03-06 08:28:43', '2025-03-06 08:28:43'),
(32, '2025_03_15_Pilvax Kávéház.jpg', '26L8Sk7UnuECI1Gr4vF3U6xf5SojbkZpQ2y7DV0lPOWMeCBq', 'public/https://utfs.io/f/26L8Sk7UnuECI1Gr4vF3U6xf5SojbkZpQ2y7DV0lPOWMeCBq', 'https://utfs.io/f/26L8Sk7UnuECI1Gr4vF3U6xf5SojbkZpQ2y7DV0lPOWMeCBq', 'application/octet-stream', 123252, 'gallery', NULL, 'image', 57, 1, NULL, '2025-03-06 08:29:25', '2025-03-06 08:29:25'),
(33, '2025_03_15_Pilvax Kávéház.jpg', '26L8Sk7UnuECj8lG98MdVTPH1f4QNIYeZOKG0nqzEAJr6FLg', 'public/https://utfs.io/f/26L8Sk7UnuECj8lG98MdVTPH1f4QNIYeZOKG0nqzEAJr6FLg', 'https://utfs.io/f/26L8Sk7UnuECj8lG98MdVTPH1f4QNIYeZOKG0nqzEAJr6FLg', 'application/octet-stream', 123252, 'gallery', NULL, 'image', 58, 1, NULL, '2025-03-06 08:32:25', '2025-03-06 08:32:25'),
(34, '2025_03_15_Pilvax Kávéház.jpg', '26L8Sk7UnuEC3sJg1vGVEstpDrH4YmojWGN9uMyOIeCwJlKn', 'public/https://utfs.io/f/26L8Sk7UnuEC3sJg1vGVEstpDrH4YmojWGN9uMyOIeCwJlKn', 'https://utfs.io/f/26L8Sk7UnuEC3sJg1vGVEstpDrH4YmojWGN9uMyOIeCwJlKn', 'application/octet-stream', 123252, 'gallery', NULL, 'image', 59, 1, NULL, '2025-03-06 08:34:08', '2025-03-06 08:34:08'),
(35, 'Könyvjelző.jpg', '26L8Sk7UnuEC1G9RUR789QX6bm0v4B8adyiMJAnfwWCDKkVO', 'public/https://utfs.io/f/26L8Sk7UnuEC1G9RUR789QX6bm0v4B8adyiMJAnfwWCDKkVO', 'https://utfs.io/f/26L8Sk7UnuEC1G9RUR789QX6bm0v4B8adyiMJAnfwWCDKkVO', 'application/octet-stream', 29184, 'gallery', NULL, 'image', 60, 1, NULL, '2025-03-06 08:38:19', '2025-03-06 08:38:19'),
(36, 'Könyvjelző.jpg', '26L8Sk7UnuECjy8y1adVTPH1f4QNIYeZOKG0nqzEAJr6FLgy', 'public/https://utfs.io/f/26L8Sk7UnuECjy8y1adVTPH1f4QNIYeZOKG0nqzEAJr6FLgy', 'https://utfs.io/f/26L8Sk7UnuECjy8y1adVTPH1f4QNIYeZOKG0nqzEAJr6FLgy', 'application/octet-stream', 29184, 'gallery', NULL, 'image', 61, 1, NULL, '2025-03-06 08:41:08', '2025-03-06 08:41:08'),
(37, 'Erdo.jpg', '26L8Sk7UnuECKd1xamiwM9qkW1bhYdTcOEV5rUQnXmvG3JL7', 'public/https://utfs.io/f/26L8Sk7UnuECKd1xamiwM9qkW1bhYdTcOEV5rUQnXmvG3JL7', 'https://utfs.io/f/26L8Sk7UnuECKd1xamiwM9qkW1bhYdTcOEV5rUQnXmvG3JL7', 'application/octet-stream', 730143, 'gallery', NULL, 'image', 62, 1, NULL, '2025-03-20 18:07:55', '2025-03-20 18:07:55'),
(38, 'Erdo.jpg', '26L8Sk7UnuECGPCCZIlRAoqETBFgX2U4fvkxMsYmrHbh51an', 'public/https://utfs.io/f/26L8Sk7UnuECGPCCZIlRAoqETBFgX2U4fvkxMsYmrHbh51an', 'https://utfs.io/f/26L8Sk7UnuECGPCCZIlRAoqETBFgX2U4fvkxMsYmrHbh51an', 'application/octet-stream', 730143, 'gallery', NULL, 'image', 63, 1, NULL, '2025-03-20 18:08:22', '2025-03-20 18:08:22'),
(39, '6_kep.jpg', '26L8Sk7UnuECnZ1llaypuwvx56J1US2AQWgyPYTDO7XGiend', 'public/https://utfs.io/f/26L8Sk7UnuECnZ1llaypuwvx56J1US2AQWgyPYTDO7XGiend', 'https://utfs.io/f/26L8Sk7UnuECnZ1llaypuwvx56J1US2AQWgyPYTDO7XGiend', 'application/octet-stream', 0, 'gallery', NULL, 'image', 64, 1, NULL, '2025-03-23 04:47:18', '2025-03-23 04:58:19'),
(40, '7_kep.jpg', '26L8Sk7UnuECpe74Ug60tYOVN4SgU2xuoem6swRjIQKAFZBL', 'public/https://utfs.io/f/26L8Sk7UnuECpe74Ug60tYOVN4SgU2xuoem6swRjIQKAFZBL', 'https://utfs.io/f/26L8Sk7UnuECpe74Ug60tYOVN4SgU2xuoem6swRjIQKAFZBL', 'application/octet-stream', 0, 'gallery', NULL, 'image', 65, 1, NULL, '2025-03-23 04:47:36', '2025-03-23 04:58:27'),
(41, '8_kep_1910-es_evek.jpg', '26L8Sk7UnuECnNakkPypuwvx56J1US2AQWgyPYTDO7XGiend', 'public/https://utfs.io/f/26L8Sk7UnuECnNakkPypuwvx56J1US2AQWgyPYTDO7XGiend', 'https://utfs.io/f/26L8Sk7UnuECnNakkPypuwvx56J1US2AQWgyPYTDO7XGiend', 'application/octet-stream', 0, 'gallery', NULL, 'image', 66, 1, NULL, '2025-03-23 04:47:45', '2025-03-23 04:58:24'),
(44, 'Artemis.png', 'Artemis_3d7f7929.png', 'public/uploads/gallery/Artemis_3d7f7929.png', '/uploads/gallery/Artemis_3d7f7929.png', 'image/png', 455781, 'gallery', NULL, 'image', 69, 0, NULL, '2025-09-08 13:24:24', '2025-09-08 13:24:24'),
(45, 'icon.png', 'icon_c3aefad3.png', 'public/uploads/gallery/icon_c3aefad3.png', '/uploads/gallery/icon_c3aefad3.png', 'image/png', 131215, 'gallery', NULL, 'image', 70, 0, NULL, '2025-09-08 13:25:40', '2025-09-08 13:25:40'),
(47, 'Álláshirdetés', '26L8Sk7UnuECwclnBlSheWP5jZyfGnp24M8Jrbm0t9vNAFka', 'public/https://utfs.io/f/26L8Sk7UnuECwclnBlSheWP5jZyfGnp24M8Jrbm0t9vNAFka', 'https://utfs.io/f/26L8Sk7UnuECwclnBlSheWP5jZyfGnp24M8Jrbm0t9vNAFka', 'application/octet-stream', 0, 'documents', NULL, 'document', 1, 1, NULL, '2025-02-18 15:02:00', '2025-02-18 15:02:00'),
(48, 'Képviselő testületi meghívó', '26L8Sk7UnuECfTzii6Hu3aru6LDUb0V8oGMOFt5cR72B1Qkq', 'public/https://utfs.io/f/26L8Sk7UnuECfTzii6Hu3aru6LDUb0V8oGMOFt5cR72B1Qkq', 'https://utfs.io/f/26L8Sk7UnuECfTzii6Hu3aru6LDUb0V8oGMOFt5cR72B1Qkq', 'application/octet-stream', 0, 'documents', NULL, 'document', 3, 1, NULL, '2025-02-18 15:07:00', '2025-02-18 15:07:00'),
(49, 'Álláshirdetés', '26L8Sk7UnuECwclnBlSheWP5jZyfGnp24M8Jrbm0t9vNAFka', 'public/https://utfs.io/f/26L8Sk7UnuECwclnBlSheWP5jZyfGnp24M8Jrbm0t9vNAFka', 'https://utfs.io/f/26L8Sk7UnuECwclnBlSheWP5jZyfGnp24M8Jrbm0t9vNAFka', 'application/octet-stream', 0, 'documents', NULL, 'document', 4, 1, NULL, '2025-02-18 15:02:00', '2025-02-18 15:02:00'),
(52, 'Eboltás.jpg', '26L8Sk7UnuECh2bJf6X2NFjoegCyrV3qp4LH1DuZtd5nIKsc', 'public/https://utfs.io/f/26L8Sk7UnuECh2bJf6X2NFjoegCyrV3qp4LH1DuZtd5nIKsc', 'https://utfs.io/f/26L8Sk7UnuECh2bJf6X2NFjoegCyrV3qp4LH1DuZtd5nIKsc', 'application/octet-stream', 0, 'gallery', NULL, 'image', 67, 1, NULL, '2025-04-16 14:07:40', '2025-04-16 14:09:13'),
(53, 'Eboltás.jpg', '26L8Sk7UnuECIaXv38vF3U6xf5SojbkZpQ2y7DV0lPOWMeCB', 'public/https://utfs.io/f/26L8Sk7UnuECIaXv38vF3U6xf5SojbkZpQ2y7DV0lPOWMeCB', 'https://utfs.io/f/26L8Sk7UnuECIaXv38vF3U6xf5SojbkZpQ2y7DV0lPOWMeCB', 'application/octet-stream', 450167, 'gallery', NULL, 'image', 68, 1, NULL, '2025-04-16 14:08:50', '2025-06-14 07:54:25'),
(54, 'Artemis.png', 'Artemis_f57d6924.png', 'public/uploads/gallery/Artemis_f57d6924.png', '/uploads/gallery/Artemis_f57d6924.png', 'image/png', 455781, 'gallery', NULL, 'image', 71, 1, NULL, '2025-09-08 14:15:19', '2025-09-08 14:15:19');

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

-- Data for table: bakonykuti-t3_image
INSERT INTO `bakonykuti-t3_image` (`id`, `url`, `title`, `carousel`, `gallery`, `image_size`, `created_at`, `updated_at`, `visible`, `local_path`) VALUES
(1, 'https://utfs.io/f/26L8Sk7UnuECn1bcfKypuwvx56J1US2AQWgyPYTDO7XGiend', 'Játszótér', 1, 1, 416300, '2024-12-06 17:14:05', '2025-01-18 14:08:26', 1, NULL),
(2, 'https://utfs.io/f/26L8Sk7UnuECw9AGByheWP5jZyfGnp24M8Jrbm0t9vNAFkaB', 'Játszótér2', 1, 1, 0, '2024-12-06 17:14:05', '2025-06-14 07:55:14', 1, NULL),
(3, 'https://utfs.io/f/26L8Sk7UnuECIaccBCbF3U6xf5SojbkZpQ2y7DV0lPOWMeCB', 'Polgármesteri hivatal', 1, 1, 0, '2024-12-06 17:14:05', '2025-01-11 09:54:38', 1, NULL),
(5, 'https://utfs.io/f/26L8Sk7UnuECSheGIErBJwXMmcgpOnyY6qTPFChLG0Sl2ukN', 'Baglyas', 0, 1, 0, '2024-12-28 09:52:06', '2025-01-11 09:54:38', 1, NULL),
(7, 'https://utfs.io/f/26L8Sk7UnuECXtmPDGcZENFc91oCB07LqidpvXmUWH4VeMwx', 'Ady utca', 0, 1, 0, '2024-12-30 16:34:50', '2025-01-18 15:28:56', 1, NULL),
(9, 'https://utfs.io/f/26L8Sk7UnuECwcWT6w9heWP5jZyfGnp24M8Jrbm0t9vNAFka', 'Honvedseg.jpg', 0, 0, 0, '2025-01-01 14:58:44', '2025-01-11 09:54:38', 1, NULL),
(14, 'https://utfs.io/f/26L8Sk7UnuECdDrxrx1Uhew93I0vo8azHPAfDN5B2qQFlKmt', 'Bakonykuti_1424-2000.jpg', 0, 0, 0, '2025-01-01 15:37:40', '2025-01-11 09:54:38', 1, NULL),
(20, 'https://utfs.io/f/26L8Sk7UnuECEXNJlBeDfCRWZAPiqY1BUG5V8Mz3t920HXwj', 'Őzláb gomba', 0, 0, 181397, '2025-01-20 18:33:05', '2025-01-30 07:56:57', 1, NULL),
(22, 'https://utfs.io/f/26L8Sk7UnuECj8eYgFvdVTPH1f4QNIYeZOKG0nqzEAJr6FLg', 'Tavasz', 0, 1, 0, '2025-01-21 08:07:55', '2025-01-30 07:56:42', 1, NULL),
(24, 'https://utfs.io/f/26L8Sk7UnuECreJYxZbVX5JwIdfPKubn4WEsNUiZezhFy3OY', '26L8Sk7UnuEC3LDtQ4GVEstpDrH4YmojWGN9uMyOIeCwJlKn.jpg', 0, 0, 181397, '2025-01-22 20:10:54', '2025-01-22 20:10:54', 1, NULL),
(35, 'https://utfs.io/f/26L8Sk7UnuECsKKSMqzBglwcTmdj90FZsYR7yQuMS3OeJ4B1', '1_kep.jpg', 0, 0, 0, '2025-01-24 15:49:12', '2025-01-24 16:04:50', 1, NULL),
(36, 'https://utfs.io/f/26L8Sk7UnuECufbHLszmDBpZYSAVG1czbfeQOu9yK3WLdFln', '2_kep.jpg', 0, 0, 0, '2025-01-24 16:05:10', '2025-01-24 16:09:33', 1, NULL),
(38, 'https://utfs.io/f/26L8Sk7UnuECYBe5Hqn5diVuyFRbKC6l9PrQOtLBvmwhEopq', '3a_kep.jpg', 0, 0, 0, '2025-01-30 07:43:56', '2025-01-30 07:46:59', 1, NULL),
(39, 'https://utfs.io/f/26L8Sk7UnuECSkosUXrBJwXMmcgpOnyY6qTPFChLG0Sl2ukN', '4a_kep.JPG', 0, 0, 0, '2025-01-30 07:48:02', '2025-01-30 07:52:53', 1, NULL),
(40, 'https://utfs.io/f/26L8Sk7UnuEC23QYSOUnuECB16T3NaRGHbkgyItv9Smfci0q', '5a_kep.JPG', 0, 0, 0, '2025-01-30 07:49:06', '2025-01-30 07:52:54', 1, NULL),
(41, 'https://utfs.io/f/26L8Sk7UnuECjq1lG6dVTPH1f4QNIYeZOKG0nqzEAJr6FLgy', '2025_02_22_Farsang plakát2.jpg', 0, 0, 4146191, '2025-02-07 14:36:01', '2025-02-07 14:36:01', 1, NULL),
(42, 'https://utfs.io/f/26L8Sk7UnuECSBdC20rBJwXMmcgpOnyY6qTPFChLG0Sl2ukN', '2025_02_22_Farsang plakát2.jpg', 0, 0, 4146191, '2025-02-08 08:09:49', '2025-02-08 08:09:49', 1, NULL),
(43, 'https://utfs.io/f/26L8Sk7UnuECLskRArKbp6Sh14YX5LERKwtFsGya3UVgiH8Q', '2025_02_22_Farsang plakát2.jpg', 0, 0, 4146191, '2025-02-08 08:10:07', '2025-02-08 08:10:07', 1, NULL),
(44, 'https://utfs.io/f/26L8Sk7UnuECXYNUyicZENFc91oCB07LqidpvXmUWH4VeMwx', 'kki_logo.png', 0, 0, 39712, '2025-02-18 13:58:10', '2025-02-18 13:58:10', 1, NULL),
(45, 'https://utfs.io/f/26L8Sk7UnuECbdeKZYOWbPq5eHr31oBZJLQdxS6Gvi8k2mFj', 'kki_logo.png', 0, 0, 39712, '2025-02-18 13:59:35', '2025-02-18 13:59:35', 1, NULL),
(46, 'https://utfs.io/f/26L8Sk7UnuECB6mwoILtiGAb1WuzdjMZ6rO9S2U8Ll3D75pI', 'kki_logo.png', 0, 0, 39712, '2025-02-18 14:00:00', '2025-02-18 14:00:00', 1, NULL),
(47, 'https://utfs.io/f/26L8Sk7UnuECKB4j75iwM9qkW1bhYdTcOEV5rUQnXmvG3JL7', 'BKuti_cimer.jpg', 0, 0, 14982, '2025-02-18 14:04:43', '2025-02-18 14:04:43', 1, NULL),
(48, 'https://utfs.io/f/26L8Sk7UnuECkcbT70wPCJb48Ar2U9okYnfdSWvR5pDwstVe', 'BKuti_cimer.jpg', 0, 0, 14982, '2025-02-18 14:08:08', '2025-02-18 14:08:08', 1, NULL),
(49, 'https://utfs.io/f/26L8Sk7UnuECoEXIdxAu3SMxWU2adZA8VJYKbfw6OtzGmPIQ', 'BKuti_cimer.jpg', 0, 0, 14982, '2025-02-18 14:10:20', '2025-02-18 14:10:20', 1, NULL),
(50, 'https://utfs.io/f/26L8Sk7UnuECnHDiRUypuwvx56J1US2AQWgyPYTDO7XGiend', 'BKuti_cimer.jpg', 0, 0, 14982, '2025-02-18 14:10:54', '2025-02-18 14:10:54', 1, NULL),
(51, 'https://utfs.io/f/26L8Sk7UnuECcHNLIyMGlVyP5pWMY6DoSU8zQmEbCBJ0Nt2O', 'Földönkívüli.jpg', 0, 0, 0, '2025-03-06 07:49:11', '2025-03-06 15:03:10', 1, NULL),
(52, 'https://utfs.io/f/26L8Sk7UnuECo5yHF8Au3SMxWU2adZA8VJYKbfw6OtzGmPIQ', '26L8Sk7UnuECcHNLIyMGlVyP5pWMY6DoSU8zQmEbCBJ0Nt2O.webp', 0, 0, 138360, '2025-03-06 07:55:06', '2025-03-06 07:55:06', 1, NULL),
(53, 'https://utfs.io/f/26L8Sk7UnuECXSrDiHqcZENFc91oCB07LqidpvXmUWH4VeMw', 'UFO.jpeg', 0, 0, 221100, '2025-03-06 07:56:23', '2025-03-06 07:56:23', 1, NULL),
(54, 'https://utfs.io/f/26L8Sk7UnuEC3AgeVtGVEstpDrH4YmojWGN9uMyOIeCwJlKn', 'UFO.jpg', 0, 0, 221424, '2025-03-06 07:57:27', '2025-03-06 07:57:27', 1, NULL),
(55, 'https://utfs.io/f/26L8Sk7UnuECM4JateSfVkXvqlZ4gba0UNI8zsDYxnhyrG2d', '2025_03_15_Pilvax Kávéház.jpg', 0, 0, 123252, '2025-03-06 08:07:10', '2025-03-06 08:07:10', 1, NULL),
(56, 'https://utfs.io/f/26L8Sk7UnuECAQF3xuRG0hVAdNUJ9M2RYupFQZcsWLlTxwzk', '2025_03_15_Pilvax Kávéház.jpg', 0, 0, 123252, '2025-03-06 08:28:43', '2025-03-06 08:28:43', 1, NULL),
(57, 'https://utfs.io/f/26L8Sk7UnuECI1Gr4vF3U6xf5SojbkZpQ2y7DV0lPOWMeCBq', '2025_03_15_Pilvax Kávéház.jpg', 0, 0, 123252, '2025-03-06 08:29:25', '2025-03-06 08:29:25', 1, NULL),
(58, 'https://utfs.io/f/26L8Sk7UnuECj8lG98MdVTPH1f4QNIYeZOKG0nqzEAJr6FLg', '2025_03_15_Pilvax Kávéház.jpg', 0, 0, 123252, '2025-03-06 08:32:25', '2025-03-06 08:32:25', 1, NULL),
(59, 'https://utfs.io/f/26L8Sk7UnuEC3sJg1vGVEstpDrH4YmojWGN9uMyOIeCwJlKn', '2025_03_15_Pilvax Kávéház.jpg', 0, 0, 123252, '2025-03-06 08:34:08', '2025-03-06 08:34:08', 1, NULL),
(60, 'https://utfs.io/f/26L8Sk7UnuEC1G9RUR789QX6bm0v4B8adyiMJAnfwWCDKkVO', 'Könyvjelző.jpg', 0, 0, 29184, '2025-03-06 08:38:19', '2025-03-06 08:38:19', 1, NULL),
(61, 'https://utfs.io/f/26L8Sk7UnuECjy8y1adVTPH1f4QNIYeZOKG0nqzEAJr6FLgy', 'Könyvjelző.jpg', 0, 0, 29184, '2025-03-06 08:41:08', '2025-03-06 08:41:08', 1, NULL),
(62, 'https://utfs.io/f/26L8Sk7UnuECKd1xamiwM9qkW1bhYdTcOEV5rUQnXmvG3JL7', 'Erdo.jpg', 0, 0, 730143, '2025-03-20 18:07:55', '2025-03-20 18:07:55', 1, NULL),
(63, 'https://utfs.io/f/26L8Sk7UnuECGPCCZIlRAoqETBFgX2U4fvkxMsYmrHbh51an', 'Erdo.jpg', 0, 0, 730143, '2025-03-20 18:08:22', '2025-03-20 18:08:22', 1, NULL),
(64, 'https://utfs.io/f/26L8Sk7UnuECnZ1llaypuwvx56J1US2AQWgyPYTDO7XGiend', '6_kep.jpg', 0, 0, 0, '2025-03-23 04:47:18', '2025-03-23 04:58:19', 1, NULL),
(65, 'https://utfs.io/f/26L8Sk7UnuECpe74Ug60tYOVN4SgU2xuoem6swRjIQKAFZBL', '7_kep.jpg', 0, 0, 0, '2025-03-23 04:47:36', '2025-03-23 04:58:27', 1, NULL),
(66, 'https://utfs.io/f/26L8Sk7UnuECnNakkPypuwvx56J1US2AQWgyPYTDO7XGiend', '8_kep_1910-es_evek.jpg', 0, 1, 0, '2025-03-23 04:47:45', '2025-03-23 04:58:24', 1, NULL),
(67, 'https://utfs.io/f/26L8Sk7UnuECh2bJf6X2NFjoegCyrV3qp4LH1DuZtd5nIKsc', 'Eboltás.jpg', 0, 0, 0, '2025-04-16 14:07:40', '2025-04-16 14:09:13', 1, NULL),
(68, 'https://utfs.io/f/26L8Sk7UnuECIaXv38vF3U6xf5SojbkZpQ2y7DV0lPOWMeCB', 'Eboltás.jpg', 0, 0, 450167, '2025-04-16 14:08:50', '2025-06-14 07:54:25', 1, NULL),
(69, '/uploads/gallery/Artemis_3d7f7929.png', 'Artemis.png', 0, 1, 455781, '2025-09-08 13:24:24', '2025-09-08 13:24:24', 1, '/uploads/gallery/Artemis_3d7f7929.png'),
(70, '/uploads/gallery/icon_c3aefad3.png', 'icon.png', 0, 1, 131215, '2025-09-08 13:25:40', '2025-09-08 13:25:40', 1, '/uploads/gallery/icon_c3aefad3.png'),
(71, '/uploads/gallery/Artemis_f57d6924.png', 'Artemis.png', 0, 1, 455781, '2025-09-08 14:15:19', '2025-09-08 14:15:19', 1, '/uploads/gallery/Artemis_f57d6924.png');

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

-- Data for table: bakonykuti-t3_news
INSERT INTO `bakonykuti-t3_news` (`id`, `title`, `thumbnail`, `content`, `creator_name`, `created_at`) VALUES
(55, 'Hulladéknaptár 2025', 'https://utfs.io/f/26L8Sk7UnuECM1Xe6JSfVkXvqlZ4gba0UNI8zsDYxnhyrG2d', '

## Hulladéknaptár - Bakonykúti

Települési vegyes hulladék gyûjtési nap: **Hétfõ**
## 
Kérjük a hulladékokat a szállítás napján reggel 6 óráig az ingatlanok elé szíveskedjenek kirakni úgy, hogy az se a gyalogos, se a jármű forgalmat ne akadályozza.
## 
## Szelektív hulladék gyűjtési napok:

A járat átszervezése a szelektív napokat a következőképp érinti: a korábbi páratlan csütörtök helyett **2025. július 1**-től a páros hétfő lesz a gyűjtés napja Bakonykúti településen.

## 
További részletek itt [PDF](https://utfs.io/f/26L8Sk7UnuECRFofCrgOMzl8R0LVyP71WfxAQKYCqZmBGUud)', 'admin', '2025-01-18 14:44:37'),
(56, 'Tájékoztató  települési főépítész alkalmazásáról', 'https://utfs.io/f/26L8Sk7UnuECXtmPDGcZENFc91oCB07LqidpvXmUWH4VeMwx', '
## Tájékoztató  települési főépítész alkalmazásáról

Értesítem a Tisztelt Lakosságot, hogy Bakonykúti Község Önkormányzata 2025. január 2.-től új települési főépítészt alkalmaz **Ertl Antal** személyében.
## 
Ertl Antal főépítész elérhetőségei:

E-mail: ertl.antal@feterv.hu

Telefon: +36 70 3850133

Személyesen: Székesfehérvár, Kassai u. 79. Irodában, előzetes egyeztetést követően
## 
Kérem, hogy az építtetésre vonatkozó jogszabályok betartása, valamint településünk
arculatának megőrzése érdekében, az építési tevékenységek megkezdése előtt vegyék igénybe
a települési főépítész szakmai konzultációját, amely a lakosság számára térítés mentes.
## 
Bakonykúti, 2025. január 10.
## 

Marics József

polgármester', 'agota', '2025-01-18 14:58:52'),
(57, 'Lőtéri értesítő', 'https://utfs.io/f/26L8Sk7UnuECwcWT6w9heWP5jZyfGnp24M8Jrbm0t9vNAFka', '## 2025 januári értesítő

Az MH Böszörményi Géza Csapatgyakorlótér Parancsnoksága a 2025 januári értesítőjét [ITT](http://www.bakonykuti.hu/loter/Loter202501.pdf) olvashatja. ', 'agota', '2025-01-18 15:14:15'),
(62, 'Vándortábor felhívás', 'https://utfs.io/f/26L8Sk7UnuECCZEIrDoD3h5BTWPtNcop4XHGVmvlbLQxAy71', '## Vándortáborok 

*Fedezz fel! Vezess! Inspirálj!*
## 
Nyáron kilencedik alkalommal indulnak útnak az egyhetes vándortáborok, melyekre január 30-tól lehet jelentkezni.
## 
Ennek érdekében szeretnénk felhívni a figyelmét egy kiváló ár-érték arányú táborozási lehetőségre, a Vándortábor Programra, melyekhez kedvező feltételeket kínálunk:
## 
A részvételi díj az utazási költséget kivéve mindent tartalmaz. A táborozók 49 000 forintért kapnak szállást, étkezést és programokat a 7 napos turnusokon.
## 
A csoportvezető pedagógusok a vándortáboros csoportvezetésért bruttó 150 000 forint díjazásban részesülnek. 
## 
A hátrányos helyzetû és a halmozottan hátrányos helyzetű gyerekek 50%-os kedvezménnyel vehetnek részt a táborokban, nekik a részvételi díj 24 500 forint.
## 
A pedagógusok és a kísérők 20 000 forintért végezhetik el a 30 órás akkreditált gyalogos, vízi vagy kerékpáros vándortábor-vezető képzést.
## 
A jelentkezés január 30. (csütörtök) 20:00-kor indul, a felhívás a szervezetek honlapjain érhetõ el:
## 
**[ErdeiVándor](https://www.erdeivandor.hu/jelentkezesi-felhivas/), [BringásVándor](https://www.bringasvandor.hu/bringasvandor/#jelentkezesi-felhivas), [VíziVándor](https://vizivandor.hu/palyazati-kiiras/), [Zarándoktábor](https://zarandoktabor.hu/jelentkezesi-felhivas)**
## 
Bõvebb információért látogasson el a honlapra: https://vandortabor.hu/

Vándotábor bemutató  [ITT](http://www.bakonykuti.hu/Hirdet/Vandortabor2025.pdf)', 'agota', '2025-01-23 07:08:55'),
(63, 'Lőtéri értesítő - február', 'https://utfs.io/f/26L8Sk7UnuECwcWT6w9heWP5jZyfGnp24M8Jrbm0t9vNAFka', '## 2025 februári értesítő

Az MH Böszörményi Géza Csapatgyakorlótér Parancsnoksága a 2025 januári értesítőjét [ITT](http://www.bakonykuti.hu/loter/Loter202502.pdf) olvashatja. ', 'agota', '2025-01-23 07:13:53'),
(64, 'Farsang febrár 22-én a Közösségi Házban', 'https://utfs.io/f/26L8Sk7UnuECLskRArKbp6Sh14YX5LERKwtFsGya3UVgiH8Q', 'Idén is meg lesz tartva a farsangi mulatság február 22-én 17 órai kezdéssel. További részletek a Bakonykúti Facebook oldalon találhatók. ', 'agota', '2025-02-08 08:11:38'),
(65, 'Álláshirdetés', 'https://utfs.io/f/26L8Sk7UnuECB6mwoILtiGAb1WuzdjMZ6rO9S2U8Ll3D75pI', '## A BM Katasztrófavédelmi Főigazgatóság a következő állásra keres jelentkezőket: 

https://utfs.io/f/26L8Sk7UnuECwclnBlSheWP5jZyfGnp24M8Jrbm0t9vNAFka', 'agota', '2025-02-18 14:02:54'),
(68, 'MEGHÍVÓ - nyilvános testületi ülés', 'https://utfs.io/f/26L8Sk7UnuECnHDiRUypuwvx56J1US2AQWgyPYTDO7XGiend', '## MEGHÍVÓ - nyilvános testületi ülés

Bakonykúti Községi Önkormányzat Képviselő-testülete
2025. február 27-én (csütörtökön) 17.00 órakor 
rendes, nyilvános testületi ülést tart.

A napirendi pontokról bővebben itt olvashat: 
https://utfs.io/f/26L8Sk7UnuECfTzii6Hu3aru6LDUb0V8oGMOFt5cR72B1Qkq', 'agota', '2025-02-18 14:11:06'),
(69, 'Lőtéri értesítő - március', 'https://utfs.io/f/26L8Sk7UnuECwcWT6w9heWP5jZyfGnp24M8Jrbm0t9vNAFka', '## 2025 márciusi értesítő 

A márciusi lőtéri értesítőről bővebben itt olvashat: Fájl feltöltve: https://utfs.io/f/26L8Sk7UnuECTLBLdaBsBd7vKsTMS9If2ZzDyiwp5quY30Gm', 'agota', '2025-02-19 15:07:46'),
(70, 'A földönkívüli élet lehetősége a Naprendszerben és azon túl', 'https://utfs.io/f/26L8Sk7UnuECcHNLIyMGlVyP5pWMY6DoSU8zQmEbCBJ0Nt2O', 'Talabér Gergely amatőrcsillagász előadása a BAKONYKÚTI KÖZÖSSÉGI HÁZBAN

## 
További információ: https://utfs.io/f/26L8Sk7UnuECCJaSKDoD3h5BTWPtNcop4XHGVmvlbLQxAy71

Mindenkit szeretettel várunk!', 'agota', '2025-03-06 08:01:42'),
(72, 'Március 15. Ünnepi megemlékezés ', 'https://utfs.io/f/26L8Sk7UnuEC3sJg1vGVEstpDrH4YmojWGN9uMyOIeCwJlKn', '2025.03.15-én szombaton 9 és 11 óra között a Bakonykúti Közösségi Ház kávézóként üzemel.
## 
Ünnepi megemlékezésünkre mindenkit szeretettel várunk!
Bakonykúti Község Önkormányzata ', 'agota', '2025-03-06 08:34:38'),
(73, 'Könyvjelző - a bakonykúti könyvklub', 'https://utfs.io/f/26L8Sk7UnuECjy8y1adVTPH1f4QNIYeZOKG0nqzEAJr6FLgy', 'Ahogyan minden hónapban, márciusban is szeretettel várnak a könyvbarátok minden érdeklődőt a bakonykúti könyvklubon, a Könyvjelzőn!', 'agota', '2025-03-06 08:41:51'),
(74, 'Lőtéri értesítő - április', 'https://utfs.io/f/26L8Sk7UnuECwcWT6w9heWP5jZyfGnp24M8Jrbm0t9vNAFka', '## 2025 márciusi értesítő 

Az áprilisi lőtéri értesítőről bővebben itt olvashat:  https://utfs.io/f/26L8Sk7UnuECTcPBJvsBd7vKsTMS9If2ZzDyiwp5quY30Gmx ', 'agota', '2025-03-20 17:45:04'),
(75, 'MEGHÍVÓ a VERGA Vadászterület tulajdonosi közösségének gyűlésére (2025.04.24, 8:00-9:00):', 'https://utfs.io/f/26L8Sk7UnuECGPCCZIlRAoqETBFgX2U4fvkxMsYmrHbh51an', '## MEGHÍVÓ a VERGA Vadászterület tulajdonosi közösségének gyűlésére

Ideje:  2025.04.24, 8:00-9:00
Helye: VERGA Zrt. Irodaépülete: 8200 Veszprém, Jutasi út 10. 
## 
Bővebb információ: 
 https://utfs.io/f/26L8Sk7UnuECHms9aAPrhOQ7z5tdNT6PIwFxqfA2XscmnvoM

https://utfs.io/f/26L8Sk7UnuECj2meBsdVTPH1f4QNIYeZOKG0nqzEAJr6FLgy', 'agota', '2025-03-20 18:08:28'),
(76, 'Eboltás Bakonykútiban és környékén', 'https://utfs.io/f/26L8Sk7UnuECIaXv38vF3U6xf5SojbkZpQ2y7DV0lPOWMeCB', '## Eboltás Bakonykútiban

Április 28-án 7:30-8:00

További információk: https://utfs.io/f/26L8Sk7UnuECugeFL9zmDBpZYSAVG1czbfeQOu9yK3WLdFln

Illetve a környéken más időpontokban: https://utfs.io/f/26L8Sk7UnuEClzqgyBpuj9t2oESZxJThfvnqIKeawNB08iAm', 'agota', '2025-04-16 14:11:47'),
(77, 'Lőtéri értesítő - Május', 'https://utfs.io/f/26L8Sk7UnuECwcWT6w9heWP5jZyfGnp24M8Jrbm0t9vNAFka', '## 2025 májusi értesítő 

A májusi lőtéri értesítőről bővebben itt olvashat:  https://utfs.io/f/26L8Sk7UnuECErrq6seDfCRWZAPiqY1BUG5V8Mz3t920HXwj', 'agota', '2025-04-17 07:53:46'),
(78, 'Bakonykúti Községi Önkormányzat Képviselő-testületi ülés - 2025.04.24 17:00', 'https://utfs.io/f/26L8Sk7UnuECnHDiRUypuwvx56J1US2AQWgyPYTDO7XGiend', '## MEGHÍVÓ

Bakonykúti Községi Önkormányzat Képviselő-testülete
2025. április 24-én (csütörtökön) 17.00 órakor 
rendes, nyilvános testületi ülést tart, amelyre ezúton tisztelettel meghívom.

Az ülés helye: Községháza (Bakonykúti, Szabadság u. 41.)                         
## 
Napirendi javaslat: 

1)	Tájékoztatás az egészségügyi ellátás helyzetéről – Dr. Rumann Hildegard háziorvos előterjesztésében

2)	Javaslat a 2024. évi belső ellenőri éves összefoglaló jelentés elfogadásáról – a jegyző előterjesztésében 

3)	Javaslat a munkamegosztás és felelősségvállalás rendjéről szóló megállapodás elfogadására – a jegyző előterjesztésében

4)	Javaslat a 2024. évi nem közművel összegyűjtött szennyvíz közszolgáltatás költségelszámolásának elfogadására – a polgármester előterjesztésében

5)	Polgármesteri tájékoztató az előző ülés óta végzett munkáról, főbb intézkedésekről, eseményekről – a polgármester előterjesztésében

6)	Egyebek

	Kérem a tisztelt képviselőket, hogy a napirend fontosságára való tekintettel a képviselő-testületi ülésen szíveskedjenek megjelenni! Kérem, hogy esetleges akadályoztatását szíveskedjen előre jelezni!


Bakonykúti, 2025. április 17.
## 

Tisztelettel: 

Marics József

Polgármester
', 'agota', '2025-04-17 09:16:52'),
(79, 'MEGHÍVÓ Bakonykúti Községi Önkormányzat Képviselő-testülete 2025. május 29-én (csütörtökön) 16.30 órakor  rendes, nyilvános testületi ülést tart', 'https://utfs.io/f/26L8Sk7UnuECnHDiRUypuwvx56J1US2AQWgyPYTDO7XGiend', '## Az ülés helye: Községháza (Bakonykúti, Szabadság u. 41.)                         

**Napirendi javaslat:** 
1)	Az önkormányzat gyermekjóléti és gyámügyi tevékenységének átfogó értékelése – a jegyző előterjesztésében
2)	Beszámoló a Vörösmarty Mihály Könyvtár által a KSZR-ben végzett tevékenységről – Horváth Adrienn igazgató előterjesztésében
3)	Beszámoló az Iszkaszentgyörgyi Közös Önkormányzati Hivatal 2024. évi költségvetésének végrehajtásáról – a jegyző előterjesztésében
4)	Javaslat az önkormányzat 2024. évi költségvetésének végrehajtásáról szóló beszámoló elfogadására – a polgármester előterjesztésében 
5)	Beszámoló az Iszkaszentgyörgyi Közös Önkormányzati Hivatal 2024. évi munkájáról – a jegyző előterjesztésében
6)	Javaslat az Iszkaszentgyörgyi Közös Önkormányzati Hivatal tekintetében nyári, téli igazgatási szünet elrendelésére – a jegyző előterjesztésében
7)	Javaslat a polgármester tiszteletdíjának és költségtérítésének megállapítására - a polgármester előterjesztésében 
8)	Javaslat a fogorvosi feladatellátási szerződés VI. számú módosítására - a polgármester előterjesztésében
9)	Javaslat közvilágítás korszerűsítésére és üzemeltetésére vonatkozó árajánlat elfogadására - polgármester előterjesztésében
10)	Javaslat az Iszkaszentgyörgyi Szociális Intézményi Társulás Társulási Megállapodásának VII. számú módosítására – a polgármester előterjesztésében
11)	Polgármesteri tájékoztató az előző ülés óta végzett munkáról, főbb intézkedésekről, eseményekről – a polgármester előterjesztésében
12)	Egyebek
	Kérem a tisztelt képviselőket, hogy a napirend fontosságára való tekintettel a képviselő-testületi ülésen szíveskedjenek megjelenni! Kérem, hogy esetleges akadályoztatását szíveskedjen előre jelezni!

Bakonykúti, 2025. április 22.
## 
                                                                                                           
   Tisztelettel:
## 
Marics József

polgármester
', 'agota', '2025-05-26 14:21:14'),
(80, 'Lőtéri értesítő - Június ', 'https://utfs.io/f/26L8Sk7UnuECwcWT6w9heWP5jZyfGnp24M8Jrbm0t9vNAFka', '## 2025 júniusi értesítő 

A júniusi lőtéri értesítőről bővebben itt olvashat:   https://utfs.io/f/26L8Sk7UnuECr7hmlMbVX5JwIdfPKubn4WEsNUiZezhFy3OY', 'agota', '2025-05-26 14:26:18'),
(81, 'Guttamási bányanyitás', 'https://utfs.io/f/26L8Sk7UnuECnHDiRUypuwvx56J1US2AQWgyPYTDO7XGiend', '## Fejér Megyei Kormányhivatal Székesfehérvári Járási Hivatala, Környezetvédelmi és Természetvédelmi Fõosztály 2018. január 3. napján kelt, FE-08/KTF/95-1/2018. iktatószámú határozatát megsemmisítõ KHFF/134-33/2025-EM iktatószámú határozat közhírré tétele

A bányanyitással kapcsolatos legfrissebb információkat a következő dokumentumokban olvashatók: 
## 
Határozat hirdetés:  https://utfs.io/f/26L8Sk7UnuECWMEUYxjMe78C4Hl1gVLjSdwtzqbmKROP0uki
## 
Határozat:  https://utfs.io/f/26L8Sk7UnuEC2ctvuHUnuECB16T3NaRGHbkgyItv9Smfci0q', 'agota', '2025-05-29 11:21:37'),
(82, 'Állami támogatással telepíthető korszerű, környezetbarát szennyvíztisztító berendezések', 'https://utfs.io/f/26L8Sk7UnuECIaccBCbF3U6xf5SojbkZpQ2y7DV0lPOWMeCB', '
A következő email érkezett a Polgármesteri Hivatalba, melyet most módosítás nélkül közlünk:

## Biológiai szennyvíztisztító berendezések gyártása, telepítése.

Tisztelt Polgármester Asszony/Úr!
## 
A 2026. június 30-ig igényelhető otthonfelújítási támogatás először nyújt lehetőséget arra, hogy csatornázatlan ingatlanok tulajdonosai állami támogatással telepíthessenek korszerű, környezetbarát szennyvíztisztító berendezést.
## 
A szennyvízkezelés sok településen évek óta megoldatlan vagy ideiglenes eszközökkel kezelhető kérdés. A lakosság részéről egyre erősebb az igény, az önkormányzatok pedig sok esetben már megfogalmazták fejlesztési szándékukat – azonban a közműves szennyvízhálózat kiépítése túl drága, pályázati forrás nem elérhető, vagy a településszerkezet miatt nem minden utcában kivitelezhető.
## 
Gyakori, hogy egyes utcákban, településrészeken ma is zárt tárolók, ideiglenes megoldások, rendszeres szippantás jelenti a szennyvízkezelést. Ez nemcsak költséges és kényelmetlen, hanem környezetvédelmi szempontból sem hosszú távú megoldás.
## 
A támogatás most lehetőséget ad arra, hogy a háztartások saját maguk korszerűsítsék a szennyvízkezelést egy jogszabályilag elfogadott, hosszú távú, önálló működésű biológiai tisztítórendszerrel.
## 
Az ÖkoTech-Home Kft. által fejlesztett és gyártott A.B.Clear szennyvíztisztító:

– nem igényel szippantást-iszapzsákos technológia

– a tisztított víz helyben újrahasznosítható

– CE minősítéssel és EN 12566-3 szabvánnyal rendelkezik

– magyar termék, hazai háttérrel és szervizszolgáltatással

– minimális karbantartást igényel, hosszú élettartamú
## 

Kérjük, tájékoztassák a lakosságot erről a lehetőségről, akár hirdetőtáblán, akár közösségi felületen, vagy egy lakossági fórumon keresztül. Ez valódi településfejlesztési lépés, amely sok családnak jelent hosszú távú megoldást.
## 
Egyben szeretnénk megkérdezni Öntől, mint a település vezetőjét:
milyen megoldás működik jelenleg a nem csatornázott ingatlanok esetében?
Látják-e, hallják-e az igényt a lakosság részéről, vannak-e tervek e téren?

Kérjük, akkor is szíveskedjenek visszajelezni, ha jelenleg nem aktuális a téma, hogy tudjuk, hol lehet érdemi párbeszédet folytatni. Válaszukat előre is köszönjük, minden érdeklődő önkormányzatnak teljes körű szakmai és műszaki támogatást nyújtunk.
## 
További információ:
weboldal: www.okotechhome.hu
központi telefon +36 33 200 211
## 
Üdvözlettel:

az ÖkoTech-Home Kft.

Szennyvíztisztító rendszerek, 2004 óta kizárólag ezzel foglalkozunk." ', 'agota', '2025-06-04 12:39:22');

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

-- Data for table: bakonykuti-t3_page
INSERT INTO `bakonykuti-t3_page` (`id`, `title`, `content`, `slug`, `last_modified`) VALUES
(2, 'Látnivalók', '
### Vendéglátás és kirándulási lehetőségek

Bakonykútiban több vendégház várja a turistákat, akik nyugodt, természetközeli pihenésre vágynak. 
## 
A faluból számos kirándulási lehetőség kínálkozik:

- **Baglyas-hegy**: A környék legszebb panorámája nyílik innen.
- **Bogrács-hegy**: Kincsesbánya irányában található.
- **Burok-völgy**: Ritka természeti szépségű völgy, amelyet több helyen meredek sziklafalak határolnak.


---


### **Baglyas-hegy**

![kep](https://upload.wikimedia.org/wikipedia/commons/9/93/Turistaut.jpg)
## 
A 363 méter magas Baglyas-hegy tömbje, különösen távolabbról nézve, tűzhányóra emlékeztet. Ez a terület:

- Fehérlő réteghatároktól szeletelt falakkal,
- Mély horhosokkal,
- Keskenyre kopott gerincekkel,
- Leszakadozott, állat-formájú sziklákkal,
- Elvetélődött, elvonszolódott dolomit-tömbökkel, amelyek egy bizarr világot alkotnak.

A csúcsáról zavartalan körpanoráma nyílik:

- **Kelet felé**: Székesfehérvár.
- **Észak felé**: A Vértes egy része, például a Móri-árok, Csóka-hegy és Csókakő.
- **Nyugat felé**: A Bakony közeli részletei: Burok-völgy szájadéka, Tési-fennsík laposa, Keleti-Bakony magasabb régiói.

A tetőn található egy antennatorony és egy kopjafa, amelyet 1991-ben állítottak. Az évfordulóján, június végéhez eső szombaton, sok kiránduló zarándokol ide.

---

### **Burok-völgy**

A Burok-völgy Magyarország egyik legérdekesebb természetvédelmi területe. Ritka természeti jelenségekkel, botanikai és zoológiai érdekességekkel várja a látogatókat.

#### **Fekvése**

- A völgy a **Keleti-Bakonyban**, Fejér és Veszprém megye határán található.
- **Hossza**: Mintegy 12 km Királyszállástól Bakonykúti községéig.
- **Mélysége**: 50–90 méter, számos függőleges sziklafallal.
- **Szintkülönbsége**: Kb. 200 méter.

#### **Kialakulása és barlangjai**

- A völgy kanyon jellege **hasadásos eredetű**, nem folyóvízi erózió okozta.
- A felemelkedő kőzetréteg feszültsége töréseket és sziklaformációkat hozott létre.
- **Barlangok**: 42 barlangot tártak fel eddig, ezek többsége kicsi (átlagos hosszuk 5–8 méter).
    - **Ruska-zsomboly**: A legnagyobb barlang a Bükkös-árok mellett található, hossza 73 méter, mélysége 21 méter.

#### **Növény- és állatvilág**

- A völgy klímája eltér környezetétől: hűvösebb és párásabb, ami lehetővé tette jégkorszaki növényfajok fennmaradását, mint például:
    - **Havasi hagyma**
    - **Cifra nádtippan**
    - **Fürtös holdruta**
- Több mint 200 madárfaj figyelhető meg, közülük soknak fészkelőhelyet biztosít a völgy.

A Burok-völgy különlegessége, hogy Magyarország egyik egyedülállóan ősi állapotban megmaradt természetes erdeje. Ez a terület lehetőséget nyújt a természet regenerációs folyamatainak tanulmányozására.', 'bakonykuti/latnivalok', '2025-01-13 14:55:29'),
(5, 'Bemutatás', 'Bakonykúti község Fejér vármegye legkisebb önálló települése, a Kelet-Bakony hegység lábánál, a Burok-völgyi természetvédelmi terület mentén, csodálatos természeti környezetben fekvő zsákfalu. Környékén 300 méter feletti magaslatok is találhatók, melyekről a település felé eső lejtők meredekek. Közúton az Isztimér községhez tartozó Guttamásin keresztül Iszkaszentgyörgy, Kincsesbánya és Fehérvárcsurgó felől közelíthető meg, a megyeszékhely Székesfehérvár 18 km-re található.
## 
Bakonykúti lakossága a múlt században a mindenkori társadalmi és gazdasági változások tükörképeként folyamatosan csökkent, 2000-ben már csak 104 lakos élt a faluban. Örvendetes, hogy az ezredfordulót követően megfordult ez a folyamat, és azóta a lakosság növekedése figyelhető meg. Kezdetben elsősorban a hétvégi házak szaporodtak, és egyre inkább pihenőfaluvá vált a település, de ma már egyre többen választják otthonuknak Bakonykútit, így az ingatlanok többségében állandó lakosok élnek. Ezt jelzi az igényesen felújított régi parasztházak és az új építésű lakóházak számának növekedése. Napjainkban már 170 állandó lakosa van településünknek, de a korábbi német nemzetiségi lakosságnak csak töredéke maradt, lakóink döntő többségét az elmúlt években a városokból, elsősorban Székesfehérvárról kiköltöző családok alkotják.
## 
A falu önállósága 1970-ben megszűnt, ettől kezdődően az Isztiméri Tanács fennhatósága alá került Bakonykúti, ezzel együtt az általános iskolája is bezárt. Az önállóságát a rendszerváltást követő első szabad önkormányzati választások során 1990-ben nyerte vissza. Bakonykúti Önkormányzata kezdetben Isztimér Önkormányzatával hozott létre Körjegyzőséget, majd 2008-tól Iszkaszentgyörgy Önkormányzatával Körjegyzőséget, végül közös önkormányzati hivatalt, amelyhez 2025. január 1-től Csór Önkormányzata is csatlakozott, így már ez a három település alkotja jelenleg az Iszkaszentgyörgyi Közös Önkormányzati Hivatalt.
## 
A község belterülete 39 hektár, amelyen jelentős zöldterületek is találhatók. A település összes belterületi útja szilárd burkolatú. A közművek a szennyvízcsatornázás kivételével kiépítettek. A kiváló minőségű vezetékes ivóvizet saját 120 méter mély kút és vízműhálózat biztosítja.
## 
A település mellett található a Magyar Honvédség Csapatgyakorlótere, amely Közép-Európa legnagyobb egybefüggő katonai területe. Mindez okoz néhány zajosabb napot a környéken, ugyanakkor a terület viszonylagos zártsága miatt csökkent az értékes élőhelyek pusztulása, ezért számos védett állat és növény talált itt menedéket. A Magyar Honvédség havonta értesítést küld az önkormányzat részére a következő hónap katonai kiképzési tevékenységeiről, így a lakosság és a turisták a honlapunkon egyaránt tájékozódni tudnak a várható zajhatásokról és korlátozásokról.
## 
Az alacsony lakosságszám miatt Bakonykútiban élelmiszerbolt nem működik. A lakosság ellátását kenyérrel és pékáruval heti három alkalommal mozgóbolt biztosítja. Főként a túrázók kiszolgálását biztosítja egy a falu szélén, a kéktúra útvonalán található időszakosan nyitvatartó kerthelyiség, ahol a túrázó megpihenhet, ételt és italt vásárolhat. Bakonykútit nemcsak az Országos Kéktúra útvonalán áthaladó bakancsos turisták keresik fel, hanem sokan több napot is szívesen töltenek el ebben a hangulatos környezetben, ezért ma már több falusi vendégház is várja szolgáltatásaival a látogatókat a településen.

    ', 'bakonykuti/bemutatas', '2025-01-20 07:24:28'),
(6, 'Bakonykúti Története', '
## Bakonykúti története a kezdetektől a falu újraalapításáig

**Az első ismert lakók nyomában Bakonykúti területén – rézkori és bronzkori telepek a falu határában**
## 
Bakonykúti közigazgatási területének legkorábbi régészeti lelőhelye a rézkorra (Kr. e. 4500–2800) tehető; Bakonykúti-puszta mellett, egy ma már csak időszaki vízfolyás keleti partján helyezkedett el.  Pattintott köveket, háztapasztás mintával díszített vastag töredékét, és kézzel formált edények töredékeit gyűjtötték össze régészek – az egykori telep földalatti maradványairól árulkodó felszíni nyomokként – egy 2014. évi terepbejáráson.
A középső bronzkori vatya kultúrába (Kr. e. 2000–1500) sorolható az a telep, amelynek a nyomaira 1981-ben egy mezőgazdasági mintavétel során figyeltek fel cseréptöredékek alapján a falu széli kőfeszület közelében, a Közép-dűlő nevű határrészen. Az István Király Múzeumból Jungbert Béla régész szállt ki a helyszínre, és megállapította, hogy 60-80 cm-es mélységből, egy bronzkori veremből kerültek a felszínre a korabeli kerámiatöredékek és állatcsontok. 2018 decemberében a Szent István Király Múzeum munkatársai felszíni leletgyűjtéssel határolták le a bronzkori telep kiterjedését.

## 
**A második magyar „régésznő”, gróf Zichy Paulina bakonykúti ásatása 1884-ben**
## 
Gróf Zichy Paulinát (1836–1890) a legutóbbi időkig méltatlanul elfeledte az utókor. 
## 
![Gróf Zichy Paulina](https://utfs.io/f/26L8Sk7UnuECsKKSMqzBglwcTmdj90FZsYR7yQuMS3OeJ4B1)
## 
Pedig a grófnő alig egy évtizeddel az első magyar régésznő, Torma Zsófia (1832–1899) tordosi feltárását követően – a Tróját felfedező Heinrich Schliemann kortársaként az európai régészet hőskorában – vezetett ásatást, és ezzel a második magyar ásatásvezető nőt tisztelhetjük benne. 1880-ban tudósított róla a Fehérvári Hiradó, hogy a „*fejérmegyei és Székesfejérvár Városi régiségtárt*” a nyár folyamán megtekintette a férjével, és igen nagy érdeklődéssel vizsgálta az ott levő régiségeket. 1884-ben pedig a Pesti Napló adott hírt arról a legbővebben, hogy „*Kuti pusztától nyugatra, mérsékelt emelkedésű halomnak éjszaki lejtőjén, gyönyörü ponton, mindennap reggeltől estélig egy főuri hölgyet látni, munkások nagy számától körülvéve. Fáradhatatlan türelemmel figyel, a munkásokkal munkálkodik maga is, megvizsgál behatóan minden cserepet, faragott követ, csontdarabot stb. Mert hát a főuri hölgy, Schläger Jánosné szül. gróf Zichy Paulina, a maga tulajdon birtokán, nagy költséggel ásat, a régiség tudománynak áldozik*”. Feltárta a középkori Kuti falu templomának romjait, amit a „*falu lakosainak szóhagyománya után indulva*” talált meg. Ez a „szóhagyomány” megőrizte az akkor már talán több mint három évszázada felhagyott, és pusztulásra ítélt templom helyét. A templom körüli temetőben is ásott, ahol „*számos csontváz vala, érdekes régi fegyverdarabok, pénzek, bronzgyürük, sarkantyuk stb.*”. 
## 
**Római villa a bakonykúti fennsíkon?**
## 
A grófnő ásatási munkásai a középkori templom körüli temetőtől néhány méterrel odébb akadtak „*római vizvezetőcsövekre*”, majd egy liliomos oszlopfőre, és vagy 18 vörösmárvány oszlopra. Utóbbiakról szinte biztosan kizárhatjuk, hogy egy középkori falusi templomhoz tartoztak volna, a leírás alapján sokkal inkább egy évezreddel korábban állott római villaépületet sejthetünk a közelben. A pazar kilátás és a forrásvíz közelsége tökéletesen alkalmas helyszín egy villagazdaság reprezentatív központi épületének. A római kori pezsgő életre utal a környezetében előkerült számos lelet is (például edénytöredékek, pénzérmék és ruhakapcsoló tűként használt ún. fibulák). Mindenesetre további kutatások gyarapíthatják majd a római kori lelőhelyről alkotott tudásunkat.
## 
**A bakonykúti-pusztai avar kori hölgy**
## 
Jóval a római világ letűnte után, a Kr. u. 567/568-ban Belső-Ázsiából érkező avarok uralma alatt egyesült a Kárpát-medence közel két és fél évszázadon át. Az egyébként igen harcias avarok tartós uralma megteremtette a békés belső fejlődés és gyarapodás lehetőségét, aminek eredményeképpen a Dunántúlon például sűrű, falusias településhálózat alakult ki. Talán egy tanyasias vagy kisebb falusias településen élhetett a 7. században az a nő is, akinek a sírja Bakonykúti-pusztán sértéshízlalda építésekor mindössze 50 cm-es mélységben látott napvilágot. Fülében ezüst nagygömbcsüngős fülbevalókat viselt, karját bronz karperec díszítette, és övéhez függesztve vaskést hordott.
## 
**A középkori Kuti falu újrafelfedezése**
## 
Gróf Zichy Paulina 1884-es bakonykúti ásatásából az utókornak a Pesti Napló tudósításán kívül semmi sem maradt fenn. Még az ásatás pontos helyszíne is feledésbe merült, és azt újra fel kellett fedezni. Az újrafelfedezésben nagy része volt Mihályi Attila múzeumbarát fémkeresős önkéntesnek, aki Lencsés Zsuzsanna, a Kormányhivatal régészeti felügyelőjének javaslatára kutatta át a gyanított területet, és egy késő középkori csillár bronz gyertyafoglalatára bukkant. 
## 
![KÉP2](https://utfs.io/f/26L8Sk7UnuECufbHLszmDBpZYSAVG1czbfeQOu9yK3WLdFln)
## 
A helyszínen egyúttal észrevették, hogy a dűlőút (akkor még egyúttal Kéktúra-útvonal) felszínét kőfalak keresztezik. Ezen fellelkesülve szerveztek a székesfehérvári Szent István Király Múzeum régészei a közösségi régészeti program önkénteseinek segítségével fémkeresős kutatást 2021-ben, amely a várakozásokat túlszárnyaló sikerrel végződött. Több tucatnyi középkori és római kori fémlelet, valamint marékszámra gyűjtött cseréptöredékek igazolták az egykor nyüzsgő életet e két korszakban a ma részben rétként, részben szántóföldként hasznosított fennsíkon. A fémkeresős kutatással párhuzamosan geofizikai (talajradaros és magnetométeres) felmérésre is sor került, aminek a kiértékelése szépen kirajzolta a középkori templom föld alatti falmaradványait. Sikerült tehát beazonosítani a forrásokban elsőként 1424-ben említett *Kwthy* falut, valamint az ismert középkori forrásokban nem is említett templomát.
## 
22023-ban kezdődött a hitelesítő ásatás Reich Szabina régésznő szakmai vezetésével, és a helyben élő Szücsi Frigyes régész közösségi régészeti koordinálásával, a bontómunka dandárját ugyanis az önkéntesek végezték. 
## 
![KÉP3](https://utfs.io/f/26L8Sk7UnuECYBe5Hqn5diVuyFRbKC6l9PrQOtLBvmwhEopq)
## 

Feltárták az ÉK–DNy tájolású templom ÉNy-i oldalának megmaradt alapozását, és fényt derítettek arra, hogy elkülöníthető két periódus a templom építéstörténetében. Az első, korai templom külső hossza 10,8 m, falszélessége 1,2 m volt. Téglalap alakú hajóval és egyenes szentélyzáródással rendelkezett. 
## 
![KÉP4](https://utfs.io/f/26L8Sk7UnuECSkosUXrBJwXMmcgpOnyY6qTPFChLG0Sl2ukN)
## 
Valószínűleg festett lehetett a belső fala, mert piros és rózsaszínű festésű vakolatdarabokra bukkantak. A második építési periódusban a templomhajót DNy-i irányban 5,4 méterrel kibővítették. Összesen nyolc melléklet nélküli temetkezés is napvilágot látott, többségében csecsemő-, illetve gyermekcsontvázak. 
## 
![KÉP5](https://utfs.io/f/26L8Sk7UnuEC23QYSOUnuECB16T3NaRGHbkgyItv9Smfci0q)
## 
Az egyik bolygatott koponya alatt S végű karikát találtak, ami felveti a lehetőségét, hogy a templom, s körülötte a temető (cinterem) akár már a kora Árpád-korban – tehát jóval a falu első ismert, 1424-es említése előtt – használatban volt.  
## 
**A „török vész” és az új kezdetek**
## 
A török hódoltság alatt rengeteget szenvedett az Oszmán Birodalom – főként magyar lakosságú – határvidéke, nem véletlenül látja több, a korszakkal foglalkozó kutató Trianon gyökereit ebben az időszakban. A háborús periódusok, a kettős adóztatás és a portyázásokból, hatalmaskodásokból adódó bizonytalanság, kilátástalanság eredményeképpen a középkori eredetű magyar falvak és templomaik jelentős részét felhagyták, a lakosság elpusztult vagy elmenekült. Így történt ez sajnos Kuti faluval és templomával is. 1559-ben a Palota uradalmához tartozó falut már lakatlan pusztaként említették.
## 
Egészen 1740-ig nincs arra nézve adat, hogy állandó lakosai lennének. Ettől függetlenül területét legelőnek, kaszálónak, erdeit sertések makkoltatására használhatták, ahogy erre 1716-ból már rendelkezünk forrással. A falu újraalapítására végül 1759-ben, az elpusztult középkori magyar falutól nyugatra, mintegy fél kilométeres távolságban, németajkú sváb telepesekkel került sor. Az új telepesek különböző környékbeli sváb falvakból, Sályról, Isztimérről, Bánhidáról, Fenyőfőről, Mórról, Palotáról, Pusztavámról, Szőnyből, Balinkáról, Tarjánból, Oszlopról és Csórról kerültek ide, de érkeztek távolabbról is (a bakonykúti történetét jegyző Degré Alajos szerint bizonyos Schrőd és Neuheysl nevű településekről).
## 
Az első katonai felmérés térképszelvényén (6. kép) már látható a felmérés készítése előtt (1782-1785) több mint két évtizeddel újraalapított település a mai Szabadság utca két oldalán, valamint a 8212. sz. út mentén a mai Szabadság utcától nagyjából a mai Ady Endre utcáig. 
## 
![KÉP6](https://utfs.io/f/26L8Sk7UnuECnZ1llaypuwvx56J1US2AQWgyPYTDO7XGiend)
## 
A település a 18. században még nem rendelkezett templommal, bár 1794-ben templomépítésbe kezdtek, az építmény azonban még az építkezés alatt összedőlt. 1810-re épült fel a római katolikus Nagyboldogasszony-templom, a lakosság ugyanis elenyésző töredék kivételével római katolikus volt. A második katonai felmérés (1819–1869) alapján a 19. században a falu a mai Ady Endre és Petőfi utcák irányába terjeszkedett.
## 
![KÉP7](https://utfs.io/f/26L8Sk7UnuECpe74Ug60tYOVN4SgU2xuoem6swRjIQKAFZBL)
## 

## 
A lakosság lélekszáma a 19. században érte el a mindenkori csúcsát. Magyarország történeti statisztikai helységnévtára szerint 1785-ben 397 fő, 1828-ban 588 fő, 1857-ben 571 fő, 1870-ben 557 fő, 1880-ban 526 fő, 1890-ben 527 fő, 1900-ban 396 fő lakta a falut, és a hozzátartozó Kútipusztát. A falutól északkeletre, Kútipusztával azonosítható építmények már az első katonai felmérés térképén (1782-85) láthatók, de a 19. század első felében kezdenek ide más gazdasági épületeket és cselédlakásokat építeni. 1910-ben 63-an éltek ott.
## 
![KÉP8](https://utfs.io/f/26L8Sk7UnuECnNakkPypuwvx56J1US2AQWgyPYTDO7XGiend)
## 
## A 20. század

Az első világháború Bakonykúti lakóitól is sok áldozatot kívánt. A harctereken hősi halált halt 15 bakonykúti lakos neve a katolikus templom előtt 1937-ben felavatott emlékművön szerepel (Haraszti Márton várpalotai kőfaragó mester alkotása).
## 
A második világháború borzalmai 1944. december 20-án értek Bakonykúti közelébe, amikor a Vörös Hadsereg Mór térségében a falu mintegy 15 km-es közelségébe került. A 6. gárda hadsereg harckocsidandárjai azonban csak március 19-én foglalták el Bakonykútit a német 6. SS-páncélos hadsereg erős ellenállása ellenére. Mivel a harcok viszonylag rövid ideig dúltak és a falu többször nem cserélt gazdát, ezért „csak” 5 ház vált lakhatatlanná, és további 5 ház, valamint a templom rongálódott meg. 
## 
A falu lakosságának megpróbáltatásai nem értek véget a második világégéssel. 1948 februárjától kitelepítették a német nemzetiségű lakosságának jelentős részét, 11 családot (31 főt) Németországba. Helyükre többek között felvidéki magyarokat telepítettek be a csehszlovák-magyar lakosságcsere következtében. 
## 
1948 áprilisiában történt, hogy Shvoy Lajos püspök nyilvános hitehagyás miatt kiközösítette Bakonykúti kommunista papját, Szittyay Dénest, ami miatt a kommunista propaganda országos sajtóbotrányt gerjesztett Shvoy Lajos püspök lejáratása céljából.
## 
1949-ben önálló tanácsú községgé alakult Bakonykúti. Iskolája a második világháború után 8 osztályos általános iskolaként működött egészen 1964-ig, amikor az iskolák körzetesítésével a felső tagozatos tanulók Isztimérre kerültek. A tanulók létszámának csökkenése miatt végül 1970-ben zárták be az alsó tagozatot. 
## 
   Összeállította: dr. Szücsi Frigyes
## Felhasznált irodalom
- A Fejér megyei németek kitelepítésének története, különös tekintettel Mórra és környékére. A helyi identitás és kohézió erősítése Móron, TOP-5.3.1-16-FE1-2017-00008, Magyar Műemléki Topográfia Nonprofit Kft. https://www.topografia.hu/_user/browser/File/top531%20tanulmanyok/A%20Fejér%20megyei%20németek%20kitelepítésének%20története.pdf letöltés időpontja: 2025. 03. 17.

- Degré Alajos: Bakonykúti. Fejér Megyei Történeti Évkönyv 13 (1979) 243–267.

- Kállay István – Kovacsics József: Magyarország történeti statisztikai helységnévtára – 13. Fejér megye. Budapest 1998, 41.

- Reich Szabina: Bakonykúti, Szentegyházi-dűlő (033/1–2 hrsz.) tervásatás. Alba Regia 51 (2023) 99–100.

- Szij Rezső: Várpalota. Fejezetek a város történetéből, Budapest 1960. [195–196. oldal]

- Szücsi Frigyes: Bakonykúti község, települési örökségvédelmi hatástanulmány, régészeti munkarész, Bakonykúti 2018.

- Varga Mátyás: A Szittyay-eset. Egy rendhagyó kísérlet a katolikus egyház és az állam közti viszony rendezésére (1948). Székesfehérvár 2023.

- Zichy Paulina. krudylib.hu, Krúdy Gyula Városi Könyvtár, Várpalota. http://www.krudylib.hu/wiki/zichy-paulina letöltés időpontja: 2024. 05. 04.

-  I. világháborús emlékművek (Bakonykúti). https://mnl.gov.hu/mnl/fml/i_vilaghaborus_emlekmuvek_bakonykuti letöltés időpontja: 2025. 03. 17.


    
', 'bakonykuti/tortenet', '2025-03-23 04:57:42'),
(9, 'Bakonykúti Környéke', '
### **Iszkaszentgyörgy** _(10 km)_

- **Kastély**
- **Katolikus templom**
- **Szent György Kápolna**
- **Csillaghegyi kilátó**
- **Kőpiramis**

### **Kincsesbánya** _(9 km)_

- **Bányász emlékhely**

### **Fehérvárcsurgó** _(11 km)_

- **Gaja-völgyi tájcentrum** _(7.6 km)_
    - Víztározó
- **Károlyi kastély**

### **Csókakő** _(19 km)_

- **Csókakői vár**

### **Bodajk** _(13 km)_

- **Segítő Szűz Mária kegytemplom**
- **Kálvária domb**
- **Szoborpark**
    ', 'bakonykuti/kornyekunk', '2025-01-23 14:53:29'),
(13, 'Képviselő testület', '
2024-2029




|    Név    |  Titulus  |
| ------------------- | ------------- |
| Marics József        | polgármester polgarmester@bakonykuti.hu|
| Márkus Erika        | alpolgármester |
| Horel Ágota         | képviselő     |
| Pató Ágnes          | képviselő     |
| Talaberné Fodor Éva | képviselő     |

## 
[Bakonykúti Községi Önkormányzat Képviselő-testülete 2025-2029 évekre szóló gazdasági programja, fejlesztési terve](https://utfs.io/f/26L8Sk7UnuECpetpLib0tYOVN4SgU2xuoem6swRjIQKAFZBL) 
		', 'onkormanyzat/kepviselo-testulet', '2025-04-08 14:27:15'),
(14, 'Testületi ülés jegyzőkönyvek', '
## Meghívók jegyzőkönyvek 

## 2025
[2025 Április 24](https://utfs.io/f/26L8Sk7UnuECVC34uuqT1HuRmKsf6XNoZydnDGAWgaLqVOvr)

[2025 Március 27](https://utfs.io/f/26L8Sk7UnuEC5TKrRSkVqBcO9XlC0318ZTQN4s6Axy7fgoJD)

## 2024

[2024 December 05](http://www.bakonykuti.hu/jegyzokonyvek/2024_12_05.pdf)

[2024 November 28 Közös testületi ülés](http://www.bakonykuti.hu/jegyzokonyvek/2024_11_28_E.pdf)

[2024 November 20](http://www.bakonykuti.hu/jegyzokonyvek/2024_11_20.pdf)

[2024 Október 30 közmeghallgatás](http://www.bakonykuti.hu/jegyzokonyvek/2024_10_30kmh.pdf)

[2024 Október 30](http://www.bakonykuti.hu/jegyzokonyvek/2024_10_30.pdf)

[2024 Október 10](http://www.bakonykuti.hu/jegyzokonyvek/2024_10_10.pdf)

[2024 Szeptember 05](http://www.bakonykuti.hu/jegyzokonyvek/2024_09_05.pdf)

[2024 Május 23](http://www.bakonykuti.hu/jegyzokonyvek/2024_05_23.pdf)

[2024 Április 25](http://www.bakonykuti.hu/jegyzokonyvek/2024_04_25.pdf)

[2024 Március 28](http://www.bakonykuti.hu/jegyzokonyvek/2024_03_28.pdf)

[2024 Február 22](http://www.bakonykuti.hu/jegyzokonyvek/2024_02_22.pdf)

[2023 December 14](http://www.bakonykuti.hu/jegyzokonyvek/2023_12_14.pdf)

[2023 November 30](http://www.bakonykuti.hu/jegyzokonyvek/2023_11_30.pdf)

[2023 Október 26 közmeghallgatás](http://www.bakonykuti.hu/jegyzokonyvek/2023_10_26kmh.pdf)

[2023 Október 26](http://www.bakonykuti.hu/jegyzokonyvek/2023_10_26.pdf)

[2023 Szeptember 28](http://www.bakonykuti.hu/jegyzokonyvek/2023_09_28.pdf)



Ø  2023 Szeptember 28

Ø  2023 Augusztus 10

Ø  2023 Június 22

Ø  2023 Május 25

Ø  2023 Május 23

Ø  2023 Április 27

Ø  2023 Március 30

Ø  2023 Február 23  

Ø  2022 November 22 

Ø  2022 Október 27 Közmeghallgatás

Ø  2022 Otóber 27 

Ø  2022 Szeptember 08

Ø  2022 Július 14 

Ø  2022 Május 26

Ø  2022 Április 28

Ø  2022 Február 24

Ø  2022 Január 13

Ø  2021 November 25 

Ø  2021 Október 28

Ø  2021 Október 14 Közmeghallgatás

Ø  2021 Szeptember 30

Ø  2021 Augusztus 26

Ø  2021 Július 08

Ø  PM HAT 18 2021 5_21 ZÁRSZÁMADÁS 2020 ÉVRÕL

Ø  PM HAT 17 2021

Ø  PM HAT 16 2021

Ø  PM HAT 15 2021

Ø  PM HAT 14 2021

Ø  PM HAT 13 2021

Ø  PM HAT 12 2021
Ø  PM HAT 11 2021

Ø  PM HAT 10 2021

Ø  PM HAT 9 2021

Ø  PM HAT 6 2021

Ø  PM HAT 5 2021 

Ø  PM REND 4 2021 2021 évi költségvetési rendelet és mellékletei

Ø  PM REND 3 2021

Ø  PM HAT 3 2021

Ø  PM REND 2 2021

Ø  PM HAT 2 2021

Ø  PM REND 1 2021

Ø  PM HAT 1 2021

Ø  PM HAT 19 2020

Ø  PM HAT 18 2020

Ø  PM HAT 17 2020

Ø  PM HAT 16 2020

Ø  PM HAT 15 2020

Ø  PM HAT 13 2020

Ø  2020 Október 29 Közmeghallgatás

Ø  2020 Október 29

Ø  2020 Szeptember 18

Ø  2020 Július 09

Ø  PM HAT 9 2020

Ø  PM HAT 8 2020

Ø  PM HAT 7 2020

Ø  PM HAT 6 2020

Ø  PM HAT 5 2020

Ø  PM HAT 4 2020

Ø  Közmûvelõdés rendelet módosítás 2020

Ø  PM HAT 3 2020

Ø  PM HAT 2 2020

Ø  PM HAT 1 2020 

Ø  2020 Február 27

Ø  2019 November 28

Ø  2019 Október 21 Alakuló gyűlés

Ø  2019 Október 3

Ø  2019 Július 24

Ø  2019 Július 2

Ø  2019 Május 9

Ø  2019 Február 20

Ø  2019 Január 22 renkívüli

Ø  2018 November 27

Ø  2018 November 22 Közmeghallgatás

Ø  2018 Október 2 

Ø  2018 Szeptember 6

Ø  2018 Június 28

Ø  2018 Május 31

Ø  2018 Április 26

Ø  2018 Március 13

Ø  2018 Február 20

Ø  2017 december 19 rendkívüli

Ø  2017 november 23 közmeghallgatás

Ø  2017 november 23

Ø  2017 október 17

Ø  2017 szeptember 5

Ø  2017 június 27

Ø  2017 június 14

Ø  2017 május 24

Ø  2017 május 24 Iszka-Bakonykúti

Ø  2017 április 19

Ø  2017 március 23 rendkívüli ülés

Ø  2017 február 28

Ø  2017 február 16

Ø  2016 december 13

Ø  2016 november 24

Ø  2016 október 26

Ø  2016 szeptember 16

Ø  2016 július 22

Ø  2016 június 17

Ø  2016 május 31

Ø  2016 május 10

Ø  2016 május 10

Ø  2016 május 04 Iszka-Bakonykúti

Ø  2016 április 19

Ø  2016 március 30

Ø  2016 február 16

Ø  2016 február 16 Iszka-Bakonykúti

Ø  2015 december 15

Ø  2015 november 25

Ø  2015 november 25 Közmeghallgatás

Ø  2015 október 29

Ø  2015 augusztus 31

Ø  2015 június 30

Ø  2015 május 27

Ø  2015 május 8

Ø  2015 április 28

Ø  2015 február 19

Ø  2015 március 26

Ø  2014 december 19

Ø  2014 december 9

Ø  2014 november 25 közmeghallgatás

Ø  2014 november 25

Ø  2014 október 22 Alakuló Ülés

Ø  2014 április 22 rendkívüli

Ø  2014 március 04

Ø  2014 február 06

Ø  2014 február 06 Iszka 2014 január 28 rendkívüli

Ø  2014 január 21

Ø  2013 december 17

Ø  2013 december 5

Ø  2013 december 5 közmeghallgatás

Ø  2013 november 5 rendkívüli

Ø  2013 szeptember 19

Ø  2013 augusztus 22

Ø  2013 július 16

Ø  2013 június 20

Ø  2013 május 30

Ø  2013 április 30

Ø  2013 április 18

Ø  2013 február 14

Ø  2012 december 19

Ø  2012 november 29

Ø  2012 november 22

Ø  2012 október 24

Ø  2012 szeptember 21

Ø  2012 augusztus 13

Ø  2012 július 3

Ø  2012 június 19

Ø  2012 június 1

Ø  2012 május 2

Ø  2012 május 2 Iszkaszentgyörgy

Ø  2012 március 28

Ø  2012 február 29

Ø  2012 február 16

Ø  2011 január 26

Ø  2011 december 13

Ø  2011 november 29

Ø  2011 november 28 Közmeghallgatás

Ø  2011 október 12

Ø  2011 szeptember 13

Ø  2011 június 27

Ø  2011 június 8

Ø  2011 május 25

Ø  2011 április 25

Ø  2011 április 25 Iszkaszentgyörgy

Ø  2011 január 25

Ø  2011 február 15 Iszkaszentgyörgy

Ø  2011 február 15

Ø  2010 október 15

Ø  2010 november 9

Ø  2010 december 14 elõterjesztés

Ø  2010 december 14

Ø  2010 november 23 rendkívüli

Ø  2009 november 26 közmeghallgatás

Ø  2008 január 29

Ø  2008 február 15

Ø  2008 március 27

Ø  2008 április 8

Ø  2008 április 22

Ø  2008 május 15

Ø  2008 május 27

Ø  2008 június 26a>

Ø  2008 július 24

Ø  2008 szeptember 15

Ø  2008 szeptember 15 Iszkaszentgyörgy

Ø  2008 október 17

Ø  2008 november 24

Ø  2008 november 24 Iszkaszentgyörgy

Ø  2008 november 24 Iszka-Bakonykuti

Ø  2008 november 21 közmeghallgatás

Ø  2008 december 15

Ø  2008 január 15
		', 'onkormanyzat/testuleti-ulesek', '2025-05-04 11:42:54'),
(16, 'Önkormányzati rendeletek', '
[Nemzei Jogszabálytár](https://or.njt.hu/onkorm/-:19:3678:-:-:1:-:-:-/1/10)

6/2022 rendelet

Személyes gondoskodást nyújtó szociális ellátások térítési díjainak változása

10/2021 rendelet

Személyes gondoskodást nyújtó szociális ellátások (egységes szerkezetbe foglalt)

		', 'onkormanyzat/onkormanyzati-rendeletek', '2024-12-08 20:57:44'),
(19, 'Iszkaszentgyörgyi Közös Önkormányzati Hivatal ', '
## **Iszkaszentgyörgyi Közös Önkormányzati hivatal ügyfélfogadása:**



Hétfõ: 13:00 – 15:30

Kedd : 08:00-12:00

Szerda: 08:00-12:00 és 13:00-15:30

Csütörtök: Nincs

Péntek: 8:00-12:00
 

## **Iszkaszentgyörgyi Közös Önkormányzati hivatal elérhetõségei:**

Telefon: 22-596-026 vagy 22-441-010

Fax: 22-596-027

E-mail: jegyzo@iszkaszentgyorgy.hu

 ## 

Bővebb információ a Közös Hivatal munkatársairól és ügyfélfogadási rendjéről itt található: https://iszkaszentgyorgy.hu/onkormanyzat/kozos-hivatal-munkatarsai-es-ugyfelfogadasi-rendje/ 
	', 'onkormanyzat/iszkaszentgyorgyi-kozos-onkormanyzati-hivatal', '2025-01-23 15:29:48'),
(26, 'Elérhetőségek', '
Iszkaszentgyörgyi Közös Önkormányzati hivatal elérhetőségei:
- Telefon: 22-596-026 vagy 22-441-010
- E-mail: jegyzo@iszkaszentgyorgy.hu

Bakonykúti Önkormányzati hivatal elérhetőségei:
- Ügyfélfogadás kedden 08.00-12.00-ig
- Telefon: 22-596-026
- E-mail: polgarmester@bakonykuti.hu

		', 'onkormanyzat/elerhetosegek', '2025-01-23 15:26:10'),
(27, 'Közérdekü adatok', 'Törvényes', 'onkormanyzat/kozerdeku-adatok', '2025-01-23 15:35:43'),
(28, 'Hirdetmény', 'A legfrissebb hirdetmények elérhetőek itt. 
## 
VERGA haszonbérleti díj: 

https://utfs.io/f/26L8Sk7UnuECj2meBsdVTPH1f4QNIYeZOKG0nqzEAJr6FLgy
## 
MEGHÍVÓ a VERGA Vadászterület tulajdonosi közösségének gyűlésére (2025.04.24, 8:00-9:00): 

https://utfs.io/f/26L8Sk7UnuECHms9aAPrhOQ7z5tdNT6PIwFxqfA2XscmnvoM
## 
		', 'onkormanyzat/hirdetmenyek', '2025-03-20 18:35:20'),
(30, 'Szabályzatok', '
1. [Számviteli politika](http://bakonykuti.hu/szabalyzat/1_Szamviteli_politika_%202020_1_.01.pdf "Klikk a megnyitáshoz")

2. [Számlarend](http://bakonykuti.hu/szabalyzat/2_Szamlarend_2020_11_.01.pdf "Klikk a megnyitáshoz")

3. [Bizonylat](http://bakonykuti.hu/szabalyzat/3_Bizonylati_szabalyzat_2020_11_01.pdf "Klikk a megnyitáshoz")

4. [Gazdálkodás](http://bakonykuti.hu/szabalyzat/4_Gazdalkodasi_2020_11_01.pdf "Klikk a megnyitáshoz")

5. [Pénzkezelés](http://bakonykuti.hu/szabalyzat/5_Penzkezelesi_szabalyzat_2020_11_01.pdf "Klikk a megnyitáshoz")

6. [Leltározás](http://bakonykuti.hu/szabalyzat/6_Leltarozasi_szabalyzat_2020_11_01.pdf "Klikk a megnyitáshoz")

7. [Értékelés](http://bakonykuti.hu/szabalyzat/7_Ertekelesi_szabalyzat_2020_11_01.pdf "Klikk a megyitáshoz")

8. [Selejtezés](http://bakonykuti.hu/szabalyzat/8_Selejtezesi_szabalyzat_2020_11_01.pdf "Klikk a megnyitáshoz")

9. [Önköltség számítás](http://bakonykuti.hu/szabalyzat/9_Onkoltseg_szamitasi_szabalyzat_2020_11_01.pdf "Klikk a megnyitáshoz")

10. [Telefon](http://bakonykuti.hu/szabalyzat/10_Telefon_szabalyzat_2021_01_01.pdf "Klikk a megnyitáshoz")

11. [Közérdekû adatok](http://bakonykuti.hu/szabalyzat/11_Kozerdeku_adatok_szabalyzat.pdf "Klikk a megnyitáshoz")

12. [Reprezentáció](http://bakonykuti.hu/szabalyzat/12_Reprezentacios_szabalyzat_2021_01_01.pdf "Klikk a megnyitáshoz")

13. [Kiküldetés](http://bakonykuti.hu/szabalyzat/13_Kikuldetesi_szabalyzat_2021_01_01.pdf "Klikk a megnyitáshoz")

14. [Belsõ kontroll](http://bakonykuti.hu/szabalyzat/14_Belso_kontroll_2021_04_01.pdf "Klikk a megnyitáshoz")

15. [Beszerzés](http://bakonykuti.hu/szabalyzat/15_Beszerzesi_2020_11_01.pdf "Klikk a megnyitáshoz")

[Adatkezelési tájékoztató KÖH](http://bakonykuti.hu/szabalyzat/Adatkezelesi_tajekoztato_KOH.pdf "Klikk a megnyitáshoz")

[Adatvédelmi szabályzat](http://bakonykuti.hu/szabalyzat/Adatvedelmi_szabalyzat_2020_08_01.pdf "Klikk a megnyitáshoz")

[Közzétételi lista](http://bakonykuti.hu/szabalyzat/KozzetetelLst.pdf "Klikk a megnyitáshoz")
		', 'onkormanyzat/szabalyzatok', '2024-12-09 19:28:25'),
(33, 'Helyi Esélyegyenlőségi Program', '
Az Egyenlő Bánásmód Hatóság feladata a diszkriminációval okozott jogsértések kivizsgálása és megszüntetése.


## 

Bakonykúti Helyi Esélyegyenlőségi Programja megtekinthető [ITT](http://www.bakonykuti.hu/HEP/BK_HEP.pdf)


		', 'onkormanyzat/helyi-eselyegyenlosegi-program', '2024-12-30 11:37:48'),
(34, 'Településrendezési eszközök és arculati kézikönyv', '## Bakonykúti Község jóváhagyott településfejlesztési koncepciója, településszerkezeti terve, helyi építési szabályzata és arculati kézikönyve 

1. TELEPÜLÉSFEJLESZTÉSI KONCEPCIÓ
 

[H27.sz. Határozat - koncepció](http://www.bakonykuti.hu/bkhesz/27hat.pdf)
 

[BAKONYKÚTI TELÜLÉSFEJLESZTÉSI KONCEPCIÓ](http://www.bakonykuti.hu/bkhesz/BKTFK.pdf)

 
 

2. TELEPÜLÉSSZERKEZETI TERV
 

[BAKONYKÚTI TSZT Határozat és leírás](http://www.bakonykuti.hu/bkhesz/BKTSZTHAT.pdf)

 

[TSZT SZERKEZETI TERV](http://www.bakonykuti.hu/bkhesz/TSZTszt.pdf)

 

3. HELYI ÉPÍTÉSI SZABÁLYZAT
 

[BAKONYKÚTI HÉSZ](http://www.bakonykuti.hu/bkhesz/BKHESZ.pdf)

 

[HÉSZ 2.sz MELLÉKLET : SZT-1 Belterületi szabályozási terv](http://www.bakonykuti.hu/bkhesz/SZT1Belt.pdf)

 

[HÉSZ 3.sz. MELLÉKLET: SZT-2 Külterületi szabályozási terv](http://www.bakonykuti.hu/bkhesz/SZT2Kult.pdf)

 

[HESZ 3. függelék mintakeresztszelvenyek](http://www.bakonykuti.hu/bkhesz/BKHESZ3mkszelv.pdf)

 ## 
[TELEPÜLÉS ARCULATI KÉZIKÖNYV](http://www.bakonykuti.hu/rend/Bakonykuti_TAK.pdf)
 

 
## 
## TELEPÜLÉSKÉP VÉDELEM
 

Közérthetõ tájékoztató a településkép védelmérõl szóló rendelet módosításáról [itt](http://www.bakonykuti.hu/Hirdet/S25C-921111112011.pdf)! /2021.10.11/

 

 
## 
Tájékoztató a településkép védelmérõl szóló önkormányzati rendeletrõl és a települési fõépítész alkalmazásáról

[Megnyitás PDF-ben](http://www.bakonykuti.hu/Hirek/FoepiteszTajekoztato.pdf)
## 


Az eljárások szakszerû lefolytatása érdekében Bakonykúti Község Önkormányzata 2025. január 1-tõl települési fõépítészt foglalkoztat. A települési fõépítész elérhetõségei az alábbiak:

·         Név:           Eartl Antal

·         Telefon:      +36/70-385-0133

·         e-mail:        ertl.antal@feterv.hu

·         személyesen:        Székesfehérvár, Kassai utca 79. Irodában, előzetes egyeztetést követően. 


## 
', 'onkormanyzat/telepulesrendezesi-eszkozok-es-arculati-kezikonyv', '2025-01-23 15:22:21'),
(36, 'Pályazatok', '## Magyar Falu Program
 
 ![Magyar Falu Program](https://utfs.io/f/26L8Sk7UnuECxbds1Im6US9lW2db5o0YcJV4Xyum8ekwHTvx)

## 
Bakonykúti Község Önkormányzata a Magyar Falu Program keretében 2022-ben meghirdetett „**Közösségszervezéshez kapcsolódó eszközbeszerzés és közösségszervezõ bértámogatása – 2022**” címû, **MFP-KEB/2022** kódszámú pályázati kiírásra benyújtott pályázatára **1.762.800** Ft. vissza nem térítendő támogatásban részesült.
 ## 
Bakonykúti Község Önkormányzata a Magyar Falu Program keretében „**Közösség szervezéshez kapcsolódó eszközbeszerzés és közösségszervező bértámogatása**” **MFP-KEB/2021** pályázati kiírásra benyújtott pályázatára **1.517.670** Ft. vissza nem térítendő támogatásban részesült.
##  
Bakonykúti Község Önkormányzata a Magyar Falu Program keretében meghirdetett, „**Orvosi rendelők fejlesztése-2020**” címû pályázati kiírásra benyújtott pályázatára **29.761.013** Ft. vissza nem térítendő támogatásban részesült. 
 
## 
Bakonykúti Község Önkormányzata a Magyar Falu Program keretében meghirdetett „Nemzeti és helyi identitástudat erősítése” pályázati kiírásra benyújtott pályázatára 1.398.150 Ft. vissza nem térítendő támogatásban részesült.

 
## 
Bakonykúti Község Önkormányzata a Magyar Falu Program keretében meghirdetett „**Orvosi eszköz beszerzése**” pályázati kiírásra benyújtott pályázatára **2.967.878** Ft. vissza nem térítendő támogatásban részesült.

 
## 
Bakonykúti Község Önkormányzata a Magyar Falu Program keretében meghirdetett „**Temetõ fejlesztése**” pályázati kiírásra benyújtott pályázatára **4.908.993** Ft. vissza nem térítendő támogatásban részesült.

 
## 
Bakonykúti Község Önkormányzata a Magyar Falu Program keretében meghirdetett,
"**Közösségi tér ki- /átalakítás és foglalkoztatás - 202**0"  címû pályázati kiírásra benyújtott
pályázatára **1.484.730** Ft. támogatásban részesült.

 

## 
Bakonykúti Község Önkormányzata által a
 „**TELEPÜLÉSI KÖNYVTÁRAK SZAKMAI ESZKÖZFEJLESZTÉSÉRE, KORSZERÛSÍTÉSÉRE**” benyújtott pályázatára a **KÖZGYÛJTEMÉNYEK KOLLÉGIUMA 022/204/19** számú döntése végrehajtásaként az Emberi Erõforrás Támogatáskezelõ a Nemzeti Kulturális Alap terhére **2.158.784** Ft. vissza nem térítendõ támogatást folyósít.
A támogatás utalásának várható idõpontja: 2019. 12. 19.
 
##  

## **Tájékoztató a KÖFOP-1.2.1-VEKOP-16 Csatlakoztatási konstrukció az önkormányzati ASP rendszer országos kiterjesztéséhez címû pályázatról**

 

A kedvezményezett neve: Iszkaszentgyörgy Község Önkormányzata

A támogatás összege: **5.988.840** Ft, támogatási intenzitás: 100%

A projekt azonosító száma: KÖFOP-1.2.1-VEKOP-16-2017-01004

Támogatói okirat kelte: 2017. május 3.

A projekt megvalósításának befejezése: 2018. június 30.

 

Iszkaszentgyörgy Község Önkormányzata 2017. februárban nyújtotta be pályázatát a KÖFOP-1.2.1-VEKOP-16 Csatlakoztatási konstrukció az önkormányzati ASP rendszer országos kiterjesztéséhez címû felhívásra.

A támogatási döntés alapján az önkormányzat **6 millió** Ft vissza nem térítendő támogatásban részesült Magyarország Kormánya és az Európai Unió által. A projekt célja az egységesített önkormányzati elektronikus ügyviteli megoldások bevezetése 
országos szinten, az egyes települési önkormányzatok az Önkormányzati ASP központhoz történő csatlakozásának megvalósításával. A támogatás segítségével beszerzésre kerül 6 db, az ASP rendszer követelményeinek megfelelő hardverrel és szoftverekkel rendelkező számítógép, 1 db laptop, 7 db monitor és 7 db kártyaolvasó; utóbbi eszköz lehetővé teszi az elektronikus személyi igazolvánnyal történő belépést az ügyintézéshez az ügyfelek részéről is. Az eszközök beszerzésén túl megvalósul az elektronikus ügyintézés feltételeinek kialakítása és ehhez kapcsolódóan az önkormányzati rendeletek felülvizsgálata, a szabályzatok aktualizálása, továbbá a szakrendszerek adatainak az ASP központi rendszerbe történõ migrációja. A projekt biztosítja az Iszkaszentgyörgyi Közös Önkormányzati Hivatal dolgozóinak a 
Magyar Államkincstár Fejér Megyei Igazgatósága által szervezett oktatásokon való részvétel útiköltségét, a kötelezõ nyilvánosság biztosításának költségeit, valamint a projektmenedzsment díját. 

##  

Székesfehérvár sikeresen pályázott "**Az alapellátás és népegészségügy rendszerének átfogó fejlesztése - népegészségügy helyi kapacitás fejlesztése**"címû pályázatra.

A pályázat célja a székesfehérvári járásban a Lelki Egészség Központtal kibővített Egészségfejlesztési Iroda kialakítása.
2018. szeptember elsejétõl az Egészségfejlesztési Iroda megkezdi működését.

Átfogó céljuk a járásban élők egészségi állapotának javításával a születéskor várható élettartam és az egészségben eltöltött életévek számának növelése, továbbá a lakosság egészségtudatosságának, egészségkultúrájának fejlesztése prevenciós közösségi programok és egyéni tanácsadások megvalósításával.

 
## 
Egészségfejlesztési Iroda központi email címe:
 
efi@efi.szekesfehervar.hu
 

Egészségfejlesztési Iroda vezetõ email címe: 

hujber.anita@efi.szekesfehervar.hu

 

Humán Szolgáltató Intézet központi email címe:

titkarsag@humanszolg.hu

 
## 
## Tájékoztató Levél a járás településeinek:
http://www.bakonykuti.hu/Hirek/Egeszsegfejlesztesi_Iroda.pdf

## 

2018.08.28

Marics József

polgármester

	', 'onkormanyzat/palyazatok', '2024-12-31 07:46:40'),
(37, 'Választás', '## Önkormányzati és EP Választások 2024

### Választási eredmények

- **Polgármester választás eredménye** [(PDF)](url)
- **Képviselő választás eredménye** [(PDF)](url)

---

### Jóváhagyott Szavazólapok

- **Polgármester választás szavazólap** [(PDF)](url)
- **Képviselő szavazólap** [(PDF)](url)

---

### Önkormányzati Választások 2024 Nyilvántartásbavétel és Sorsolás

#### **Sorsolás**

- **Polgármester sorsolás** [(PDF)](url)
- **Képviselő sorsolás** [(PDF)](url)

#### **Nyilvántartásbavétel**

- **Szalmási Korinna** [(PDF)](url)
- **Marics József** [(PDF)](url)
- **Krizsán Attila** [(PDF)](url)
- **Mészáros Imola Katalin** [(PDF)](url)
- **Talabérné Fodor Éva** [(PDF)](url)
- **Kasztiné Körmöczi Nóra** [(PDF)](url)
- **Pató Ágnes** [(PDF)](url)
- **Volkensdorfer Istvánné** [(PDF)](url)
- **Márkus Erika** [(PDF)](url)
- **Kurjancsek László** [(PDF)](url)
- **Horel Ágota** [(PDF)](url)

---

### Tájékoztató választópolgároknak

- **Az Iszkaszentgyörgyi Helyi Választási Iroda Vezetőjének 2/2024. (IV.04.) számú közleménye**

#### **Helyi Választási Iroda vezetőjének határozata a képviselők számáról**

- **2/2023. (10.24.) HVI Vezetői Határozat**', 'onkormanyzat/valasztas', '2024-12-21 11:04:15'),
(39, 'Iszkaszentgyörgyi Szociális Intézményi Társulás', '## Iszkaszentgyörgyi Szociális Intézményi Társulás (ISZIT)


Információ: https://iszkaszentgyorgy.hu/intezmenyek/iszkaszentgyorgyi-szocialis-intezmenyi-tarsulas-iszit/', 'intezmenyek/iszkaszentgyorgyi-szocialis-intezmenyi-tarsulas', '2024-12-29 11:49:43'),
(40, 'Iszkaszentgyörgyi Szociális Alapszolgáltatási Intézmény', '## Tájékoztató az Iszkaszentgyörgyi Szociális Alapszolgáltatási Intézmény szolgáltatásairól 
 
Az Iszkaszentgyörgyi Szociális Alapszolgáltatási Intézmény, amely Iszkaszentgyörgyön, a Rákóczi u. 48. szám alatt található, a Bakonykúti településen élő lakosság számára az alábbi szociális és gyermekjóléti alapellátásokat biztosítja:

1. Szociális étkeztetés, 
1. Házi segítségnyújtás, 
1. Idősek  nappali ellátása helyileg Iszkaszentgyörgy településen
1. Család- és gyermekjóléti szolgálat 

## ÉTKEZTETÉS:

Ki igényelheti az étkeztetést?
## 
Az étkeztetés keretében azoknak a legalább napi egyszeri meleg étkezéséről tudunk gondoskodni, akik azt önmaguk, illetve eltartottjaik részére tartósan vagy átmeneti jelleggel nem képesek biztosítani, különösen
koruk,
- egészségi állapotuk,
- fogyatékosságuk, pszichiátriai betegségük,
- szenvedélybetegségük, vagy
- hajléktalanságuk miatt.
## 
Az ételt az Iszkaszentgyörgyi Vackor Óvoda konyhájáról szállítjuk a településre. 

Az étel kiszállítás munkanapokon 11:30-tól -13:30 óráig történik.

Az étkeztetés - jövedelemtől függően- térítési díjhoz kötött. A jelenleg érvényes térítési díj: 1325,- Ft/adag házhozszállítással.

## HÁZI SEGÍTSÉGNYÚJTÁS:
A házi segítségnyújtás alapvető gondozási és ápolás körébe tartozó feladatokat lát el.

Olyan gondozási forma, amely az igénybe vevő önálló életvitelének fenntartását – szükségleteinek megfelelően – otthonában, lakókörnyezetében biztosítja.
## 
**Miben tudunk segítséget nyújtani?**

- A személyi és lakókörnyezeti higiéné megtartásában (fürdetés, mosdatás, hajmosás, körömápolás, ruházat mosása, vasalása, takarítás, mosogatás, porszívózás, a vizes helyiségek rendbetétele, a napi életvitelhez tartozó rend fenntartása)
- Közreműködés a háztartási feladatok ellátásában (bevásárlás, főzés előkészítése, hivatalos ügyek intézése, csekkek feladása, növényápolás segítése)
- A háziorvos által előírt gondozási, alapápolási feladatok ellátásában (gyógyszer felíratás, kiváltás, adagolás, ellenőrzés, a segédeszközök felíratása, kiváltása, használatuk elsajátításának segítése, pelenkázás, öltöztetés, az étkezés segítése, diéta betartatása, vérnyomás- és vércukorszint-mérés, folyamatos kapcsolattartás a háziorvossal, szükség esetén a szakorvosi ellátásokra beutaló kérése, séta szervezése az erőnléti állapot fenntartása céljából)
- A házi segítségnyújtás igénybevétele önkéntes, viszont térítési díjhoz kötött, jövedelemtől függően: 90-270,- Ft/óra.

## IDŐSEK NAPPALI ELLÁTÁSA:

A nappali ellátás célja pótolni a hiányzó családi gondoskodást, fizikai, mentális és pszicho- szociális segítséget nyújtani az otthonukban élő, önmaguk ellátására részben képes 18. életévüket betöltött személyek számára.

## 
**Mit biztosítunk az ellátás keretében?**

- napközbeni tartózkodást,
- társas kapcsolatok kialakítását,
- az alapvető higiéniai szükségletek kielégítését,
- szabadidős programokat (társasjátékok, zenehallgatás, filmvetítés, zenés-táncos délutánok, kirándulás, felolvasás, torna),
- napi 3x-i étkezést,
- egészségügyi alapellátáshoz vagy szakellátáshoz való hozzájutás segítése (gyógyszerek felíratása, kiváltása; időpont kérése; szükség esetén egészségügyi intézménybe szállítás, kísérés),
- hivatalos ügyek intézése (kérelmek, nyomtatványok kitöltése, postai ügyek intézése),
- életvitelre vonatkozó tanácsadás, életvezetés segítése,
- szükség esetén más szociális alapellátáshoz való hozzájutás segítése (pl. házi segítségnyújtás),
- egészségnevelés, mentális gondozás,
- felvilágosító, egészségügyi előadások szervezése,
- tisztálkodási, mosási, vasalási, varrási lehetőség,
- televízió, rádió, CD lejátszó használat. Újság (heti- és napilapok), könyvek, társasjátékok biztosítás,
- rendszeres vérnyomás és testsúlymérés. 
- rendezvények, ünnepek szervezése, munkavégzés lehetőségének szervezése,
- speciális önszerveződő csoportok támogatása, működésének, szervezésének segítése.

Az idősek nappali ellátása helyileg az Iszkaszentgyörgy, Rákóczi u. 48. szám alatti intézményünkben található. Az igénybevétel ingyenes, a szállításban igény szerint segítséget tudunk nyújtani.

## 
## Család- és Gyermekjóléti Szolgálat:
A családsegítés és a gyermekjóléti szolgáltatás 2016. január 1-jétől  összevonásra került, egy szervezeti és szakmai egységben működik, ezért feladataink egy részét a gyermekjóléti szolgáltatás (Gyvt. 40.§.), másik részét a családsegítés (Szt. 64.§.) szolgáltatásainak ellátása jelenti.
## 
- A **gyermekjóléti szolgáltatás** a szociális munka eszközeinek és módszereinek alkalmazásával szolgálja a gyermek testi, lelki egészségének megőrzését, elősegíti a gyermek családban történő nevelkedését, veszélyeztetettségének megelőzését, a kialakult veszélyhelyzet megszüntetését. A szociális munka módszereivel és eszközeivel, humán szolgáltatások biztosításával elkerülhetővé válik a hatósági beavatkozás.
- **Családsegítés**körében a szociális vagy mentálhigiénés problémák, illetve egyéb krízishelyzetek miatt segítségre szoruló személyek, családok, tartós munkanélküliek, fiatal munkanélküliek, adósságterhekkel, lakhatási problémákkal küzdők, fogyatékossággal élők, krónikus betegek, szenvedélybetegek, pszichiátriai betegek számára, illetve az ilyen helyzethez vezető okok megelőzése, a krízishelyzet megszüntetése, valamint az életvezetési képesség megőrzése céljából nyújt szolgáltatást.
 ## 
**A Család-és gyermekjóléti Szolgálat feladatai:**
## 
- tájékoztatás, információnyújtás,
- szociális segítő munka,
- ellátások, szolgáltatások közvetítése,
- hivatalos ügyek intézése,
- a családban jelentkező nevelési problémák és hiányosságok káros hatásainak enyhítése,
- észlelő és jelzőrendszer működtetése,
- adminisztrációs tevékenységi kör,
- prevenciós programok szervezése.
## 
Bakonykúti település családsegítője: Siposné Varga Petra
Elérhetősége: 06-20/426-0830
Ügyfélfogadás: igény szerint, előzetes telefonos egyeztetés után
A szolgáltatásokkal, az igénybevétellel kapcsolatban a következő elérhetőségeken érdeklődhetnek:
Levelezési cím:
- Iszkaszentgyörgyi Szociális Alapszolgáltatási Intézmény
- 8043 Iszkaszentgyörgy, Rákóczi u. 48. 

**Elérhetőség:**
Seresné Zsidai Borbála, intézményvezető
- Tel.: 06-20/293-9120
- Email: ics.szocintezmeny@gmail.com 

**Nyitva tartás:**
- hétfő-péntekig: 7-15 óra között

**Bakonykúti Önkormányzat részéről Pató Ágnes önkormányzati képviselő a közvetlen kapcsolattartó az Intézménnyel.**
## 
További információ: 
https://iszkaszentgyorgy.hu/intezmenyek/iszai/1', 'intezmenyek/iszkaszentgyorgyi-szocialis-alapszolgaltatasi-intezmeny', '2025-01-17 02:52:07'),
(41, 'Iszkaszentgyörgyi Általános Iskola', '## Iszkaszentgyörgyi Általános Iskola

8043 Iszkaszentgyörgy, Kastély u. 8.  
Tel.: +36 22 596 191  
Email: titkar@iszkaiskola.hu

Nyitvatartási idő:
07:00 – 18:00
## 
Weboldal: https://iszkaiskola.hu/
', 'intezmenyek/iszkaszentgyorgyi-altalanos-iskola', '2024-12-29 11:56:59'),
(42, 'Iszkaszentgyörgyi Vackor Óvoda – Mini Bölcsőde és Konyha', '## Iszkaszentgyörgyi Vackor Óvoda – Mini Bölcsőde és Konyha

Cím: 8043 Iszkaszentgyörgy, Mándi Márton István tér 2

## 
**Intézményvezető:** Polyák-Ruff Mónika

Telefon: (22)612-472

Gazdasági iroda: (22)612-479
## 
Email:  
iszka.vackorovi@gmail.com 

iszka.ovoda@gmail.com
## 

További információ: https://iszkaovi.hu/

		', 'intezmenyek/iszkaszentgyorgyi-vackor-ovoda-es-konyha', '2024-12-29 11:46:16'),
(43, 'Bakonykúti Közösségi Ház és Könyvtár', '## Bakonykúti Közösségi Ház és Könyvtár
## Nyitvatartási idő



Csütörtök  		13:00 – 17:00

Péntek 		08:00 – 12:00

illetve előzetes időpont-egyeztetéssel: +36/30-129-3691 (Mészáros Imola), valamint a programok ideje alatt.

		', 'intezmenyek/kozossegi-haz-es-konyvtar', '2025-01-23 15:38:26'),
(46, 'Háziorvos és orvosi ügyelet', '
## Háziorvosi ellátás 

  

Háziorvos:          Dr. Rumann Hildegard

  

Helyettes háziorvos hétfőnként: Dr. Nap Ágnes

  

Asszisztens:       Somogyiné Fodor Melinda

  
## 
**Orvosi rendelő**

  

8043 Iszkaszentgyörgy, Kossuth tér 1.- Egészségház,Tel.: (22) 440-105

  

8046 Bakonykúti, Szabadság u. 41. Tel.: (22) 595-000

| Rendelési idő  | Iszkaszentgyörgyön | Bakonykútiban |
| -------------- | ------------------ | ------------- |
| Hétfő          | 13.00-14.30        | -             |
| Kedd           | 09.00-13.00        | -             |
| Szerda         | 8.00-11.30         | 12.15-14.30   |
| Csütörtök      | 14.00-18.00        | -             |
| Péntek         | 11.00-13.00        | -             |


Dr. Rumann Hildegard háziorvos elérhetősége sürgős esetekben munkanapokon 8.00-16.00 óráig: 20-471-7179 telefonszámon.

  

A rendelésre előzetes bejelentkezés szükséges telefonon vagy e-mail-ben.

  

Elérhetőségek: 440-105 illetve 06-20-471-7179

  

E-mail: iszkarendelo@gmail.com

  

Munkanapokon 16 óra után, valamint hétvégén és ünnepnapokon Székesfehérváron a Városkörnyéki Ügyeleten vehető igénybe az orvosi ellátás.

  

## Központi Orvosi Ügyelet:

2024. február 1. napjától az ügyeleti feladat ellátásáról az Országos Mentőszolgálat gondoskodik az alábbiak szerint:

**Felnőtt ügyelet:**

Fejér Vármegyei Szent György Egyetemi Oktató Kórház Sürgősségi Osztálya (Székesfehérvár, Hunyadi u. 2. SBO
belépési pont) 2067-es számú rendelő

**Telefon: 1830**
##  
Rendelési idő:

Hétköznap 16:00-22:00 óra között, illetve hétvégén és ünnepnapokon 08:00-14:00 óra között
## 
**Gyermekorvosi ügyelet:**

**Telefon: 1830**

Fejér Vármegyei Szent György Egyetemi Oktató Kórház Gyermekambulancia mellett (Seregélyesi út) gyermek
ügyeleti rendelők

**Telefon: 1830**

Hétköznap 16:00-22:00 óráig, hétvégén és ünnepnapokon 08:00-20:00 óráig.
## 
**Sürgősségi ügyelet vagy mentőellátás:**

Hétköznap 22:00-08:00 óráig, hétvégén és ünnepnapokon 14:00-08:00 óráig

Székesfehérvár, Hunyadi u. 2. (SBO belépési pont)  
', 'egeszsegugy/haziorvosi-ellatas', '2025-01-30 14:44:07'),
(47, 'Fogászat', '## Fogorvosi rendelés:

Fogorvos: Dr. Óvári Péter

Fogorvosi asszisztens: Balogh Enikõ



## 
Fogászati bejelentkezés telefonszáma:

+36 30 496 3989

|    Rendelő    |  Rendelési Napok |Rendelési idő | 
| ------------------- | ------------- |------------- |
| Iszkaszentgyörgy       | Hétfõ (Magánrendelés) |13-19 (19-20) |
|Kincsesbánya        | Kedd (Magánrendelés) | 8-14 (14-15) |
| Kincsesbánya       | Szerda (Magánrendelés)     |13-19 (19-20) |
|Iszkaszentgyörgy           | Csütörtök (Magánrendelés)| 8-14 (14-15) |
|Iszkaszentgyörgy           | Csütörtök rendelési időn belül gyermek- és iskolafogászat| 8-10 |
| Kincsesbánya| Péntek (Magánrendelés)     |8-14 (14-15) |
|Kincsesbánya           | Péntek rendelési időn belül gyermek- és iskolafogászat| 8-10 |', 'egeszsegugy/fogaszati-rendeles', '2024-12-29 12:20:43'),
(49, 'Vedőnő', '

## Védőnői Tanácsadás

**Gál Diána védőnő**

Tel.: 06-30/633-8716
## 
Kedd Iszkaszentgyörgyön:
- Csecsemő tanácsadás: 09:00 – 11:00
- Várandós tanácsadás: 13:00 – 15:00

Csütörtök (páratlan héten)
- Bakonykútiban: 09:30 – 10:30
', 'egeszsegugy/vedonoi-ellatas', '2025-02-24 09:20:27'),
(50, 'Vérvétel', '
## Vérvétel 

Iszkaszentgyörgy Orvosi rendelőben csütörtökönként egyeztetett időpontfoglalás után. 
Időpontot foglalni a Dr. Rumann Hildegard házi orvosnál lehet kérni az iszkarendelo@gmail.com email címen vagy rendelési időben telefonon. 

Előzetes bejelentkezés szükséges

		', 'egeszsegugy/vervetel', '2025-01-23 15:54:13'),
(52, 'Honvédség', '## Bakonykúti Kiképző Bázis 


![alt WIP](https://utfs.io/f/26L8Sk7UnuECwcWT6w9heWP5jZyfGnp24M8Jrbm0t9vNAFka)
## 
Legfrissebb lőtéri értesítő: http://www.bakonykuti.hu/loter/Loter202502.pdf
		', 'kozerdeku/magyar-honvedseg-boszormenyi-geza-csapatgyakorloter-parancsnoksag', '2025-01-23 09:35:41'),
(53, 'DRV', '
## A DRV Zrt. ügyfélszolgálatának elérhetőségei:

## Telefonos elérhetőség
**Hibabejelentés**:	

+36 80 240 240, 1-es menüpont	0:00–24:00

Ingyenesen hívható telefonszám:

+36 80 240 240

## 
Munkanapokon

7:30-tól 15:30-ig,
csütörtökön 20.00-ig

Faxszám:

+36 84 501 299

 

Külföldről hívható telefonszám:

+36 84 999 240

Minden nap
0:00–24:00


Elektronikus levélcím:

ugyfelszolgalat@drv.hu

 
## 
**További információ:**

https://www.drv.hu/elerhetosegeink
## 
## Szennyvíz szippantásának megrendelése 
## 
2025 szeptember 30-ig hívható: 
+36/30/385-0684', 'kozerdeku/drv', '2025-01-23 15:46:18'),
(54, 'E-On', '
## Közvilágítási hibabejelentő telefonszám

## **E-On**

06-80-533-533

Észak-dunántúli régió

## Mit tegyek, ha közvilágítási hibát észlelek?

Az élet- és vagyonvédelmet veszélyeztető hibákat  telefonon jelentse be. Jellemző élet és vagyonvédelmet veszélyeztető közvilágítási hibák: ki- és megdőlt lámpaoszlop; hiányzó kandeláber ajtó; megrongált/lógó lámpabúra.


Közvilágítási hibát telefonon vagy online ügyfélszolgálaton jelenthet be. A pontos hibafeltárás miatt lépjen be online ügyfélszolgálatra, és válasza ki a hiba típusát.

## Milyen információkat szükséges megadnia a sikeres hibaelhárításhoz?
Pontosan hány lámpát érint a meghibásodás?
Amennyiben több lámpa hibásodott meg, hogyan helyezkednek el egymáshoz képest? Például egymás mellett 2 db lámpa, vagy minden második lámpa?
Milyen utcaszakaszon áll fenn a probléma? Például több lámpa  meghibásodása estén Település név, Utca név házszám tól-ig
Kossuth utca 78-tól 102-ig
Mikor észlelte a hibát?
Elérhetőségei, melyen kollégáink kereshetik esetleges hibapontosítás céljából: név, telefonszámot, emailcím

## További információ: 
https://www.eon.hu/hu/lakossagi/elerhetosegek/bejelentesek/hibabejelentes/hibabejelentes-aram/kozvilagitasi-hiba.html', 'kozerdeku/e-on', '2024-12-29 10:22:57'),
(55, 'Telekom', '
## Telekom 

https://www.telekom.hu/lakossagi/ugyintezes/ 

		', 'kozerdeku/telekom', '2024-12-29 10:25:26'),
(56, 'Kéményellenőrzés és -tisztítás', '
## Tájékoztató Kéményseprésről

 

2023.01.20-tól Fejér vármegye területén – az ország jelentős részével azonos módon – a BM OKF Gazdasági Ellátó Központ (a továbbiakban: GEK) látja el a kéményellenőrzési és –tisztítási tevékenységet a lakosság körében.

 
## 
Tájékoztató megnyitása: http://www.bakonykuti.hu/Hirek/Kemenysepres_2024.pdf

', 'kozerdeku/kemenyellenorzes-es-tisztitas', '2024-12-29 10:31:36'),
(57, 'Ügyfélfogadás', '
WIP

		', 'onkormanyzat/ugyfelfogadas', '2024-12-09 19:49:41'),
(59, 'Bejelentés köteles tevékenységek', '## Bejelentés köteles tevékenységek

SZÁLLÁSHELY NYILVÁNTARTÁS  
http://www.bakonykuti.hu/Nyilvantartas/szallashely.pdf
## 
TELEP NYILVÁNTARTÁS 2021 
http://www.bakonykuti.hu/Nyilvantartas/TNYT_BK.pdf
## 
ÜZLETNYILVÁNTARTÁS BEJELENTÉS 2021 
http://www.bakonykuti.hu/Nyilvantartas/uzletnyilv_bejelent.pdf
## 

## Bejelentésre vonatkozó dokumentumok:

 

Kommunális adó bejelentõ 
http://www.bakonykuti.hu/igeny/01Komm_ado_bejel.pdf

 ## 

Megállapodás több tulajdonos részérõl a kommunális adót megfizetõ személyérõl 

http://www.bakonykuti.hu/igeny/02Komm_ado_megall.pdf 

 

## Igénylésre vonatkozó dokumentumok:

 

Aktív korúak ellátására vonatkozó kérelem 
http://www.bakonykuti.hu/igeny/Aktellat.pdf

 
## 
Ápolási díj iránti kérelem 

http://www.bakonykuti.hu/igeny/Apoldij.pdf

 
## 
Egészségügyi szolgáltatásra való jogosultság iránti kérelem 
http://www.bakonykuti.hu/igeny/Euszolg.pdf

 ## 

Gyermek otthongondozási díj iránti kérelem 
http://www.bakonykuti.hu/igeny/Gyermotthongond.pdf

 
## 
Idõskorúak  járadéka iránti kérelem 
http://www.bakonykuti.hu/igeny/Idjarad.pdf

 
## 
Közgyógyellátás iránti kérelem 
http://www.bakonykuti.hu/igeny/Kozgyogy.pdf

		', 'onkormanyzat/bejelentes-koteles-tevekenysegek', '2024-12-30 08:17:32'),
(61, 'Akadálymentesitési Nyilatkozat', '## **AKADÁLYMENTESÍTÉSI NYILATKOZAT**
## 
A Bakonykúti Önkormányzat elkötelezett amellett, hogy honlapját a közszférabeli szervezetek honlapjainak és mobilalkalmazásainak akadálymentesítéséről szóló 2018. évi LXXV. törvény szerint akadálymentessé tegye.
## 
Ezen akadálymentesítési nyilatkozat a https://www.bakonykuti.hu -ra vonatkozik.
## 
## MEGFELELŐSÉGI STÁTUSZ

Ez a honlap teljes mértékben megfelel a közszférabeli szervezetek honlapjainak és mobilalkalmazásainak akadálymentesítéséről szóló 2018. évi LXXV. törvénynek.
## 
## AZ AKADÁLYMENTESÍTÉSI NYILATKOZAT ELKÉSZÍTÉSE

E nyilatkozat 2025.02.27-én a Bakonykúti Önkormányzat által végzett önértékelés alapján készült.

## VISSZAJELZÉS ÉS ELÉRHETŐSÉGEK
A honlap esetleges megfelelőségi hiányosságait a polgarmester@bakonykuti.hu, illetve a polgármesteri Hivatal, Szabadság Utca 41. 8046 címen jelezheti.
Az akadálymentesítésért és a kérések feldolgozásért felelős szervezeti egység a Bakonykúti Önkormányzat.
##  
Jelen akadálymentesítési nyilatkozatot jóváhagyta:

Marics József

polgármester
## ', 'onkormanyzat/akadalymentesitesi-nyilatkozat', '2025-02-28 14:27:34'),
(62, 'Körzeti Megbízott', 'wip2', 'kozerdeku/korzeti-megbizott', '2025-03-29 12:09:26');

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

-- Data for table: bakonykuti-t3_user
INSERT INTO `bakonykuti-t3_user` (`id`, `name`, `email`, `emailVerified`, `image`, `password`, `role`) VALUES
('1f005f4a-775f-42af-8fca-2e5c2bdc971f', 'AdminUser', 'admin@example.com', NULL, NULL, '$2b$10$y33FM.83SIXUOkRZHabZ0OG8JWUsXz4zSQENYZVBLRScptDnsYEn2', 'admin');

-- Table: bakonykuti-t3_verificationToken
DROP TABLE IF EXISTS `bakonykuti-t3_verificationToken`;
CREATE TABLE `bakonykuti-t3_verificationToken` (
  `identifier` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires` timestamp NOT NULL,
  PRIMARY KEY (`identifier`,`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Table: __drizzle_migrations
DROP TABLE IF EXISTS `__drizzle_migrations`;
CREATE TABLE `__drizzle_migrations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `hash` text NOT NULL,
  `created_at` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- Data for table: __drizzle_migrations
INSERT INTO `__drizzle_migrations` (`id`, `hash`, `created_at`) VALUES
(1, '0000_clear_slipstream', 1758648164956),
(2, '0001_gigantic_korath', 1758648164965);

