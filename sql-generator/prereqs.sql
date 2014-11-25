START TRANSACTION;

DELETE FROM prereqs;
DELETE FROM course_program_reqs;

-- ELEC Prereqs
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=2501), (SELECT id FROM courses WHERE dept="MATH" and code=1005), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=2501), (SELECT id FROM courses WHERE dept="PHYS" and code=1002), FALSE, 1);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=2501), (SELECT id FROM courses WHERE dept="PHYS" and code=1004), FALSE, 1);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=2507), (SELECT id FROM courses WHERE dept="ELEC" and code=2501), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=2607), (SELECT id FROM courses WHERE dept="PHYS" and code=1002), FALSE, 2);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=2607), (SELECT id FROM courses WHERE dept="PHYS" and code=1004), FALSE, 2);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=3105), (SELECT id FROM courses WHERE dept="MATH" and code=2004), FALSE, 2);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=3105), (SELECT id FROM courses WHERE dept="PHYS" and code=1002), FALSE, 3);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=3105), (SELECT id FROM courses WHERE dept="PHYS" and code=1004), FALSE, 3);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=3500), (SELECT id FROM courses WHERE dept="ELEC" and code=2507), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=3500), (SELECT id FROM courses WHERE dept="ELEC" and code=2607), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=3508), (SELECT id FROM courses WHERE dept="ELEC" and code=2501), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=3508), (SELECT id FROM courses WHERE dept="ELEC" and code=2507), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=3509), (SELECT id FROM courses WHERE dept="ELEC" and code=2507), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=3605), (SELECT id FROM courses WHERE dept="MATH" and code=1005), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=3605), (SELECT id FROM courses WHERE dept="PHYS" and code=1004), FALSE, 4);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=3605), (SELECT id FROM courses WHERE dept="PHYS" and code=1002), FALSE, 4);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=3908), (SELECT id FROM courses WHERE dept="ELEC" and code=2507), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=3909), (SELECT id FROM courses WHERE dept="ELEC" and code=3105), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=3605), (SELECT id FROM courses WHERE dept="ELEC" and code=2507), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4502), (SELECT id FROM courses WHERE dept="ELEC" and code=4503), TRUE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4503), (SELECT id FROM courses WHERE dept="ELEC" and code=3909), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4505), (SELECT id FROM courses WHERE dept="ELEC" and code=3509), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4505), (SELECT id FROM courses WHERE dept="SYSC" and code=3501), FALSE, 5);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4505), (SELECT id FROM courses WHERE dept="SYSC" and code=3503), FALSE, 5);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4601), (SELECT id FROM courses WHERE dept="ELEC" and code=2607), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4601), (SELECT id FROM courses WHERE dept="SYSC" and code=2003), FALSE, 6);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4601), (SELECT id FROM courses WHERE dept="SYSC" and code=3003), FALSE, 6);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4601), (SELECT id FROM courses WHERE dept="SYSC" and code=3006), FALSE, 6);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4609), (SELECT id FROM courses WHERE dept="SYSC" and code=3500), FALSE, 7);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4609), (SELECT id FROM courses WHERE dept="SYSC" and code=3908), FALSE, 7);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4700), (SELECT id FROM courses WHERE dept="ELEC" and code=3908), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4702), (SELECT id FROM courses WHERE dept="ELEC" and code=3908), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4702), (SELECT id FROM courses WHERE dept="ELEC" and code=3909), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4703), (SELECT id FROM courses WHERE dept="ELEC" and code=2501), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4703), (SELECT id FROM courses WHERE dept="ELEC" and code=2507), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4704), (SELECT id FROM courses WHERE dept="ELEC" and code=3908), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4706), (SELECT id FROM courses WHERE dept="ELEC" and code=3500), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4707), (SELECT id FROM courses WHERE dept="ELEC" and code=3509), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4708), (SELECT id FROM courses WHERE dept="ELEC" and code=3500), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4907), (SELECT id FROM courses WHERE dept="ELEC" and code=3907), TRUE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4907), (SELECT id FROM courses WHERE dept="ECOR" and code=4995), TRUE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4908), (SELECT id FROM courses WHERE dept="ECOR" and code=4995), FALSE, NULL);

