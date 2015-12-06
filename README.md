#Trinkbörse
A Web Application to order drinks like stocks on a market.

###Server: 
* RESTful HATEOAS driven node.js web-server using web-sockets for price-change propagation
* Event-Sourcing (MongoDB) and CQRS-designed domain-model
* role-based user-model using basic-authentication middleware
* supports http & https protocol-schemes (switch protocols in config.js in the backend, however certs are self-signed, 
so it's just a show-case)

###Client:
* AngularJS / Bootstrap
* heavily using flexbox
* Typescript
* (transparently supports https, however, different browsers might notify the user due to a "not trusted" server cert 
being used)


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

### ...gulp
* tasks:
*   - AppOpen           --> open the browser with the start page of the app
*   - start.server      --> start the server (npm start)
*   - start.server.dev  --> start the server in dev mode (npm run start-dev)
*   - start.mongod      --> start mongodb (start mongod)
*   - test.e2e          --> start e2e test with protractor
*   - test.unit         --> start unit test with karma
*   - test.midway       --> start midway test with karma
*   - test.all          --> start.mongod/start.server.dev/test.midway/test.unit/test.e2e
*   - default           --> start.mongod/start.server/appOpen


#TODOS
* factor out lodash
* complete translations

#Known Issues
* no table-sorting features
* error handling, i.e. messages are not really top-notch
* some code duplication in db-items