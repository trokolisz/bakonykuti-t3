-- Add visibility and localPath columns to images table
-- This script adds the new columns needed for local file storage management

USE `bakonykuti-mariadb`;

-- Add visible column if it doesn't exist
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'bakonykuti-mariadb' 
       AND TABLE_NAME = 'bakonykuti-t3_image' 
       AND COLUMN_NAME = 'visible') = 0,
    'ALTER TABLE `bakonykuti-t3_image` ADD COLUMN `visible` BOOLEAN NOT NULL DEFAULT TRUE',
    'SELECT "visible column already exists" as message'
));

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add local_path column if it doesn't exist
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'bakonykuti-mariadb' 
       AND TABLE_NAME = 'bakonykuti-t3_image' 
       AND COLUMN_NAME = 'local_path') = 0,
    'ALTER TABLE `bakonykuti-t3_image` ADD COLUMN `local_path` VARCHAR(1024) NULL',
    'SELECT "local_path column already exists" as message'
));

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Update existing records to be visible by default
UPDATE `bakonykuti-t3_image` 
SET `visible` = TRUE 
WHERE `visible` IS NULL OR `visible` = FALSE;

-- Show the updated table structure
DESCRIBE `bakonykuti-t3_image`;

-- Show count of images
SELECT COUNT(*) as total_images FROM `bakonykuti-t3_image`;
SELECT COUNT(*) as visible_images FROM `bakonykuti-t3_image` WHERE `visible` = TRUE;
