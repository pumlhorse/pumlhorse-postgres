# pumlhorse-postgres
Provides Postgres functions for [Pumlhorse](https://www.github.com/pumlhorse/pumlhorse) scripts

Wraps [pg](https://github.com/brianc/node-postgres) package

## Installing npm module
`npm install pumlhorse-postgres`

## Connecting to a database
The `connect` function takes a connection string. See [pg](https://github.com/brianc/node-postgres) documentation
for connection string details.

```yaml
modules: 
  - pg = pumlhorse-postgres
steps:
  - pg.connect: postgres://my_username:my_password@server_name/database_name
```

It's likely that you would want to store this connection string in a context file and reference the
variable instead.

## Inserting data

The following code inserts three records into the myFavoriteMovies table.

```yaml
modules:
  - pg = pumlhorse-postgres
steps:
  - pg.connect: $postgresConnectionString
  - pg.insert:
      table: favoritemovies
      data:
        - name: Shawshank Redemption
          stars: 4.5
          notes: Excellent cinematography
          reviewer: $username
          reviewDate: ${new Date()}
        - name: The Matrix
          stars: 4.5
          notes: Groundbreaking
          reviewer: $username
          reviewDate: ${new Date()}
        - name: Hot Rod
          stars: 5
          notes: Just plain perfect
          reviewer: $username
          reviewDate: ${new Date()}
```

## Retrieving data
Assuming that the data above has been inserted, we can retrieve it like so

```yaml
modules:
  - pg = pumlhorse-postgres
steps:
  - pg.connect: $postgresConnectionString
  - movies = pg.query:
      parameters:
        - 4
      sql: >
             SELECT name, stars, notes, id
             FROM favoritemovies
             WHERE stars >= $1
             ORDER BY stars, name DESC
  - for:
      each: row
      in: $movies
      steps:
        - log: 
            - %s (%s stars) - %s
            - $row.name
            - $row.stars
            - $row.notes
```

The code above outputs the following lines:
- `Hot Rod (5 stars) - Just plain perfect`
- `Shawshank Redemption (4.5 stars) - Excellent cinematography`
- `The Matrix (4.5 stars) - Groundbreaking`

If you don't want to use the `for` function, you can reference the result as an array: 
```yaml
  - log: $movies[0].name # logs "Hot Rod"
```

## Multiple connections
If your script needs multiple connections, you can explicity pass the connection to the functions

```yaml
modules:
  - pg = pumlhorse-postgres
steps:
  - conn1 = pg.connect: $connection1String
  - conn2 = pg.connect: $connection2String
  - pg.insert:
      connection: $conn1
      table: table1
      data:
        - #table1 data
  - pg.insert:
      connection: $conn2
      table: table2
      data:
        - #table2 data
  - movies = pg.query:
      connection: $conn1
      parameters:
        #parameters
      sql: #SQL query
```