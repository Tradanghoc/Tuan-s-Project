CREATE DATABASE IF not EXISTS orangic;

USE orangic;

CREATE TABLE Users (
    Id VARCHAR(20) PRIMARY KEY, 
    Name VARCHAR(25) NOT NULL, 
    Email VARCHAR(60) NOT NULL, 
    Password VARCHAR(30) NOT NULL, 
    `Rank` INTEGER, 
    `Status` VARCHAR(20), 
    CreateAt DATETIME, 
    UpdateAt DATETIME, 
    DeleteAt DATETIME
);

CREATE TABLE Restaurants (
    Id VARCHAR(20) PRIMARY KEY, 
    Name VARCHAR(25) NOT NULL, 
    Introduction VARCHAR(300), 
    Address VARCHAR(50), 
    City VARCHAR(30), 
    District VARCHAR(40), 
    Ward VARCHAR(30), 
    Phone VARCHAR(20), 
    Email VARCHAR(60), 
    Status VARCHAR(20), 
    OwnerID VARCHAR(20) NOT NULL,
    CreateAt DATETIME,
    UpdateAt DATETIME,
    FOREIGN KEY (ownerID) REFERENCES Users (Id)
);

CREATE TABLE Foods (
    Id VARCHAR(20) PRIMARY KEY, 
    Name VARCHAR(30) NOT NULL, 
    Description VARCHAR(300), 
    TimeMade TIME,
    FeatureItem BOOLEAN, 
    Price DECIMAL(10, 2), 
    Status VARCHAR(20), 
    CreateAt DATETIME, 
    UpdateAt DATETIME,
    Discount INTEGER CHECK (
        Discount >= 0
        AND Discount <= 100
    ), 
    RestaurantID VARCHAR(20) NOT NULL, 
    FOREIGN KEY (RestaurantID) REFERENCES Restaurants (Id)
);

CREATE TABLE Admin (
    Id VARCHAR(20) PRIMARY KEY, 
    Name VARCHAR(25) NOT NULL, 
    Email VARCHAR(60) NOT NULL, 
    Password VARCHAR(30) NOT NULL, 
    Job VARCHAR(20) NOT NULL, 
    `Status` VARCHAR(20), 
    CreateAt DATETIME, 
    UpdateAt DATETIME, 
    DeleteAt DATETIME
);

CREATE TABLE FavList (
    Id VARCHAR(20) PRIMARY KEY, 
    UserID VARCHAR(20) NOT NULL, 
    TargetID VARCHAR(20) NOT NULL, 
    FOREIGN KEY (UserID) REFERENCES Users (Id)
);

CREATE TABLE Address (
    Id VARCHAR(20) PRIMARY KEY, 
    Address VARCHAR(50), 
    City VARCHAR(30), 
    District VARCHAR(30), 
    Ward VARCHAR(40), 
    Phone VARCHAR(15), 
    Priority TINYINT,
    Status VARCHAR(20),
    OwnerID VARCHAR(20) NOT NULL, 
);


CREATE TABLE Coupons (
    Id VARCHAR(20) PRIMARY KEY, 
    Code VARCHAR(6) NOT NULL, 
    Discount INTEGER, 
    Type VARCHAR(10), 
    Amount INTEGER, 
    Start DATETIME, 
    End DATETIME, 
    CreateAt DATETIME, 
    UpdateAt DATETIME, 
    CreateBy VARCHAR(20) NOT NULL, 
    UpdateBy VARCHAR(20) DEFAULT NULL, 
    FOREIGN KEY (CreateBy) REFERENCES Admin (Id), 
    FOREIGN KEY (UpdateBy) REFERENCES Admin (Id)
);

CREATE TABLE CouponItems (
    Id VARCHAR(20) PRIMARY KEY, 
    CouponID VARCHAR(20) NOT NULL, 
    FoodID VARCHAR(20) NOT NULL,
    Value DECIMAL,
    FOREIGN KEY (CouponID) REFERENCES Coupons (Id), 
    FOREIGN KEY (FoodID) REFERENCES Foods (Id)
);

CREATE TABLE CouponUser (
    Id VARCHAR(20) PRIMARY KEY, 
    Status VARCHAR(20) Not NULL, 
    UserID VARCHAR(20) NOT NULL, 
    CouponID VARCHAR(20) NOT NULL, 
    FOREIGN KEY (UserID) REFERENCES Users (Id), 
    FOREIGN KEY (CouponID) REFERENCES Coupons (Id)
);

