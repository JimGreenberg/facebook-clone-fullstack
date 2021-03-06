 # Schema Information

## users
column name       | data type | details
------------------|-----------|--------------------------
id                | integer   | not null, primary key
username          | string    | not null, indexed, unique
fname             | string    | not null, indexed
lname             | string    | not null, indexed
password_digest   | string    | not null
session_token     | string    | not null, indexed, unique
cover_photo       | string    |
profile_pic       | string    |  
work              | string    |
location          | string    |
birthday          | string    |

## friendships
column name       | data type | details
------------------|-----------|--------------
id                | integer   | not null, primary key
friender_id       | integer   | not null, foreign key (references users), indexed
receiver_id       | integer   | not null, foreign key (references users), indexed

## posts
column name         | data type | details
--------------------|-----------|--------------
id                  | integer   | not null, primary key
author_id           | integer   | not_null, foreign key (references users), indexed
timeline_of_user_id |integer    | not null, foreign key (references users), indexed
body                | text      | not null

## comments
column name       | data type | details
------------------|-----------|--------------
id                | integer   | not null, primary key
author_id         | integer   | not_null, foreign key (references users), indexed
post_id           | integer   | not_null, foreign key (references posts)
body              | text      | not null
