<template>
    <div class="home-demo-wrapper">
        <p>home-page</p>
        <SubassemblyDemoPartOne />
        <ul>
            <li v-for="item in articleList" :key="item.text">{{ item.text }}</li>
        </ul>
        <p>language: {{$t('UI.OperationSuccess')}}</p>
    </div>
</template>

<script>
    import { mxiPageHabitualInitialize } from '@plugins/mixins/must-work.js';

    import SubassemblyDemoPartOne from './subassembly/demo-part-one.vue';

    async function asyncPageInitializationHandling({ refStore, refRoute }) {
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
        // 在这里生成页面使用的数据结构集
        // 然后通过computed分拆独立数据
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
                // 可以在这里进行下数据加工
                // 返回文章列表
                return this.$store.state.communal.depository?.list || [];
            }
        },
        methods: {},
        watch: {
            '$store.state.communal.scrollEvent.isBottom'(nvl, ovl) {
                // do some thing
            }
        },
        mounted() {}
    };
</script>

<style lang="scss">
    @import '~@static/styles/variable.scss';
    @import './assets/demo-swiper.scss';

    .home-demo-wrapper {
        p {
            color: $color-secondary;
        }
    }
</style>
