DROP TABLE IF EXISTS School CASCADE;
DROP TABLE IF EXISTS Classes CASCADE;
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Roles CASCADE;
DROP TABLE IF EXISTS ExtraPoints CASCADE;
DROP TABLE IF EXISTS Review CASCADE;
DROP TABLE IF EXISTS Book CASCADE;
DROP TABLE IF EXISTS FrequentlyAskedQuestions CASCADE;
DROP TABLE IF EXISTS SchoolSettings CASCADE;
DROP TABLE IF EXISTS Errors CASCADE;

CREATE TABLE School(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE Classes(
    id SERIAL PRIMARY KEY,
    className TEXT NOT NULL,
    schoolId INT NOT NULL,
    FOREIGN KEY(schoolId) REFERENCES School(id),
    UNIQUE (schoolId,className) -- ONE UNIQUE CLASS PER SCHOOL
);

CREATE TABLE Roles(
    id INT PRIMARY KEY,
    role TEXT NOT NULL
);

CREATE TABLE Users(
    id SERIAL PRIMARY KEY,
    mail TEXT UNIQUE NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    password TEXT NOT NULL,
    classId INT REFERENCES Classes(id) NOT NULL,
    roleId INT REFERENCES Roles(id) NOT NULL
);

CREATE TABLE ExtraPoints(
    userId INT REFERENCES Users(id),
    exPoints INT NOT NULL,
    reason TEXT NOT NULL,
    CHECK (exPoints > 0)
);

CREATE TABLE Book(
    id SERIAL PRIMARY KEY,
    apiLink TEXT, -- CAN BE NULL
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    pages INT NOT NULL,
    descr TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    UNIQUE (title,author,pages), -- FOR ID SEARCH
    CHECK (pages > 0)
);

CREATE TABLE Review(
    id SERIAL PRIMARY KEY,
    bookId INT REFERENCES Book(id) NOT NULL, 
    writtenBy INT REFERENCES Users(id) NOT NULL,
    worthReading BOOLEAN DEFAULT FALSE NOT NULL,
    accepted BOOLEAN DEFAULT FALSE NOT NULL,
    published BOOLEAN DEFAULT FALSE NOT NULL,
    rating INT NOT NULL, 
    summary TEXT NOT NULL,
    timeOfReview DATE DEFAULT NOW(),
    UNIQUE (writtenBy,bookId), -- USER CAN ONLY READ SAME BOOK ONE TIME
    CHECK (rating BETWEEN 0 AND 11)
);

CREATE TABLE FrequentlyAskedQuestions(
    id SERIAL PRIMARY KEY,
    schoolId INT REFERENCES School(id) NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL
);

CREATE TABLE SchoolSettings(
    schoolId INT REFERENCES School(id) PRIMARY KEY NOT NULL,
    weeklyBook INT REFERENCES Book(id), -- CAN BE NULL
    minimumReviewLength INT DEFAULT 1 NOT NULL,
    CHECK (minimumReviewLength > 0)
);

CREATE TABLE RecommendedBooks(
    schoolId INT REFERENCES School(id) PRIMARY KEY NOT NULL,
    bookId INT REFERENCES Book(id) NOT NULL 
);

CREATE TABLE Errors (
    id SERIAL PRIMARY KEY,
    timeOfError DATE DEFAULT NOW() NOT NULL,
    userId INT REFERENCES Users(id) NOT NULL,
    error TEXT NOT NULL,
    msg TEXT NOT NULL
)