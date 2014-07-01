'use strict';

var oss = require('node-oss-client');
/**
 * Get awesome things
 */
 var client = oss.createClient({
        hostname: '107.170.62.61',
        port: 9090,
        protocol: 'http',
        login: '',
        key: ''
    });
 var indexName = 'test';
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
exports.awesomeThings = function(req, res) {
  res.json([
    {
      name : 'HTML5 Boilerplate',
      info : 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.',
      awesomeness: 10
    }, {
      name : 'AngularJS',
      info : 'AngularJS is a toolset for building the framework most suited to your application development.',
      awesomeness: 10
    }, {
      name : 'Karma',
      info : 'Spectacular Test Runner for JavaScript.',
      awesomeness: 10
    }, {
      name : 'Express',
      info : 'Flexible and minimalist web application framework for node.js.',
      awesomeness: 10
    }
  ]);
};