CREATE TABLE Events (
    Id VARCHAR(20) PRIMARY KEY, 
    Title VARCHAR(50) NOT NULL, 
    Content VARCHAR(300), 
    Start DATETIME, 
    End DATETIME, 
    CreateAt DATETIME, 
    UpdateAt DATETIME, 
    CreateBy VARCHAR(20) NOT NULL, 
    UpdateBy VARCHAR(20) NOT NULL, 
    CouponID VARCHAR(20) NOT NULL, 
    FOREIGN KEY (CreateBy) REFERENCES Admin (Id), 
    FOREIGN KEY (UpdateBy) REFERENCES Admin (Id), 
    FOREIGN KEY (CouponID) REFERENCES Coupons (Id)
);

CREATE TABLE Images (
    Id VARCHAR(20) PRIMARY KEY, 
    OwnerID VARCHAR(20) NOT NULL
);

CREATE TABLE Orders (
    Id VARCHAR(20) PRIMARY KEY, 
    UserID VARCHAR(20) NOT NULL, 
    CouponID VARCHAR(20), 
    TotalValue DECIMAL, 
    Status VARCHAR(20), 
    Delivery DECIMAL, 
    CreateAt DATETIME, 
    UpdateAt DATETIME, 
    DeleteAt DATETIME, 
    AddressID VARCHAR(20) NOT NULL, 
    PaymentMethod VARCHAR(10),
    FOREIGN KEY (CouponID) REFERENCES Coupons (Id), 
    FOREIGN KEY (AddressID) REFERENCES Address (Id)
);

CREATE TABLE OrderItems (
    Id VARCHAR(20) PRIMARY KEY, 
    OrderID VARCHAR(20) NOT NULL, 
    FoodID VARCHAR(20) NOT NULL, 
    ArriveAt DATETIME,
    Quantity INTEGER, 
    Pick TINYINT, 
    Status VARCHAR(20),
    FOREIGN KEY (OrderID) REFERENCES Orders (Id), 
    FOREIGN KEY (FoodID) REFERENCES Foods (Id)
);

CREATE TABLE Reviews (
    Id VARCHAR(20) PRIMARY KEY, 
    Point INTEGER, 
    UserID VARCHAR(20) NOT NULL, 
    TargetID VARCHAR(20) NOT NULL, 
    Comment VARCHAR(300), 
    Status VARCHAR(20), 
    CreateAt DATETIME, 
    UpdateAt DATETIME, 
    FOREIGN KEY (UserID) REFERENCES Users (Id)
);

CREATE TABLE Schedules (
    Id VARCHAR(20) PRIMARY KEY, 
    AddressID VARCHAR(20) NOT NULL, 
    `Interval` VARCHAR(15), 
    Time TIME, 
    Pick BOOLEAN, 
    Quantity INT,
    FoodID VARCHAR(20) NOT NULL, 
    UserID VARCHAR(20) NOT NULL, 
    FOREIGN KEY (UserID) REFERENCES Users (Id), 
    FOREIGN KEY (FoodID) REFERENCES Foods (Id), 
    FOREIGN KEY (AddressID) REFERENCES Address (Id)
);

CREATE TABLE Reports (
    Id VARCHAR(20) PRIMARY KEY, 
    Title VARCHAR(50) NOT NULL, 
    Content VARCHAR(300), 
    CreateAt DATETIME, 
    ReplyAt DATETIME, 
    Reply VARCHAR(300), 
    Author VARCHAR(20) NOT NULL, 
    ReplyBy VARCHAR(20), 
    TargetID VARCHAR(20) NOT NULL, 
    ImageID VARCHAR(20), 
    Status VARCHAR(20),
    FOREIGN KEY (Author) REFERENCES Users (Id), 
    FOREIGN KEY (ReplyBy) REFERENCES Admin (Id), 
);

CREATE TABLE Notifications (
    Id VARCHAR(20) PRIMARY KEY, 
    Title VARCHAR(50) NOT NULL, 
    Content VARCHAR(300), 
    IsRead BOOLEAN, 
    CreateAt DATETIME, 
    TargetID VARCHAR(20) NOT NULL, 
    GiftID VARCHAR(20), 
    Creator VARCHAR(25) NOT NULL, 
    FOREIGN KEY (GiftID) REFERENCES Coupons (Id)
    FOREIGN KEY (Creator) REFERENCES Admin (Id)
);

CREATE TABLE Confirmations (
    Id INT AUTO_INCREMENT PRIMARY KEY, 
    Email VARCHAR(60) NOT NULL,
    Token VARCHAR(6) NOT NULL, 
    Type VARCHAR(20), 
    CreateAt DATETIME, 
    ExpireAt DATETIME, 
    Status TINYINT
);

ALTER TABLE foods
MODIFY Name VARCHAR(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
MODIFY Description VARCHAR(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

ALTER TABLE restaurants
MODIFY Name VARCHAR(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
MODIFY Address VARCHAR(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
MODIFY City VARCHAR(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
MODIFY District VARCHAR(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
MODIFY Ward VARCHAR(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci