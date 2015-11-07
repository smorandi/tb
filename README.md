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
* Mongo-DB 3.0.4+
* Node v0.12.6+ (incl. npm)
* that's it...the rest (inlcuding client deps) will be installed by npm

<hr>

##How to...
###...install dependencies & build:
* move into the <code>src</code> folder
* <code>npm install<code> (this will install everything, including bower, tsd, tsc and do the transpilation)
* == GULP ===

###...start the server
* in the <code>src</code> folder
* <code>npm start<code> to start the server
* <code>npm <b>run</b> start-dev<code> to start the server in dev-mode (cleared DB & populated with a defult set of data)

### ...run the server-tests
* in the <code>src</code> folder
* call <code>npm test</code> (this will run all integration tests based on mocha)
