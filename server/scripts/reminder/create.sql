/*
    Creates table Users.

    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/

CREATE TABLE IF NOT EXISTS ${schema~}.reminder (
  id        SERIAL PRIMARY KEY,
  md_time     VARCHAR(50) NULL,
  user_id   BIGINT      NULL,
  from_date TIMESTAMP   NULL,
  to_date   TIMESTAMP   NULL,
  daily     BOOLEAN DEFAULT TRUE
);
