const web3 = require('web3');
const express = require('express');

const db = require('./database');


const Web3 = new web3(new web3.providers.HttpProvider("https://kovan.infura.io/v3/6c6f87a10e12438f8fbb7fc7c762b37c"))

const databaseinit = async () =>
{
    console.log("database init")
    let result = [];
    let block = await Web3.eth.getBlock('latest',true)
    let latestblock = block.number;
    result = await loop(block);
    console.log("result",result);
}
async function  loop(block)
 {
    let firstblock = block.number;
    let inputdata = [],maxblock;
    console.log("entered loop")
    await db.execute('SELECT MAX(blocknumber) AS blockmax from fromtxns', async function(err,result)
    {
        if(err)
         {
             console.log(err)
         }
        else
         {
             console.log(result[0].blockmax)
             maxblock = result[0].blockmax;
             console.log("max",maxblock)
    for(let i=firstblock;i>maxblock;i--)
     {
         let txlist = [];
         let tempblock = await Web3.eth.getBlock(i,true)
         if(tempblock.transactions == null)
          {
              continue;
          }
        //  console.log("templength",templength)
         txlist = await gettransactions(tempblock.transactions,tempblock.transactions.length)
         for(x in txlist)
          {     
              inputdata.push(txlist[x]);
          }
     }
    return inputdata;
         }
    })
    
 }

async function gettransactions(txns,length)
 {
     let txlist = [];
    //  console.log("length",length)
     for(let i=0;i<length;i++)
      {
          txlist.push({
              from : txns[i].from,
              to : txns[i].to,
              txhash : txns[i].hash,
              blocknumber : txns[i].blockNumber
          })
          let search = txns[i].from.toString();
          console.log("search",search)
          let check = await db.execute(`SELECT * FROM addresses WHERE address = '${search}'`)
          check = check[0];
          let id;
          console.log("check",check)
          
          
          if(check.length == 0)
            {
                console.log("into")
                let res = await db.execute('INSERT INTO addresses(address) VALUES(?)',[txns[i].from]);
                console.log("res",res[0].insertId);
                id = res[0].insertId;
            }
          else 
           {
                id = check[0].id;
           }
        let resp = await db.execute('INSERT INTO fromtxns(from_address,to_address,txhash,blocknumber,id_address) VALUES(?,?,?,?,?)',
        [txns[i].from,txns[i].to,txns[i].hash,txns[i].blockNumber,id])
      }
    //  console.log("txlist",txlist)
    
     return txlist;
 }

module.exports = databaseinit;