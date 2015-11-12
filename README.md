#Trinkbörse
An Web Application to order drinks like stocks on a market.

###Server: 
* RESTful HATEOAS driven node.js web-server using web-sockets for price-change propagation
* Event-Sourcing (MongoDB) and CQRS-designed domain-model
* role-based user-model using basic-authentication middleware

###Client:
* AngularJS / Bootstrap
* heavily using flexbox
* Typescript

<hr>

##Pre-Requisites:
* working network ;)
* Mongo-DB 3.0.4+ (mongod must be accessible via **path**)
* Node v0.12.6+ (incl. npm)
* that's it...the rest (inlcuding client deps) will be installed by npm

<hr>

##How to...
###...install dependencies & build:
* move into the `src` folder
* `npm install` (this will install everything, including bower, tsd, tsc and do the transpilation)
* == GULP ===

###...start the server
* in the `src` folder
* `npm start` to start the server
* `npm run start-dev` to start the server in dev-mode (cleared DB & populated with a defult set of data)

### ...run the server-tests
* in the `src` folder
* call `npm test` (this will run all integration tests based on mocha)

#TODOS
* error handling when server is not running/responding
* xxx
