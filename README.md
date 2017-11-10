# Backend API server for [health-data-react](https://github.com/fjsandov/health-data-react).

## 1. Requirements
This project requirements are `node`, `npm` and `mongodb`. We will asume you already have them installed.

## 2. Install node modules
First we have to install the necessary modules. To do that you can run the next command:
```sh
 npm install
```

## 3. Start the server
To start the server you must run the command:
```sh
 npm start
```

## 4. Load the data into the database
To load the database with the excel data stored in the [seed folder](./seed) with the counties and their indicators for diabetes, inactivity and obesity, you have to call the url: `localhost:3001/counties/update_database`.

When the process is complete you will see the message `Database updated` in the HTTP client or browser you used to call the update_database url.

## 5. Project structure
The server starts with [server.js](./server.js) file, which loads every resource and starts the server.

The resources are controllers, models and routes, each of them in a folder with the respective name.

The [controllers folder](./api/controllers) stores the logic for each endpoint of the API, [routes folder](./api/routes) stores the relation between the url of the endpoint with the logic of the controllers and finally the [models folder](./api/models) stores the database schemas for each model used in the application.

## 6. API
There are 3 routes of this API:
1. /counties/update_database
2. /counties/
3. /counties/:code

The first url delete all the data and load the counties and their indicators from the excel files.
The second url lists all the counties as an array with the basic data of each county.
The last url requires a county unique code (FIPS Code) to get that county's complete information, including the indicators for diabetes, inactivity and obesity.

## 5. Information
The information contained in the excel files in the [seed folder](./seed) was extracted from the [CDC site](https://www.cdc.gov/diabetes/data/countydata/countydataindicators.html).