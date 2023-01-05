1.  .gitignore - add .env
    .env => .env.example

2.  socket in
    server.on('clientError',(error, socket)=>{
    socket.end('400 Bad request')})

3.  check if workers at 4001, 4002... are online

4.  on SIGNSL - terminate all workers & DB

balancer (hhtp request)
-> router (message)
-> app (message)
-> DBservice (message)
-> app (message)
-> router (http response)
-> balancer
