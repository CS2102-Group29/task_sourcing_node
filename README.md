# task_sourcing_node

## Using Semantic UI

Include the following header in the HTML file:
```html
<head>
  <link href="./semantic.min.css" rel="stylesheet" type="text/css">
  <script src="./jquery.min.js"></script>
  <script src="./semantic.min.js"></script>
</head>
```

Dynamic Semantic-UI components like tab, sticky and all APIs need jQuery as a prerequisite. If you do not need JavaScript at all, you can remove the two script lines.

## Schemas

1. users (entity)
```sql
CREATE TABLE users (
	email VARCHAR(256) PRIMARY KEY,
	password VARCHAR(256) NOT NULL,
	name VARCHAR(256) NOT NULL,
	mobile VARCHAR(256) NOT NULL,
	image_url VARCHAR(512)
	);
```

2. tasks (entity)
```sql
CREATE TABLE tasks (
	id INTEGER PRIMARY KEY,
	title VARCHAR(256) NOT NULL,
	description TEXT,
	date DATE NOT NULL,
        time TIME NOT NULL,
	location VARCHAR(256) NOT NULL,
	taskee_email VARCHAR(256) NOT NULL,
	expiry_date DATE NOT NULL CHECK(expiry_date <= date),
	FOREIGN KEY (taskee_email) REFERENCES users (email) ON UPDATE CASCADE
	);
```

3. bid_task (relationship)
```sql
CREATE TABLE bid_task (
	task_id INTEGER NOT NULL,
	bidder_email VARCHAR(20) NOT NULL,
	bid NUMERIC NOT NULL,
	is_taken BOOLEAN NOT NULL,
	FOREIGN KEY (task_id) REFERENCES tasks (id),
	FOREIGN KEY (bidder_email) REFERENCES users (email) ON UPDATE CASCADE,
	PRIMARY KEY (task_id, bidder_email)
	);
```