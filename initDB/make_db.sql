create database mydb;
create user family with password 'frame';
grant all privileges on database mydb to family;
alter database mydb owner to family;
