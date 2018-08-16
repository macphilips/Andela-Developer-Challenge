CREATE OR REPLACE FUNCTION getTotalEntries(userId INTEGER)
  RETURNS INTEGER AS $total$
DECLARE
  total INTEGER;
BEGIN
  SELECT count(*)
  INTO total
  FROM ${schema~}.entries
  WHERE user_id = userId;
  RETURN total;
END;
$total$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION getEntriesByUser(
  userId INTEGER,
  page   INTEGER,
  size   INTEGER)
  RETURNS SETOF ${schema~}.ENTRIES AS $$
DECLARE
  total       DOUBLE PRECISION;
  totalPage   INTEGER;
  startOffset INTEGER;
BEGIN
  total = getTotalEntries(userId);
  totalPage = CEILING(total / size);
  IF (totalPage < 1)
  THEN
    totalPage = 1;
  END IF;

  IF (page < 1)
  THEN
    page = 1;
  ELSEIF (page > totalPage)
    THEN
      page = totalPage;
  END IF;
  startOffset = (page - 1) * size;
  RETURN QUERY SELECT *
               FROM ${schema~}.entries
               WHERE user_id = userId
               ORDER BY created_date DESC
               LIMIT size
               OFFSET startOffset;
END;
$$
LANGUAGE plpgsql;