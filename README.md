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

	Run on Port --> 4000
	
Create new folder --> comments:
	mkdir comments
	cd comments
	npm init -y (generate package.json file)
	npm install express cors axios nodemon

	Run on Port --> 4001

Create a new folder ---> event-bus:  (Used for Async communication)
	mkdir event-bus
	cd event-bus
	npm init -y (generate package.json file)
	npm install express axios nodemon

	Run on Port --> 4005

Create a new folder ---> query:  (Used for Async communication)
	mkdir query
	cd query
	npm init -y (generate package.json file)
	npm install express cors nodemon axios

	Run on Port --> 4002

Create a new folder ----> moderation 
	mkdir moderation
	cd moderation
	npm init -y (generate package.json file)
	npm install express nodemon axios (Not need cors because this folder doesn't have direct communication with FE)

	Run on Port --> 4003


In this branch, We dockerized the  post service  
	Create the file inside posts folder named --> Dockerfile
	
	Code: 

		FROM node:alpine  		 (Base image)

		WORKDIR /app      		 (Working directory)
		COPY package.json ./     (Copy over just the package.json file)
		RUN npm install			 (Then, Run npm install, to install all over dependencies)
		COPY ./ ./				 (Copy over all from Post directory (That means just only index.js file))

		CMD ["npm", "start"]	 (And then finally we setup our default command, npm start)



	Create the other file inside posts folder named --> .dockerignore
		Ignore the node_modules


	Now open /posts terminal 
		cd posts
		Run, docker build .  (Build the docker image. At last it succeed with "Successfully built 04a6349efb55". --> 04a6349efb55 differ every time )

		& now Run the docker image through,
			docker run 04a6349efb55   (Command succeed with, starting `node index.js` . Listening on 4000)


** Some Basic command of Docker **

1)  docker build -t komalchothani/posts      	(Build an image based on the dockerfile in the current directory. Tag it as 'KomalChothani/posts')
2)  docker run [imageId or imageTag]			(Create & start a container based on the provided image id/tag)
3)  docker run -it [imageId or imageTag] [cmd]	(Create & start container, but also override the default command)
4)  docker ps 									(Print out information about all of the running containers)
5)  docker exec -it [containerId] [cmd]			(Execute the given command in a running container)
6)  docker logs [containerId]					(Print out logs from the given container)


	Run command, 
		1) docker build -t komalchothani/posts .    
			(Make sure, repository name must be in lowercase (komalchothani))
			(Build succeed with, --> Successfully built 04a6349efb55. Successfully tagged komalchothani/posts:latest)
		
		2) docker run -it komalchothani/posts sh (sh means shell, --> 1>  Execute "ls" command.  2> You can change the directory "cd ..".  & to leave the terminal hit command "ctrl + D" )


At the last, we dockerrized all other services, Eg, client, comments, event-bus, moderation & query
	Copy 2 files & paste it at all folder, 1) Dockerfile 2) .dockerignore

	Do the same for all., 
		1) docker build .
		2) docker run imgId/imgTag

	Ex,
		1) cd /event-bus
		2) docker build -t komalchothani/event-bus . or docker build .
		3) docker run komalchothani/event-bus

		1) cd /client
		2) docker build -t komalchothani/client . or docker build .
		3) docker run komalchothani/client

		1) cd /comments
		2) docker build -t komalchothani/comments . or docker build .
		3) docker run komalchothani/comments

		1) cd /moderation
		2) docker build -t komalchothani/moderation . or docker build .
		3) docker run komalchothani/moderation

		1) cd /query
		2) docker build -t komalchothani/query . or docker build .
		3) docker run komalchothani/query