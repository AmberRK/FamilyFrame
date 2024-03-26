drop schema if exists family cascade;
create schema family;

CREATE TABLE family.user (
    userID SERIAL PRIMARY KEY,
    displayName text NOT NULL,
    email text NOT NULL UNIQUE CHECK(email ~* '^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$'),
    password_hash text NOT NULL,
    salt text
    --pword text NOT NULL
);

CREATE TABLE family.tree (
    treeID serial PRIMARY KEY,
    treeLabel text NOT NULL,
    createdBy INT REFERENCES family.user(userID),
    createdDate timestamp DEFAULT CURRENT_TIMESTAMP
);

create table family.person (
    personID serial primary key,
    firstName text not null,
    lastName text not null,
    dateOfBirth date,
    dateOfDeath date,
    gender text,
    createdBy int references family.user(userID),
    createdDate timestamp DEFAULT CURRENT_TIMESTAMP,
    treeID int references family.tree(treeID)
);

create table family.relationshipType (
    relationshipTypeID serial primary key,
    relationshipLabel text not null
);

create table family.relationship (
    relationshipID serial PRIMARY KEY,
    person1ID INT REFERENCES family.person(personID),
    relationshipTypeID INT REFERENCES family.relationshipType(relationshipTypeID),
    person2ID INT REFERENCES family.person(personID)
);

CREATE TABLE family.treeAuthors (
    treeID INT REFERENCES family.tree(treeID),
    userID INT REFERENCES family.user(userID),
    createdDate timestamp DEFAULT CURRENT_TIMESTAMP
);
