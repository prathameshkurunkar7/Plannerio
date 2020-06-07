self.addEventListener('push',e=>{
    const data = e.data.json();
    //push received
    self.registration.showNotification(data.title,{
        body:`Hey! ${data.name} Make Sure you Complete your Task`,
    });
})