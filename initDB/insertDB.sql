BEGIN;

INSERT INTO familyFrame.tbUser (displayName, email, passwordHash)
VALUES
    ('admin', 'alape632@live.kutztown.edu', crypt('familyFrame', gen_salt('bf'))),
   ('admin2', 'fakeemail@gmail.com', crypt('familyFrame', gen_salt('bf')));

INSERT INTO familyFrame.tbRelationshipType (relationshipLabel) VALUES
    ('Parent'),
    ('Child'),
    ('Spouse'),
    ('Sibling'),
    ('Friend');

INSERT INTO familyFrame.tbTree (treeLabel, createdBy)
VALUES
    ('The Simpsons', ( Select userID from familyFrame.tbUser where displayName='admin')),
   ('The Washingtons', ( Select userID from familyFrame.tbUser where displayName='admin2'));
   
insert into familyframe.tbtreeauthor (treeID, userID) values
	(( Select treeID from familyFrame.tbTree where treeLabel = 'The Simpsons' ), 
	( Select userID from familyFrame.tbUser where displayName='admin')),
	(( Select treeID from familyFrame.tbTree where treeLabel = 'The Washingtons' ), 
	( Select userID from familyFrame.tbUser where displayName='admin')),
	(( Select treeID from familyFrame.tbTree where treeLabel = 'The Washingtons' ), 
	( Select userID from familyFrame.tbUser where displayName='admin2'))
;

DO $$
Declare 
    userId int := ( Select userID from familyFrame.tbUser where displayName='admin');
    familyTreeId uuid := ( Select treeID from familyFrame.tbTree where treeLabel = 'The Simpsons' );

BEGIN

-- Insert Simpsons family into tbPerson

INSERT INTO familyFrame.tbPerson (firstName, lastName, dateOfBirth, gender, createdBy, treeID)
VALUES
    ('Homer', 'Simpson', '1956-05-12', 'Male', userId, familyTreeId),  -- Homer
    -- ('Marge', 'Simpson', '1954-03-19', 'Female', userId, familyTreeId), -- Marge
    ('Bart', 'Simpson', '1980-04-01', 'Male', userId, familyTreeId),   -- Bart
    ('Lisa', 'Simpson', '1984-05-09', 'Female', userId, familyTreeId), -- Lisa
    ('Maggie', 'Simpson', '1988-12-17', 'Female', userId, familyTreeId), -- Maggie
    ('Abe', 'Simpson', '1926-03-12', 'Male', userId, familyTreeId);  -- Abe

END $$;
-- Insert relationships for the Simpsons family
-- Homer and Marge are spouses
-- INSERT INTO familyFrame.tbRelationship (person1ID, RelationshipTypeID, person2ID)
-- VALUES
    -- (1, (SELECT relationshipTypeID FROM familyFrame.tbRelationshipType WHERE relationshipLabel = 'Spouse'), 2),
    -- (2, (SELECT relationshipTypeID FROM familyFrame.tbRelationshipType WHERE relationshipLabel = 'Spouse'), 1);

-- Homer and Marge are parents of Bart, Lisa, and Maggie
INSERT INTO familyFrame.tbRelationship (person1ID, RelationshipTypeID, person2ID)
VALUES
    (1, (SELECT relationshipTypeID FROM familyFrame.tbRelationshipType WHERE relationshipLabel = 'Parent'), 2), -- Homer is a parent of Bart
    -- (2, (SELECT relationshipTypeID FROM familyFrame.tbRelationshipType WHERE relationshipLabel = 'Parent'), 3), -- Marge is a parent of Bart

    (1, (SELECT relationshipTypeID FROM familyFrame.tbRelationshipType WHERE relationshipLabel = 'Parent'), 3), -- Homer is a parent of Lisa
    -- (2, (SELECT relationshipTypeID FROM familyFrame.tbRelationshipType WHERE relationshipLabel = 'Parent'), 4), -- Marge is a parent of Lisa

    (1, (SELECT relationshipTypeID FROM familyFrame.tbRelationshipType WHERE relationshipLabel = 'Parent'), 4), -- Homer is a parent of Maggie
    -- (2, (SELECT relationshipTypeID FROM familyFrame.tbRelationshipType WHERE relationshipLabel = 'Parent'), 5), -- Marge is a parent of Maggie

    (5, (SELECT relationshipTypeID FROM familyFrame.tbRelationshipType WHERE relationshipLabel = 'Parent'), 1); -- Abe is a parent of Homer
    

COMMIT;