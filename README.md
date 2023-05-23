# microservices-mini

# Project setup
Create a react-app using command:
	npx create-react-app client
	npm install axios

	Attach the bootstrap link in index.html under the header section
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">

	About component hierarchy
		App --> PostList & PostCreate
		PostList --> CommentList & CommentCreate

Create new folder --> posts
	mkdir posts
	cd posts
	npm init -y (generate package.json file)
	npm install express cors axios nodemon
	
Create new folder --> comments:
	mkdir comments
	cd comments
	npm init -y (generate package.json file)
	npm install express cors axios nodemon
