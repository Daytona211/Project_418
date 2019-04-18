CREATE TABLE UserProfile(
    UserProfileId int AUTO_INCREMENT,
    Name varchar(20) NOT NULL,
    Password varchar(30) NOT NULL,
    isAdmin tinyint NOT NULL,
    PRIMARY KEY (UserProfileId)
);

CREATE TABLE Test(
    TestId int AUTO_INCREMENT,
    UserProfileId int NOT NULL,
    PRIMARY KEY (TestId),
    FOREIGN KEY (UserProfileId) REFERENCES UserProfile(UserProfileId)
);

CREATE TABLE Question(
    QuestionId int AUTO_INCREMENT,
    TestId int,
    TypeOfQuestion varchar(20) NOT NULL,
    Answer varchar(100) NOT NULL,
    Question varchar(500) NOT NULL,
    PRIMARY KEY (QuestionId),
    FOREIGN KEY (TestId) REFERENCES Test(TestId)
);

CREATE TABLE Image(
    ImageId int AUTO_INCREMENT,
    QuestionId int NOT NULL,
    Image BLOB NOT NULL,
    PRIMARY KEY (ImageId),
    FOREIGN KEY (QuestionId) REFERENCES Question(QuestionId)
);

CREATE TABLE Choices(
    ChoicesId int AUTO_INCREMENT,
    QuestionId int NOT NULL,
    PossibleAnswer varchar(400) NOT NULL,
    PRIMARY KEY (ChoicesId),
    FOREIGN KEY (QuestionId) REFERENCES Question(QuestionId)
);

CREATE TABLE Grade(
    GradeId int AUTO_INCREMENT,
    TestId int NOT NULL,
    UserProfileId int NOT NULL,
    Grade DECIMAL(5,2) NOT NULL,
    PRIMARY KEY (GradeId),
    FOREIGN KEY (TestId) REFERENCES Test(TestId),
    FOREIGN KEY (UserProfileId) REFERENCES UserProfile(UserProfileId)
);