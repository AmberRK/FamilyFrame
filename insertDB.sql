BEGIN;

-- Make a user
INSERT INTO family.tbUser (displayName, email, pword)
VALUES
    ('admin', 'alape632@live.kutztown.edu', 'familyFrame');

-- Insert predefined relationship types
INSERT INTO family.relationshipType (relationshipLabel) VALUES
    ('Parent'),
    ('Child'),
    ('Spouse'),
    ('Sibling'),
    ('Friend');

-- Insert Simpsons family into tbPerson
INSERT INTO family.person (firstName, lastName, dateOfBirth, gender, creatorID)
VALUES
    ('Homer', 'Simpson', '1956-05-12', 'Male', 1),  -- Homer
    ('Marge', 'Simpson', '1954-03-19', 'Female', 1), -- Marge
    ('Bart', 'Simpson', '1980-04-01', 'Male', 1),   -- Bart
    ('Lisa', 'Simpson', '1984-05-09', 'Female', 1), -- Lisa
    ('Maggie', 'Simpson', '1988-12-17', 'Female', 1), -- Maggie
    ('Abe', 'Simpson', '1926-03-12', 'Male', 1);  -- Abe

-- Insert relationships for the Simpsons family
-- Homer and Marge are spouses
INSERT INTO family.relationship (Person1, RelationshipTypeID, Person2)
VALUES
    (1, (SELECT relationshipTypeID FROM family.relationshipType WHERE relationshipLabel = 'Spouse'), 2),
    (2, (SELECT relationshipTypeID FROM family.relationshipType WHERE relationshipLabel = 'Spouse'), 1);

-- Homer and Marge are parents of Bart, Lisa, and Maggie
INSERT INTO family.relationship (Person1, RelationshipTypeID, Person2)
VALUES
    (1, (SELECT relationshipTypeID FROM family.relationshipType WHERE relationshipLabel = 'Parent'), 3), -- Homer is a parent of Bart
    (2, (SELECT relationshipTypeID FROM family.relationshipType WHERE relationshipLabel = 'Parent'), 3), -- Marge is a parent of Bart

    (1, (SELECT relationshipTypeID FROM family.relationshipType WHERE relationshipLabel = 'Parent'), 4), -- Homer is a parent of Lisa
    (2, (SELECT relationshipTypeID FROM family.relationshipType WHERE relationshipLabel = 'Parent'), 4), -- Marge is a parent of Lisa

    (1, (SELECT relationshipTypeID FROM family.relationshipType WHERE relationshipLabel = 'Parent'), 5), -- Homer is a parent of Maggie
    (2, (SELECT relationshipTypeID FROM family.relationshipType WHERE relationshipLabel = 'Parent'), 5); -- Marge is a parent of Maggie

COMMIT;
