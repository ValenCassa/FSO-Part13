CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title)
VALUES('Valen', 'https://valencassa.dev', 'New Blog')

INSERT INTO blogs (author, url, title)
VALUES('Valentin', 'https://valencassa.dev', 'New Blog 2')
