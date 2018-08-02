SELECT *
FROM md_user
  INNER JOIN reminder ON md_user.id = reminder.user_id
WHERE md_user.id = ${id}