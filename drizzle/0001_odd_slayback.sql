CREATE TABLE `aiInsights` (
	`id` int AUTO_INCREMENT NOT NULL,
	`simulationId` int NOT NULL,
	`userId` int NOT NULL,
	`insightType` varchar(100) NOT NULL,
	`content` text NOT NULL,
	`confidence` decimal(3,2) NOT NULL,
	`recommendations` json,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aiInsights_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `anomalies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`simulationId` int NOT NULL,
	`userId` int NOT NULL,
	`anomalyType` varchar(100) NOT NULL,
	`severity` enum('low','medium','high','critical') NOT NULL,
	`description` text,
	`detectedAt` timestamp NOT NULL DEFAULT (now()),
	`resolvedAt` timestamp,
	`metadata` json,
	CONSTRAINT `anomalies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`simulationId` int NOT NULL,
	`userId` int NOT NULL,
	`metricType` enum('resonance_quality','energy_efficiency','phase_alignment','frequency_lock','amplitude_response','system_health') NOT NULL,
	`value` decimal(10,4) NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sharedSimulations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`simulationId` int NOT NULL,
	`ownerId` int NOT NULL,
	`sharedWithUserId` int NOT NULL,
	`accessLevel` enum('view','edit','admin') NOT NULL DEFAULT 'view',
	`sharedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sharedSimulations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `simulationStates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`simulationId` int NOT NULL,
	`userId` int NOT NULL,
	`stateData` json NOT NULL,
	`metrics` json,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `simulationStates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `simulations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`simulationType` enum('photonic_manifold','cosmological_bridge','mhrma_antenna','iof_resonance') NOT NULL,
	`isPublic` int NOT NULL DEFAULT 0,
	`parameters` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `simulations_id` PRIMARY KEY(`id`)
);
