CREATE TABLE IF NOT EXISTS ${schema~}.entries
(
  id                 SERIAL PRIMARY KEY,
  title              VARCHAR(255)                        NULL,
  content            TEXT                                NULL,
  user_id           BIGINT                              NULL,
  created_date       TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  last_modified_date TIMESTAMP                           NULL
);
/*

    CONSTRAINT fk_entries_owner_id  FOREIGN KEY (user_id) REFERENCES md_user (id)


 */
ALTER TABLE ${schema~}.entries
  ADD CONSTRAINT entries_md_user_id_fk
FOREIGN KEY (owner_id) REFERENCES md_user (id);