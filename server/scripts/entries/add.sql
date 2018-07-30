/*
    Adds a new product for a specified user.

    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/
INSERT INTO ${schema~}.entries(title, content, user_id, created_date, last_modified_date)
VALUES(${title}, ${content}, ${userID}, ${createdDate}, ${lastModified})

RETURNING *
