CREATE TABLE posts_info (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    tags TEXT,
    name TEXT NOT NULL
);

--added data from csv import
select * from posts_info ;

--with wild card
SELECT id, title, body FROM posts_info WHERE title ILIKE '%harry%' OR body ILIKE '%harry%';

-- added new search column with tsvector
alter table posts_info add column search tsvector generated always as (
  setweight(to_tsvector('simple',tags), 'A')  || ' ' ||
  setweight(to_tsvector('english',title), 'B') || ' ' ||
  setweight(to_tsvector('english',body), 'C') :: tsvector ) stored;

select search from posts_info pi2 ;

-- added the index on search column, GIN is used for composite indexing
create index idx_search on posts_info using GIN(search);

-- the search query
select title, body,
  ts_rank(search, websearch_to_tsquery('english','harry potter')) + 
  ts_rank(search, websearch_to_tsquery('simple','harry potter')) as rank
from posts_info
where search @@ websearch_to_tsquery('english','harry potter')
or search @@ websearch_to_tsquery('simple','harry potter')
order by rank desc;

-- turning it into a function
create or replace function search_questions(term text) 
returns table(
  id int,
  title text,
  body text,
  rank real
)
as
$$

select id, title, body,
  ts_rank(search, websearch_to_tsquery('english',term)) + 
  ts_rank(search, websearch_to_tsquery('simple',term)) as rank
from questions
where search @@ websearch_to_tsquery('english',term)
or search @@ websearch_to_tsquery('simple',term)
order by rank desc;

$$ language SQL;