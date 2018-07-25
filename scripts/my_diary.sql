DROP DATABASE IF EXISTS mydiary;
CREATE DATABASE mydiary;

\c mydiary;


CREATE TABLE md_user (
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


CREATE TABLE entries
(
  id                 SERIAL                              PRIMARY KEY,
  title              VARCHAR(255)                        NULL,
  content            TEXT                                NULL,
  owner_id           BIGINT                              NULL,
  created_date       TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  last_modified_date TIMESTAMP                           NULL,

  CONSTRAINT ux_owner_id  UNIQUE (owner_id),
  CONSTRAINT fk_entries_owner_id  FOREIGN KEY (owner_id) REFERENCES md_user (id)
);