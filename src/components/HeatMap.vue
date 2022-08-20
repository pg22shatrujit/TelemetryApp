<!--
VFS VUE Single File Component

<t-heat-map :data="dataObject" title="Title" src="image.jpg" />

Copyright (C) Shatrujit Aditya Kumar, 2022. All Rights Reserved
-->
<template>

    <section>
        <h3> {{ title }} </h3>
        <div ref="root" :style="{ 'background-image': `url(${ require( `@/assets/${src}` ) })` }"/>
    </section>

</template>

<style scoped>
    section {
        height: 100%;
    }

    h3 {
        color: black;
        font-size: 1.5em;
        font-weight: 700;
        margin: .25em;
    }

    /* Containing element for the heatmap */
    div {
        width: 100%;
        height: 80%;
        background-size: contain;
    }
</style>

<script>

    import Controller from '@/mixins/controller'
    import { LOCATION_MAXIMUM_KEY, LOCATION_OBJECTS_KEY } from '../../functions/FirestoreSetup'
    import h337 from '../../node_modules/heatmap.js/build/heatmap' // Plugin to handle heatmap generation

    class HeatMapController extends Controller {

        constructor( name, subComponentList = []) {
            super( name, subComponentList );

            this.vm = {
                heatmap: null
            }

            this.props = {
                data: Object,
                title: String,
                src: String
            }
        }

        // Get a reference to the root element and set it as the container for the heat map
        onMounted() {
            let root = this.$refs.root
            this.heatmap = h337.create({
                container: root
            })
        }

        // Called by the parent every poll after data is updated to refresh the heat map
        refreshHeatMapData() {
            if(this.data.hasOwnProperty( LOCATION_MAXIMUM_KEY ) && this.data.hasOwnProperty( LOCATION_OBJECTS_KEY )) {
                this.heatmap.setData({
                    max: this.data[ LOCATION_MAXIMUM_KEY ],
                    data: this.data[ LOCATION_OBJECTS_KEY ]
                })
            }
        }
    }

    export default new HeatMapController('THeatMap');

</script>
