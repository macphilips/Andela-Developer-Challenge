INSERT INTO ${schema~}.md_user (email, password_hash, first_name, last_name, created_date, last_modified_date)
VALUES (${email}, ${password}, ${firstName}, ${lastName}, ${createdDate}, ${lastModified})
RETURNING *
