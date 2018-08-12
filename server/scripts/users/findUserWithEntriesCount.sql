SELECT *
FROM (SELECT *
      FROM md_user
        INNER JOIN reminder ON md_user.id = reminder.user_id
      WHERE md_user.id = ${id}) AS x, (SELECT COUNT(*) as num_entries
                                       FROM entries
                                       WHERE user_id = ${id}) AS y , (SELECT last_modified_date AS lastest_entry_date
                                                                      FROM entries
                                                                      WHERE user_id = ${id}
                                                                      ORDER BY last_modified_date DESC
                                                                      LIMIT 1) AS z;