CREATE SCHEMA IF NOT EXISTS ${schema~};

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

CREATE TABLE IF NOT EXISTS ${schema~}.entries
(
  id                 SERIAL PRIMARY KEY,
  title              VARCHAR(255)                        NULL,
  content            TEXT                                NULL,
  owner_id           BIGINT                              NULL,
  created_date       TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  last_modified_date TIMESTAMP                           NULL,
  CONSTRAINT fk_entries_owner_id  FOREIGN KEY (owner_id) REFERENCES md_user (id)
);

CREATE TABLE IF NOT EXISTS ${schema~}.reminder (
  id        SERIAL PRIMARY KEY,
  md_time   VARCHAR(50) NULL,
  user_id   BIGINT      NULL,
  from_date TIMESTAMP   NULL,
  to_date   TIMESTAMP   NULL,
  daily     BOOLEAN DEFAULT TRUE,

  CONSTRAINT fk_entries_owner_id  FOREIGN KEY (user_id) REFERENCES md_user (id)
);

/*

ALTER TABLE ${schema~}.entries
  ADD CONSTRAINT entries_md_user_id_fk
FOREIGN KEY (owner_id) REFERENCES md_user (id);

ALTER TABLE ${schema~}.reminder
  ADD CONSTRAINT reminder_md_user_id_fk
FOREIGN KEY (user_id) REFERENCES md_user (id);
 */
