2.  socket in
    server.on('clientError',(error, socket)=>{
    socket.end('400 Bad request')})

3.  on SIGNSL - terminate all workers & DB

4.  Scheme

incoming hhtp request -> balancer (hhtp request) ->
-> router (message)
-> app (message)
-> DBservice (message)
-> app (message)
-> router (http response)
-> balancer -> outgoing http response

PUT & no id - no error

5.  check user structure

Users are stored as objects that have following properties:
id — unique identifier (string, uuid) generated on server side
username — user's name (string, required)
age — user's age (number, required)
hobbies — user's hobbies (array of strings or empty array, required)
