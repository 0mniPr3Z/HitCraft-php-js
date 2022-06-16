/* Database Schema for simple Forums
 * Author: Dee the great amateur RDBS wizard
 * 07 Dec 2011 - Initial Version
 */

/* NOTE: You may want to alter this according to this setup,
 *       especially if you are not running the script as root and
 *       just need the tables.
 */

CREATE DATABASE `forum` DEFAULT CHARSET=utf8;
GRANT ALL PRIVILEGES ON forum.* TO 'fuser'@'localhost' IDENTIFIED BY 'pass';

USE forum;


/* NOTE: Tables use InnoDB as a table engine on MySQL, because lolrelations */

-- Users Table
-- Contains primary key, username, password hash and email address.
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `username` VARCHAR(45) NOT NULL ,
  `password_hash` VARCHAR(75) NOT NULL ,
  `email` VARCHAR(75) NOT NULL ,
  `last_co` INT() NOT NULL default '',
  PRIMARY KEY (`id`) 
) ENGINE = InnoDB;

-- Categories table
-- Contains primary key, name and weight.
-- Weight would be used to soft-order the categories when displaying them.
-- Feel free to ignore/drop.
CREATE TABLE `categories` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(75) NOT NULL ,
  `weight` INT UNSIGNED NOT NULL DEFAULT 1 ,
  PRIMARY KEY (`id`) 
) ENGINE = InnoDB;


-- Posts table
--  Stores Posts and the many-to-one relations with other tables/rows.
-- Here is a short rundown of the columns
--   id          Primary key
--   title       Post title
--   body        Post body (the actual post). Feel free to change the type.
--   posted_on   Post date. Shit MySQL DATETIME field, feel free to change
--   owner*      Foreign key, references users.id
--   category*   Foreign key, references categories.id
--   parent*     Foreign key, references this table's primary key column.
--                 The idea is to set this field to NULL to determine if
--                 if the post is the first in a thread.
-- NOTE:
--   There are some constraints on the relations. Updating a referenced field
--   will automatically update the referer as well.
--   By default here ON DELETE does nothing, except for the categories,
--   mostly as an example. ON DELETE CASCADE means in this case, that if you
--   DELETE a Category, any Posts in this Category will also be DELETE'd.
--   Feel free to change/adapt, I mostly did it as an example.
--
CREATE TABLE `posts` (
  `id` INT NOT NULL AUTO_INCREMENT ,
  `title` VARCHAR(75) NOT NULL ,
  `body` TEXT NOT NULL ,
  `posted_on` DATETIME NOT NULL ,
  PRIMARY KEY (`id`) ,
  INDEX `owner` (`id` ASC) ,
  INDEX `category` () ,
  CONSTRAINT `owner`
    FOREIGN KEY (`id` )
    REFERENCES `forum`.`users` (`id` )
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `parent_post`
    FOREIGN KEY ()
    REFERENCES `forum`.`posts` ()
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `category`
    FOREIGN KEY ()
    REFERENCES `forum`.`categories` ()
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;