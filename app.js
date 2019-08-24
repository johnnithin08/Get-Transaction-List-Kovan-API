const express = require('express');
const initload = require('./databaseinit');
const indexrouting = require('./index');

const app = express();

async function dbinit(callback)
 {
    console.log("entered dbinit");
    initload();
    callback();
 }

function wait10sec(){
    setTimeout(function(){
        dbinit(wait10sec);
    }, 15000);
}

dbinit(wait10sec);

app.use(express.json());
app.use(express.urlencoded({extended : true}))



app.use('/',indexrouting);

app.listen(3000,() => {
    console.log('server up at 3000');
})
