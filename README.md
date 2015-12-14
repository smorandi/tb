#Trinkbörse
A Web Application to order drinks like stocks on a market.

###Server
* RESTful HATEOAS driven node.js web-server using web-sockets for price-change propagation
* Event-Sourcing (MongoDB) and CQRS-designed domain-model
* role-based user-model using basic-authentication middleware
* supports http & https protocol-schemes (switch protocols in config.js in the backend, however certs are self-signed, 
so it's just a show-case)

###front-end
* AngularJS / Bootstrap
* heavily using flexbox
* Typescript
* everything with the keyboard can be operated
* (transparently supports https, however, different browsers might notify the user due to a "not trusted" server cert 
being used)

<hr>

## Version

* Version 0.0.1

<hr>

##Pre-Requisites:
* working network ;)
* Mongo-DB 3.0.4+ (mongod must be accessible via **path**)
* Node 4.2.x+ (incl. npm)
* that's it...the rest will be installed by npm

<hr>

##How to...

(all commands have to be executed in the folder `src`)

###...install dependencies & build:
* `npm install` (this will install and build the system )

###...start the server
#### dev server
* `npm start` to start the server
* `npm run start-dev` to start the server with a default set of data
* open localhost:3000

#### build server
* `npm start-build` to start the server
* `npm run start-build-dev` to start the server with a default set of data
* open localhost:3000 

### ...run the tests
#### all
* `npm test`

#### server
* `npm run test-server` 

this will run all integration tests based on mocha

#### front-end unit
* `npm run test-unit` 

this will run all unit tests for the front-end based on mocha and karma as test runner

#### front-end midway
* `npm run test-midway`

this will run all midway tests for the front-end based on mocha and karma as test runner

#### e2e
* `npm run test-e2e`

end-to-end testing with protractor

### ...gulp

*   dev.appOpen        --> open the browser with the start page of the app
*   dev.inject.index   --> inject the dependencies into the index.html
*   dev.fe.less        --> compile all less files into the tb.css  
*   start.server       --> start the server (npm start)
*   start.server.dev   --> start the server in dev mode (npm run start-dev)
*   start.server.build --> start the server in dev mode (npm run start-dev)
*   test.e2e           --> start e2e test with protractor
*   test.unit          --> start unit test with karma
*   test.midway        --> start midway test with karma
*   build.all          --> inject/minify/uglify and copy the file into the build folder
*   build.fe           --> build the front-end
*   build.server       --> build the server
*   default            --> start.server/dev.appOpen


<hr>

##TODOS
* factor out lodash
* complete translations
* expansion of the tests
* improve the accessibility 

<hr>

## License


<hr>

##Known Issues
###Server
  * only "core" functionality is automatically tested
  * server-side validation (pre-condition/business rule testing) is only implemented for drink creation and user creation 

###front-end
* no table-sorting features
* error handling, i.e. messages are not really top-notch
* some code duplication in db-items
* focus-handling not perfect, e.g. no focus transferal to fomrs when clicking "edit"
* only tested with chrome (FF works OK, but focus handling is not done the same way)
* currently credentials are stored in LocalStore und are not timedout -> should switch to cookies or something similar