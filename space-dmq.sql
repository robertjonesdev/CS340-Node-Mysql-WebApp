-- The Select Stars (Robert Jones and Lauren Briese)
-- Project Step 5: Final

-- Note that a colon before a variable name (for example ‘:lnameInput’) indicates unique user input.

-- ------------------------------------------
--            ASTRONAUTS
-- ------------------------------------------
-- Add a new astronaut to the database:
INSERT INTO astronaut (first_name, last_name, birth_date, death_date, country_id)
    VALUES (:fnameInput, :lnameInput, :bDateInput, :dDateInput, :countryInput);

--Update an existing astronaut in the database:
UPDATE astronaut
    SET first_name = :fnameInput, last_name = :lnameInput, birth_date = :bDateInput, death_date = :dDateInput, country_id = :countryInput)
    WHERE (astronaut_id = :idInput);

--Delete an astronaut from the database
DELETE FROM astronaut WHERE astronaut_id = :idInput;

-- Select all astronauts in database:
SELECT A1.astronaut_id AS astronaut_id,
    A1.first_name AS first_name,
    A1.last_name AS last_name,
    DATE_FORMAT(A1.birth_date, "%Y-%m-%d") AS birth_date,
    DATE_FORMAT(A1.death_date, "%Y-%m-%d", NULL) AS death_date,
    C1.name AS cname
    FROM astronaut AS A1
    LEFT JOIN country_of_origin AS C1 ON A1.country_id = C1.country_id;

-- SELECT the id and name of all astronauts:
SELECT astronaut_id, first_name FROM astronaut;

-- Select all Astonauts by Country (country_id)
SELECT A1.astronaut_id AS astronaut_id,
    A1.first_name AS first_name,
    A1.last_name AS last_name,
    DATE_FORMAT(A1.birth_date, "%Y-%m-%d") AS birth_date,
    DATE_FORMAT(A1.death_date, "%Y-%m-%d", NULL) AS death_date,
    C1.name AS cname
    FROM astronaut AS A1
    LEFT JOIN country_of_origin AS C1 ON A1.country_id = C1.country_id
    WHERE C1.country_id = :country_id

-- ------------------------------------------
--            COUNTRY OF ORIGIN
-- ------------------------------------------
-- Add a new country to the database:
INSERT INTO country_of_origin (name, space_agency_name)
    VALUES (:nameInput, :agencyInput);

--Update an existing country in the database:
UPDATE country_of_origin SET
    name = :nameInput,
    space_agency_name = :agencyInput
    WHERE (country_id  = :idInput);

--Delete a country from the database
DELETE FROM country_of_origin WHERE country_id = :idInput;

-- Select all countries in database:
SELECT * FROM country_of_origin;

-- SELECT the id and name of all countries:
SELECT country_id, name FROM country_of_origin;

-- ------------------------------------------
--            DESTINATIONS
-- ------------------------------------------
-- Add a new destination to the database:
INSERT INTO destination (name, distance_from_earth)
    VALUES (:nameInput, :distanceInput);

-- Update an existing destination in the database:
UPDATE destination SET
    name = :nameInput,
    distance_from_earth = :distanceInput;
    WHERE destination_id = :idInput;

-- Delete a destination from the database
DELETE FROM destination WHERE destination_id = :idInput;

-- Select all destinations in database:
SELECT * FROM destination;

-- SELECT the id and name of all destinations:
SELECT destination_id, name FROM destination;

-- Select name and distance of all destinations by distance in descending order
SELECT name, distance_from_earth FROM destination
    ORDER BY distance_from_earth DESC;

-- Select name and distance of all destinations by distance in ascending order
SELECT name, distance_from_earth FROM destination
    ORDER BY distance_from_earth ASC;


-- ------------------------------------------
--            MISSIONS
-- ------------------------------------------

-- Add a new mission to the database:
INSERT INTO mission (launch_date, end_date, success, destination_id, country_id, spacecraft_id)
    VALUES (:launchInput, :endInput, :successInput, :destinationInput, :countryInput);

-- Update an existing mission in the database:
UPDATE mission SET
    launch_date = :launchInput,
    end_date = :endInput,
    success = :successInput,
    destination_id = :destinationInput,
    country_id = :countryInput
    WHERE mission_id = :idInput;

-- Delete a mission from the database
DELETE FROM mission WHERE mission_id = :idInput;

-- Select all missions in database:
SELECT M1.mission_id AS mission_id,
   DATE_FORMAT(M1.launch_date, "%Y-%m-%d") AS launch_date,
   DATE_FORMAT(M1.end_date, "%Y-%m-%d") AS end_date,
   M1.success AS msuccess,
   D1.name AS dname,
   C1.name AS cname,
   S1.name AS sname
   FROM mission AS M1
   LEFT JOIN destination AS D1 ON M1.destination_id = D1.destination_id
   LEFT JOIN country_of_origin AS C1 ON M1.country_id = C1.country_id
   LEFT JOIN spacecraft AS S1 ON M1.spacecraft_id = S1.spacecraft_id;

