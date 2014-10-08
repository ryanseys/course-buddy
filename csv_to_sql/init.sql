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