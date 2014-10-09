# This Script Generates 3 SQL files from the included data.csv and cses.txt files
# Run with no parameters.

require 'csv'
require 'set'

COURSES_TEMPLATE =
	'INSERT INTO courses (dept, code, name) VALUES ("%s", %s, "%s");'
OFFERINGS_TEMPLATE =
	'INSERT INTO offerings (course, type, time_start, time_end, capacity, days)'\
	' VALUES (%s, "%s", %s, %s, %s, "%s");'

# data.csv indexes
DEPT = 0
CODE = 1
SECTION = 2
NAME = 3
TYPE = 4  # LEC/LAB
DAYS = 5  # e.g. "WF", "MW"
TIME_START = 6
TIME_END = 7
CAPACITY = 8

def get_course(dept, code)
	return "(SELECT id from courses WHERE dept=\"#{dept}\" AND code=#{code})"
end 

def compound_code(csv_row)
	return "#{csv_row[DEPT]}#{csv_row[CODE]}"
end

# Generate courses SQL
File.open('courses.sql', 'w') { |file|
	codes = Set.new
	file.write("START TRANSACTION;\nDELETE FROM courses;\n")
	CSV.foreach('data.csv', {:col_sep => ';', :headers=>:first_row, :encoding => 'windows-1251:utf-8' }) do |row|
		if not codes.include? compound_code row
			codes.add compound_code row
			file.write(COURSES_TEMPLATE % [row[DEPT], row[CODE], row[NAME]])
			file.write("\n")
		end
	end

	file.write("COMMIT;\n")
}

# Generate offerings SQL
File.open('offerings.sql', 'w') { |file|
	file.write("START TRANSACTION;\nDELETE FROM offerings;\n")
	CSV.foreach('data.csv', {:col_sep => ';', :headers=>:first_row, :encoding => 'windows-1251:utf-8'}) do |row|
		course_search = get_course(row[DEPT], row[CODE])
		time_start = row[TIME_START].nil? ? "NULL" : "TIME_FORMAT(#{row[TIME_START]}, '%H%i')"
		time_end = row[TIME_END].nil? ? "NULL" : "TIME_FORMAT(#{row[TIME_END]}, '%H%i')"
		capacity = row[CAPACITY].nil? ? "NULL" : row[CAPACITY]
		file.write(OFFERINGS_TEMPLATE % [course_search, row[TYPE], time_start, time_end, capacity, row[DAYS]])
		file.write("\n")
	end

	file.write("COMMIT;\n")
}

# Generate CSE SQL
File.open('cses.sql', 'w') { |sql|
	group_name = 'CSE'
	# get_group_sql = "SELECT id from elective_groups WHERE name=\"#{group_name}\""

	sql.write("START TRANSACTION;\n")
	sql.write("DELETE FROM elective_groups WHERE name=\"CSE\";\n")
	sql.write("DELETE FROM elective_group_courses WHERE elective_group=\"#{group_name}\";\n")
	sql.write("INSERT INTO elective_groups (name) VALUES (\"#{group_name}\");\n")

	File.open("cses.txt", "r").each_line do |line|
		dept = line.split(':')[0].strip()
		courses = line.split(':')[1]
		courses.split(',').each{ |code|
			code = code.strip()
			sql.write("INSERT INTO elective_group_courses (elective_group, course) VALUES (\"#{group_name}\", #{get_course(dept, code)});\n")
		}
	end

	sql.write("COMMIT;\n")
}