-- Select the id and name of all missions:
SELECT mission_id, name FROM mission;

-- Select Missions by Country (country_id)
SELECT M1.mission_id AS mission_id,
    DATE_FORMAT(M1.launch_date, "%Y-%m-%d") AS launch_date,
    DATE_FORMAT(M1.end_date, "%Y-%m-%d") AS end_date,
    M1.success AS msuccess,
    D1.name AS dname,
    C1.name AS cname,
    S1.name AS sname
    FROM mission AS M1
    LEFT JOIN destination AS D1 ON M1.destination_id = D1.destination_id
    LEFT JOIN country_of_origin AS C1 ON M1.country_id = C1.country_id
    LEFT JOIN spacecraft AS S1 ON M1.spacecraft_id = S1.spacecraft_id
    WHERE C1.country_id = :country_id

-- ------------------------------------------
--            MISSION TO ASTRONAUT
-- ------------------------------------------
-- Note: we do not have update statements for this table. There are only two columns in the table and if someone wants to change a mission-to-astronaut relationship, they should delete the incorrect relationship and add a new one.

-- Add a new mission to astronaut relationship
INSERT INTO mission_to_astronaut
    VALUES (:missionIdInput, :astronautIdInput);

-- Select the astronaut-to-mission relationship
SELECT A1.astronaut_id AS astronaut_id,
        A1.first_name AS first_name,
        A1.last_name AS last_name,
        M1.mission_id AS mission_id
        FROM astronaut as A1
        INNER JOIN mission_to_astronaut AS MA1 ON A1.astronaut_id = MA1.astronaut_id
        LEFT JOIN mission AS M1 ON MA1.mission_id = M1.mission_id;

-- Select the mission-to-astronaut relationship
SELECT M1.mission_id AS mission_id,
        A1.astronaut_id AS astronaut_id,
        DATE_FORMAT(M1.launch_date, "%Y-%m-%d") AS launch_date,
        DATE_FORMAT(M1.end_date, "%Y-%m-%d") AS end_date,
        D1.name AS dname,
        S1.name AS sname
        FROM mission AS M1
        INNER JOIN mission_to_astronaut AS MA1 ON M1.mission_id = MA1.mission_id
        LEFT JOIN astronaut AS A1 ON MA1.astronaut_id = A1.astronaut_id
        LEFT JOIN destination AS D1 ON M1.destination_id = D1.destination_id
        LEFT JOIN spacecraft AS S1 ON M1.spacecraft_id = S1.spacecraft_id;

-- Delete a mission_to_astronaut relationship from the database:
DELETE FROM mission_to_astronaut WHERE mission_id = :idInput;


-- ------------------------------------------
--            SPACECRAFT
-- ------------------------------------------
-- Add a new spacecraft to the database:
INSERT INTO spacecraft (name, service_start_date, service_end_date, country_id)
    VALUES (:nameInput, startDateInput, endDateInput, countryInput);

-- Update an existing spacecraft in the database:
UPDATE spacecraft SET
    name = :nameInput,
    service_start_date = :startDateInput,
    service_end_date = :endDateInput,
    country_id = :countryInput
    WHERE spacecraft_id = :spacecraft_id;

-- Delete a spacecraft from the database
DELETE FROM spacecraft WHERE spacecraft_id = :idInput;

-- Select all spacecraft in database:
SELECT S1.spacecraft_id AS spacecraft_id,
    S1.name AS name,
    DATE_FORMAT(S1.service_start_date, "%Y-%m-%d") AS service_start_date,
    DATE_FORMAT(S1.service_end_date, "%Y-%m-%d", NULL) AS service_end_date,
    C1.name AS cname
    FROM spacecraft AS S1
    LEFT JOIN country_of_origin AS C1 ON S1.country_id = C1.country_id;

-- Select the id and name of all spacecraft, used for dropdown boxes:
SELECT spacecraft_id, name FROM spacecraft;

-- Select all spacecraft from a certain country:
SELECT S1.spacecraft_id AS spacecraft_id,
    S1.name AS name,
    DATE_FORMAT(S1.service_start_date, "%Y-%m-%d") AS service_start_date,
    DATE_FORMAT(S1.service_end_date, "%Y-%m-%d", NULL) AS service_end_date,
    C1.name AS cname
    FROM spacecraft AS S1
    LEFT JOIN country_of_origin AS C1 ON S1.country_id = C1.country_id
    WHERE S1.country_id = :country_id
