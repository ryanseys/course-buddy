START TRANSACTION;

-- courses table
DROP TABLE IF EXISTS courses;
CREATE TABLE courses (
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  dept char(4) NOT NULL COMMENT 'course dept e.g. SYSC',
  code int(4) NOT NULL COMMENT 'course code e.g. 2003',
  name varchar(100) NOT NULL COMMENT 'course name'
);

-- offerings table
DROP TABLE IF EXISTS offerings;
CREATE TABLE offerings (
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  course int REFERENCES courses(id),
  type ENUM('LEC', 'TUT', 'LAB', 'GRP', 'PLA', 'SEM', 'PAS', 'PRC', 'IND', 'WRK', 'REP', 'WKS', 'OTH', 'STU', 'VOD', 'FIE', 'DIR', 'PAN', 'FLM', 'NTC'),
  time_start time COMMENT 'class start time',
  time_end time COMMENT 'class end time',
  capacity int COMMENT 'class student capacity e.g. 400',
  days varchar(5) COMMENT 'days a class is offered.  Possibilities: MTWRF'
);

-- prereqs
DROP TABLE IF EXISTS prereqs;
CREATE TABLE prereqs (
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  course int REFERENCES courses(id) COMMENT "Course with Prereqs",
  prereq int REFERENCES courses(id) COMMENT "Must be completed to take course",
  allow_concur boolean NOT NULL,
  equiv_group int COMMENT "Assign same id to a group of courses which would satisfy the same prereq"
);

-- programs
DROP TABLE IF EXISTS programs;
CREATE TABLE programs(
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name text NOT NULL
);

-- program requirements
DROP TABLE IF EXISTS program_reqs;
CREATE TABLE program_reqs(
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  program int REFERENCES programs(id),
  course int REFERENCES courses(id),
  equiv_group int COMMENT "Assign same id to a group of courses which would satisfy the same program req",
  is_elective boolean NOT NULL,
  year smallint NOT NULL COMMENT "on-pattern year this course is to be taken in",
  term ENUM("F", "W") COMMENT "on-pattern term this course is to be taken in"
);

COMMIT;