const Web3 = require('web3')
const { BigNumber, ethers } = require('ethers');
const fs = require('fs')
const readline = require("readline");

const ethRpcURL = '' // Your RPC URL goes here
const web3 = new Web3(ethRpcURL)

const arbitrumAddress = '0x67a24CE4321aB3aF51c2D0a4801c3E111D88C9d9'
const arbitrumABI = [{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"claimableTokens","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]
const arbitrumContract = new web3.eth.Contract(arbitrumABI, arbitrumAddress)

let accounts = []

async function getInfo(){
    const acc = readline.createInterface({ 
      input:fs.createReadStream('accs_arb.txt'), //Название файла с адрессами
    })
    for await (let line of acc) {
      accounts.push({address: line})
    }
}

async function main(){
    await getInfo()
    let totalBalance = 0
    for(let account of accounts){
        balance = Number(web3.utils.fromWei(await arbitrumContract.methods.claimableTokens(web3.utils.toChecksumAddress(account.address)).call(), 'ether'))
        totalBalance += balance
        console.log(`${account.address} ${balance} ARB`)
    }

    console.log(`\nTotal balance: ${totalBalance} ARB`)
}

main()