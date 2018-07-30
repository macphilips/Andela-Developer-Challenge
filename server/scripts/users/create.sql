/*
    Creates table Users.

    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/

CREATE TABLE IF NOT EXISTS ${schema~}.md_user (
  id                 SERIAL PRIMARY KEY,
  login              VARCHAR(50)  NOT NULL,
  password_hash      VARCHAR(60)  NULL,
  first_name         VARCHAR(50)  NULL,
  last_name          VARCHAR(50)  NULL,
  email              VARCHAR(100) NULL,
  created_date       TIMESTAMP    NOT NULL,
  last_modified_date TIMESTAMP    NULL,

  CONSTRAINT ux_user_login UNIQUE (login),
  CONSTRAINT ux_user_email UNIQUE (email)
);
