
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

TBD


## Configuration

TBD


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
