SELECT *
FROM ${schema~}.reminder
  INNER JOIN ${schema~}.gcm_token ON  ${schema~}.reminder.user_id = ${schema~}.gcm_token.user_id
WHERE enabled=TRUE AND md_time BETWEEN ${timeBefore} AND ${timeAfter}
