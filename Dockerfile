FROM alpine

# Install postgresql and set up the database
RUN apk add postgresql nodejs npm
RUN npm install -g nodemon

RUN su -l postgres -c "initdb -D /var/lib/postgresql/data"

# Set up directories
RUN mkdir /run/postgresql
RUN chown postgres:postgres /run/postgresql

# Copy startup file
COPY ./initDB/startup.sh /
RUN chmod u+x /startup.sh

# Copy over SQL files and run them
COPY ./initDB/make_db.sql /var/lib/postgresql/make_db.sql
COPY ./initDB/create_tables.sql /var/lib/postgresql/create_tables.sql
COPY ./initDB/insertDB.sql /var/lib/postgresql/insertDB.sql

RUN chown postgres:postgres /var/lib/postgresql/make_db.sql
RUN chown postgres:postgres /var/lib/postgresql/create_tables.sql
RUN chown postgres:postgres /var/lib/postgresql/insertDB.sql

WORKDIR /app

COPY ./package*.json ./

RUN npm install

# Doesn't copy files over, for dev environment bind mounting
# COPY . .

ENV PORT=8080

EXPOSE 8080

# Run the container command
# Start container and use npm start
CMD ["/bin/ash", "-c", "/startup.sh && npm start"]

# Start a container and jump into a shell
# CMD ["/bin/ash", "-c", "/startup.sh && /bin/ash"]

# Start the container and start serving it with node
# CMD ["/bin/ash", "-c", "/startup.sh && nodemon ./Project/index.js"]

# Start container and use nodemon as a CMD instead of in npm startup
# CMD ["/bin/ash", "-c", "/startup.sh && nodemon ./Project/index.js"]
