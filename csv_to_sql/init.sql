-- courses table

DROP TABLE IF EXISTS courses;
CREATE TABLE courses (
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  dept char(4) NOT NULL COMMENT 'course dept e.g. SYSC',
  code int(4) NOT NULL COMMENT 'course code e.g. 2003',
  name varchar(100) NOT NULL COMMENT 'course name'
);

-- offering_types table

DROP TABLE IF EXISTS offering_types;
CREATE TABLE offering_types (
    type char(3) PRIMARY KEY NOT NULL
);
INSERT INTO offering_types (type) VALUES ("LEC");
INSERT INTO offering_types (type) VALUES ("TUT");
INSERT INTO offering_types (type) VALUES ("LAB");
INSERT INTO offering_types (type) VALUES ("GRP");
INSERT INTO offering_types (type) VALUES ("PLA");
INSERT INTO offering_types (type) VALUES ("SEM");
INSERT INTO offering_types (type) VALUES ("PAS");
INSERT INTO offering_types (type) VALUES ("PRC");
INSERT INTO offering_types (type) VALUES ("IND");
INSERT INTO offering_types (type) VALUES ("WRK");
INSERT INTO offering_types (type) VALUES ("REP");
INSERT INTO offering_types (type) VALUES ("WKS");
INSERT INTO offering_types (type) VALUES ("OTH");
INSERT INTO offering_types (type) VALUES ("STU");
INSERT INTO offering_types (type) VALUES ("VOD");
INSERT INTO offering_types (type) VALUES ("FIE");
INSERT INTO offering_types (type) VALUES ("DIR");
INSERT INTO offering_types (type) VALUES ("PAN");
INSERT INTO offering_types (type) VALUES ("FLM");
INSERT INTO offering_types (type) VALUES ("NTC");

-- offerings table

DROP TABLE IF EXISTS offerings;
CREATE TABLE offerings (
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  course int REFERENCES courses(id),
  type char(3) REFERENCES offering_types(type),
  time_start time COMMENT 'class start time',
  time_end time COMMENT 'class end time',
  capacity int COMMENT 'class student capacity e.g. 400',
  days varchar(5) COMMENT 'days a class is offered.  Possibilities: MTWRF'
);