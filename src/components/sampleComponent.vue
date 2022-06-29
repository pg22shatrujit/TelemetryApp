<!--
<some-tag-name title="My Component">
    -- user can add their own HTML code here, replaces 'slot' component --
</some-tag-name>

@copyright (c) 2019. Scott Henshaw. All Rights Reserved.
-->
<template>

    <section class="component-style">  <!-- Just one main element per template -->
        <div>{{ title }}</div>
        <div>
            <!-- Put your HTML template here-->
            <slot></slot>
        </div>
        <button @click="doIt( event )">Do it!</button>
    </section>

</template>
<script>
    import Controller from '@/mixins/controller'

    // import other components you use here...

    class ComponentController extends Controller {

        constructor( name, subComponentList = []) {
            super( name, subComponentList )

            // the vm date does not exist until the component is created
            this.vm = {
                someData: "Hello world"
            }

            // props passed in when using this component
            this.props = {
                title: String
            }
            /*
            Data from the VUEX use injectGetters.
            injectActions, injectGetters take an array of names from the vuex
            */
            //this.injectGetters([/* List of names in array */]);
            //this.injectActions(['actionMethod','anotherAction'])
        }

        // Local component methods, used in a template they are called whenever it renders
        doIt( params, $event ) {
            // A method that does something to the props or viewModel, or global state
        }

        // Local computed methods, recomputed only when reactive properties change
        computeDoIt( params ) {
            this.someData = "has changed";
        }

        /*
        Lifecycle hooks, remove any you don't need
        */
        onBeforeCreate() {
            // after the Vue instance initializes, before instances are created
        }

        onCreated() {
            // initialized, injections and reactivity registered
        }

        onBeforeMount() {
            // after template compile or innerHTML generated
        }

        onMounted() {
            //  innerHTML el is attached to parent
        }

        onBeforeUpdate() {
            // After data changes and before Virtual DOM is about to change
        }

        onUpdated() {
            // After data changes and after the Virtual DOM changes
        }

        onBeforeUnmount() {
            // specifically when unmount is called
        }

        onUnmounted() {
            // After el has been unmounted
        }
    }

    export default new ComponentController('someTagName'/* , { subComponent, anotherComponent } */);

</script>
<style scoped>
    /*
    Add "scoped" attribute to limit CSS to this component only <style scoped>
    styles that are specific to this component only, not sub-children
    */
    .component-style {
        display: flex;
        flex-direction:row;
        flex-wrap:wrap;
        justify-content:space-evenly;
        align-content: flex-start;
        align-items:flex-start;
    }

    .component-item {
        flex-grow: inherit;
        flex-shrink: inherit;
        order: inherit;
    }

</style>