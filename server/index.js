const express = require('express')
const app = express()
const db = require('../db/index.js').db



app.get('/find/:address', (req, res) => {
    let address = JSON.stringify(req.params.address.split('+').join(' '));
    db.all(`select * from hosts_neighborhood where location = ${address} `, (err, data) => {
        if (err) {console.log(err, ' <-- Error occured on retrieving the data by address'); res.sendStatus(500)}
        else(res.json(data).status(200))
    })
})

app.get('/contact/:host', (req, res) => {
  let host = JSON.stringify(req.params.host.split('+').join(' '))
  db.all(`select email, phoneNum from hosts_neighborhood where name = ${host}`, (err, data)=>{
      if(err) {console.error(err, ' <-- Error occured on getting the host contact info'); res.sendStatus(500)}
      else res.json(data).status(200)
  })
})

app.post('/contact/:host/message', (req, res) =>{
    let host = JSON.stringify(req.params.host.split('+').join(' '))
    db.get(`insert into messages where toHost = ${host}
    (toHost, messageBody) values (?, ?)`, [host, req.body.messageBody], (err) =>{
        if(err) {console.error(err, ' <-- Error occured on sending a message to host'); res.sendStatus(500)}
        else res.sendStatus(201)
    })
})

app.get('/contact/:host/message', (req, res)=>{
    let host = JSON.stringify(req.params.host.split('+').join(' '))
    db.all(` select * from messages where toHost = ${host}`, (err, data)=>{
        if(err) {console.error(err, ' <-- Error occured on getting message history'); res.sendStatus(500)}
        else res.json(data).status(200)
    })
})

let port = 3005
app.listen(port, () => {
    console.log(`app is listening on port ${port}`)
})
