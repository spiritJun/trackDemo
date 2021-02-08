<template>
    <div :class="{'hidden':hidden}" class="pagination-container">
        <!--  v-if="total>10"  -->
        <el-pagination
                :background="background"
                :current-page.sync="currentPage"
                :page-size.sync="pageSize"
                :layout="layout"
                :page-sizes="pageSizes"
                :total="total"
                v-bind="$attrs"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"/>
    </div>
</template>

<script>
    import { scrollTo } from '@/utils/scrollTo'
    import merge from 'lodash/merge'
    export default {
        name: 'Pagination',
        props: {
            total: {
                required: true,
                type: Number
            },
            page: {
                type: Number,
                default: 1
            },
            limit: {
                type: Number,
                default: 10
            },
            pageSizes: {
                type: Array,
                default() {
                    return [ 8,10, 20, 30, 40, 50, 100]
                }
            },
            layout: {
                type: String,
                default: 'total, sizes, prev, pager, next, jumper'
            },
            background: {
                type: Boolean,
                default: false
            },
            autoScroll: {
                type: Boolean,
                default: true
            },
            hidden: {
                type: Boolean,
                default: false
            },
            params: {//请求时传递的其余参数
                type: Object,
                default() {
                    return {}
                }
            }
        },
        computed: {
            currentPage: {
                get() {
                    return this.page
                },
                set(val) {
                    this.$emit('update:page', val)
                }
            },
            pageSize: {
                get() {
                    return this.limit
                },
                set(val) {
                    this.$emit('update:limit', val)
                }
            }
        },
        methods: {
            handleSizeChange(val) {
                // console.log('每页' + val +'条')
                /* 切换每页条数的时候，都将pageNo设置回第一页  pageNo: 1*/
                this.$emit('pagination', merge(this.params,{ pageNo: 1, pageSize: val }))
                if (this.autoScroll) {
                    scrollTo(0, 800)
                }
            },
            handleCurrentChange(val) {
                // console.log('当前第' + val +'页')
                this.$emit('pagination', merge(this.params, { pageNo: val, pageSize: this.pageSize }))
                if (this.autoScroll) {
                    scrollTo(0, 800)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .pagination-container {
      background: #F4F6FC;
      padding: 32px 0 32px 0;
      text-align: right;
      /* 以下deep 是修改分页的css 如果不需要直接注释 */
      /deep/ .el-pagination .btn-prev {
        background: #F4F6FC;
      }
      /deep/ .el-pagination .btn-next {
        background: #F4F6FC;
      }

      /deep/ .el-pagination .el-pager li {
        background: #F4F6FC;
      }

      .el-input__inner {
        background: #F4F6FC;
      }

      /deep/ .el-pagination .el-select .el-input .el-input__inner {
        background: #F4F6FC;
      }

      /deep/ .el-pagination__editor.el-input .el-input__inner {
        background: #F4F6FC;
      }
    }
    .pagination-container.hidden {
        display: none;
    }
</style>
