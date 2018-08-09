SELECT *
FROM (SELECT *
      FROM md_user
        INNER JOIN reminder ON md_user.id = reminder.user_id
      WHERE md_user.id = ${id}) AS x, (SELECT COUNT(*) as num_entries
                                       FROM entries
                                       WHERE user_id = ${id}) AS y;