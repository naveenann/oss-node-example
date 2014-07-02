# Creating a Search Engine with Angular + Node + OpenSearchServer

##Prerequisite
1.	[Node] (http://nodejs.org/)
2.	npm (which comes bundled with Node) v1.3.7+
3.	[Yeoman](http://yeoman.io)
4.	[Angular](http://angularjs.org)
5.	[OpenSearchServer](http://www.opensearchserver.com)

##Setting up the environment
If Node, npm,Yeoman, OpenSearchServer are installed you can move to next step.

#### Installing Node
The documentation for installing node can be found [here](https://github.com/joyent/node/wiki/installation). 
Additionally [this](http://www.joyent.com/blog/installing-node-and-npm/) link also provides some useful information.

#### Installing OpenSearchServer
The documentation for installing OpenSearchServer can be found [here](http://www.opensearchserver.com/documentation/installation/)

#### Installing Yeoman
    npm install --global yo
Full install instruction's can be found [here](http://yeoman.io/learning/index.html)

##Setup the project
In this tutorial we will use yeoman to setup the project. It will create basic folders, files and configurations to get you up and running quickly.

We'll use the generator called [generator-angular-fullstack](https://www.npmjs.org/package/generator-angular-fullstack) install it using. Install it using the below command.

    npm install -g generator-angular-fullstack

We will run the generator to scaffold our application by answering some questions about our project.  We will use the default settings in this application and Jade as our HTML template language. More information about Jade can be found [here](http://jade-lang.com/)
    
    yo angular-fullstack --jade # The jade flag is used for Jade HTML templating 
    [?] Would you like to use Sass (with Compass)? # Yes
    [?] Would you like to include Twitter Bootstrap? # Yes
    [?] Would you like to use the Sass version of Twitter Bootstrap? # Yes
    [?] Which modules would you like to include? (Press <space> to select)
    ❯⬢ angular-resource.js
     ⬢ angular-cookies.js
     ⬢ angular-sanitize.js
     ⬢ angular-route.js
    [?] Which modules would you like to include? (Press <space> to select) # We will use the default selections by pressing return.
    [?] Would you like to include MongoDB with Mongoose? # No
After answering these configuration questions, Yeoman will take a minute to scaffold our project files and pull down Node and Bower modules. Once finished, we will have our development environment all set up.

The directory structure will look like this.

    app/               # Main directory for application
       scripts/         # Angular js/coffee directory where most of our
         controllers/   #  yeoman-generated modules will go 
        app.js           # Main application js file
       styles/          # css/scss
       views/           # Angular views
        index.html       # Entry point to our single page app
    lib/
        config/
            express.js      # Express configuration file
            config.js       # Global configuration file
        controllers/    # Ccontroller directory
            api.js      # API file
        routes.js       # The routes file
    test/              # Tests (shocking, I know)
    bower.json         # Bower configuration file
    Gruntfile.js       # Grunt configuration file
    package.json       # Node/npm configuration file

## Adding OSS node client as dependency

Add the [node-oss-client](https://github.com/lemonde/node-oss-client) as a dependency in the package.json file.

    {
      "name": "nodeexample",
      "version": "0.0.0",
      "dependencies": {
        ...
        "node-oss-client":"0.3.0"
      }...}

Save the file and run the below command

    npm install 
This will download and install OSS node client module.


## Initializing the API
Add the search API in the API file located in the lib/routes.js 

        app.get('/api/search/:query', api.search);

## Handling the API request

The `lib/controllers/api.js` handles the search API requests node-oss-client library is used to request the documents from OpenSearchServer and return them to the API. Specify a valid hostname,port, protocol, login and key.
Add these code in the top of the file.

```javascript
    var oss = require('node-oss-client');

    var client = oss.createClient({
        hostname: 'localhost',
        port: 9090,
        protocol: 'http',
        login: 'example',
        key: '181123asda1474a3d91a77a69de7c77'
    });
    var indexName = 'test'; // The name of the index to query.
    exports.search = function (request, response) {

        client.search(indexName, {
            "query": request.params.query,
            "start": 0,
            "rows": 10,
            "lang": "ENGLISH",
            "operator": "AND",
            "returnedFields": [
                "url"
            ],

            "snippets": [
                {
                    "field": "title",
                    "tag": "",
                    "separator": "...",
                    "maxSize": 200,
                    "maxNumber": 1,
                    "fragmenter": "NO"
                },
                {
                    "field": "content",
                    "tag": "",
                    "separator": "...",
                    "maxSize": 200,
                    "maxNumber": 1,
                    "fragmenter": "NO"
                }
            ], "searchFields": [
                {
                    "field": "title",
                    "boost": 10
                },
                {
                    "field": "content",
                    "boost": 1
                },
                {
                    "field": "titleExact",
                    "boost": 10
                },
                {
                    "field": "contentExact",
                    "boost": 1
                }
            ]

        }, function (err, res) {

            response.json({
                results: res

            });
        });

    };
```
More information about the search request can be found [here](http://www.opensearchserver.com/documentation/api_v2/searching_using_fields/search.html)

## Controller to handle search.

Handling ng-submit which is triggered upon form submission.

In `app/scripts/controllers/main.js` add the `$scope-submit`.

      'use strict';
      
      angular.module('nodeExampleApp')
        .controller('MainCtrl', function ($scope, $http) {
           $scope.submit = function () {
                  $scope.loading = true;
                  var url = '/api/search/' + $scope.q + '/';
                  $http({
                      method: 'GET',
                      url: url
                  }).
                      success(function (data, status, headers, config) {
                          $scope.numFound = data.results.numFound +" Results Found";
                          $scope.documents = data.results.documents;
      
                      }).
                      error(function (data, status, headers, config) {
                          $scope.name = 'Error!';
                      });
      
              }
        });
        
## Creating the layout to display the form and result.

In the `app/views/partials/main.jade` file remove existing code and  create the form and layout to display the result. 

    // Search Form
     form.sidebar-form.col-centered(ng-submit="submit()")
      .input-group
        input.form-control(id='q',type='text',autocomplete='off',placeholder='Search',ng-model='q')
        span.input-group-btn
          button#search-btn.btn.btn-flat(type='submit', name='seach',)
            i(class='glyphicon glyphicon-search')
    // Display the number of document found.
    div{{numFound}}
    // Iterate over the results
    div(ng-repeat='document in documents',ng-model='menus')
      h3
      a(href='{{document.fields[0].values[0]}}') {{document.snippets[1].values[0]}}
      div {{document.snippets[0].values[0]}}
      a.btn.btn-primary.btn-xs(href='{{document.fields[0].values[0]}}',target='_blank') Read more

## Run the project
Run the project from terminal using the below command  

    grunt serve
## Example

You can find the whole example [here](https://github.com/naveenann/oss-node-example)

