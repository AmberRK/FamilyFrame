drop schema if exists family cascade;
create schema family;

CREATE TABLE family.tbUser (
    userID SERIAL PRIMARY KEY,
    displayName text NOT NULL,
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    salt text
    --pword text NOT NULL
);

create table family.person (
    personID serial primary key,
    firstName text not null,
    lastName text not null,
    dateOfBirth date,
    dateOfDeath date,
    gender text,
    creatorID int references family.tbUser(userID)
);

create table family.relationshipType (
    relationshipTypeID serial primary key,
    relationshipLabel text not null
);

create table family.relationship (
    relationshipID serial PRIMARY KEY,
    Person1 INT REFERENCES family.person(personID),
    relationshipTypeID INT REFERENCES family.relationshipType(relationshipTypeID),
    Person2 INT REFERENCES family.person(personID)
);

CREATE TABLE family.tbOwner (
    userID INT REFERENCES family.tbUser(userID),
    entity INT REFERENCES family.person(personID)
);
