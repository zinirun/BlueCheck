console.log('Im service worker');

self.addEventListener('push',(event)=>{
    console.log('push message',event);
    
    var title='push!';
    event.waitUntil(
        self.registration.showNotification(title,{
            body:'a message',
            tag:'my tag'
        }));
});