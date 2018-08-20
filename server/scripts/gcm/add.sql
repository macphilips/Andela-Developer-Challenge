/*
    Inserts a new user record.

    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/

INSERT INTO ${schema~}.gcm_token (token, user_id)
VALUES (${gcmToken}, ${userId})
RETURNING *
