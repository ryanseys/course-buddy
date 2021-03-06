START TRANSACTION;

-- Delete Old Data
DELETE FROM programs WHERE name = "Software Engineering";
DELETE FROM program_reqs where program = (SELECT id FROM programs WHERE name = "Software Engineering");

-- -----------------------
-- Program Requirements --
-- -----------------------

INSERT IGNORE INTO programs (name) VALUES ("Software Engineering");
SET @program = (SELECT id FROM programs WHERE name = "Software Engineering");

-- Y1 TF
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="MATH" AND code=1104), 1, "F");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="MATH" AND code=1004), 1, "F");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="PHYS" AND code=1003), 1, "F");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=1005), 1, "F");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="ECOR" AND code=1010), 1, "F");

-- Y1 TW
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="MATH" AND code=1005), 1, "W");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="PHYS" AND code=1004), 1, "W");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="ECOR" AND code=1101), 1, "W");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=2006), 1, "W");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="CHEM" AND code=1101), 1, "W");

-- Y2 TF
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="MATH" AND code=2004), 2, "F");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="ELEC" AND code=2501), 2, "F");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=2001), 2, "F");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=2004), 2, "F");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="CCDP" AND code=2100), 2, "F");

-- Y2 TW
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="COMP" AND code=1805), 2, "W");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="ELEC" AND code=2607), 2, "W");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=2003), 2, "W");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=2100), 2, "W");
-- INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="PHYS" AND code=1104), 2, "W");

-- Y3 TF
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="ECOR" AND code=3800), 3, "F");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="COMP" AND code=3005), 3, "F");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=4001), 3, "F");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=3110), 3, "F");

-- Y3 TW
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="STAT" AND code=3502), 3, "W");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=3303), 3, "W");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=3101), 3, "W");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=3120), 3, "W");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=4106), 3, "W");

-- Y4 TF
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="ELEC" AND code=4705), 4, "F");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=4101), 4, "F");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=4120), 4, "F");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=4927), 4, "F");

-- Y4 TW
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=4005), 4, "W");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=4507), 4, "W");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="ECOR" AND code=4995), 4, "W");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=4927), 4, "W");
INSERT INTO program_reqs (program, course, year, term) VALUES (@program, (SELECT id from COURSES WHERE dept="SYSC" AND code=4806), 4, "W");

-- ------------
-- Electives --
-- ------------

-- Note A Electives (3 required)
INSERT INTO program_elective_groups (program, req_group, year, term) VALUES (@program, "SE Note A", 3, "F"); -- schedule first elective
INSERT INTO program_elective_groups (program, req_group, year, term) VALUES (@program, "SE Note A", 4, "F"); -- sechedule second elective
INSERT INTO program_elective_groups (program, req_group, year, term) VALUES (@program, "SE Note A", 4, "W"); -- schedule third elective
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note A", (SELECT id from courses where dept="ELEC" and code=2507));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note A", (SELECT id from courses where dept="SYSC" and code=3200));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note A", (SELECT id from courses where dept="SYSC" and code=3600));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note A", (SELECT id from courses where dept="SYSC" and code=3601));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note A", (SELECT id from courses where dept="SYSC" and code=4102));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note A", (SELECT id from courses where dept="SYSC" and code=4502));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note A", (SELECT id from courses where dept="SYSC" and code=4504));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note A", (SELECT id from courses where dept="ELEC" and code=3602));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note A", (SELECT id from courses where dept="ELEC" and code=4708));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note A", (SELECT id from courses where dept="ELEC" and code=4509));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note A", (SELECT id from courses where dept="ELEC" and code=4508));


-- Note B Electives (1 required)
INSERT INTO program_elective_groups (program, req_group, year, term) VALUES (@program, "SE Note B", 4, "F"); -- schedule Note B elective
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note B", (SELECT id from courses where dept="SYSC" and code=4105));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note B", (SELECT id from courses where dept="SYSC" and code=4107));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note B", (SELECT id from courses where dept="COMP" and code=2805));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note B", (SELECT id from courses where dept="COMP" and code=3002));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note B", (SELECT id from courses where dept="COMP" and code=4000));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note B", (SELECT id from courses where dept="COMP" and code=4001));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note B", (SELECT id from courses where dept="COMP" and code=4002));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note B", (SELECT id from courses where dept="COMP" and code=4003));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note B", (SELECT id from courses where dept="COMP" and code=4100));
INSERT INTO elective_group_courses (elective_group, course) VALUES ("SE Note B", (SELECT id from courses where dept="COMP" and code=4106));

-- CSEs
INSERT INTO program_elective_groups (program, req_group, year, term) VALUES (@program, "CSE", 2, "F");
INSERT INTO program_elective_groups (program, req_group, year, term) VALUES (@program, "CSE", 2, "W");

COMMIT;
