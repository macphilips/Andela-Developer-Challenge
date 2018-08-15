SELECT *
                                                                                                                        FROM (SELECT *
                                                                                                                              FROM getEntriesByUser(${userId}, ${page}, ${size})) AS A, (SELECT getTotalEntries(${userId}) AS num_entries) AS B;