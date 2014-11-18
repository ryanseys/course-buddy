README.txt

+-------------------------------+
| 1. The students in your group |
+-------------------------------+

The students in our group are as follows:

+-----------+---------------+--------------------------------+
| Student # |      Name     |     Carleton Email Address     |
+------------------------------------------------------------+
| 100817604 | Ryan Seys     | RyanSeys@cmail.carleton.ca     |
| 100819001 | Caleb Simpson | CalebSimpson@cmail.carleton.ca |
| 100815259 | Andrew O’Hara | AndrewOhara@cmail.carleton.ca  |
+-----------+---------------+--------------------------------+

+----------------------------------------------------------------------+
| 2. Which program (CE, CSE, SE) did you use to test your application? |
+----------------------------------------------------------------------+

Software Engineering (SE)

+---------------------------------------------------------------------------+
| 3. Who is the TA who is assigned to your group ? (Mr. Kazi or Mr. Abaza)? |
+---------------------------------------------------------------------------+

Mr. Abaza

+-----------------------------------------------------------+
| 4. Provide the contributions of each member of the group. |
+-----------------------------------------------------------+

Ryan Seys:
- Developed the database class and generic methods for querying.
- Developed timetable generation algorithm written in JavaScript.
- Developed much of the front-end application.
- Developed part of the database queries for use in the API.

Andrew O'Hara

- Developed Database Schema
- Developed Ruby parser to generate course and CSE SQL
- Manual SQL creation
- Developed elective selection frontend and course enrollment functionality

Caleb Simpson

<TODO>

+--------------------------------------------------------------------------+
| 5. Provide a brief description of your folders/files. If your project    |
| includes several folders, give the content of each folder. If you had    |
| separate scripts to implement each task in the project, then provide the |
| mapping tasks to html/php files.                                         |
+--------------------------------------------------------------------------+

The application takes a fairly flat folder/file structure.
All of the pages that the student will directly access are available in the
root of the folder. This includes pages like install.php and index.html.

The JavaScript assets that are used on the front-end application are available
in the /js folder.

The image assets (e.g. Carleton University logo) are available in the /img
folder.

The Cascading Style Sheets (CSS) files that are used on the front end are
available in the /css folder.

