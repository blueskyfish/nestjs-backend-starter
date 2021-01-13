#
# MariaDB
#
FROM mariadb:latest
WORKDIR /app
COPY my.cnf /etc/mysql/my.cnf
COPY sql/*.sql /docker-entrypoint-initdb.d/
VOLUME /app/data
