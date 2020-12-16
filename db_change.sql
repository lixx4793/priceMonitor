ALTER TABLE `products`
	ADD COLUMN `targetPrice` DOUBLE NULL DEFAULT NULL AFTER `imageSrc`;

	CREATE TABLE `accounts` (
		`accountId` INT(10) NOT NULL AUTO_INCREMENT,
		`email` VARCHAR(50) NULL DEFAULT NULL,
		`owner` VARCHAR(50) NOT NULL,
		`active` TINYINT(4) NOT NULL DEFAULT '0',
		`note` VARCHAR(500) NULL DEFAULT NULL,
		`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (`accountId`),
		UNIQUE INDEX `owner` (`owner`)
	)
	COLLATE='utf8_general_ci'
	ENGINE=InnoDB;


	CREATE TABLE `cards` (
		`cardId` INT(10) NOT NULL AUTO_INCREMENT,
		`cardFirstName` VARCHAR(50) NOT NULL,
		`cardLastName` VARCHAR(50) NOT NULL,
		`cardNumber` VARCHAR(500) NOT NULL,
		`cvv` VARCHAR(500) NOT NULL,
		`expireMonth` INT(11) NOT NULL,
		`expireYear` INT(11) NOT NULL,
		`type` VARCHAR(15) NULL DEFAULT NULL,
		`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (`cardId`),
		UNIQUE INDEX `cardNumber` (`cardNumber`)
	)
	COLLATE='utf8_general_ci'
	ENGINE=InnoDB;


CREATE TABLE `acmaps` (
	`acmapsId` INT(10) NOT NULL AUTO_INCREMENT,
	`accountId` INT(10) NOT NULL,
	`cardId` INT(10) NOT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	UNIQUE INDEX `accountId` (`accountId`, `cardId`),
	PRIMARY KEY (`acmapsId`),
	CONSTRAINT `mapAccountId` FOREIGN KEY (`accountId`) REFERENCES `accounts` (`accountId`),
	CONSTRAINT `mapCard` FOREIGN KEY (`cardId`) REFERENCES `cards` (`cardId`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE TABLE `records` (
	`recordId` INT(10) NOT NULL AUTO_INCREMENT,
	`targetProductId` INT(10) NOT NULL,
	`acmapId` INT(10) NOT NULL,
	`result` TINYINT(4) NOT NULL DEFAULT '0',
	`errorMessage` VARCHAR(255) NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`recordId`),
	INDEX `recordProduct` (`targetProductId`),
	INDEX `acmap` (`acmapId`),
	CONSTRAINT `acmap` FOREIGN KEY (`acmapId`) REFERENCES `acmaps` (`acmapsId`),
	CONSTRAINT `recordProduct` FOREIGN KEY (`targetProductId`) REFERENCES `products` (`pid`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;
