CREATE TABLE UserProfile(
    UserProfileId int AUTO_INCREMENT,
    Name varchar(20) NOT NULL,
    Password varchar(30) NOT NULL,
    isAdmin tinyint NOT NULL,
    PRIMARY KEY (UserProfileId)
);

CREATE TABLE ChangeColor(
	ChangeColorId int NOT NULL,
	UserProfileId int NOT NULL,
	Color varchar(50) NOT NULL,
	PRIMARY KEY (ChangeColorId),
	FOREIGN KEY (UserProfileid) REFERENCES UserProfile(UserProfileId)
);

CREATE TABLE Test(
    TestId int AUTO_INCREMENT,
    TestTitle varchar(50),
    PRIMARY KEY (TestId)
);

CREATE TABLE TestStatus(
    TestStatusId int AUTO_INCREMENT,
    TestId int NOT NULL,
    UserProfileId int NOT NULL,
    TestStatus tinyint NOT NULL,
    Grade DECIMAL(5,2) NOT NULL,
    PRIMARY KEY (TeststatusId),
    FOREIGN KEY (TestId) REFERENCES Test(TestId),
    FOREIGN KEY (UserProfileId) REFERENCES UserProfile(UserProfileId)
);

CREATE TABLE Question(
    QuestionId int AUTO_INCREMENT,
    TypeOfQuestion varchar(20) NOT NULL,
    Answer varchar(100) NOT NULL,
    Question varchar(500) NOT NULL,
    PRIMARY KEY (QuestionId)
);

CREATE TABLE QuestionsForTest(
	QuestionsForTest int AUTO_INCREMENT,
	QuestionId int NOT NULL,
	PRIMARY KEY (QuestionsForTest),
	FOREIGN KEY (QuestionId) REFERENCES Question(QuestionId)
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

CREATE TABLE UserAnswers(
	UserAnswerId int AUTO_INCREMENT,
	UserProfileId int NOT NULL,
	TestId int NOT NULL,
	QuestionId int NOT NULL,
	UserAnswer varchar(400) NOT NULL,
	PRIMARY KEY (UserAnswerId),
	FOREIGN KEY (UserProfileId) REFERENCES UserProfile(UserProfileId),
	FOREIGN KEY (TestId) REFERENCES Test(TestId),
	FOREIGN KEY (QuestionId) REFERENCES Question(QuestionId)
);
