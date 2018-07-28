/*
    Inserts a new user record.

    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/

INSERT INTO ${schema~}.md_user (email, password_hash, first_name, last_name, created_date, last_modified_date)
VALUES (${email}, ${password}, ${firstName}, ${lastName}, ${createdDate}, ${lastModified})
RETURNING *
