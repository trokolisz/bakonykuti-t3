CREATE TABLE `bakonykuti-t3_account` (
	`userId` varchar(255) NOT NULL,
	`type` varchar(255) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`providerAccountId` varchar(255) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(255),
	`scope` varchar(255),
	`id_token` text,
	`session_state` varchar(255),
	CONSTRAINT `bakonykuti-t3_account_provider_providerAccountId_pk` PRIMARY KEY(`provider`,`providerAccountId`)
);
--> statement-breakpoint
CREATE TABLE `bakonykuti-t3_document` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`category` varchar(256) NOT NULL,
	`date` timestamp NOT NULL,
	`file_url` varchar(1024) NOT NULL,
	`file_size` varchar(256) NOT NULL,
	CONSTRAINT `bakonykuti-t3_document_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bakonykuti-t3_event` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`thumbnail` varchar(2056) NOT NULL,
	`content` text,
	`date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`type` varchar(256) NOT NULL DEFAULT 'community',
	`created_by` varchar(256),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `bakonykuti-t3_event_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bakonykuti-t3_image` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`url` varchar(1024) NOT NULL,
	`title` varchar(256) NOT NULL DEFAULT '',
	`carousel` boolean NOT NULL DEFAULT false,
	`gallery` boolean NOT NULL DEFAULT true,
	`visible` boolean NOT NULL DEFAULT true,
	`local_path` varchar(1024),
	`image_size` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `bakonykuti-t3_image_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bakonykuti-t3_news` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`thumbnail` varchar(2056) NOT NULL,
	`content` text,
	`creator_name` varchar(256),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `bakonykuti-t3_news_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bakonykuti-t3_page` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`content` text NOT NULL,
	`slug` varchar(256) NOT NULL,
	`last_modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `bakonykuti-t3_page_id` PRIMARY KEY(`id`),
	CONSTRAINT `bakonykuti-t3_page_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `bakonykuti-t3_session` (
	`sessionToken` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `bakonykuti-t3_session_sessionToken` PRIMARY KEY(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `bakonykuti-t3_user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255),
	`email` varchar(255) NOT NULL,
	`emailVerified` timestamp,
	`image` varchar(255),
	`password` varchar(255),
	`role` varchar(255) NOT NULL DEFAULT 'user',
	CONSTRAINT `bakonykuti-t3_user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `bakonykuti-t3_verificationToken` (
	`identifier` varchar(255) NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires` timestamp NOT NULL,
	CONSTRAINT `bakonykuti-t3_verificationToken_identifier_token_pk` PRIMARY KEY(`identifier`,`token`)
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `bakonykuti-t3_account` (`userId`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `bakonykuti-t3_session` (`userId`);