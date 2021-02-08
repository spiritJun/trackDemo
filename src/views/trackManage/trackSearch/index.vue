<template>
    <div>
        <!-- 右侧待送达抽屉 -->
        <div class="containerplatNum" :style="{right:isShowCar ? '0':'-500px'}">
            <div class="containerplatNumHead">
                <div class="title">待送达车辆</div>
                <img :src="carPoint" class="img" />
            </div>
            <div class="containerplatNumCont">
                <div class="container">
                    <div :class="item.isCur ? 'list cur': 'list' " @click="changePlatNum(item,index)" v-for="(item,index) in onLiveCars" :key="index">{{item.platNum}}</div>
                </div>
            </div>
        </div>

        <div class="map-container">
            <h1 class="navi-title">{{title}}</h1>
            <!-- 右侧按钮 -->
            <div class="containerplatBtn" @click="showCarPart">
                <img :src="carPoint" class="img" />
                <div class="title">待送达车辆</div>
            </div>
            <div class="contain">
                <div class="search-wrap">
                    <el-form :inline="true" :model="listQuery" ref="listQuery" class="search-form">
                        <el-form-item label="订单号：">
                            <el-input class="el-input-interval" v-model.trim="listQuery.orderNo" placeholder="请输入订单号" @keyup.enter.native="submitForm()"></el-input>
                        </el-form-item>
                        <el-form-item label="车牌号：">
                            <el-input class="el-input-interval" v-model.trim="listQuery.plateNumber" placeholder="请输入车牌号" style="width: 210px" @keyup.enter.native="submitForm()"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="手机号：">
                            <el-input v-model.trim="listQuery.deliverAddressName" placeholder="请输入手机号" @keyup.enter.native="submitForm()"></el-input>
                        </el-form-item>
                        <el-form-item label="接单人：">
                            <el-input v-model.trim="listQuery.takeAddressName" placeholder="请输入接单人" @keyup.enter.native="submitForm()"></el-input>
                        </el-form-item> -->
                        <el-form-item label="查询时间：" class="dateTimeContainer">
                            <el-date-picker v-model="listQuery.bidStartTime" :picker-options="bidStartTime" @change="checkTime(
                            listQuery.bidStartTime,
                            listQuery.bidEndTime,
                            'bidStartTime',
                            'bidEndTime'
                        )" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" placeholder="请选择开始时间">
                            </el-date-picker>
                            <span>至</span>
                            <el-date-picker v-model="listQuery.bidEndTime" :picker-options="bidEndTime" @change="
                checkTime(
                  listQuery.bidStartTime,
                  listQuery.bidEndTime,
                  'bidStartTime',
                  'bidEndTime'
                )
              " type="datetime" value-format="yyyy-MM-dd HH:mm:ss" default-time="23:59:59" placeholder="请选择结束时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item class="search-fr">
                            <el-button type="primary" @click="mockBtn()">模拟推送1</el-button>
                            <el-button type="primary" @click="mockBtn2()">模拟推送2</el-button>
                            <el-button type="primary" @click="submitForm()">查询</el-button>
                            <el-button type="primary" plain @click="resetForm()">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <!-- 轨迹相关 -->
                <div id="container" v-loading="loaddingTrack">
                    <!-- 左侧订单信息 -->
                    <div class="containerorder">
                        <div class="containerorderBox">
                            <div class="containerorderList">
                                <img :src="carIcon" class="carIcon" />
                                <div class="containerorderNotice">京A88888</div>
                            </div>
                            <div class="containerorderList">
                                <img :src="person" class="person" />
                                <div class="containerorderNotice">刘董 12345678908</div>
                            </div>
                        </div>
                        <!-- 需要显示隐藏的订单信息 -->
                        <div class="containerorderInfo" :style="{height:isShowallOrderInfo ? 'calc(650px - 96px - 30px)' : 0}">
                            <div class="orderInfoFrame">
                                <div class="orderInfoList">
                                    <div class="orderInfoLi title">订单号</div>
                                    <div class="orderInfoLi">QWW12345790456</div>
                                </div>
                                <div class="orderInfoList">
                                    <div class="orderInfoLi title">路线</div>
                                    <div class="orderInfoLi">山西太原清徐县—河北邯郸开发新区</div>
                                </div>
                                <div class="orderInfoList">
                                    <div class="orderInfoLi title">当前位置</div>
                                    <div class="orderInfoLi">山西省长治市潞城区靠近潞城服务区</div>
                                </div>
                                <div class="orderInfoList">
                                    <div class="orderInfoLi title">采集时间</div>
                                    <div class="orderInfoLi">2020/12/25 15:03:06</div>
                                </div>
                                <div class="orderInfoListFlex">
                                    <div class="orderInfoList">
                                        <div class="orderInfoLi title">时速</div>
                                        <div class="orderInfoLi">66km/h</div>
                                    </div>
                                    <div class="orderInfoList">
                                        <div class="orderInfoLi title">方向</div>
                                        <div class="orderInfoLi">西北</div>
                                    </div>
                                </div>
                                <div class="orderInfoList">
                                    <div class="orderInfoLi title">里程</div>
                                    <div class="orderInfoLi">45km（9%）</div>
                                </div>
                            </div>
                        </div>
                        <!-- 下拉 -->
                        <div class="containerDrap" @click="orderInfoDrap">
                            <img :src="drapImg" :class="isShowallOrderInfo ? 'drapImg cur' : 'drapImg'" />
                        </div>
                    </div>
                    <!-- 下方操作播放 -->
                    <div class="containerPlayer" v-show="!isLiveTrack">
                        <div class="containerPlayerLi" v-for="(item , index) in (players.filter(item => item.isShow))" :key="index" @click="changePlayer(item)">
                            <img :src="item.src" />
                            <div class="playerTxt">{{item.name}}</div>
                        </div>
                    </div>
                </div>
                <!-- 列表相关 -->
                <div class="containerTable">
                    <div class="containerTable_title">
                        <h3>关联订单</h3>
                        <div class="orderCar" :style="{background:`url(${carIcon}) no-repeat left center`}">
                            京A88888
                        </div>
                    </div>
                    <ComTable ref="dataTable" :table-option="tableOption" :table-data="tableData" :columns="columns" :listQuery="listQuery" showAlwaysShowColumnInCheckbox @getList="getList"
                        :alwaysShowColumnIndexs="[0, 2]" :paging="false" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ComTable from "@/components/PageTable";
