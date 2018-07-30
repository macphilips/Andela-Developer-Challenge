/*
    Adds a new product for a specified user.

    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/
UPDATE ${schema~}.md_user
SET
  email              = ${email}, password_hash = ${password}, first_name = ${firstName}, last_name = ${lastName},
  last_modified_date = ${lastModified}
WHERE id = ${id}
RETURNING *