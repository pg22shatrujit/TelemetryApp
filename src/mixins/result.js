/*
 *   Copyright (c) 2019 Kibble Online, in cooperation with Vancouver Film School
 *   All rights reserved.
 */

class Result {

    constructor( error = -1, errorMsg = "Unknown Error") {

        this.error = error;
        this.errMsg = errorMsg;
        this.payload = {};
    }

    ok() {

        this.error = 0;
        this.errMsg = "OK";
    }

    problem( error = -1, errorMsg = "Unknown Error" ) {

        this.error = error;
        this.errMsg = errorMsg;
    }

    serialize() {

        return JSON.stringify( this )
    }
}

module.exports = Result;