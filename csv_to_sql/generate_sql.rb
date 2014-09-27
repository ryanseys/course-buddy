# This Script Generates 3 SQL files from the included data.csv file
# Run with no parameters.
# 
# To Load SQL into mysql
# mysql> source init.sql
# mysql> source courses.sql
# mysql> source offerings.sql
# mysql> source offering_days.sql

require 'csv'
require 'set'

COURSES_TEMPLATE =
	'INSERT INTO courses (dept, code, name) VALUES ("%s", %s, "%s");'
OFFERINGS_TEMPLATE =
	'INSERT INTO offerings (course, type, time_start, time_end, capacity)'\
	' VALUES (%s, "%s", %s, %s, %s);'

DEPT = 0
CODE = 1
SECTION = 2
NAME = 3
TYPE = 4  # LEC/LAB
DAYS = 5  # e.g. "WF", "MW"
TIME_START = 6
TIME_END = 7
CAPACITY = 8

def search_course_statement(csv_row)
	return  "(SELECT id from courses WHERE dept = \"#{csv_row[DEPT]}\" AND code = #{csv_row[CODE]})"
end

def compound_code(csv_row)
	return "#{csv_row[DEPT]}#{csv_row[CODE]}"
end

# Generate courses SQL
File.open('courses.sql', 'w') { |file| 
	codes = Set.new
	file.write("DELETE FROM courses;\n")
	CSV.foreach('data.csv', {:col_sep => ';', :headers=>:first_row}) do |row|
		if not codes.include? compound_code row
			codes.add compound_code row
			file.write(COURSES_TEMPLATE % [row[DEPT], row[CODE], row[NAME]])
			file.write("\n")
		end
	end
}

# Generate offerings SQL
File.open('offerings.sql', 'w') { |file| 
	file.write("DELETE FROM offerings;\n")
	CSV.foreach('data.csv', {:col_sep => ';', :headers=>:first_row}) do |row|
		course_search = search_course_statement row
		time_start = row[TIME_START].nil? ? "NULL" : "TIME_FORMAT(#{row[TIME_START]}, '%H%i')"
		time_end = row[TIME_END].nil? ? "NULL" : "TIME_FORMAT(#{row[TIME_END]}, '%H%i')"
		capacity = row[CAPACITY].nil? ? "NULL" : row[CAPACITY]
		file.write(OFFERINGS_TEMPLATE % [course_search, row[TYPE], time_start, time_end, capacity])
		file.write("\n")
	end
}

# Generate offering_days SQL
File.open('offering_days.sql', 'w') { |file| 
	file.write("DELETE FROM offering_days;\n")
	CSV.foreach('data.csv', {:col_sep => ';', :headers=>:first_row}) do |row|
		course_search = search_course_statement row
		days = row[DAYS]
		if not days.nil?
			row[DAYS].each_char do |day|
				file.write("INSERT INTO offering_days (course, day) VALUES (#{course_search}, \"#{day}\");")
				file.write("\n")
			end
		end
	end
}
