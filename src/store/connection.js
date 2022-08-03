// Copyright (C) Shatrujit Aditya Kumar 2022, All Rights Reserved

'use strict'

// Virtual parent to specialized connections
export default class Connection {

    constructor() {
        this.db
    }

    open() {}

    read( request ) {}
    write( request, data ) {}
    delete( request, data ) {}

    close() {}
}