import TrackFactory from '@/utils/map';
import carIcon from '@/assets/images/track/carIcon.png';
import person from '@/assets/images/track/person.png';
import drapImg from '@/assets/images/track/drapDown.png';
import reStart from '@/assets/images/track/reStart.png';
import speed from '@/assets/images/track/speed.png';
import start from '@/assets/images/track/start.png';
import timeOut from '@/assets/images/track/timeOut.png';
import carPoint from '@/assets/images/track/carPoint.png';
import carPoto from '@/assets/images/track/car1.png';
import Mock from '@/utils/map/mock';
import Mock2 from '@/utils/map/mock2';
import Mock3 from '@/utils/map/mock3';
import { checkTime } from "@/utils";
import { initSocket } from '@/utils/socket/create';
const players = [
    {
        src: start,
        name: '播放',
        key: 'start',
        isShow: true,
    },
    {
        src: timeOut,
        name: '暂停',
        key: 'timeOut',
        isShow: false,
    },
    {
        src: reStart,
        name: '回放',
        key: 'reStart',
        isShow: true,
    }
]
const onLiveCars = [
    {
        platNum: '京A88888',
        isCur: false
    },
    {
        platNum: '京A88888',
        isCur: false
    },
    {
        platNum: '京A88888',
        isCur: false
    },
    {
        platNum: '京A88888',
        isCur: false
    },
    {
        platNum: '京A88888',
        isCur: false
    }
]
export default {
    name: 'trackSearch',
    components: { ComTable },
    data () {
        return {
            carIcon,
            map: null,
            person,
            drapImg,
            carPoint,
            isShowallOrderInfo: false,//是否完全展示订单信息
            players,
            onLiveCars,//后期换真数据
            isLiveTrack: false,
            isShowCar: false,
            loaddingTrack: false,//轨迹的loadding
            title: '',
            trackMap: null,
            listQuery: {
                pageNo: 1,
                pageSize: 10,
            },
            cloneListQuery: {},
            total: 0,
            tableData: [],
            bidStartTime: {},
            bidEndTime: {},
        }
    },
    methods: {
        checkTime,
        /**免责声明 弹框 */
        statementDialog () {
            if (!window.sessionStorage.getItem('statement')) {
                const dom = `
                <div class="statementFrame">
                    <p>感谢您使用快成轨迹开放平台！</p>
                    <p>快成轨迹开发平台向您提供需付费的高质量车辆轨迹服务，在这里您可以对车辆的实时轨迹和历史轨迹进行跟踪和查看，帮助您通过更快地通过订单找到想要的轨迹，我们还将陆续向您开放车辆定位查询和车辆预警警示等增值性功能。</p>
                    <p>计费规则-实时/历史轨迹：单车每日最多记一次，单车每月最多记10次。</p> 
                    <p>当前价格为试运行版，暂时仅做费用统计，最终定价权归快成物流所有。</p>
                 </div>
               `
                this.$alert(
                    dom,
                    '快成轨迹开放平台法律和收费声明', {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '同意并继续',
                    cancelButtonText: '',
                    confirmButtonClass: 'warning-btn',
                    type: 'warning',
                    center: true
                }).then(() => {
                    window.sessionStorage.setItem('statement', 'statement');
                }).catch(() => {
                    window.sessionStorage.setItem('statement', 'statement');
                })
            }
        },
        /* 处理公共提示 */
        handleCommonTrip (type, message) {
            this.$message.closeAll();
            this.$message({
                type,
                message
            });
        },
        /* 点车牌号 */
        changePlatNum (obj, index) {
            this.onLiveCars.forEach(item => item.isCur = false);
            obj.isCur = true;
            this.players.find(item => item.key == 'start').isShow = true;
            this.players.find(item => item.key == 'timeOut').isShow = false;
            this.statementDialog();
            if (index == 0) {
                //清空实例上的轨迹和小车 恢复初始化状态
                this.trackMap.resetMap();
            } else {
                this.trackMap.resetMap();
                setTimeout(() => {
                    this.trackMap.currentTrack({
                        data: Mock.data.data,
                        isShowCar: true
                    }).catch(err => {
                        this.handleCommonTrip('error', '数据格式不正确，高德地图无法画线');
                    })
                }, 50)
            }
        },
        /* 失去焦点点击事件儿 */
        documentClick (e) {
            let drawer = document.getElementsByClassName('containerplatNum')[0];
            let btn = document.getElementsByClassName('containerplatBtn')[0];
            if (btn.contains(e.target)) return false;
            if (!drawer.contains(e.target)) {
                this.isShowCar = false;
            }
        },
        /* 显示右侧抽屉 */
        showCarPart () {
            this.isShowCar = true;
        },
        /* player 实时轨迹没有 */
        changePlayer (item) {
            switch (item.key) {
                case 'start': //轨迹推送的时候 回放的问题 哎
                    item.isShow = false;
                    this.players.find(item => item.key == 'timeOut').isShow = true;
                    this.trackMap.trackPlay().catch(err => {
                        this.handleCommonTrip('error', err);
                    });
                    break;
                case 'reStart':
                    this.players.find(item => item.key == 'start').isShow = false;
                    this.players.find(item => item.key == 'timeOut').isShow = true;
                    this.trackMap.trackReStart().catch(err => {
                        this.handleCommonTrip('error', err);
                    });
                    break;
                case 'timeOut':
                    item.isShow = false;
                    this.players.find(item => item.key == 'start').isShow = true;
                    this.trackMap.trackTimeOut().catch(err => {
                        this.handleCommonTrip('error', err);
                    });
                    break;
                default:
                    return;
            }
        },
        /* 点击订单信息下拉 */
        orderInfoDrap () {
            this.isShowallOrderInfo = !this.isShowallOrderInfo;
        },
        /* 重置 */
        resetForm () {
            this.handleTimeFn(["bidStartTime", "bidEndTime"]);
            this.listQuery = { ...this.cloneListQuery };
        },
        /* 处理过多时间 */
        handleTimeFn (arr) {
            arr.forEach((item) => {
                this[item] = {
                    disabledDate (time) {
                        return "";
                    },
                    selectableRange: "00:00:00 - 23:59:59",
                };
            });
        },
        /* 查询校验 */
        checkSubForm () {
            const {
                orderNo,
                bidEndTime,
                bidStartTime,
                plateNumber
            } = this.listQuery;
            let obj = {
                orderNo,
                bidEndTime,
                bidStartTime,
                plateNumber
            };
            const flag = Object.keys(obj).some(key => obj[key]);
            if (!flag) {
                this.handleCommonTrip('error', '请输入订单号或车牌号');
            }
            if (!orderNo && !plateNumber) {
                this.handleCommonTrip('error', '请输入订单号或车牌号');
                return false;
            }
            if (plateNumber && !bidEndTime && !bidStartTime) {
                this.handleCommonTrip('error', '请选择查询时间');
                return false;
            }
            return true;
        },
        /* 查询按钮提交 */
        submitForm (formName) {
            if (this.checkSubForm()) {
                console.log(this.listQuery);
                this.listQuery.pageNo = 1;
                let params = this.listQuery;
            }
        },
        //模拟推送按钮
        mockBtn () { //currentTrack
            this.trackMap.drawHisTory({
                data: Mock2.data.data,
                isShowCar: true
            }).catch(err => {
                this.handleCommonTrip('error', '数据格式不正确，高德地图无法画线');
            })
        },
        //模拟推送2
        mockBtn2 () {
            this.trackMap.drawHisTory({
                data: Mock3.data.data,
                isShowCar: true
            }).catch(err => {
                this.handleCommonTrip('error', '数据格式不正确，高德地图无法画线');
            })
        },
        getList () {
            this.$nextTick(() => {
                if (this.$refs.dataTable) {
                    let res = {
                        rows: this.tableData,
                        pageNo: 1,
                        pageSize: 20,
                        totalPages: 36,
                        totalRecords: 360
                    };
                    this.$refs.dataTable.callback(res);
                }
            })
        },
        //初始化地图
        initMap () {
            return new Promise((resolve, reject) => {
                this.trackMap = new TrackFactory({
                    el: 'container',
                    key: '3f2bb47cfc78749f63ea7dd866d15d7f',
                    carPoto,
                    isReDress: true,
                    initCreated: (map) => {
                        this.map = map;
                        resolve();
                        //你可以在地图加载完就画线并且在数据加载完成后 
                    },
                    initError: (err) => {
                        reject(err);
                    },
                });
            })
        }
    },
    created () {
        this.cloneListQuery = { ...this.listQuery };
        this.title = this.$route.name;
        this.columns = [
            {
                label: "日期",
                param: "plateNumber",
                isShowTooltip: true,
                align: "left",
                width: "140px",
            },
            {
                label: "订单号",
                param: "deliverAddressName",
                isShowTooltip: true,
                align: "left",
                width: "260px",
            },
            {
                label: "装车地/卸车地",
                param: "takeAddressName",
                isShowTooltip: true,
                align: "left",
                width: "300px",
            },
            {
                label: "装车时间",
                isShowTooltip: true,
                param: "typeName",
                align: "left",
                width: "140px",
            },
            {
                label: "卸车时间",
                param: "bidAllCount",
                align: "left",
                width: "140px",
            },
            {
                label: "状态",
                param: "statusName",
                align: "left",
                width: "120px",
                formatData: function (val) {
                    return val;
                },
                render: (h, params) => {
                    return h(
                        "span",
                        {
                            class: {
                                "column-success": params.row.statusName == "已完成",
                                "column-info": params.row.statusName != "已完成",
                            },
                        },
                        params.row.statusName
                    );
                },
            },
        ];
        this.$nextTick(async () => {
            this.loaddingTrack = true;
            await this.initMap().catch(err => {
                this.handleCommonTrip('error', '高德地图加载失败');
            });
            this.loaddingTrack = false;
            //模拟接口 change
            setTimeout(() => {
                //可以传参数 writeError 也可以去catch
                this.trackMap.drawHisTory({
                    data: Mock.data.data,
                    isShowCar: true //实时轨迹 是false 轨迹回放是true
                }).catch(err => {
                    console.log(err);
                    this.handleCommonTrip('error', '数据格式不正确，高德地图无法画线');
                })
            }, 10)
        });
        initSocket().then(res => {
            console.log(res);
        })
    },
    computed: {
        tableOption () {
            // 操作按钮配置对象
            return {
                label: "操作",
                width: "80px",
                minWidth: this.minWidth,
                size: "mini",
                plain: true,
                fixed: "right",
                options: [
                    {
                        label: "查看",
                        type: "primary",
                        event: this.lineHandle,
                        isShow: item => {
                            //是否显示
                            return true;
                        }
                    },
                ]
            };
        }
    },
    mounted () {
        document.addEventListener('click', (e) => this.documentClick(e));
    },
    beforeDestroy () {
        document.removeEventListener('click', (e) => this.documentClick(e));
        this.trackMap.mapDestroy();
    }
}
</script>
<style>
.statementFrame {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}
.statementFrame p {
    width: 100%;
    color: #222;
    text-align: left;
    font-size: 14px;
}
.warning-btn {
    width: 100%;
    height: 34px;
}
</style>
<style lang='scss' scoped>
.containerplatNum {
    position: absolute;
    top: 0;
    right: 0;
    width: 374px;
    background-color: #fff;
    z-index: 200;
    transition: all 0.7s;
    .containerplatNumHead {
        height: 70px;
        display: flex;
        padding: 0 32px;
        justify-content: space-between;
        align-items: center;
        .title {
            color: #202224;
            font-size: 18px;
        }
        .img {
            width: 16px;
            height: 16px;
            transform: rotate(0);
        }
        .img.cur {
            transform: rotate(90deg);
        }
    }
    .containerplatNumCont {
        border-top: 1px solid #e0e0e0;
        height: calc(100vh - 70px);
        overflow-x: hidden;
        overflow-y: auto;
        .container {
            padding: 38px 32px 0 32px;
            box-sizing: border-box;
            .list {
                height: 48px;
                line-height: 48px;
                padding-left: 24px;
                color: #222222;
                font-size: 16px;
                margin-bottom: 19px;
                cursor: pointer;
            }
            .list.cur {
                color: #2e53eb;
                background: rgba(0, 0, 255, 0.15);
                border-radius: 8px;
            }
        }
    }
}
.map-container {
    position: relative;
    overflow-x: hidden;
    .containerplatBtn {
        position: absolute;
        top: 0;
        right: 0;
        background-color: #fff;
        z-index: 199;
        padding: 0 16px;
        height: 40px;
        background: #fafbfd;
        border-radius: 12px;
        border: 1px solid #d5d5d5;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        .title {
            color: #202224;
            font-size: 14px;
            padding-left: 15px;
        }
        .img {
            width: 14px;
            height: 14px;
        }
    }
    #container {
        margin-top: 16px;
        width: 100%;
        min-width: 600px;
        min-height: 650px;
        height: 650px;
        position: relative;
        .containerorder {
            background-color: #fff;
            position: absolute;
            left: 0;
            top: 0;
            width: 290px;
            z-index: 199;
            cursor: default;
            .containerorderBox {
                border-bottom: 1px solid #e0e0e0;
                .containerorderList {
                    padding: 0 17px 15px 17px;
                    display: flex;
                    align-items: center;
                    .carIcon {
                        width: 25px;
                        height: 24px;
                    }
                    .person {
                        width: 25px;
                        height: 24px;
                    }
                    .containerorderNotice {
                        padding-left: 5px;
                        font-size: 16px;
                        color: #222;
                        font-weight: 700;
                    }
                }
                .containerorderList:first-child {
                    padding-top: 17px;
                }
            }
            .containerorderInfo {
                transition: all 0.6s;
                height: 100%;
                overflow: hidden;
                .orderInfoFrame {
                    padding: 15px 15px 0 15px;
                    overflow-x: hidden;
                    overflow-y: auto;
                    .orderInfoListFlex {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        .orderInfoList {
                            flex: 1;
                        }
                    }
                    .orderInfoList {
                        padding-bottom: 15px;
                        .orderInfoLi {
                            font-size: 14px;
                            color: #2e384d;
                        }
                        .orderInfoLi.title {
                            color: #222;
                            font-size: 12px;
                            padding-bottom: 9px;
                        }
                    }
                }
            }
            .containerDrap {
                cursor: pointer;
                background-color: #fff;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                .drapImg {
                    width: 17px;
                    height: 16px;
                    transform: rotate(0deg);
                    transition: all 0.6s;
                }
                .drapImg.cur {
                    transform: rotate(180deg);
                }
            }
        }
        .containerPlayer {
            width: 300px;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translate(-50%);
            height: 64px;
            background-color: #fff;
            z-index: 199;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: default;
            .containerPlayerLi {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                .playerTxt {
                    color: #202224;
                    font-size: 12px;
                    margin-top: 4px;
                }
            }
        }
    }
    .hide {
        opacity: 0;
    }
    .containerTable {
        margin-top: 24px;
        padding: 0 32px 32px 32px;
        background-color: #fff;
    }
    .containerTable_title {
        padding: 24px 0;
        display: flex;
        align-items: center;
        flex-direction: row;
        .orderCar {
            margin-left: 50px;
            padding-left: 30px;
            font-size: 16px;
            color: #222;
            font-weight: 700;
        }
    }
}
</style>