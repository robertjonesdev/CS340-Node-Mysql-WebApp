-- SQL DATA DEFINITION QUERIES
-- GROUP 10 The Select Stars

-- Drop tables if they exist
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE country_of_origin;
DROP TABLE astronaut;
DROP TABLE mission;
DROP TABLE spacecraft;
DROP TABLE destination;
DROP TABLE mission_to_astronaut;
SET FOREIGN_KEY_CHECKS = 1;

-- Countries
-- Create table
CREATE TABLE country_of_origin (
	country_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	name VARCHAR(20) NOT NULL,
	space_agency_name VARCHAR(100));

-- Astronauts
-- Create table
CREATE TABLE astronaut(
	astronaut_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	birth_date DATE NOT NULL,
	death_date DATE,
	country_id INT);

-- Missions
-- Create table
CREATE TABLE mission(
	mission_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	launch_date DATE NOT NULL,
	end_date DATE,
	success TINYINT,
	destination_id INT NOT NULL,
	country_id INT NOT NULL,
	spacecraft_id INT NOT NULL);

-- Spacecraft
-- Create table
CREATE TABLE spacecraft(
	spacecraft_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	name VARCHAR(250) NOT NULL,
	service_start_date DATE NOT NULL,
	service_end_date DATE,
	country_id INT NOT NULL);

-- Destinations
-- Create table

CREATE TABLE destination(
	destination_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	name VARCHAR(100) NOT NULL,
	distance_from_earth INT NOT NULL);

-- Astronaut to Mission Relationship
CREATE TABLE mission_to_astronaut (
	mission_id INT NOT NULL,
	astronaut_id INT NOT NULL,
	FOREIGN KEY (mission_id) REFERENCES mission (mission_id) ON DELETE CASCADE,
	FOREIGN KEY (astronaut_id) REFERENCES astronaut (astronaut_id) ON DELETE CASCADE);

-- Alter Tables to establish foriegn keys after entities are created.

ALTER TABLE spacecraft
	ADD FOREIGN KEY (country_id) REFERENCES country_of_origin (country_id);

ALTER TABLE mission
	ADD FOREIGN KEY (country_id) REFERENCES country_of_origin(country_id),
	ADD FOREIGN KEY (spacecraft_id) REFERENCES spacecraft (spacecraft_id),
	ADD FOREIGN KEY (destination_id) REFERENCES destination (destination_id);

ALTER TABLE astronaut
	ADD FOREIGN KEY (country_id) REFERENCES  country_of_origin (country_id);

-- INSERT starter data

INSERT INTO country_of_origin (name, space_agency_name) VALUES ('USA', 'NASA'), ('Canada', 'Canadian Space Agency'),
('China', 'China National Space Administration'), ('Russia', 'Russian Federal Space Agency');

INSERT INTO destination (name, distance_from_earth) VALUES ('Earths Moon', 238900), 
('Low Earth Orbit (LEO)', 100);

INSERT INTO spacecraft (name, service_start_date, service_end_date, country_id)
VALUES ('Apollo CSM-107', '1969-07-16', '1969-07-24', 1), ('Vostok 1', '1961-04-12', '1961-04-12', 4),
 ('Vostok 6', '1963-06-16', '1963-06-19', 4);

INSERT INTO astronaut (first_name, last_name, birth_date, death_date, country_id)
VALUES ('Neil', 'Armstrong', '1930-08-05' ,'2012-08-25' ,1), ('Buzz', 'Aldrin', '1930-01-20',NULL , 1),
	('Michael', 'Collins', '1930-10-31' ,NULL , 1), ('Yuri', 'Gagarin', '1934-03-09', '1968-03-27', 4),
	('Valentina', 'Tereshkova', '1937-06-03', NULL, 4);

INSERT INTO mission (launch_date, end_date, success, destination_id, country_id, spacecraft_id) VALUES 
('1969-07-16', '1969-07-24', 1, 1, 1, 1),
('1961-04-12', '1961-04-12', 1, 2, 4, 2),
('1963-06-16', '1963-06-19', 1, 2, 4, 3);


INSERT INTO mission_to_astronaut (mission_id, astronaut_id) VALUES (1, 1), (1, 2), (1, 3);
