/**  整除的问题 -- 完成 前端进行500分页 后端进行多渲染 解放后端 
 * 续上的问题 ---这个最好是后端追加点 前端不是很好处理 后端处理更简单一些
 * 边画边渲染的问题 ---完成 同步纠偏 画线 渲染
 * 已完成的订单 是从开始到结尾的 待送达的是从结尾到开头 
 * 推送的时候 看下分页这块儿
 * 
 * 数据的初始化状态包括以下几点
 * 历史轨迹
 * 小车定位 
 * 轨迹纠偏 是否纠偏
 * 
 */
/**
 * props ==>{
 *   data -- 轨迹的数据源 Array
 *   AMap -- 高德地图构造函数 Fn
 *   isReDress --是否进行轨迹纠偏 Boolean
 *   writeError --实例化画线方法失败 callBack
 *   map ---当前地图的实例对象
 *   carPoto -- 小车车的图标
 *   isRealTime --是否画线
 *   isShowCar --是否显示小车以及定位
 *   strokeObj --线的样式一坨
 * }
 * __proto__ ==>{
 *    addPoint -- 添加轨迹点 并且进行纠偏 纠偏完成后没必要返回
 *    searchLoopMarker --查询当前小车实例是否已经加载 这玩意儿牵扯太多
 * }
 */
export default class WriteHistoryLine {
    constructor(props) {
        this.props = { ...props };
        this.historyBeforeRedress = []; //纠偏前的数据处理
        this.historyAfterRedress = [];//纠偏后的数据处理 难过
        this.deepNum = 0;//轮询的次数
        this.renderPageNo = 1;//画线的第几页 相当于500一页 不用find这种方法 因为不能因为循环影响了性能
        this.currentMarkerBox = null;//小车的实例
        this._init();
    }
    //纠偏前的数据处理 需要额外解析deepNum
    _renderDeepNum (data = this.props.data, count_ = 0) {
        if (data.length > 500) {
            if (data.length % 500 == 0) {
                this.deepNum = data.length / 500 + count_;
            } else {
                this.deepNum = Math.ceil(data.length / 500) + count_;
            }
        } else {
            this.deepNum = count_ + 1 || 1;
        }
    }
    _init () {
        if (!this.props.AMap || !this.props.data) {
            this.props.writeError && this.props.writeError();
        } else {
            //进行轨迹纠偏
            if (this.props.isReDress) {
                this._renderDeepNum();
                this._reduceHistoryData({ data: this.props.data });
            } else {
                //不需要纠偏 直接跑车
                // this._drawLine(graspRoadArr).then(res => {
                //     let beginPosition = this.historyBeforeRedress[0][1];//历史轨迹是初始点
                //     beginPosition = beginPosition[0];
                //     this._drawCar([beginPosition.x, beginPosition.y], beginPosition.ag);
                //     // this.props.map.setFitView();
                //     this.props.map.setZoomAndCenter(14, [beginPosition.x, beginPosition.y]);
                // }).catch(err => {
                //     console.error(err);
                // });
            }
        }
    }
    /**
     * 将数据进行隔断渲染 最终渲染结果为
     * {
     *   1：[{
     *       "x": item.lon *1,
             "y": item.lat *1,
             "ag": item.agl *1,
             "sp": item.spd *1,
             "tm": tm
     *   }],
         2:[...]
     * }
     */
    _reduceHistoryData ({ data = [], count_ = 0, isAddLine = false }) {//记录一下当前循环的次数与递归是否匹配
        let count = 0;
        let currentCount = 0;
        let preTime, curTime, tm;
        let arr = []; //historyBeforeRedress
        const callBack = () => {
            for (let i = currentCount; i < currentCount + 500; i++) {
                if (i > data.length - 1) {
                    break;
                } else {
                    let item = data[i];
                    curTime = new Date(item.utc);
                    if (i == 0) {
                        tm = 1478031031; //初试时间 1970-
                    } else {
                        preTime = !preTime ? new Date(data[i - 1].utc) : preTime;
                        tm = Math.round(curTime.getTime() / 1000) - Math.round(preTime.getTime() / 1000);
                    }
                    arr.push({
                        x: Number(item.lon),
                        y: Number(item.lat),
                        ag: Number(item.agl),
                        sp: Number(item.spd),
                        tm
                    });
                    preTime = curTime;
                }

            }
            count += 1;
            if (arr.length > data.length) {
                return;
            } else {
                if (count <= this.deepNum) {
                    currentCount += 500;
                    callBack();
                } else {
                    if (!isAddLine) {
                        for (let k = 0; k < this.deepNum; k++) {
                            this.historyBeforeRedress.push({
                                [k + 1]: arr.slice(k * 500, k * 500 + 500),
                            });
                        }
                    } else {
                        for (let k = 0; k < (this.deepNum - count_); k++) {
                            this.historyBeforeRedress.push({
                                [k + count_ + 1]: arr.slice(k * 500, k * 500 + 500),
                            });
                        }
                    }
                    this._reDressLine(count_);//纠偏
                }
            }
        }
        callBack();
    }
    //纠偏 500个点的高德纠偏
    async _reDressLine (filterNumber) {
        console.log(this.historyBeforeRedress);
        //画全部的轨迹 先注释掉
        // let historyBeforeRedress = this.historyBeforeRedress;
        // this.renderPageNo = 1;
        //画全部的轨迹 先注释掉
        let historyBeforeRedress = this.historyBeforeRedress.filter((item, index) => {
            return index + 1 > filterNumber; //画线优化 每次都把上一次最后一个500条目的轨迹进行纠偏 这样可以连上了 就大于等于 目前应该不用 不想多画线
        });
        // this.renderPageNo = filterNumber || this.renderPageNo;
        //默认数据是CRM的数据源 所以解析的话 还是递归 处理 Promise
        for (let i = 0; i < historyBeforeRedress.length; i++) {
            let item = historyBeforeRedress[i];
            if (this.deepNum >= this.renderPageNo) { //大于的时候才会画图 这块纠偏一次就加一次能对得上
                //可能会有几百个点都是同一个点的情况 这种情况需要下一版优化
                let graspRoadArr = await this._reDressGraspRoad(item[this.renderPageNo]).catch(errItem => {
                    console.error(errItem);
                });
                this.historyAfterRedress.push({
                    [this.renderPageNo]: graspRoadArr
                });
                this.renderPageNo += 1;
                //画线方法复用 
                if(!this.props.isRealTime){
                    await this._drawLine(graspRoadArr).catch(err => {
                        console.error(err);
                    });
                    //业务争议
                    // this.props.map.setFitView();
                }
            }
        }
        //可以优化一下 因为不能有空数组的 就可以重新纠偏一下 然后把数组赋值 链接一下
        !filterNumber && this.props.isShowCar && this._renderCarLine();


    } //整除的问题 续上的问题 边画边渲染的问题

