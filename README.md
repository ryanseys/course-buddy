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

Import the `install.sql` file into the database.

## Usage

TODO

##

## License

MIT
