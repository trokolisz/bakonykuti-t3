CREATE TABLE `bakonykuti-t3_file` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`original_name` varchar(512) NOT NULL,
	`filename` varchar(512) NOT NULL,
	`file_path` varchar(1024) NOT NULL,
	`public_url` varchar(1024) NOT NULL,
	`mime_type` varchar(128) NOT NULL,
	`file_size` int NOT NULL,
	`upload_type` varchar(64) NOT NULL,
	`uploaded_by` varchar(255),
	`associated_entity` varchar(64),
	`associated_entity_id` int,
	`is_orphaned` boolean NOT NULL DEFAULT false,
	`last_accessed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `bakonykuti-t3_file_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `file_path_idx` ON `bakonykuti-t3_file` (`file_path`);--> statement-breakpoint
CREATE INDEX `upload_type_idx` ON `bakonykuti-t3_file` (`upload_type`);--> statement-breakpoint
CREATE INDEX `uploaded_by_idx` ON `bakonykuti-t3_file` (`uploaded_by`);--> statement-breakpoint
CREATE INDEX `associated_entity_idx` ON `bakonykuti-t3_file` (`associated_entity`,`associated_entity_id`);--> statement-breakpoint
CREATE INDEX `orphaned_idx` ON `bakonykuti-t3_file` (`is_orphaned`);