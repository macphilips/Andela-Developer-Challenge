CREATE SCHEMA IF NOT EXISTS ${schema~};

CREATE TABLE IF NOT EXISTS ${schema~}.md_user (
  id                 SERIAL PRIMARY KEY,
  password_hash      VARCHAR(60)  NULL,
  first_name         VARCHAR(50)  NULL,
  last_name          VARCHAR(50)  NULL,
  email              VARCHAR(100) NULL,
  created_date       TIMESTAMP    NOT NULL,
  last_modified_date TIMESTAMP    NULL,

  CONSTRAINT ux_user_email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS ${schema~}.entries
(
  id                 SERIAL PRIMARY KEY,
  title              VARCHAR(255)                        NULL,
  content            TEXT                                NULL,
  user_id            INT                                 NULL,
  created_date       TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  last_modified_date TIMESTAMP                           NULL,
  CONSTRAINT fk_entries_user_id FOREIGN KEY (user_id) REFERENCES md_user (id)
);

CREATE TABLE IF NOT EXISTS ${schema~}.reminder (
  id        SERIAL PRIMARY KEY,
  md_time   VARCHAR(50) NULL,
  user_id   INT         NULL,
  from_date VARCHAR(10) NULL,
  to_date   VARCHAR(10) NULL,
  daily     BOOLEAN DEFAULT TRUE,

  CONSTRAINT fk_reminder_user_id FOREIGN KEY (user_id) REFERENCES md_user (id)
);

/*

ALTER TABLE ${schema~}.entries
  ADD CONSTRAINT entries_md_user_id_fk
FOREIGN KEY (owner_id) REFERENCES md_user (id);

ALTER TABLE ${schema~}.reminder
  ADD CONSTRAINT reminder_md_user_id_fk
FOREIGN KEY (user_id) REFERENCES md_user (id);
 */
