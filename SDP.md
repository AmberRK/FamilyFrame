Software Development Plan
==================================

TITLE PAGE CONTENT
------------------

**NAME OF SYSTEM**

**DATE**

Version

**Presented To:**

who

**Submitted By:**

who

REVISION HISTORY
----------------

  **Date**       |**Author**   |**Distributed to**   |**Version**          |**Description**
  -------------- | ------------ |-------------------- |-------------------- |-----------------------------
  Nov 3, 2023  |Aidan La Penta | Dr. Schwesinger |1.0 |Creation

TABLE OF CONTENTS
-----------------

1\. PRODUCT DESCRIPTION
----------------------

Describe the product and the client in general. What problem are you
solving?

Provide a description of the potential audience and what goals are to be
satisfied with this product, including a list of major product
functionalities and salient feature

2\. TEAM DESCRIPTION
-------------------

Describe the strengths/skills needed of the team members for this
product. Use a table to list skills vs team members.

Is there a need for a Subject Matter Expert (SME)?

What expertise is missing?

3\. SOFTWARE PROCESS MODEL DESCRIPTION
-------------------------------------

The agile methodology will be used for this project. Agile allows for more flexible development and will respond to changing requirements as development progresses. We will take a variety of ideas from different agile methodologies, like sprints from scrum and the simplicity in Extreme Programming. Our project can be broken into independent features that are tackled concurrently each sprint. Features can then be integrated by the end of each sprint, similar to the incremental model. We will also be aware of our progress at the end of each sprint and have more accountability for deadlines. Solutions will be simple and understandable by other members to aid in integration.

However, Agile can also lead to burnout if there is not sufficient post-sprint review and unwinding. The short nature of sprints may also encourage development of small, non-critical features. This will be remedied by following the requirements traceability matrix. Documentation may suffer due to the fast pace. Not enough time might be spent for retrospection and could lead to problems later in development. Features may be designed too quickly and inelegantly which will put us into code debt.

The waterfall methodology ensures that components are complete and can be built upon but is inflexible for changing requirements which is likely in a senior project. Waterfall projects are easiliy tracked but Agile meetings following each sprint provides the same accountability. The rational unified process and spiral model methods are similarly built on a foundation of design that will be unstable for this project.

4\. PRODUCT DEFINITION
---------------------

The application will support normal users and admins. Normal users can use the application with or without an account. A normal account can be created by any user. An initial admin account will be created for development and can create other admin accounts. 

Relationship information will be gathered from the normal users who create family trees. Family information will be collected and the application will visualize the information. The family tree will be stored in the application database to view later, export to other formats, or share to other users. Administrators can view a user list and the trees the users have created. 

## Use Case Descriptions

### Add a tree
1. Name: CreateTree
2. Actor: User
3. Entry condition:
4. Exit condition: Tree is created and, if the user is optionally logged in, saved
5. Flow of events
    1. User adds self
    1. User adds desired relatives
    1. Application visualizes connections
    1. User adds desired information to each relative
    1. Application stores data attributes
6. Special requirements:
    - 3a incorrect connections can be removed

### Share a tree
1. Name: ShareTree
2. Actors: >=2 users
3. Entry condition: A tree is created and saved to one user
4. Exit condition: >=2 users have access to the tree
5. Flow of events
    1. User navigates to the tree to share
    1. User clicks on share
    1. Application shows tree's UUID
    1. User shares the UUID
6. Special requirements: None

### Delete a tree
1. Name: DeleteTree
2. Actor: User
3. Entry condition: A tree is created and saved to one user
4. Exit condition: The tree is removed from the user account and the database
5. Flow of events
    1. User navigates to the tree to remove
    1. User clicks on delete
    1. Application removes the tree from the database
    1. User page of list of trees is updated
6. Special requirements: 

5\. USER EXPERIENCE WIREFRAMES
-----------------------------

Initial prototype screens to validate initial understanding of the
product.

6\. PROJECT ORGANIZATION
-----------------------

Breakdown of major tasks and schedule

### Matrix of Responsibilities

Defines the high level which team members are responsible for which
tasks

### PERT / Gantt Chart

First cut at schedule

7\. VALIDATION PLAN
------------------

### Test Strategy

What is the definition of done?

What does success look like?

8\. FEASIBILITY STUDY
--------------------

What are the known risks and how will they be handled?

### Risk Identification

Description of the risks

### Risk Prioritization

Prioritized list (biggest risk -\> lowest risk)

### Risk Mitigation

How will risk factors be addressed? By when?

What are you going to prototype?

9\. CONFIGURATION AND VERSION CONTROL
------------------------------------

Specify the process and attributes for version control for all project
and product artifacts

10\. TOOLS
---------

Provide a list of tools required for the project and their use

11\. ARCHITECTURE
----------------

List of hardware or other subsystems required for the product.