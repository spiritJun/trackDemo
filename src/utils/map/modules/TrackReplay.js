/**
 * 轨迹回放或者播放功能
 * 轨迹动画类
 * props ==>{
 *   map -- 当前地图的实例
 *   AMap --高德地图的构造函数
 *   historyLineInstance --轨迹的实例对象需要传参 继承初始化轨迹实例没有意义
 *   isRealTime --是否是实时轨迹 如果是的话 需要把画线方法放开以及动态画线等等 
 *   strokeObj --线的样式一坨
 * }
 * __proto__ ==>{
 *    reStartAnimation --重新播放轨迹回放
 *    addRedressRunning --轨迹新增之后调用方法 判断小车是否在跑 如果在跑就特殊处理
 * }
 */
export default class TrackReplay {
    constructor(props) {
        this.props = { ...props };
        // console.log(this.props);
        this.FatherInstance = this.props.historyLineInstance;//取自WriteHistoryLine类
        this.currentMarkerBox = this.FatherInstance.currentMarkerBox;
        this.renderPageNo = 0;//默认从1开始跑车 跟父类的deepNum 相对应 这样数据就可以对的上了
        this.isCarDrivingEnd = false;//默认小车是非静止状态
        this.passedPolyline = null;
        this._init();//使用监听的方法实现轨迹回放和实时轨迹
    }
    _init () {
        let initRuningArr = this._parseLine(this.FatherInstance.historyAfterRedress);
        this._renderLineAndAnimate(initRuningArr);
    }
    _initPolyLine(){
        let strokeObj = this.props.strokeObj || {
            strokeColor: "#28F", //线颜色
            strokeOpacity: 0.8,       //线透明度
            strokeWeight: 5,        //线宽
            strokeStyle: "solid",   //线样式
            lineJoin: "round",
            zIndex: 70,
            strokeDasharray: [10, 5] //补充线样式
        }
        this.passedPolyline = new this.props.AMap.Polyline({
            map: this.props.map,
            ...strokeObj
        });
    }
    //每次推送或者初始化有轨迹之后的渲染
    _renderLineAndAnimate (runingArr) {
        //先取到纠偏完的数据 每次先从父类里取数据 并且记录当前的滑动的数据 
       this.props.isRealTime && this._initPolyLine();
        this.currentMarkerBox.on('moving', (e) => {
            if(this.isCarDrivingEnd) this.isCarDrivingEnd = false;  
            // this.props.map.setFitView();
            this.props.isRealTime && this.passedPolyline.setPath(e.passedPath);
        });
        //这个才是真真正正的结束完事儿后的事件儿啊
        this.currentMarkerBox.on('movealong', (e) => { //明天问下吧还是
            this.isCarDrivingEnd = true;
            this._commonRunningFn();
        });
        this.currentMarkerBox.moveAlong(runingArr,60);
    }
    //处理公共方法
    _commonRunningFn(){
        let addRedressArr = this.FatherInstance.historyAfterRedress.filter((item, index,arr) => {
            console.log(this.renderPageNo)
            return index + 1 > this.renderPageNo;
        });
        if(addRedressArr.length > 0){
            this.props.isRealTime && this._initPolyLine();
            let addRedressLines = this._parseLine(addRedressArr);
            setTimeout(() => {
                this.currentMarkerBox.moveAlong(addRedressLines,60);
            }, 100)
        }
    }
    //新增了轨迹之后都调一下此方法
    addRedressRunning () {
        //如果小车没在跑的话 就特殊处理一下
        console.log(this.isCarDrivingEnd);
        if(this.isCarDrivingEnd){
            this._commonRunningFn(); 
        }
        
    }
    //重新播放轨迹回放
    reStartAnimation () {
        this.renderPageNo = 0;
        // this.passedPolyline.setOptions({strokeColor:"#28F"})
        // this.passedPolyline.setPath(new Array());
        this.currentMarkerBox.moveAlong(this._parseLine(this.FatherInstance.historyAfterRedress),60);
        // setTimeout(()=>{
        //     this.currentMarkerBox.moveAlong(this._parseLine(this.FatherInstance.historyAfterRedress),60);
        // },500)
    }
    /* 
      特殊处理一下纠偏后的轨迹这块儿 因为moveAlone要的数据格式是 [[116.478935,39.997761]] 
      但是纠偏完的数据格式是[{1:[{x,y} 500条]}] 
    */
    _parseLine (historyAfterRedress = []) {
        let arr = [];
        for (let i = 0; i < historyAfterRedress.length; i++) {
            let item = historyAfterRedress[i][this.renderPageNo + 1];
            this.renderPageNo += 1;
            if (item.length) {
                for (let k = 0; k < item.length; k++) {
                    arr.push([item[k].x, item[k].y])
                }
            } else {
                continue;
            }
        }
        return arr;
    }
}