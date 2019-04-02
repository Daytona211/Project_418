	CREATE TABLE UserProfile(
		UserProfileId int identity primary key NOT NULL,
		Name varchar(20) NOT NULL,
		Email varchar(30) NOT NULL,
		Password varchar(30) NOT NULL
	)

	CREATE TABLE Test(
		TestId int identity primary key NOT NULL,
		UserProfileId int NOT NULL foreign key references UserProfile(UserProfileId),
		UserStatus varchar(15) NOT NULL,
		UserPermission varchar(15) NOT NULL
	)

	CREATE TABLE Image(
		ImageId int identity primary key NOT NULL,
		Image varbinary(max) NOT NULL
	)

	CREATE TABLE Choices(
		ChoicesId int identity primary key NOT NULL,
		PossibleAnswer varchar(100) NOT NULL
	)

	CREATE TABLE Question(
		QuestionId int identity primary key NOT NULL,
		TestId int NOT NULL foreign key references Test(TestId),
		ImageId int NOT NULL foreign key references Image(ImageId),
		ChoicesId int NOT NULL foreign key references Choices(ChoicesId),
		TypeOfQuestion varchar(10) NOT NULL,
		Answer varchar(100) NOT NULL,
		Question varchar(500) NOT NULL
	)
