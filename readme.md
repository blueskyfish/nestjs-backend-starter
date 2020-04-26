
![NestJs Backend Starter](logo.png)


# NestJS Backend Starter

> A small nestjs backend with integration of mysql


## Motivation

* Start with the important things faster, instead of spending time on the project setup first.
* The advantage of NestJS: It covers many technical aspects like database connection or validation.
* Some aspects are already integrated:
  * [OpenApi](OpenApiSpec) is set up
  * Connection to MySQL database is available. The database is executing in a docker container together with phpMyAdmin.
  * Use of SQL easily possible
  * The finished backend with NestJS can be executed in a docker container.
* Standards are using (MySql + phpMyAdmin), Node, NestJs, Express, OpenApi, Docker, Docker Compose

## Quote from Nestjs

> Nest ([NestJS](NestJS)) is a framework for building efficient, scalable Node.js server-side applications. It uses
> progressive JavaScript, is built with and fully supports [TypeScript](Typescript) (yet still enables developers to
> code in pure JavaScript) and combines elements of OOP (Object Oriented Programming), FP (Functional Programming),
> and FRP (Functional Reactive Programming).
>
> *From* <https://docs.nestjs.com/>


## Requirements

Some programs must be available on the developer computer:

* Node <https://nodejs.org/en/> *use the LTS version*
* Yarn oder NPM (Yarn <https://classic.yarnpkg.com/lang/en/> *Yarn 2 isn't test*)
* Docker <https://www.docker.com/>
* Docker Compose
* Typescript <https://www.typescriptlang.org/><br>install global: `yarn global add typescript` or `npm i -g typescript`
* NestJS CLI <https://nestjs.com/><br>install global: `yarn global add @nestjs/cli` or `npm i -g @nestjs/cli`


## Setup


### Testing

To execute the test cases, script `create-keys.sh` must first be executed to create a set of RSA keys.

Then the two files `test-private.pem` and `test-public.pem` are available, which are necessary for the test cases.

> **NOTE**: Please never commit the keys to the git repository.


### Database in Docker

The Mysql / MariaDB database engine is running in docker container instance. There is also an instance of `phpMyAdmin` to edit the database data.

**Structure**

| Name                       | Description
|----------------------------|------------------------------------------
| `docker-compose.yml`       | The docker compose for the mysql database- and phpMyAdmin image.<br>It is depend on the file `docker.env`.
| `docker.env`               | The environment variables for the mysql server.
| `docker/db`                | The docker directory with the mysql configuration
| `docker/db/Dockerfile`     | The MySQL Docker file.
| `docker/db/sql`            | The directory for sql statement files for initialization of the database.

![Start Page of MySQL Database](assets/phpmyadmin.png)

### Before Usage

* Setup the different ports for the backend server, the database server and the phpMyAdmin instances.
* Search for the TODO and insert or replace value with your project name
* Build the docker images


## Configuration

This section describes the application configuration and commitments. The node application is configured over environment variables.

The application is managed via  **PM2** <https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/>


### Environment

> Some environment variable are not in the PM2 configuration, because they are secret and define global in the user profile file.

| Name                | Default        | Required | PM2 | Description
|---------------------|----------------|:--------:|:---:|--------------------------------------------------------
| **PORT**            | -              | Yes      | Yes | The port of the server being listen for request
| **HOST**            | `localhost`    | No       | Yes | The host name of the server
| **DB_PORT**         | `3306`         | No       | Yes | The port of the database service
| **DB_HOST**         | `localhost`    | No       | Yes | The host name of the database server
| **DB_USER**         | -              | Yes      | Yes | The database user
| **DB_DATABASE**     | -              | Yes      | Yes | The name of the database
| **DB_PASSWORD**     | -              | Yes      | No  | The password of the database user.<br>**REMARK** The environment is setting outside of the PM2 configuration. It is setting on the **User** `.profile` file
| **AUTH_PRI_FILE**   | -              | Yes      | Yes | Environment variable for the filename of the private key
| **AUTH_PUB_FILE**   | -              | Yes      | Yes | Environment variable for the filename of the public key
| **AUTH_HEADER**     | `x-starter-key` | No      | Yes | Environment variable for the name of the http header with the encrypted token of the current user.
| **AUTH_EXPIRES**    | `7`            | No       | Yes | Environment variable for the time as days until the expires time is reaching.



### PM2 Configuration

PM2 is configured via a javascript config file. The file name must end with `config.js`.


**An excerpt from the configuration**

```js
/*!
 * Configuration file for the PM2
 */
const os = require('os');

// ...

const userHome = os.homedir();
const dbPassword = fromEnv('DB_PASSWORD').asString;
const authSecret = fromEnv('AUTH_SECRET').asString;

module.exports = {
  apps: [
    {
      name: 'appName',
      script: `${userHome}/path/to/installed/lib/main.js`,
      cwd: `${userHome}/path/to/installed`,
      watch: true,
      env: {
        'PORT': '17050',
        'HOST': '127.0.0.1',
        'DB_PORT': '3306',
        'DB_HOST': 'localhost',
        'DB_USER': 'dbUser',
        'DB_DATABASE': 'databaseName',
        'DB_PASSWORD': dbPassword,
        'AUTH_SECRET': authSecret,
      },
      listen_timeout: 5000,
      kill_timeout: 2000,
      restart_delay: 4000,
      max_restarts: 5,
      wait_ready: true,
      source_map_support: true,
    }
  ]
};
```

The critical environment settings are not setting in the **PM2** configuration file. They are setting in the User `.profile` file.

**Example of .profile**

```text
export DB_PASSWORD=xxxx
export AUTH_SECRET=yyyy
```



## Licence

```text
MIT License

Copyright (c) 2020 BlueSkyFish

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```


[NestJS]:https://nestjs.com/
[Typescript]:https://www.typescriptlang.org/
[OpenApiSpec]:https://www.openapis.org/
