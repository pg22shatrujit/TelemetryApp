<!--
<pg-loading-spinner />
@copyright (c) 2021. Scott Henshaw. All Rights Reserved.
-->
<template>

    <div class="loader">
        <svg viewBox="0 0 32 32" width="32" height="32">
            <circle id="spinner" cx="16" cy="16" r="14" fill="none" />
        </svg>
    </div>

</template>
<script>

// typical Vue component controller defined and registered here
import Controller from '@/mixins/controller'

class SpinnerController extends Controller {

    constructor( name, subComponentList = []) {
        super( name, subComponentList );
        this.vm = {
        }
    }
}

export default new SpinnerController('pgLoadingSpinner');

</script>
<style scoped>

</style>