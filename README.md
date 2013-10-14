# TODO Application with NodeJS, Mongoose and SuperTest framework
"TODO" application

Steps to run your application in Production mode:

1- Start Mongodb from your terminal: mongod
2- Run 'app.js': node app.js
3- Open your browser and hit this url: http://localhost:3000/

Steps to run Test Cases in Test mode:

1- Start Mongodb from your terminal: mongod
2- Run 'app.js' with Test Configurations: NODE_ENV=test node app.js
3- Run your test file('/test/todo.test.js') with Mocha:  mocha test/todo.test.js