    //(画小车)处理纠偏完之后的数据 有可能前几页都没有数据的情况 都得考虑一下小车的感受 
    _renderCarLine () {
        //数据格式为 [ {1:[500个点]},{2:[500个点]}
        let beginPosition = null;
        for (let i = 0; i < this.historyAfterRedress.length; i++) {
            let item = this.historyAfterRedress[i];
            if (item[i + 1].length > 0) {
                beginPosition = item[i + 1][0];
                break;
            }
        }
        if (beginPosition) {
            this._drawCar([beginPosition.x, beginPosition.y]);
            // this.props.map.setFitView();
            this.props.map.setZoomAndCenter(20, [beginPosition.x, beginPosition.y]);
            // console.log(this.historyAfterRedress);
        }
    }
    //处理纠偏的方法
    _reDressGraspRoad (redressArr) {
        return new Promise((resolve, reject) => {
            this.props.AMap.plugin("AMap.GraspRoad", () => {
                const grasp = new this.props.AMap.GraspRoad();
                grasp.driving(redressArr, (error, result) => {
                    if (error) {
                        resolve([]);
                        // reject(redressArr[0]); 后期优化
                    } else {
                        // console.log(result.data.points);
                        resolve(result.data.points);
                    }
                });
            });
        })
    }
    //画线~~ 纠完偏就画线
    _drawLine (polyPath) {
        let path = [];
        polyPath.forEach(item => {
            path.push([item.x, item.y])
        });
        let strokeObj = this.props.strokeObj || {
            strokeColor: "#28F", //线颜色
            strokeOpacity: 0.8,       //线透明度
            strokeWeight: 5,        //线宽
            strokeStyle: "solid",   //线样式
            lineJoin: "round",
            zIndex: 60,
            strokeDasharray: [10, 5] //补充线样式
        }
        return new Promise((res, rej) => {
            let polyline = new this.props.AMap.Polyline({
                path,          //设置线覆盖物路径
                ...strokeObj,
            });
            polyline.setMap(this.props.map);
            // console.log('完成')
            res();
        })
    }
    //画小车 开小车
    _drawCar (position, agl) {
        let icon = new this.props.AMap.Icon({
            image: this.props.carPoto,
            size: [100, 50],
            imageSize: new this.props.AMap.Size(100, 50)
        });
        if (this.currentMarkerBox) {
            this.currentMarkerBox.setMap(null);
            this.currentMarkerBox = null;
        }
        let angle = agl ? Number(agl) - 90 : 0;
        this.currentMarkerBox = new this.props.AMap.Marker({
            icon,
            autoRotation: true,
            angle,
            offset: new this.props.AMap.Pixel(-20, -26),
            position,

        });
        this.currentMarkerBox.setMap(this.props.map);

    }
    //添加轨迹点并且进行轨迹纠偏
    addPoint (data, count_) {
        return new Promise((resolve, reject) => {  
            this._searchLoopRenderNum(()=>{
                    this._renderDeepNum(data, count_);
                    this._reduceHistoryData({ data, count_, isAddLine: true });
                    // setTimeout(() => {
                    //     console.log(this.historyAfterRedress);
                        
                    // }, 500);
                    resolve(this.historyAfterRedress);
                })
        })
    }
    //轮询一下吧还是
    _searchLoopRenderNum(callback){
        if(this.deepNum == this.renderPageNo){
            callback();
        }else{
           setTimeout(()=>{
              this._searchLoopRenderNum(callback);
           },300) 
        }
    }
    //轮询一下吧还是 查询当前是否有Marker类 小车的实例 哎
    searchLoopMarker(callback){
        if(this.currentMarkerBox){
            callback();
        }else{
           setTimeout(()=>{
              this.searchLoopMarker(callback);
           },300) 
        }
    }
}