/*
VUE App's MAIN Component.
Copyright (c) 2018. Scott Henshaw, Kibble Online Inc. All Rights Reserved.
*/
'use strict';

import Vue from 'vue'
import Router from 'vue-router';
Vue.use( Router );

import Charts from '@/routes/Charts.vue'
import About from '@/routes/About.vue'
import Admin from '@/routes/Admin.vue'


export default new Router({
    routes: [
        { path:"/about",     name:"About", component: About },
        { path:"/", name:"Charts", component: Charts, props: { name: "DemoApp"} },
        { path:"/admin", name:"Admin", component: Admin, props: { name: "DemoApp"} },
    ]
});