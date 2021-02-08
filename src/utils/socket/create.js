function createSocketStomp () {
    return new Promise((res, rej) => {
        const url = 'https://cdn.bootcss.com/stomp.js/2.3.3/stomp.min.js';
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.async = true;
        script.onerror = rej;
        document.head.appendChild(script);
        script.onload = () => {
            res();
        }
    })
}
function createSocketClient () {
    return new Promise((res, rej) => {
        const url = 'https://cdn.bootcss.com/sockjs-client/1.1.4/sockjs.min.js';
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.async = true;
        script.onerror = rej;
        document.head.appendChild(script);
        script.onload = () => {
            res();
        }
    })
}
export async function initSocket(){
    try{
      await createSocketStomp();
      await createSocketClient();
      return new Promise((resolve, reject) => {
          resolve([window.SockJS,window.Stomp])
      })
    }catch(err){
      console.error(err);
    }
}