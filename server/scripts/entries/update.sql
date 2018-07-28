/*
    Adds a new product for a specified user.

    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/
UPDATE ${schema~}.entries
SET
  title = ${title}, content = ${content}, last_modified_date = ${lastModified}

WHERE id = ${id} AND user_id = ${userID}

RETURNING *
