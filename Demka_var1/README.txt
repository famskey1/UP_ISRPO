Данное приложение создано с ASP.net C#, Node.js и React.js
Запросы в SQL
CREATE TABLE users (
    userID SERIAL PRIMARY KEY,
    fio VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    login VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Менеджер', 'Мастер', 'Оператор', 'Заказчик'))
);
CREATE TABLE requests (
    requestID SERIAL PRIMARY KEY,
    startDate DATE NOT NULL,
    homeTechType VARCHAR(100) NOT NULL,
    homeTechModel VARCHAR(100) NOT NULL,
    problemDescryption TEXT,
    requestStatus VARCHAR(50) NOT NULL CHECK (requestStatus IN ('Новая заявка', 'В процессе ремонта', 'Готова к выдаче')),
    completionDate DATE,
    repairParts TEXT,
    masterID INTEGER,
    clientID INTEGER NOT NULL,
    FOREIGN KEY (masterID) REFERENCES users(userID),
    FOREIGN KEY (clientID) REFERENCES users(userID)
);
CREATE TABLE comments (
    commentID SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    masterID INTEGER NOT NULL,
    requestID INTEGER NOT NULL,
    FOREIGN KEY (masterID) REFERENCES users(userID),
    FOREIGN KEY (requestID) REFERENCES requests(requestID)
);
