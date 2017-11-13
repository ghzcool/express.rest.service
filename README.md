# express.rest.service
Create REST service for publishing with express

## Installation

```
npm install express-rest-service
```

## Usage

```
const ExpressRESTService = require("express-rest-service");
```

require express-rest-service

```
const myRESTService = new ExpressRESTService(props);
```

create REST service instance with properties

```
const app = express();
```

create express app


```
app.get('/foo', (req, res) => myRESTService.call(req, res));
```

register service in express app


## Properties

-  `args` object with keys that represent request argunents to service
-  `fn` function that will be called on service call with arguments (service, request, response)
-  `hasAccess` function that will be called with arguments (service, request, callback) to check is user logged in or has user access to this service or not. function should call callback with 2 boolean arguments (loggedIn, hasAccess)
-  `prettyJSON` boolean false by default

## Example

const myRESTService = new ExpressRESTService({  
&nbsp;&nbsp;args: {  
&nbsp;&nbsp;&nbsp;&nbsp;firstName: false,  
&nbsp;&nbsp;&nbsp;&nbsp;lastName: true,  
&nbsp;&nbsp;&nbsp;&nbsp;age: "number",  
&nbsp;&nbsp;&nbsp;&nbsp;height: {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: "number",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mandatory: true,  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;decimalPrecision: 2  
&nbsp;&nbsp;&nbsp;&nbsp;}  
&nbsp;&nbsp;},  
&nbsp;&nbsp;fn: (service, request, response) => {  
&nbsp;&nbsp;&nbsp;&nbsp;service.success({  
&nbsp;&nbsp;&nbsp;&nbsp;data: service.args  
&nbsp;&nbsp;&nbsp;&nbsp;});  
&nbsp;&nbsp;}  
});

app.get('/foo', (req, res) => myRESTService.call(req, res));