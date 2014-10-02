# course-buddy

Carleton University course scheduling tool

## Installation

### Generate SQL files

Run the generator in `csv_to_sql/` by running:

``` sh
$ ruby generate_sql.rb
```

It should output a bunch of .sql files to import into the database.

### Create the database

Create a database in MySQL using your MySQL tool of choice and name it `coursebuddy`.

### Import SQL files

Import the SQL files into your `coursebuddy` database in the following order:

1. `init.sql`
2. `courses.sql`
3. `offerings.sql`
4. `offering_days.sql`

## Usage

TODO

##

## License

MIT
