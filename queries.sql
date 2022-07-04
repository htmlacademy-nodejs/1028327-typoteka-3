-- получить список всех категорий
SELECT * FROM categories;


-- получить список всех НЕ пустых категорий
SELECT id, name FROM categories
	JOIN articles_categories ON id = category_id
	GROUP BY id;


-- категории с количеством объявлений
SELECT id, name, COUNT(article_id) FROM categories
	LEFT JOIN articles_categories ON id = category_id
	GROUP BY id
	ORDER BY count DESC;


-- список объявлений, сначала свежие

-- NOTICE: COUNT не правильно считает колчество комментариев к каждой статье,
-- не могу понять в чем ошибка. Данные и схему проверил. COUNT работает верно,
-- если из запроса убирать категории или пользователей.

SELECT articles.id,
	articles.title,
	articles.announce,
	articles.created_at AS date,
	CONCAT(users.first_name, ' ', users.last_name) AS author,
	users.email,
	COUNT(comments.id) AS comments_count,
	STRING_AGG(DISTINCT categories.name, ', ') AS categories
FROM articles
	JOIN users ON users.id = articles.user_id
	JOIN articles_categories ON articles_categories.article_id = articles.id
	JOIN categories ON categories.id = articles_categories.category_id
	LEFT JOIN comments ON comments.article_id = articles.id
	GROUP BY users.id, articles.id
	ORDER BY articles.created_at DESC;


-- детальная информация по объявлению

-- NOTICE: соответвенно этот запрос работает также и отдает не верный результат.

SELECT articles.id,
	articles.title,
	articles.announce,
	articles.text,
	articles.created_at AS date,
	articles.picture,
	CONCAT(users.first_name, ' ', users.last_name) AS author,
	users.email,
	COUNT(comments.id) AS comments_count,
	STRING_AGG(DISTINCT categories.name, ', ') AS categories
FROM articles
	JOIN articles_categories ON articles.id = articles_categories.article_id
	JOIN categories ON articles_categories.category_id = categories.id
	LEFT JOIN comments ON comments.article_id = articles.id
	JOIN users ON users.id = articles.user_id
WHERE articles.id = 1
	GROUP BY articles.id, users.id;


-- пять свежих комментариев
SELECT
	comments.id,
	comments.article_id,
	CONCAT(users.first_name, ' ', users.last_name) AS author,
	comments.text
FROM comments
	JOIN users ON users.id = comments.user_id
	ORDER BY comments.created_at DESC
	LIMIT 5;


-- комментарии к определенному объявлению
SELECT
	comments.id,
	comments.article_id,
	CONCAT(users.first_name, ' ', users.last_name) AS author,
	comments.text
FROM comments
	JOIN users ON users.id = comments.user_id
WHERE comments.article_id = 1
	ORDER BY comments.created_at DESC;


-- обновить заголовок определенному объявлению
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 1;
