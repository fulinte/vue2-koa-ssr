<template>
    <div>
        <span>message ... </span>
        <span>{{ refInfo }}</span>
    </div>
</template>

<script>
    export default {
        props: {
            refInfo: {
                type: Array,
                default: () => {
                    return [];
                }
            }
        },
        data() {
            return {};
        },
        computed: {},
        methods: {},
        watch: {},
        mounted() {}
    };
</script>

<style lang="scss">
</style>
