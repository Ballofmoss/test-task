CREATE TABLE Car (
    car_id INT PRIMARY KEY AUTO_INCREMENT,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    engine_volume DECIMAL(3,1) NOT NULL, -- например, 2.5
    drive_type VARCHAR(20) NOT NULL, -- 'полный', 'передний', 'задний'
    country_of_origin VARCHAR(50) NOT NULL,
    purchase_price DECIMAL(12,2) NOT NULL
);

CREATE TABLE Car_Instance (
    instance_id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT NOT NULL,
    vin VARCHAR(17) UNIQUE NOT NULL,
    color VARCHAR(30),
    year_of_manufacture INT NOT NULL,
    arrival_date DATE NOT NULL,
    is_sold BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (car_id) REFERENCES Car(car_id)
);

CREATE TABLE Client (
    client_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    passport_series_number VARCHAR(20) UNIQUE NOT NULL,
    phone_number VARCHAR(20)
);

CREATE TABLE Employee (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    commission_rate DECIMAL(5,2) NOT NULL -- например, 15.00
);

CREATE TABLE Sale (
    sale_id INT PRIMARY KEY AUTO_INCREMENT,
    instance_id INT UNIQUE NOT NULL, -- Ключевое ограничение для продажи 1 раз
    client_id INT NOT NULL,
    employee_id INT NOT NULL,
    sale_date DATE NOT NULL,
    sale_price DECIMAL(12,2) NOT NULL,
    payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('Наличные', 'Кредит', 'Рассрочка')),
    FOREIGN KEY (instance_id) REFERENCES Car_Instance(instance_id),
    FOREIGN KEY (client_id) REFERENCES Client(client_id),
    FOREIGN KEY (employee_id) REFERENCES Employee(employee_id)
);