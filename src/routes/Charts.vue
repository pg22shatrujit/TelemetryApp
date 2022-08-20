<!--
VFS VUE Single File Component

<pg-home user="User"></pg-home>

Copyright (C) Shatrujit Aditya Kumar, 2022. All Rights Reserved
-->
<template>

    <section class="container main">
        <h3>Telemetry Analysis Charts</h3>
        <div class="container chart-area">
            <div id="chart-1" class="area chart">
                <t-bar-chart :data="chartData" title="Player States" />
            </div>
            <div id="chart-2" class="area chart">
                <t-heat-map :data="mapData" title="Location Heatmap" src="layout.png" ref="locMap"/>
            </div>
        </div>
    </section>

</template>
<script>

    import Controller from '@/mixins/controller'
    import TBarChart from '@/components/BarChart.vue'
    import THeatMap from '@/components/HeatMap.vue'

    class HomeController extends Controller {

        constructor( name, subComponentList = []) {
            super( name, subComponentList );
            this.vm = {
                dataRefreshInterval: null
            }
            this.props = {
                name: String,
            }
            this.injectGetters(['chartData', 'mapData'])
            this.injectActions(['fetchVizData'])
        }

        onCreated() {
            setTimeout( this.refreshDataAndHeatMap, 2000 )
            this.dataRefreshInterval = setInterval( this.refreshDataAndHeatMap, 5000 )
        }

        onBeforeDestroy() {
            clearInterval(this.dataRefreshInterval)
        }

        refreshDataAndHeatMap() {
            this.fetchVizData()
            .then(() => {
                if( this.$refs.locMap ) this.$refs.locMap.refreshHeatMapData()
            })
        }
    }

    export default new HomeController('pgHome', { TBarChart, THeatMap });

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
