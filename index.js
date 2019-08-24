const web3 = require('web3');
const express = require('express');

const router = express.Router();
const db = require('./database');


const Web3 = new web3(new web3.providers.HttpProvider("https://kovan.infura.io/v3/6c6f87a10e12438f8fbb7fc7c762b37c"))

router.post('/',async (req,res,next) => {

    let address = req.body.address;
    await db.execute(`SELECT from_address,to_address,txhash,blocknumber FROM fromtxns as txns,addresses as addr WHERE from_address='${address}' AND txns.id_address=addr.id ORDER BY blocknumber DESC`,(err,resp)=>{
        if(err)
         {
             console.log(err);
         }
        else 
         {
            console.log("result",res)
            res.send({result : resp})
         }
    })
    
})


module.exports = router;