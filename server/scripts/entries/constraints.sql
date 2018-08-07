ALTER TABLE ${schema~}.entries
  ADD CONSTRAINT entries_md_user_id_fk
FOREIGN KEY (owner_id) REFERENCES md_user (id);