CREATE DATABASE IF NOT EXISTS `fib_handbook` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `fib_handbook`;

CREATE TABLE IF NOT EXISTS `agents` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `discord` VARCHAR(191) NOT NULL,
  `ingame` VARCHAR(191) NOT NULL,
  `password` VARCHAR(191) NOT NULL,
  `status` ENUM('active','pending','suspended') NOT NULL DEFAULT 'pending',
  `role` VARCHAR(64) NOT NULL DEFAULT 'Intern',
  `registeredAt` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `discord_unique` (`discord`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
