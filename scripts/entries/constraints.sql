/*
    Adds a new product for a specified user.

    NOTE: We only add schema here to demonstrate the ability of class QueryFile
    to pre-format SQL with static formatting parameters when needs to be.
*/

ALTER TABLE ${schema~}.entries
  ADD CONSTRAINT entries_md_user_id_fk
FOREIGN KEY (owner_id) REFERENCES md_user (id);