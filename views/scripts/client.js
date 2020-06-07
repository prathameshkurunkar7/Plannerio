
const publicVapidKey = 'BCNtuvG5chLTqMhxFqoEG5vslXNH1vOcXva9xVoe7Mm0UGCghfqgldFH-peeiE6rn7vS24a-0Qc4tJe_s6z5GFU';

//check for service worker
if('serviceWorker' in navigator){
    send().catch(err =>console.log(err));
}
//Register ServiceWorker,Register Push,Send Push
async function send() {
    //register serviceworker
    const register = await navigator.serviceWorker.register('/worker.js',{
        scope:'/user',
    });
    //register push
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly:true,
        applicationServerKey:urlBase64ToUint8Array(publicVapidKey),
    });
    //send push notification
    await fetch('/user/subscribe',{
        method:'POST',
        body:JSON.stringify(subscription),
        headers:{
            'content-type':'application/json'
        }
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }