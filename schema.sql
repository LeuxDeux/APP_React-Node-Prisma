CREATE TABLE products (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  category varchar(50) DEFAULT NULL,
  stock int DEFAULT '0',
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
)