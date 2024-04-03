drop schema if exists familyFrame cascade;
create schema familyFrame;
create EXTENSION if not exists pgcrypto; 

CREATE TABLE familyFrame.tbUser (
    userID SERIAL PRIMARY KEY,
    displayName text NOT NULL,
    email text NOT NULL UNIQUE CHECK(email ~* '^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$'),
    passwordHash text NOT NULL
);

CREATE TABLE familyFrame.tbTree (
    treeID uuid DEFAULT gen_random_uuid () PRIMARY KEY,
    treeLabel text NOT NULL,
    createdBy INT REFERENCES familyFrame.tbUser(userID),
    createdDate timestamp DEFAULT CURRENT_TIMESTAMP
);

create table familyFrame.tbPerson(
    personID serial primary key,
    firstName text not null,
    lastName text not null,
    dateOfBirth date,
    dateOfDeath date,
    gender text,
    createdBy int references familyFrame.tbUser(userID),
    createdDate timestamp DEFAULT CURRENT_TIMESTAMP,
    treeID uuid references familyFrame.tbTree(treeID)
);

create table familyFrame.tbRelationshipType (
    relationshipTypeID serial primary key,
    relationshipLabel text not null
);

create table familyFrame.tbRelationship (
    relationshipID serial PRIMARY KEY,
    person1ID INT REFERENCES familyFrame.tbPerson(personID),
    relationshipTypeID INT REFERENCES familyFrame.tbRelationshipType(relationshipTypeID),
    person2ID INT REFERENCES familyFrame.tbPerson(personID)
);

CREATE TABLE familyFrame.tbTreeAuthors (
    treeID uuid REFERENCES familyFrame.tbTree(treeID),
    userID INT REFERENCES familyFrame.tbUser(userID),
    createdDate timestamp DEFAULT CURRENT_TIMESTAMP
);
