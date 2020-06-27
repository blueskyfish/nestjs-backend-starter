--
-- Create the tables into the database "starter"
--


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

USE `starter`;

--
-- User table (user_id begins with 1000)
--
CREATE TABLE `starter_users` (
  `user_id` INT NOT NULL AUTO_INCREMENT COMMENT 'The unique user id' ,
  `name` VARCHAR(60) NOT NULL COMMENT 'The user name' ,
  `password` varchar(250) NOT NULL COMMENT 'The user password',
  `email` VARCHAR(250) NOT NULL COMMENT 'The user email' ,
  `roles` VARCHAR(250) NOT NULL COMMENT 'The json array with the role names' ,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UNI_EMAIL` (`email`)
) ENGINE = InnoDB COMMENT = '(Nestjs Starter) the user' AUTO_INCREMENT=1000;

COMMIT;