-- SYSC Prereqs

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=2001), (SELECT id FROM courses WHERE dept="ECOR" and code=1606), FALSE, 8);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=2001), (SELECT id FROM courses WHERE dept="SYSC" and code=1005), FALSE, 8);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=2003), (SELECT id FROM courses WHERE dept="SYSC" and code=2001), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=2003), (SELECT id FROM courses WHERE dept="SYSC" and code=2002), FALSE, 9);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=2003), (SELECT id FROM courses WHERE dept="SYSC" and code=2006), FALSE, 9);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=2004), (SELECT id FROM courses WHERE dept="SYSC" and code=2002), FALSE, 10);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=2004), (SELECT id FROM courses WHERE dept="SYSC" and code=2006), FALSE, 10);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=2006), (SELECT id FROM courses WHERE dept="ECOR" and code=1606), FALSE, 11);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=2006), (SELECT id FROM courses WHERE dept="SYSC" and code=1005), FALSE, 11);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=2100), (SELECT id FROM courses WHERE dept="SYSC" and code=1102), FALSE, 12);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=2100), (SELECT id FROM courses WHERE dept="SYSC" and code=2006), FALSE, 12);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=2100), (SELECT id FROM courses WHERE dept="SYSC" and code=1101), FALSE, 13);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=2100), (SELECT id FROM courses WHERE dept="SYSC" and code=2004), FALSE, 13);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3006), (SELECT id FROM courses WHERE dept="SYSC" and code=2002), FALSE, 14);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3006), (SELECT id FROM courses WHERE dept="SYSC" and code=2006), FALSE, 14);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3006), (SELECT id FROM courses WHERE dept="ELEC" and code=2607), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3020), (SELECT id FROM courses WHERE dept="SYSC" and code=2004), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3020), (SELECT id FROM courses WHERE dept="SYSC" and code=2006), FALSE, 14);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3020), (SELECT id FROM courses WHERE dept="SYSC" and code=2002), FALSE, 14);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3101), (SELECT id FROM courses WHERE dept="SYSC" and code=2004), FALSE, 15);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3101), (SELECT id FROM courses WHERE dept="SYSC" and code=2100), FALSE, 15);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3110), (SELECT id FROM courses WHERE dept="SYSC" and code=2004), FALSE, 16);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3110), (SELECT id FROM courses WHERE dept="SYSC" and code=2100), FALSE, 16);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3120), (SELECT id FROM courses WHERE dept="SYSC" and code=2004), FALSE, 17);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3120), (SELECT id FROM courses WHERE dept="SYSC" and code=2100), FALSE, 17);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3200), (SELECT id FROM courses WHERE dept="MATH" and code=1004), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3200), (SELECT id FROM courses WHERE dept="MATH" and code=1104), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3200), (SELECT id FROM courses WHERE dept="ECOR" and code=1606), FALSE, 18);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3200), (SELECT id FROM courses WHERE dept="SYSC" and code=1100), FALSE, 18);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3303), (SELECT id FROM courses WHERE dept="SYSC" and code=2003), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3303), (SELECT id FROM courses WHERE dept="SYSC" and code=2004), FALSE, 19);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3303), (SELECT id FROM courses WHERE dept="SYSC" and code=2100), FALSE, 19);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3500), (SELECT id FROM courses WHERE dept="MATH" and code=2004), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3501), (SELECT id FROM courses WHERE dept="MATH" and code=3705), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3501), (SELECT id FROM courses WHERE dept="SYSC" and code=3600), FALSE, 20);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3501), (SELECT id FROM courses WHERE dept="SYSC" and code=3610), FALSE, 20);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3503), (SELECT id FROM courses WHERE dept="SYSC" and code=3500), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3503), (SELECT id FROM courses WHERE dept="STAT" and code=2605), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3600), (SELECT id FROM courses WHERE dept="MATH" and code=1005), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3600), (SELECT id FROM courses WHERE dept="ECOR" and code=1101), FALSE, 21);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3600), (SELECT id FROM courses WHERE dept="PHYS" and code=1001), FALSE, 21);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3601), (SELECT id FROM courses WHERE dept="ELEC" and code=2607), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=3601), (SELECT id FROM courses WHERE dept="SYSC" and code=2003), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4001), (SELECT id FROM courses WHERE dept="SYSC" and code=2002), FALSE, 22);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4001), (SELECT id FROM courses WHERE dept="SYSC" and code=2100), FALSE, 22);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4001), (SELECT id FROM courses WHERE dept="SYSC" and code=2003), FALSE, 23);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4001), (SELECT id FROM courses WHERE dept="SYSC" and code=3006), FALSE, 23);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4005), (SELECT id FROM courses WHERE dept="STAT" and code=2605), FALSE, 24);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4005), (SELECT id FROM courses WHERE dept="STAT" and code=2605), FALSE, 24);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4101), (SELECT id FROM courses WHERE dept="SYSC" and code=3100), FALSE, 25);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4101), (SELECT id FROM courses WHERE dept="SYSC" and code=3120), FALSE, 25);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4101), (SELECT id FROM courses WHERE dept="SYSC" and code=3020), FALSE, 25);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4102), (SELECT id FROM courses WHERE dept="STAT" and code=3502), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4102), (SELECT id FROM courses WHERE dept="SYSC" and code=3001), FALSE, 26);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4102), (SELECT id FROM courses WHERE dept="SYSC" and code=4001), FALSE, 26);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4106), (SELECT id FROM courses WHERE dept="SYSC" and code=3100), FALSE, 27);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4106), (SELECT id FROM courses WHERE dept="SYSC" and code=3020), FALSE, 27);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4106), (SELECT id FROM courses WHERE dept="SYSC" and code=3120), FALSE, 27);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4120), (SELECT id FROM courses WHERE dept="SYSC" and code=3120), FALSE, 28);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4120), (SELECT id FROM courses WHERE dept="SYSC" and code=3100), FALSE, 28);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4201), (SELECT id FROM courses WHERE dept="SYSC" and code=3605), FALSE, 29);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4201), (SELECT id FROM courses WHERE dept="SYSC" and code=3203), FALSE, 29);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4205), (SELECT id FROM courses WHERE dept="MATH" and code=3705), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4405), (SELECT id FROM courses WHERE dept="SYSC" and code=3500), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4405), (SELECT id FROM courses WHERE dept="SYSC" and code=3600), FALSE, 30);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4405), (SELECT id FROM courses WHERE dept="SYSC" and code=3610), FALSE, 30);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4502), (SELECT id FROM courses WHERE dept="SYSC" and code=4602), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4502), (SELECT id FROM courses WHERE dept="SYSC" and code=2004), FALSE, 31);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4502), (SELECT id FROM courses WHERE dept="SYSC" and code=2100), FALSE, 31);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4504), (SELECT id FROM courses WHERE dept="SYSC" and code=2004), FALSE, 32);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4504), (SELECT id FROM courses WHERE dept="SYSC" and code=2100), FALSE, 32);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4505), (SELECT id FROM courses WHERE dept="MATH" and code=2004), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4505), (SELECT id FROM courses WHERE dept="SYSC" and code=3500), FALSE, 33);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4505), (SELECT id FROM courses WHERE dept="SYSC" and code=3600), FALSE, 33);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4505), (SELECT id FROM courses WHERE dept="SYSC" and code=3610), FALSE, 33);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4507), (SELECT id FROM courses WHERE dept="ELEC" and code=2607), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4507), (SELECT id FROM courses WHERE dept="SYSC" and code=2001), FALSE, 34);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4507), (SELECT id FROM courses WHERE dept="SYSC" and code=3606), FALSE, 34);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4600), (SELECT id FROM courses WHERE dept="SYSC" and code=3501), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4600), (SELECT id FROM courses WHERE dept="STAT" and code=3502), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4602), (SELECT id FROM courses WHERE dept="STAT" and code=2605), FALSE, 35);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4602), (SELECT id FROM courses WHERE dept="STAT" and code=3502), FALSE, 35);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4604), (SELECT id FROM courses WHERE dept="SYSC" and code=3503), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4607), (SELECT id FROM courses WHERE dept="SYSC" and code=3501), FALSE, 36);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4607), (SELECT id FROM courses WHERE dept="SYSC" and code=3503), FALSE, 36);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4806), (SELECT id FROM courses WHERE dept="SYSC" and code=4800), FALSE, 37);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4806), (SELECT id FROM courses WHERE dept="SYSC" and code=4120), FALSE, 37);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4907), (SELECT id FROM courses WHERE dept="ECOR" and code=4995), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4927), (SELECT id FROM courses WHERE dept="ECOR" and code=4995), FALSE, NULL);

