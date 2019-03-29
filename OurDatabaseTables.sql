CREATE TABLE UserProfile(
	UserProfileId int AUTO_INCREMENT NOT NULL,
	Name varchar(20) NOT NULL,
	Email varchar(30) NOT NULL,
	Password varchar(30) NOT NULL,
	PRIMARY KEY(UserProfileId)
);

CREATE TABLE Test(
	TestId int AUTO_INCREMENT NOT NULL,
	UserProfileId int NOT NULL,
	UserStatus varchar(15) NOT NULL,
	UserPermission varchar(15) NOT NULL,
	PRIMARY KEY(TestId),
	FOREIGN KEY(UserProfileId) REFERENCES UserProfile(UserProfileId)
);

CREATE TABLE Image(
	ImageId int AUTO_INCREMENT NOT NULL,
	Image LONGBLOB NOT NULL,
	PRIMARY KEY(ImageId)
);

CREATE TABLE Choices(
	ChoicesId int AUTO_INCREMENT NOT NULL,
	PossibleAnswer varchar(100) NOT NULL,
	PRIMARY KEY(ChoicesId)
);

CREATE TABLE Question(
	QuestionId int AUTO_INCREMENT NOT NULL,
	TestId int NOT NULL,
	ImageId int NOT NULL,
	ChoicesId int NOT NULL,
	TypeOfQuestion varchar(10) NOT NULL,
	Answer varchar(100) NOT NULL,
	Question varchar(500) NOT NULL,
	PRIMARY KEY(QuestionId),
	FOREIGN KEY(TestId) REFERENCES Test(TestId),
	FOREIGN KEY(ImageId) REFERENCES Image(ImageId),
	FOREIGN KEY(ChoicesId) REFERENCES Choices(ChoicesId)
);
