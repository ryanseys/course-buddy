START TRANSACTION;

-- ----------
-- Courses --
-- -----------

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
CREATE TABLE prereqs(
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  course int REFERENCES courses(id), -- Course with prereqs
  prereq int REFERENCES courses(id), -- Must be completed to take course
  allow_concur boolean NOT NULL,
  equiv_group int COMMENT 'Assign same id to a group of courses which would satisfy the same prereq'
);

-- -----------
-- Programs --
-- -----------

-- programs
DROP TABLE IF EXISTS programs;
CREATE TABLE programs(
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  name text NOT NULL
);

-- -----------------------
-- Program Requirements --
-- -----------------------

-- program requirements (Mandatory Courses)
DROP TABLE IF EXISTS program_reqs;
CREATE TABLE program_reqs(
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  program int REFERENCES programs(id),
  course int REFERENCES courses(id),
  year smallint NOT NULL COMMENT "on-pattern year this course is to be taken in",
  term ENUM("F", "W") COMMENT "on-pattern term this course is to be taken in"
);

-- elective groups (index of requirements groupings)
DROP TABLE IF EXISTS elective_groups;
CREATE TABLE elective_groups(
  name varchar(128) PRIMARY KEY NOT NULL
);

-- requirements group courses (the courses in each requirements group)
DROP TABLE IF EXISTS elective_group_courses;
CREATE TABLE elective_group_courses(
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  elective_group int REFERENCES elective_groups(id),
  course int REFERENCES courses(id)
);

-- program elective groups (assign elective groups to a program)
DROP TABLE IF EXISTS program_elective_groups;
CREATE TABLE program_elective_groups(
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  program int REFERENCES programs(id),
  req_group int REFERENCES elective_groups(id),
  year smallint NOT NULL COMMENT "on-pattern year this course is to be taken in",
  term ENUM("F", "W") NOT NULL COMMENT "on-pattern term this course is to be taken in"
);

COMMIT;