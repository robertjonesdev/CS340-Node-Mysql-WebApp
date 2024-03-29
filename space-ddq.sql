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
	space_agency_name VARCHAR(100)
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Astronauts
-- Create table
CREATE TABLE astronaut(
	astronaut_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	first_name VARCHAR(50) NOT NULL,
	last_name VARCHAR(50) NOT NULL,
	birth_date DATE NOT NULL,
	death_date DATE,
	country_id INT
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Missions
-- Create table
CREATE TABLE mission(
	mission_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	launch_date DATE NOT NULL,
	end_date DATE,
	success TINYINT,
	destination_id INT,
	country_id INT,
	spacecraft_id INT
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Spacecraft
-- Create table
CREATE TABLE spacecraft(
	spacecraft_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	name VARCHAR(250) NOT NULL,
	service_start_date DATE NOT NULL,
	service_end_date DATE,
	country_id INT
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Destinations
-- Create table

CREATE TABLE destination(
	destination_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
	name VARCHAR(100) NOT NULL,
	distance_from_earth INT NOT NULL
	) ENGINE = InnoDB;

-- Astronaut to Mission Relationship
CREATE TABLE mission_to_astronaut (
	mission_id INT NOT NULL,
	astronaut_id INT NOT NULL,
	FOREIGN KEY (mission_id) REFERENCES mission (mission_id) ON DELETE CASCADE,
	FOREIGN KEY (astronaut_id) REFERENCES astronaut (astronaut_id) ON DELETE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Alter Tables to establish foriegn keys after entities are created.

ALTER TABLE spacecraft
	ADD FOREIGN KEY (country_id) REFERENCES country_of_origin (country_id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE mission
	ADD FOREIGN KEY (country_id) REFERENCES country_of_origin (country_id) ON DELETE SET NULL ON UPDATE CASCADE,
	ADD FOREIGN KEY (spacecraft_id) REFERENCES spacecraft (spacecraft_id) ON DELETE SET NULL ON UPDATE CASCADE,
	ADD FOREIGN KEY (destination_id) REFERENCES destination (destination_id) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE astronaut
	ADD FOREIGN KEY (country_id) REFERENCES country_of_origin (country_id) ON DELETE SET NULL ON UPDATE CASCADE;

-- INSERT starter data

INSERT INTO country_of_origin (name, space_agency_name) VALUES ('USA', 'NASA'), ('Canada', 'Canadian Space Agency'),
('China', 'China National Space Administration'), ('Russia', 'Russian Federal Space Agency');

INSERT INTO destination (name, distance_from_earth) VALUES ('Earths Moon', 238900),
('Low Earth Orbit (LEO)', 100);

INSERT INTO spacecraft (name, service_start_date, service_end_date, country_id)
VALUES ('Apollo', '1966-02-26', '1975-07-15', 1), ('Vostok 1', '1961-04-12', '1961-04-12', 4),
 ('Vostok 6', '1963-06-16', '1963-06-19', 4), ('Space Shuttle Challenger', '1983-04-04', '1986-01-28', 1);

INSERT INTO astronaut (first_name, last_name, birth_date, death_date, country_id)
VALUES ('Neil', 'Armstrong', '1930-08-05' ,'2012-08-25' ,1), ('Buzz', 'Aldrin', '1930-01-20',NULL , 1),
	('Michael', 'Collins', '1930-10-31' ,NULL , 1), ('Yuri', 'Gagarin', '1934-03-09', '1968-03-27', 4),
	('Valentina', 'Tereshkova', '1937-06-03', NULL, 4), ('Francis', 'Scobee', '1939-05-19', '1986-01-28', 1),
	('Michael', 'Smith', '1945-04-30', '1986-01-28', 1), ('Ronald', 'McNair', '1950-10-21', '1986-01-28', 1),
	('Ellison', 'Onizuka', '1946-06-24', '1986-01-28', 1), ('Judith', 'Resnik', '1949-04-05', '1986-01-28', 1),
	('Gregory', 'Jarvis', '1944-08-24', '1986-01-28', 1), ('Christa', 'McAuliffe', '1948-09-02', '1986-01-28', 1),
	('Jim', 'Lovell', '1928-03-25', NULL, 1), ('Chris', 'Hadfield', '1959-08-29', NULL, 2),
	('Roberta Lynn', 'Bondar', '1945-12-04', NULL, 2), ('Yang', 'Liwei', '1965-06-21', NULL, 3);

INSERT INTO mission (launch_date, end_date, success, destination_id, country_id, spacecraft_id) VALUES
('1969-07-16', '1969-07-24', 1, 1, 1, 1),
('1961-04-12', '1961-04-12', 1, 2, 4, 2),
('1963-06-16', '1963-06-19', 1, 2, 4, 3),
('1986-01-28', '1986-01-28', 0, 2, 1, 4),
('1968-12-21', '1968-12-27', 1, 1, 1, 1),
('1970-04-11', '1970-04-17', 1, 1, 1, 1);


INSERT INTO mission_to_astronaut (mission_id, astronaut_id) VALUES
(1, 1), (1, 2), (1, 3), (4, 6),
(4, 7), (4, 8), (4, 9), (4, 10),
(4, 11), (4, 12), (3, 5), (2, 4),
(5, 13), (6, 13);
