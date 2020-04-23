
![Docker Image for Nestjs Backend Starter](../../logo.png)

# Docker Image for Nestjs Backend Starter

> The mysql server in the docker container

## Define SQL Statements

The database in the container can be initialized with data. To do this, you can store SQL statements
as files in the `sql` directory.



The order in which the SQL files will be imported into the database is alphabetical.

**Example**

```text
+ docker
  + db
    + sql
      + 01-create-tables.sql
      + 05-import-master-data.sql
      + 80-migration-v2-to-v3.sql
```

The import is performed the first time the database is started. The file `createDB` is then created in the data
directory and when the script is started again, it knows that the data has been imported into the database.
