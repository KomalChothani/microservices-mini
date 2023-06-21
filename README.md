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



** Install Kubernetes **
========================

	Mini cube is a tool that'll start up a kubernetes cluster on our local machine.
	You can install minikube from here: https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/
	
	Check  about your linux system hardware name :  uname -m

	Run command: 
		kubectl version
			(Output At last: Server Version: version.Info{Major:"1", Minor:"26", GitVersion:"v1.26.1", GitCommit:"8f94681cd294aa8cfd3407b8191f6c70214973a4", GitTreeState:"clean", BuildDate:"2023-01-18T15:51:25Z", GoVersion:"go1.19.5", Compiler:"gc", Platform:"linux/amd64"})

			If In output it says something like, Unable to connect to the server: dial tcp 192.168.49.2:8443: connect: no route to host. Then do, *minikube start*

	Through, kubectl command, We can interact with kubernetes cluster

	** kubernetes Terminology **
	---------------------------

	kubernetes Cluster: A collection of nodes + a master to manage them
	Node             : A virtual machine that will run our containers
	Pod              : More or less a running container. Technically, a pod can run multiple containers
	Deployment       : Monitors a set of pods, make sure they are running and restarts them if they crash
	Service          : Provides an easy-to-remember URL to access a running container
	

	About Kubernetes Config files:
	-----------------------------

	. Tells kubernetes about the different Deployments, Pods, and Services (referred to as 'Objects') that we want to create
	. Written in YAML syntax
	. Always store these files with our project source code (Commit that changes as well) - they are documentation!
	. We can create Objects (Services) without config files as well(But it is not a good way). Config files provides a precise definition of what your cluster        is running


	About creating a Pod
	---------------------

	. Go to /posts directory 
		. cd /posts
		. Rebuild post image: 
			docker build -t komalchothani/posts:0.0.1 .  (Here, 0.0.1 is version)
				(Output: Successfully built 04a6349efb55, Successfully tagged komalchothani/posts:0.0.1)

	. Now create the new directory named ---> infra
		. This folder contains all the configuration, all the code related to the deployment or management of all of our different services inside there
	. Create another folder inside infra ---> k8s
	. Create file named ---> posts.yaml (Make sure about the indentation while writing the file)

	. Go to /infra/k8s directory & open terminal
		. Do, ls (In output, you can see post.yaml file)
		. Then do, kubectl apply -f posts.yaml  (In o/p, you can see ---> pod/posts created)
			. If there is any typo mistake or indentation mistake then you got error in o/p

		. kubectl get pods (This command returns all the pods list)


	About config file
	------------------

	apiVersion: v1
	kind: Pod
	metadata:
  		name: posts
	spec:
  		containers:
    		- name: posts
      		  image: komalchothani/posts:0.0.1


	1) apiVersion: v1
		Tell kubernetes about the pool of objects that we want to take from. Here, we telling kubernetes, Look at the default V1
	2) kind: Pod
		The type of object we want to create
	3) metadata: 
		Config options for the object we are about to create
		Run, kubectl get pods or k get pods
	4) name: posts
		When the pod is created, give it a name of 'posts'
	5) spec:
		. The exact attributes we want to apply to the object we are about to create
		. This is very precise definition that controls exactly what should be going on inside this pod & how the pod should behave
	6) containers: 
		We can create many containers in a single pod
		Ex,
			containers:
    			- name: posts
      		  	  image: komalchothani/posts:0.0.1
				- name: comment
      		  	  image: komalchothani/comment:0.0.1
				- name: query
      		  	  image: komalchothani/query:0.0.1



	Kubernetes common command
	--------------------------

	. docker ps                            ------------------------>  kubectl get pods
	. docker exec -it [container id] [cmd] ------------------------>  kubectl exec -it [pod_name] [cmd]
	. docker logs [container id]           ------------------------>  kubectl logs [pod_name]


	. kubectl get pods
		. Prints out information about all of the running pods

	. kubectl exec -it [pod_name] [cmd]
		. Execute the given command in a running pod

		Ex, If we want to start shell inside the POD, then 
			. kubectl exec -it posts sh (O/p bash shell open inside the pod)

	. kubectl logs [pod_name]
		. Print logs from the given pod

		Ex, kubectl logs posts

	. kubectl delete pod [pod_name]
		. Deletes the given pod

		Ex, kubectl delete posts (O/p, pod "posts" deleted)

	. kubectl apply -f [config file name]
		. Tells kubernetes to process the config

		Ex, kubectl apply -f posts.yaml (O/p, Create the pod)

	. kubectl describe pod [pod_name]
		. Print out some information about the running pod
