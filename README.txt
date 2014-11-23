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
- Developed much of the front-end application for on-pattern flow.
- Developed part of the database queries for use in the API.
- Developed timetable calendar UI generation

Andrew O'Hara:
- Developed Database Schema and manual SQL generation
- Developed parser to automate course and offering SQL generation
- Developed Java View 1
- Developed elective selection and enrolment HTML front-end
- Developed enrolment back-end
- Developed much of backend REST API

Caleb Simpson:
- Developed Off-pattern flow (class selection, searching prereq tree for next
  courses, asking which courses to take)
- Developed timetable generation to support electives, full class detection, and
  term detection
- Developed mutex lock to avoid concurrency issues during enrollement.
- Developed most of the install page/script
- Developed portions of the front-end views

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
| electives ? What files in your project will need to be modified to include  |
| all Engineering programs? Briefly, describe the changes that must be done   |
| in the code.                                                                |
+-----------------------------------------------------------------------------+

Quick-start how-to install:
---------------------------

1. Update the config.php file with your database credentials and port number.
The database will be created in the install script.

2. Start your XAMPP server, aiming the "htdocs" folder at this project's root
folder. This is the folder that contains install.html and index.html

3. Point your web browser at http://localhost/install.html

4. Click the "Install" button. When the page refreshes, course buddy should be
good to use. If the program's list does not populate with "Software Engineering"
you may need to wait a bit longer or possibly there's issue with your config.php

If the page did not refresh properly, just aim your browser at http://localhost

Alternative manual approach without using install.html:

1. Create an empty database using your MySQL tool of choice.
2. Insert the install.sql into this database using your MySQL tool of choice.
3. Update the config.php file with your database credentials and port number.
4. Start your XAMPP server, aiming the "htdocs" folder at this project's root
folder. This is the folder that contains index.html
5. Point your web browser at http://localhost

+--------------------------------------------------------------------+
| Extended version explaining the intricacies of our data / database |
+--------------------------------------------------------------------+

No changes to the program (PHP / JS) should be required to support all
the programs of the Faculty of Engineering. The only thing that will need to
change is the data that the program has access to, that is, the sql queries that
take place on install to insert all the data into the database. Due to the
unique scope and nature of the application, many of the sql queries were hand-
written and thus, to support more Engineering programs, these queries will need
to also be hand-written or somehow automated to insert into the database.

The biggest database issue is a shortcut related to the program
requirements SQL.  There are several courses which only require the student to be
in the faculty of engineering, or are require the student to be in one of several
engineering programs.  The SQL currently omits this information, and will only
allow Software Engineering students to take these courses.  The course_program_reqs
table will need to be updated to allow for faculty requirements, and allow for
multiple valid programs to be elegible for a course.

The rest of the database is far more extensible. There is a programs table, which
currently only holds one program. More programs can be added to this table, and
then, then program's required core courses can be added to the course_program_reqs
table.  Any required elective groups (e.g. CSE, SE Note A) can be added to the
program with the program_elective_groups table, and if necessary, additional
elective groups can be created by adding courses to the elective_group_courses
table.

Course Buddy currently installs the database by running the generated install.sql
file.  This file is generated ahead of time, and the contributing files and
generator will not be included in the submitted version of this assignment.  In
order to modify the database, open a mysql shell session using root credentials.
Then use the database that is referenced in config.php.  From there, you can run
new SQL files using the source <path> command.

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

There is a table called course_program_reqs which is created with the following
SQL statement:
CREATE TABLE course_program_reqs(
  id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  course int REFERENCES courses(id),
  program int REFERENCES programs(id),
  year_standing int
);

For each course that has a year-standing requirement, the requirement is held in
this table.

<TODO, how these requirements are enforced>

+------------------------------------------------------------------------------+
| 8. Explain briefly the rules (or algorithms) you use when building the       |
| (conflict-free) timetable. For instance, a course has currently 2 lectures   |
| sessions (A and B) and 2 lab sessions each (A1, A2, B1, B2); if all are      |
| still available, how does your software select which lecture session and lab |
| to suggest to the student?                                                   |
+------------------------------------------------------------------------------+

To generate a conflict-free timetable, we ask the user to either specify a
particular year and term (e.g. 1st year, fall term) (on-pattern) which we use to
query the database to figure out which classes for their program fall into that
option, or we ask them to provide a list of classes and electives that they have
previously taken (off-pattern) and we calculate what courses they can take given
that list.

Once we have a list of courses that they want to take, we query the database for
all of the course offerings with a capacity > 0 and send this to the front-end
client. The front end client receieves a large list of offerings and does the
following:

Step 1. Go through every offering and place it inside of a "bucket" with all of
the other offerings that are of the same course and type. That is, all SYSC 3200
LEC offerings will end up in the same bucket. In this case, picking one offering
from every offering "bucket" will be a set of offerings that make up a single
timetable. Note: We assume here that we need one of every type of offering i.e.
if a course has a LAB section, that LAB offering is mandatory.

Step 2. Create a list of indexes that will represent the current index of
offerings in each offering bucket (from above) that we are going to consider for
a timetable. An example list of indexes is something like this:

[ // all indexes
  [ // every inner array represents an offering type e.g. SYSC 3200 LEC
    0, // start at the first offering in this offering bucket
    2 // there are a maximum of this many items in the offering bucket
  ],
  [ // another offering type here e.g. SYSC 3200 LAB
    0,
    3
  ]
]

Step 3. Generate all timetables by iterating through the indexes list, getting
the index for each offering and using it to pick an offering from the offering
bucket list. In between each iteration, increase the indexes array. This
involves increasing the left most index array before it reaches its max, then
increasing the one to its right, repeating until every index has been maxed out
and at this point you have tried every combination of offering.
A "timetable" is just a list of offerings, one from each offering bucket.

Step 4. Iterate through every timetable and pick out the ones that are conflict-
free. We do this by iterating through the offerings and testing them against
each other, ensuring their times don't overlap and their sequence numbers are
either generic e.g. LAB with sequence "L" or PAS with sequence "P". The
timetables that pass this test are conflict-free timetables and are added to a
list of found timetables.

Step 5. Render the list of found timetables (or just the first one), unless the
list is empty and then make a suggestion to the user to select less courses in
hopes that this will reduce the conflicts to zero.

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
of this work is displayed to the user in a calendar view, where they can select
which calendar suits their needs the best.

The reason for doing the time-table generation on the front end is to free up
the server from doing any long running time-table generation algorithm. This
also means that once the client has all the data they need to generate the
timetables they can also do any subsequent work with that data completely
offline, freeing up the server even more.

The data payload for sending all course offering data is actually quite small,
equating to about 20kb for an entire term's worth of offerings, or less in some
cases. In comparison, the entire website page payload is over 30kb, so from a
bandwidth perspective, it's negligible.
