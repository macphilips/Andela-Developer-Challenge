/*
    Inserts a new user record.

    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/

INSERT INTO ${schema~}.reminder (from_date, to_date, user_id, md_time)
VALUES (${from}, ${to}, ${userId}, ${time})
RETURNING *
