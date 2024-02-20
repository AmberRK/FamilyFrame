FROM alpine

# Install postgresql and set up the database
RUN apk add postgresql nodejs npm
RUN su -l postgres -c "initdb -D /var/lib/postgresql/data"

# Set up directories
RUN mkdir /run/postgresql
RUN chown postgres:postgres /run/postgresql

# Copy startup file
COPY startup.sh /
RUN chmod u+x /startup.sh

# Copy over SQL files and run them
COPY make_db.sql /var/lib/postgresql/make_db.sql
COPY create_tables.sql /var/lib/postgresql/create_tables.sql
COPY insertDB.sql /var/lib/postgresql/insertDB.sql

RUN chown postgres:postgres /var/lib/postgresql/make_db.sql
RUN chown postgres:postgres /var/lib/postgresql/create_tables.sql
RUN chown postgres:postgres /var/lib/postgresql/insertDB.sql

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8080

EXPOSE 8080

# Run the container command
#CMD ["/bin/ash", "-c", "/startup.sh && /bin/ash"]
CMD ["/bin/ash", "-c", "/startup.sh && npm start"]
