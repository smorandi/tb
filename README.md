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

#TODOS
* error handling when server is not running/responding
* setting focus on first element on page does not really work
* remove style tags in html -> move to css [done]
* factor out lodash, possibly write own functions where lodash is used atm or import only specific function from lodash
to minimize loadtime
* prevent event propagation (bubbling) of several controls, i.e. search, inc/dec/addToBasket to prevent multi handling 
of events in chain leading to effect like closing/flipping of widgets prematurely. [done]
* extend dashbaord routes / ws-emits in server to transmit HAL resources (creation of proper resource with links to 
add/remove of item to basket)
