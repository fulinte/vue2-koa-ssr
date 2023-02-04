<template>
    <div class="demo-wrapper">
        <SubassemblyDemoPartOne />
    </div>
</template>

<script>
    import { mxiPageHabitualInitialize } from '@plugins/mixins/must-work.js';

    import SubassemblyDemoPartOne from './subassembly/demo-part-one.vue';

    async function asyncPageInitializationHandling({ refStore, refAxios, refRouter, refRoute }) {
        var { page, limit } = refRoute.query, // 获取url参数
            // 生成页面需要的数据
            list = [
                {
                    text: 1
                },
                {
                    text: 2
                }
            ];
        // 赋值到通用的数据存放处（每个页面都会通过此处读取数据）
        refStore.state.communal.depository = {
            list
        };
    }

    export default {
        asyncPageInitializationHandling,
        mixins: [mxiPageHabitualInitialize],
        components: {
            SubassemblyDemoPartOne
        },
        data() {
            return {};
        },
        computed: {
            articleList() {
                // 返回文章列表
                return this.$store.state.communal.depository?.list || [];
            }
        },
        methods: {},
        watch: {},
        mounted() {}
    };
</script>

<style lang="scss">
    @import '~@static/styles/variable.scss';
    @import './assets/demo-swiper.scss';

    .demo-wrapper {
    }
</style>
