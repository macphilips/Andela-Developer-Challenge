/*
    Inserts a new user record.

    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/

INSERT INTO ${schema~}.md_user(login,password_hash,first_name, last_name, email, created_date, last_modified_date)
VALUES(${login},${password},${firstName}, ${lastName},${email}, ${createdDate}, ${lastModified})
RETURNING *