+-----------------------------------------------------------------------------+
| 6. Provide the instructions to execute when deploying your application to   |
| offer the service to all programs of the Faculty of Engineering. What is    |
| the format of data to provide to your application (for each academic        |
| program, for the prerequisite trees, for the complementary studies          |
| electives, for the basic science electives, for the (breadth) engineering   |
| electives ? What files in yourm project will need to be modified to include |
| all Engineering programs ? Briefly, describe the changes that must be done  |
| in the code?                                                                |
+-----------------------------------------------------------------------------+

No changes to the program (PHP / JS) should be required to support all
the programs of the Faculty of Engineering. The only thing that will need to
change is the data that the program has access to, that is, the sql queries that
take place on install to insert all the data into the database. Due to the
unique scope and nature of the application, many of the sql queries were hand-
written and thus, to support more Engineering programs, these queries will need
to also be hand-written or somehow automated to insert into the database.

Our database tables are as follows:

-- A generic course that is offered at Carleton.
-- The specific offer of this course is given in the offerings table.
CREATE TABLE courses (
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  dept char(4) NOT NULL COMMENT 'course dept e.g. SYSC',
  code int(4) NOT NULL COMMENT 'course code e.g. 2003',
  name varchar(100) NOT NULL COMMENT 'course name'
);

-- A specific course offering for a particular course, term and date/time.
-- When a student enrols in the course, the capacity of this offering is
-- decremented by 1.
CREATE TABLE offerings (
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  course int REFERENCES courses(id),
  type ENUM('LEC', 'TUT', 'LAB', 'GRP', 'PLA', 'SEM', 'PAS', 'PRC', 'IND',
  'WRK', 'REP', 'WKS', 'OTH', 'STU', 'VOD', 'FIE', 'DIR', 'PAN', 'FLM', 'NTC'),
  seq varchar(6) COMMENT 'section like A, A1, B1',
  term ENUM('F', 'W', 'S'),
  time_start time COMMENT 'class start time',
  time_end time COMMENT 'class end time',
  capacity int COMMENT 'class student capacity e.g. 400',
  days varchar(5) COMMENT 'days a class is offered.  Possibilities: MTWRF'
);

-- Prerequisite courses. The equivalence group is a set id given to prereqs
-- that can be taken in place of each other. That is, if the course SYSC 2001
-- requires either SYSC 1001 or SYSC 1002 to be taken as a prerequisite,
-- both SYSC 1001 and SYSC 1002 would reside in the same equivalence group for
-- this particular course prerequisite.
CREATE TABLE prereqs(
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  course int REFERENCES courses(id), -- Course with prereqs
  prereq int REFERENCES courses(id), -- Must be completed to take course
  allow_concur boolean COMMENT 'can prereq be taken at the same time as course',
  equiv_group int COMMENT 'same id to group of courses that satisfy same prereq'
);

-- Programs
-- This a program that is offered at Carleton University. E.g. Software Eng. or
-- Civil Engineering
CREATE TABLE programs(
  id int PRIMARY KEY AUTO_INCREMENT,
  name text
);

-- Program requirements (Mandatory Courses)
CREATE TABLE program_reqs(
  id int PRIMARY KEY AUTO_INCREMENT,
  program int REFERENCES programs(id),
  course int REFERENCES courses(id),
  year smallint COMMENT "on-pattern year this course is to be taken in",
  term ENUM("F", "W") COMMENT "on-pattern term this course is to be taken in"
);

-- Requirements group courses (the courses in each requirements group)
CREATE TABLE elective_group_courses(
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  elective_group ENUM("SE Note A", "SE Note B", "CSE"),
  course int REFERENCES courses(id)
);

-- Program elective groups (assign elective groups to a program)
CREATE TABLE program_elective_groups(
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  program int REFERENCES programs(id),
  req_group ENUM("SE Note A", "SE Note B", "CSE"),
  year smallint COMMENT "on-pattern year this course is to be taken in",
  term ENUM("F", "W") COMMENT "on-pattern term this course is to be taken in"
);

+------------------------------------------------------------------------------+
| 7. Explain how you implement the prerequisite dealing with 3rd year status   |
| or 4th year status in Engineering and how does your code checks whether a    |
| student has or not the proper status. Explain how your software processes    |
| the perquisites that can be taken concurrently with the course (eg. ECOR     |
| 4995 must taken at the same time as the 4th year project; STAT 2605 and STAT |
| 3502 are prerequisite to SYSC 4602, but the STAT can be taken concurrently   |
| to SYSC 4602). Explain how your application deals with program transfer: For |
| instance, SYSC 2006 requires either SYSC 1005 or ECOR 1606. Software Eng.    |
| requires SYSC 1005, while Communications Eng. requires ECOR 1606. A student  |
| starting in Software Eng. may switch to Communications Eng, or vice versa.   |
| How does your software determine if the student can take or not SYSC 2006?   |
+------------------------------------------------------------------------------+

<TODO>

+------------------------------------------------------------------------------+
| 8. Explain briefly the rules (or algorithms) you use when building the       |
| (conflict-free) timetable. For instance, a course has currently 2 lectures   |
| sessions (A and B) and 2 lab sessions each (A1, A2, B1, B2); if all are      |
| still available, how does your software select which lecture session and lab |
| to suggest to the student?                                                   |
+------------------------------------------------------------------------------+

<TODO>

+------------------------------------------------------------------------------+
| 9. In your solution, which entity identifies the courses that can be taken   |
| based on the completed courses and the prerequisites? The client process or  |
| the server process? Same question for the determination of the conflict-free |
| timetable? Explain your choices.                                             |
+------------------------------------------------------------------------------+

The client process identifies the courses that can be taken based on the
completed courses and the prerequisites.

Determining the conflict-free timetable is done by querying the server for a
set of offerings for a particular set of courses set by the student in the
client. The server returns the raw set of all course offerings and then the
client does the work of generating all the conflict-free timetables. The results
of this work is displayed to the user in a list, where they can select which set
of course offerings they would like to enroll in.

The reason for doing the time-table generation on the front end is to free up
the server from doing any long running time-table generation algorithm. This
also means that once the client has all the data they need to generate the
timetables they can also do any subsequent work with that data completely
offline, freeing up the server even more.

The data payload for sending all course offering data is actually quite small,
equating to about 20kb for an entire term's worth of offerings, or less in some
cases. In comparison, the entire website page payload is over 30kb, so from a
bandwidth perspective, it's negligible.
