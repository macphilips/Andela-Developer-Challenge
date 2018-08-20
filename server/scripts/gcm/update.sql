/*
    Adds a new product for a specified user.

    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/
UPDATE ${schema~}.gcm_token
SET
  token = ${gcmToken}
WHERE id = ${id} AND user_id = ${userId}
RETURNING *