<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<style lang="scss">
    @import '~@static/styles/scroll-normal.scss';
    @import '~@static/styles/page-reuse.scss';
    @import '~@static/styles/common.scss';

    #app {
        margin-left: 3rem;
    }
</style>

<script>
    export default {
        created() {
            // 服务端，浏览器端都会执行，首次进入时执行
            // console.log('app is run by created.');
        },
        mounted() {
            // 浏览器端执行，首次进入时执行
            // console.log('app is run by mounted.');
        }
    };
</script>
