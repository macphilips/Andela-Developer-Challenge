UPDATE ${schema~}.md_user
SET
  email              = ${email}, password_hash = ${password}, first_name = ${firstName}, last_name = ${lastName},
  last_modified_date = ${lastModified}
WHERE id = ${id}
RETURNING *