-- ECOR Prereqs

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ECOR" and code=1101), (SELECT id FROM courses WHERE dept="MATH" and code=1004), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ECOR" and code=1101), (SELECT id FROM courses WHERE dept="MATH" and code=1104), FALSE, NULL);

INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ECOR" and code=2606), (SELECT id FROM courses WHERE dept="MATH" and code=1005), FALSE, NULL);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ECOR" and code=2606), (SELECT id FROM courses WHERE dept="ECOR" and code=1606), FALSE, 38);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ECOR" and code=2606), (SELECT id FROM courses WHERE dept="SYSC" and code=1005), FALSE, 38);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ECOR" and code=2606), (SELECT id FROM courses WHERE dept="ECOR" and code=1010), FALSE, 39);
INSERT INTO prereqs (course, prereq, allow_concur, equiv_group) VALUES ((SELECT id FROM courses WHERE dept="ECOR" and code=2606), (SELECT id FROM courses WHERE dept="ELEC" and code=1908), FALSE, 39);

-- ---------------
-- CORE SE Prereqs
-- ---------------

-- Y1 TF
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="PHYS" AND code=1003), (SELECT id from COURSES WHERE dept="MATH" AND code=1004), TRUE);

-- Y1 TW
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="MATH" AND code=1005), (SELECT id from COURSES WHERE dept="MATH" AND code=1004), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="PHYS" AND code=1004), (SELECT id from COURSES WHERE dept="MATH" AND code=1004), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="PHYS" AND code=1004), (SELECT id from COURSES WHERE dept="ECOR" AND code=1101), TRUE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="ECOR" AND code=1101), (SELECT id from COURSES WHERE dept="MATH" AND code=1104), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="ECOR" AND code=1101), (SELECT id from COURSES WHERE dept="MATH" AND code=1004), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=2006), (SELECT id from COURSES WHERE dept="SYSC" AND code=1005), FALSE);

