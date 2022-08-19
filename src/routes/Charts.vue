<!--
VFS VUE Single File Component

<pg-home user="User"></pg-home>

Copyright (c) 2018. Scott Henshaw, Kibble Online Inc. All Rights Reserved.
-->
<template>

    <section class="container main">
        <h3>Telemetry Analysis Charts</h3>
        <div class="container chart-area">
            <div id="chart-1" class="area chart">
                <t-bar-chart :data="chartData" title="Player States" subtitle="Count of occurances"/>
            </div>
            <div id="chart-2" class="area chart">
                This is where two chart goes
            </div>
            <div id="chart-3" class="area chart">
                This is where three chart goes
            </div>
            <div id="chart-4" class="area chart">
                This is where four chart goes
            </div>
        </div>
    </section>

</template>
<script>

    import Controller from '@/mixins/controller'
    import TBarChart from '@/components/BarChart.vue'

    class HomeController extends Controller {

        constructor( name, subComponentList = []) {
            super( name, subComponentList );
            this.vm = {
                formData: {
                    sampleOne:"",
                    sampleTwo:42,
                },
            }
            this.props = {
                name: String,
            }
            this.injectGetters(['chartData'])
            this.injectActions(['fetchChartData'])
        }

        // Check for existing records on load
        onCreated() {
            this.fetchChartData()
        }
    }

    export default new HomeController('pgHome', { TBarChart });

</script>
<style scoped>
    /* Local styles for this template */
    h3 {
        color: black;
        font-size: 1.5em;
        font-weight: 700;
        margin: .25em;
    }
    .container {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: flex-start;
        /* width: 100%; */
    }

    .main {
        flex-direction: column;
        overflow-y: scroll;
    }

    .chart-area {
        flex-direction: row;
        justify-content: space-evenly;
        width: 85vw;
    }

    .area {
        margin:2vw;
        border: 1px solid black;
        background-color: lightgray;
        color: black;
        height: 78vh;
        width: 80vw;
    }

    .chart {
        width: 25vw;
        height: 25vw;
        background-color: rosybrown;
    }
</style>
