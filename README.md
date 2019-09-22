# Referral Marketing Dashboard

[![Build Status](https://travis-ci.com/cjcbusatto/referral-marketing-dashboard.svg?branch=development)](https://travis-ci.com/cjcbusatto/referral-marketing-dashboard) [![Known Vulnerabilities](https://snyk.io/test/github/cjcbusatto/referral-marketing-dashboard/badge.svg)](https://snyk.io/test/github/cjcbusatto/referral-marketing-dashboard) [![codecov](https://codecov.io/gh/cjcbusatto/referral-marketing-dashboard/branch/development/graph/badge.svg)](https://codecov.io/gh/cjcbusatto/referral-marketing-dashboard)

## Introduction

The strategy of turning customers to digital influencers about a product is becoming more and more popular nowadays. In order to increase their motivation to spread the word, companies provide some rewards to them, i.e., when someone installs an application or buy a service referred by another user, the one who invited (or a group of people) receive benefits like a discount, subscription renewed for free, etc.

This application provides a dashboard focused on companies which work together to universities where marketers can create such campaigns, define custom rewards models, track people engagement, and more!

## Requirements

The minimal requirements, in order to run the application is to have [Docker]() and [Docker-Compose]() installed on the host.

If your computer does not run Docker, or you want to build it mannualy, you would require to:

-   Install [NodeJS]()
-   Use [npm](https://www.npmjs.com/get-npm) or install [yarn](https://yarnpkg.com/lang/en/docs/install/#debian-stable)
-   Install Dependencies

    ```bash
    # Using npm
    $ cd /PATH/TO/api && npm install
    $ cd /PATH/TO/web && npm install

    # Using yarn
    $ cd /PATH/TO/api && yarn install
    $ cd /PATH/TO/web && yarn install
    ```

## Build

You can build the containers separatedly...

```bash
# Build the API
$ docker build -t rmd/api .

# Build the Web UI
$ docker build -t rmd/web .
```

... or build them together using docker-compose

```bash
$ docker-compose build
```

## Usage

### Using Docker

```bash
$ docker-compose up
```

### Manually

```bash
# Start the API
$ cd /PATH/TO/api && npm start

# Start the Web UI
$ cd /PATH/TO/web && npm start
```

## LICENSE

MIT License

Copyright (c) 2019 Claudio Jose Castaldello Busatto

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
