UPDATE ${schema~}.entries
SET
  title = ${title}, content = ${content}, last_modified_date = ${lastModified}

WHERE id = ${id} AND user_id = ${userID}

RETURNING *
