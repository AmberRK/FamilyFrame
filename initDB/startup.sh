#!/bin/ash

su -l postgres -c "pg_ctl start -D /var/lib/postgresql/data"
su -l postgres -c "psql -f /var/lib/postgresql/make_db.sql"
su -l postgres -c "psql -d mydb -U family -f /var/lib/postgresql/create_tables.sql"
su -l postgres -c "psql -d mydb -U family -f /var/lib/postgresql/insertDB.sql"
