import {
    InitMap,
    WriteHistoryLine,
    TrackReplay,
} from './install';
// import InitMap from './modules/InitMap';
// import WriteHistoryLine from './modules/WriteHistoryLine';
// import TrackReplay from './modules/TrackReplay';
/**
 * 工厂类 
 *   初始化地图类 --InitMap
 *   绘制历史轨迹类 --WriteHistoryLine
 *   轨迹回放类 --TrackReplay 
 * props ==> {
 *    el -- 绑定的元素 必填选项
 *    key --url的唯一秘钥
 *    initCreated --callBack 实例加载成功的回调 
 *    initError --callBack 实例加载失败的回调
 *    carPoto --小车的图片
*     isReDress --是否进行轨迹纠偏
 * }
 * __proto__ ==>{
 *    mapDestroy --callback 地图实例销毁 
 *    drawHisTory --callback 高德地图画线
 *    trackPlay --callback 高德地图轨迹动画
 *    resetMap --callback 重置地图 恢复初始化状态 定位到皇宫
 *    getRunningState --callback 获取当前小车状态 停止或者开跑 
 *    currentTrack --callback实时轨迹开始
 *    carDrivingEnd --callback小车是否已经停止了
 *    locationToAddress --callback将经纬度反编译成地址 
 * }
 */
