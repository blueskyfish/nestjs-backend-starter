#
# Build the mysql server
#
FROM alpine:3.5

WORKDIR /app

RUN \
  apk add --update mysql mysql-client bash sed && \
  rm -f /var/cache/apk/*

COPY my.cnf /etc/mysql/my.cnf

COPY startup.sh /startup.sh
COPY sql /sql

RUN \
  chmod +x /startup.sh

#
# Export the data directory
#
VOLUME /app/data

#
# Export the database port
#
EXPOSE 3306

CMD ["/startup.sh"]
