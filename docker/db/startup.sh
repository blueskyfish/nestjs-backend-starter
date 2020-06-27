#!/bin/sh

# TODO Rename "Starter" to your Short Project Name

if [ -f /app/data/createDB ]; then
  echo ">>>>>> (Starter) MySQL directory already present, skip creating database from 'sql' directory..."
else
  echo ">>>>>> (Starter) MySQL data directory not found, creating initial DBs from 'sql' directory..."

  mysql_install_db --user=root > /dev/null

  if [ "$MYSQL_ROOT_PASSWORD" = "" ]; then
    MYSQL_ROOT_PASSWORD=111111
    echo ">>>>>> (Starter) MySQL root Password: $MYSQL_ROOT_PASSWORD"
  fi

  MYSQL_DATABASE=${MYSQL_DATABASE:-""}
  MYSQL_USER=${MYSQL_USER:-""}
  MYSQL_PASSWORD=${MYSQL_PASSWORD:-""}

  if [ ! -d "/run/mysqld" ]; then
    mkdir -p /run/mysqld
  fi

  tfile=`mktemp`
  if [ ! -f "$tfile" ]; then
      return 1
  fi

  cat << EOF > $tfile
USE mysql;
FLUSH PRIVILEGES;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY "$MYSQL_ROOT_PASSWORD" WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
UPDATE user SET password=PASSWORD("") WHERE user='root' AND host='localhost';
EOF

  if [ "$MYSQL_DATABASE" != "" ]; then
    echo ">>>>>> (Starter) Creating database: $MYSQL_DATABASE"
    echo "CREATE DATABASE IF NOT EXISTS \`$MYSQL_DATABASE\` CHARACTER SET utf8 COLLATE utf8_general_ci;" >> $tfile

    if [ "$MYSQL_USER" != "" ]; then
      echo ">>>>>> (Starter) Creating user: $MYSQL_USER with password $MYSQL_PASSWORD"
      echo "GRANT ALL ON \`$MYSQL_DATABASE\`.* to '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';" >> $tfile
    fi

    # Test
    echo "CREATE DATABASE IF NOT EXISTS \`$MYSQL_DATABASE-test\` CHARACTER SET utf8 COLLATE utf8_general_ci;" >> $tfile
    echo "GRANT ALL ON \`$MYSQL_DATABASE-test\`.* to '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';" >> $tfile
  fi

  /usr/bin/mysqld --user=root --bootstrap --verbose=0 < $tfile

  #
  # ADD here the commons sql scripts for initialize the database
  #
  cat `ls -- /sql/*.sql | sort` > /sql/all.sql
  /usr/bin/mysqld --user=root --bootstrap --verbose=0 < /sql/all.sql

  echo ">>>>>> (Starter) Test database"
  sed 's/`starter`/`starter-test`/g' /sql/all.sql > /sql/all-test.sql
  /usr/bin/mysqld --user=root --bootstrap --verbose=0 < /sql/all-test.sql

  echo ">>>>>> (Starter) Finish Test database"

  if [ ! -f /app/data/createDB ]; then
    echo ">>>>>> (Starter) create file /app/data/createDB"
    touch /app/data/createDB
  fi

  rm -f $tfile
fi

# Mysql Server
echo ">>>>>> (Starter) starts the MySQL database domain with \"root\" and console parameter..."
exec /usr/bin/mysqld --user=root --console