export default class TrackFactory {
    constructor(props) {
        this.props = { ...props };
        this.map = null;//地图实例
        this.drawLineInstance = null;//画线实例
        this.trackPlayInstance = null;//轨迹播放实例对象
        this.RealTimeTrack = null;//实时轨迹播放实例对象
        this.realTimeDrawLine = null;//实时轨迹画线实例对象
        this.isStopRuning = false;//默认没有点暂停
        if (!this.props.el) {
            this.props.initError && this.props.initError('参数不正确，缺少必要的挂载元素');
            return false;
        } else {
            this._init();
        }
    }
    async _init () {
        try {
            const { el, key } = this.props;
            const map = new InitMap({ el, key });
            this.map = await map._initMap().catch(err => {
                this.props.initError && this.props.initError(err);
            });
            this.props.initCreated && this.props.initCreated(this.map);
        } catch (err) {
            this.props.initError && this.props.initError(err);
        }
    }
    mapDestroy () {
        //地图实例销毁 
        this.map.destroy();
    }
    //画线吧 小伙儿 //默认是轨迹回放 是true
    drawHisTory ({ data = null, writeError = () => { }, isShowCar = true }) {
        if (!this.drawLineInstance) {
            return new Promise((resolve, reject) => {
                this.drawLineInstance = new WriteHistoryLine({
                    map: this.map,
                    carPoto: this.props.carPoto,
                    data,
                    isRealTime: false,
                    isShowCar,
                    strokeObj: this.props.strokeObj,
                    isReDress: this.props.isReDress,
                    AMap: window.AMap,
                    writeError: (err) => {
                        writeError(err);
                        reject();
                    }
                });
                resolve();
            })
        } else {
            //追加的逻辑 可以调这个实例的其他方法 this.drawLineInstance.xxxx 这样就解耦了 舒服
            if (!isShowCar) { //如果是动态轨迹的话
                return new Promise((resolve, reject) => {
                    this.drawLineInstance.addPoint(data, this.drawLineInstance.deepNum).then(res => {
                        this.trackPlayInstance && this.trackPlayInstance.addRedressRunning();//追加了点之后需要监听一下小车是否移动
                        resolve(res);
                    })
                })
            } else {
                return new Promise((resolve, reject) => {
                    this.drawLineInstance.addPoint(data, this.drawLineInstance.deepNum).then(res => {
                        //如果没有停车的话 有推送就跑车
                        if (!this.isStopRuning) {
                            this.trackPlayInstance && this.trackPlayInstance.addRedressRunning();//追加了点之后需要监听一下小车是否移动
                        }
                        resolve(res);
                    })
                })
            }
        }
    }
    //轨迹回放动画开始
    trackPlay (playerr = () => { }) {
        return new Promise((resolve, reject) => {
            if (this.drawLineInstance) {
                if (!this.trackPlayInstance) {
                    this.trackPlayInstance = new TrackReplay({
                        AMap: window.AMap,
                        map: this.map,
                        strokeObj: this.props.strokeObj,
                        historyLineInstance: this.drawLineInstance,
                        isRealTime: false
                    })
                }
                setTimeout(() => {
                    if (!this.trackPlayInstance.isCarDrivingEnd) {
                        this.trackPlayInstance.currentMarkerBox.resumeMove();
                    } else {
                        this.isStopRuning = false;
                        this.trackPlayInstance && this.trackPlayInstance.addRedressRunning();//追加了点之后需要监听一下小车是否移动
                    }
                }, 50)
                resolve();
            } else {
                playerr('当前没有轨迹需要播放！');
                reject('当前没有轨迹需要播放！');
            }
        })
    }
    //轨迹回放暂停
    trackTimeOut (playerr = () => { }) {
        this.isStopRuning = true;
        return new Promise((resolve, reject) => {
            if (this.drawLineInstance) {
                this.trackPlayInstance.currentMarkerBox.pauseMove();
                // this.trackPlayInstance.isCarDrivingEnd = true;
                // console.log(this.trackPlayInstance)
                resolve();
            } else {
                playerr('当前没有轨迹需要播放！');
                reject('当前没有轨迹需要播放！');
            }
        })
    }
    //轨迹重新播放
    trackReStart (playerr = () => { }) {
        this.isStopRuning = false;
        return new Promise((resolve, reject) => {
            if (this.drawLineInstance) {
                if (!this.trackPlayInstance) {
                    this.trackPlayInstance = new TrackReplay({
                        AMap: window.AMap,
                        map: this.map,
                        strokeObj: this.props.strokeObj,
                        historyLineInstance: this.drawLineInstance,
                        isRealTime: false
                    });
                }
                this.trackPlayInstance.reStartAnimation();
                // this.trackPlayInstance.addRedressRunning();//追加了点之后需要监听一下小车是否移动
                // console.log(this.trackPlayInstance)
                resolve();
            } else {
                playerr('当前没有轨迹需要播放！');
                reject('当前没有轨迹需要播放！');
            }
        })
    }
    //地图清除轨迹和小车等等一切的一切 恢复初始化状态 地图不要给干掉哦~
    resetMap () {
        // this.drawLineInstance = null;
        // this.trackPlayInstance = null;
        this.drawLineInstance = null;//画线实例
        this.trackPlayInstance = null;//轨迹播放实例对象
        this.RealTimeTrack = null;//实时轨迹播放实例对象
        this.realTimeDrawLine = null;//实时轨迹画线实例对象
        this.isStopRuning = false;//默认没有点暂停
        this.map.clearMap();
        this.map.setZoomAndCenter(14, [116.397428, 39.90923]);//默认定位到皇宫
    }
    //判断小车是否跑完了 然后将状态抛出去(必须有个结束的标识 去判断这个去)
    getRunningState () {
        if (!this.trackPlayInstance) {
            console.error('没有小车实例，无法查询小车是否正在移动！');
        } else {
            return this.trackPlayInstance.isCarDrivingEnd;
        }
    }
    //实时轨迹开始方法
    currentTrack ({ data = [], errorFn = () => { }, isShowCar = true }) {
        return new Promise((resolve, reject) => {
            if (!data.length) {
                errorFn('实时轨迹数据不能为空！');
                reject('实时轨迹数据不能为空！');
            } else {
                if (!this.realTimeDrawLine) {
                    this.realTimeDrawLine = new WriteHistoryLine({
                        map: this.map,
                        carPoto: this.props.carPoto,
                        data,
                        strokeObj: this.props.strokeObj,
                        isRealTime: true,
                        isShowCar,
                        isReDress: this.props.isReDress,
                        AMap: window.AMap,
                        writeError: (err) => {
                            writeError(err);
                            reject(err);
                        }
                    });
                }
                if (!this.RealTimeTrack) {
                    this.realTimeDrawLine.searchLoopMarker(() => {
                        this.RealTimeTrack = new TrackReplay({
                            AMap: window.AMap,
                            map: this.map,
                            strokeObj: this.props.strokeObj,
                            historyLineInstance: this.realTimeDrawLine,
                            isRealTime: true
                        });
                        resolve();
                    })
                    // setTimeout(()=>{
                    //     this.RealTimeTrack = new TrackReplay({
                    //         AMap: window.AMap,
                    //         map: this.map,
                    //         historyLineInstance: this.realTimeDrawLine,
                    //         isRealTime:true
                    //     });
                    //     resolve();
                    // },800)
                } else {
                    //轨迹点的追加
                    this.realTimeDrawLine.addPoint(data, this.realTimeDrawLine.deepNum).then(res => {
                        this.RealTimeTrack.addRedressRunning();//追加了点之后需要监听一下小车是否移动
                        resolve(res);
                    })
                }
            }
        })
    }
    //小车是否已经停止了 抛出去的方法
    carDrivingEnd (callback) {
        if (this.trackPlayInstance) {
            if (!this.trackPlayInstance.isCarDrivingEnd) {
                setTimeout(() => {
                    this.carDrivingEnd(callback)
                }, 1500);
            } else {
                callback();
            }
        }
    }
    //将经纬度反编译成地址
    locationToAddress (lnglatArr) {
        return new Promise((res, rej) => {
            window.AMap.plugin('AMap.Geocoder', () => {
                let geocoder = new window.AMap.Geocoder();
                //    console.log(lnglatArr)
                geocoder.getAddress(lnglatArr, (status, result) => {
                    if (status === 'complete' && result.regeocode && result.info === 'OK') {
                        let address = result.regeocode.formattedAddress;
                        res(address);
                    } else {
                        rej('根据经纬度查询地址失败');
                    }
                })
            })
        })
    }
}