import { initSocket } from './create';
export async function socketInstance (timeStamp, errorCallBack = () => { }) {
   // await initSocket();
   // const socket = new window.SockJS(`https://pfshippertest.bjkcwl.com/webSocket`);
   // const stompClient = Stomp.over(socket);
   // return new Promise((resolve, reject) => {
   //    stompClient.connect({
   //       token: window.sessionStorage.getItem('brokerwT'), // 携带客户端信息
   //       timeStamp
   //    }, () => { //成功
   //       stompClient.debug = null;
   //       resolve(stompClient);
   //    }, (e) => {
   //       console.log(e);
   //       errorCallBack();
   //       reject('连接失败！')
   //    })
   // })
   /** testing */ //wss://pfshippertest.bjkcwl.com/webSocket
   //wss://373r7558u9.qicp.vip:48667/webSocket 磊哥测试
   const ws = new WebSocket(`wss://pfshippertest.bjkcwl.com/webSocket`);
   ws.onopen = function (evt) {
      console.log("Connection open ...");
      ws.send("Hello WebSockets!");
   };

   ws.onmessage = function (evt) {
      console.log(evt.data)
      console.log("Received Message: " + evt.data);
      ws.close();
   };

   ws.onclose = function (evt) {
      console.log("Connection closed.");
   };
   return new Promise((resolve, reject) => {
      resolve(ws);
   })
};