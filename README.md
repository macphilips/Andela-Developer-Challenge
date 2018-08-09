# My Diary Application

[![Build Status](https://travis-ci.org/macphilips/Andela-Developer-Challenge.svg?branch=master)](https://travis-ci.org/macphilips/Andela-Developer-Challenge)
[![Coverage Status](https://coveralls.io/repos/github/macphilips/Andela-Developer-Challenge/badge.svg?branch=develop)](https://coveralls.io/github/macphilips/Andela-Developer-Challenge?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/770e1e1a1009e339d2b2/maintainability)](https://codeclimate.com/github/macphilips/Andela-Developer-Challenge/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/770e1e1a1009e339d2b2/test_coverage)](https://codeclimate.com/github/macphilips/Andela-Developer-Challenge/test_coverage)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=my-diary&metric=alert_status)](https://sonarcloud.io/dashboard?id=my-diary)



MyDiary is an online journal where users can pen down their thoughts and feelings. MyDiary lets users view list of diary entries and alse create and update entries. It allows users to set daily reminder to create new diary contents.

## Requirements

* [Node V8+](https://nodejs.org)
* [PostgresSQL 9.4+](https://www.postgresql.org)

## Development
This application was developed using [ExpressJS](http://expressjs.com/) for handling HTTP requests and PostgreSQL was used for persisting data.

## Installation
* Before installing, ensure [PostgreSQL](https://www.postgresql.org/docs/9.4/static/tutorial-install.html) is installed and you've create a database.
* From the terminal, run the following commands to clone and install application dependencies. 
``` 
> git clone https://github.com/macphilips/Andela-Developer-Challenge

> cd Andela-Developer-Challenge

> npm install

``` 

* Rename `.env.sample` file on the root directory of the clone repo to `.env`. Uncomment `DB_URL` and supply the URL to your database.

```$xslt
> mv .env.sample .env
```

```
# DB_URL=postgres://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<database>
```
* To run application
 
 ```$xslt
 > npm start
 ```

## Testing
To ensure that your installation is successful you'll need to run tests.
The command: `npm test` makes this possible. It isn't functional right now, but once it's done you'll be notified via the README.

## [API Documentation](http://localhost:3000/docs/v1/)
All URIs are relative to the base url.
Base url: `localhost:3000/docs/api/v1`

### Create User Account 

**POST** /auth/signup

This endpoint is used to create user account with a unique email address.

#### HTTP request 

##### Headers
 - ***Content-Type***: application/json
 - ***Accept***: application/json
 
##### Request Body

Example
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "johndoe"
}
``` 
#### Http Response

##### Header
 - ***content-type:*** application/json; charset=utf-8 
 - ***x-access-token:*** <api-key>

##### Return type

```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "DOe",
  "email": "john.doe@example.com",
  "createdDate": "2018-07-31T11:18:55.109Z",
  "lastModified": "2018-07-31T11:18:55.109Z"
}
```

### Authenticate User 

**POST** /auth/login

This endpoint is used to sign in user with a valid email and password.

#### HTTP request 

##### Headers
 - ***Content-Type***: application/json
 - ***Accept***: application/json
 
##### Request Body

Example
```json
{
  "email": "john.doe@example.com",
  "password": "johndoe"
}
``` 
#### Http Response

##### Header
 - ***content-type:*** application/json; charset=utf-8 

##### Return type

```json
{
  "token": "<api access token>"
}
```

### Get User Information

**GET** /account/me

Returns the user information with the provided access token.

#### HTTP request 

##### Headers
 - ***Content-Type:*** application/json
 - ***Accept:***: application/json
 - ***x-access-token:*** <api-key>
 
#### Http Response
 
##### Header
 - ***content-type:*** application/json; charset=utf-8 

##### Return type

```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "DOe",
  "email": "john.doe@example.com",
  "createdDate": "2018-07-31T11:18:55.109Z",
  "lastModified": "2018-07-31T11:18:55.109Z"
}
```

### Get List of User's diary Entries 

**GET** /entries

Returns the list of entry created by the user with the token provided with the request. Access Token is required to use this endpoint.

#### HTTP request 

##### Headers
 - ***Content-Type***: application/json
 - ***Accept***: application/json
 - ***x-access-token:*** <api-key>
 
#### Http Response

##### Header
 - ***content-type:*** application/json; charset=utf-8 

##### Return type

```json
{
  "entries": [
    {
      "id": 123,
      "title": "Nice Title",
      "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla congue nulla sem, ut luctus turpis pulvinar sollicitudin.",
      "createdDate": "Jul 12, 2018",
      "lastModified": "Jul 12, 2018",
      "userID": 32
    }
  ]
}
```

### Create Entry

**POST** /entries

This endpoint is used to create new diary entry. Access Token is required to use this endpoint.

#### HTTP request 

##### Headers
 - ***Content-Type***: application/json
 - ***Accept***: application/json
 - ***x-access-token:*** <api-key>
 
##### Request Body

Example
```json
{
  "title": "Nice Title",
  "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla congue nulla sem, ut luctus turpis pulvinar sollicitudin."
}
``` 
#### Http Response

##### Header
 - ***content-type:*** application/json; charset=utf-8 
 - ***x-access-token:*** <api-key>

##### Return type

```json
{
  "id": 123,
  "title": "Nice Title",
  "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla congue nulla sem, ut luctus turpis pulvinar sollicitudin.",
  "createdDate": "Jul 12, 2018",
  "lastModified": "Jul 12, 2018",
  "userID": 32
}
```

### Get Entry by ID

**GET** /entries/{id}

Returns a single entry with the {id} provided. Access Token is required to use this endpoint. 404 Error is return when not entry is found.

#### HTTP request 

##### Headers
 - ***Content-Type***: application/json
 - ***Accept***: application/json
 - ***x-access-token:*** <api-key>
 
##### Parameter
 - ***id:*** The ID of the Entry to retrieve
 
#### Http Response

##### Header
 - ***content-type:*** application/json; charset=utf-8 
 - ***x-access-token:*** <api-key>

##### Return type

```json
{
  "id": 123,
  "title": "Nice Title",
  "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla congue nulla sem, ut luctus turpis pulvinar sollicitudin.",
  "createdDate": "Jul 12, 2018",
  "lastModified": "Jul 12, 2018",
  "userID": 32
}
```

### Update Entry by ID

**PUT** /entries/{id}

Update and Return the modified entry with the provided {id}.

#### HTTP request 

##### Headers
 - ***Content-Type***: application/json
 - ***Accept***: application/json
 - ***x-access-token:*** <api-key>
 
##### Parameter
 - ***id:*** The ID of the Entry to be updated

Example
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "johndoe"
}
``` 
#### Http Response

##### Header
 - ***content-type:*** application/json; charset=utf-8 
 - ***x-access-token:*** <api-key>

##### Return type

```json
{
  "id": 123,
  "title": "Nice Title",
  "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla congue nulla sem, ut luctus turpis pulvinar sollicitudin.",
  "createdDate": "Jul 12, 2018",
  "lastModified": "Jul 12, 2018",
  "userID": 32
}
```

### Author
**Titilope Morolari**

