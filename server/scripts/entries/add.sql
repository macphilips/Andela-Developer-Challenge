INSERT INTO ${schema~}.entries(title, content, user_id, created_date, last_modified_date)
VALUES(${title}, ${content}, ${userID}, ${createdDate}, ${lastModified})

RETURNING *