-- Y2 TF
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="MATH" AND code=2004), (SELECT id from COURSES WHERE dept="MATH" AND code=1005), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="MATH" AND code=2004), (SELECT id from COURSES WHERE dept="MATH" AND code=1104), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="ELEC" AND code=2501), (SELECT id from COURSES WHERE dept="MATH" AND code=1005), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="ELEC" AND code=2501), (SELECT id from COURSES WHERE dept="PHYS" AND code=1004), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=2004), (SELECT id from COURSES WHERE dept="SYSC" AND code=2006), TRUE);

-- Y2 TW
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="MATH" AND code=1805), (SELECT id from COURSES WHERE dept="SYSC" AND code=1005), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="ELEC" AND code=2607), (SELECT id from COURSES WHERE dept="PHYS" AND code=1004), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=2003), (SELECT id from COURSES WHERE dept="SYSC" AND code=2001), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=2003), (SELECT id from COURSES WHERE dept="SYSC" AND code=2006), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=2100), (SELECT id from COURSES WHERE dept="SYSC" AND code=2006), FALSE);

-- Y3 TF
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="COMP" AND code=3005), (SELECT id from COURSES WHERE dept="SYSC" AND code=2100), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=4001), (SELECT id from COURSES WHERE dept="SYSC" AND code=2003), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=4001), (SELECT id from COURSES WHERE dept="SYSC" AND code=2100), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=3110), (SELECT id from COURSES WHERE dept="SYSC" AND code=2004), FALSE);

-- Y3 TW
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="STAT" AND code=3502), (SELECT id from COURSES WHERE dept="MATH" AND code=2004), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=3303), (SELECT id from COURSES WHERE dept="SYSC" AND code=2003), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=3303), (SELECT id from COURSES WHERE dept="SYSC" AND code=2004), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=3101), (SELECT id from COURSES WHERE dept="SYSC" AND code=2100), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=3101), (SELECT id from COURSES WHERE dept="SYSC" AND code=2004), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=3120), (SELECT id from COURSES WHERE dept="SYSC" AND code=2100), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=3120), (SELECT id from COURSES WHERE dept="SYSC" AND code=2004), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=4106), (SELECT id from COURSES WHERE dept="SYSC" AND code=3120), TRUE);

-- Y4 TF
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=4101), (SELECT id from COURSES WHERE dept="SYSC" AND code=3120), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=4120), (SELECT id from COURSES WHERE dept="SYSC" AND code=3120), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=4927), (SELECT id from COURSES WHERE dept="ECOR" AND code=4995), FALSE);

-- Y4 TW
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=4005), (SELECT id from COURSES WHERE dept="STAT" AND code=3502), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=4507), (SELECT id from COURSES WHERE dept="ELEC" AND code=2607), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=4507), (SELECT id from COURSES WHERE dept="SYSC" AND code=2001), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=2100), (SELECT id from COURSES WHERE dept="SYSC" AND code=2006), FALSE);
INSERT INTO prereqs (course, prereq, allow_concur) VALUES ((SELECT id from COURSES WHERE dept="SYSC" AND code=4806), (SELECT id from COURSES WHERE dept="SYSC" AND code=4120), FALSE);

-- ------------------
-- Program Prereqs --
-- ------------------

INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4504), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4506), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4509), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4600), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4602), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4703), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4705), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4708), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4709), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4906), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4907), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=4908), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=3110), (SELECT id FROM programs WHERE name="Software Engineering"), 3);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="ELEC" and code=3120), (SELECT id FROM programs WHERE name="Software Engineering"), 3);

INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4005), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4105), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4107), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4205), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4502), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4602), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4806), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4907), (SELECT id FROM programs WHERE name="Software Engineering"), 4);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="SYSC" and code=4927), (SELECT id FROM programs WHERE name="Software Engineering"), 4);

INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="ECOR" and code=3800), (SELECT id FROM programs WHERE name="Software Engineering"), 3);
INSERT INTO course_program_reqs (course, program, year_standing) VALUES ((SELECT id FROM courses WHERE dept="ECOR" and code=4995), (SELECT id FROM programs WHERE name="Software Engineering"), 4);

COMMIT;
