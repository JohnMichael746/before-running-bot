import Web3 from 'web3';

function gt(value1, value2) {
  const bnValue1 = BigInt(value1);
  const bnValue2 = BigInt(value2);
  return bnValue1 > bnValue2;
}

// const web3 = new Web3('https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
// const web3 = new Web3('https://bsc.drpc.org/');
const web3 = new Web3('https://eth.drpc.org');

const senderAddress = '0x31a1B9822F2'; // Test2 with priv
const senderPriv = '';
const receiverAddress = '0x3973678'; // Test Receiver

const sendEntireBalance = async () => {
  const senderBalance = await web3.eth.getBalance(senderAddress);
  if (gt(web3.utils.toBigInt(senderBalance), web3.utils.toBigInt(0))) {

    console.log("Balance: ", senderBalance);

    const gasPrice = await web3.eth.getGasPrice();
    const valueEth = web3.utils.toWei(web3.utils.fromWei(senderBalance, "ether") * 0.25, "ether");
    console.log("valueEth", valueEth)

    let gasLimit = web3.utils.toBigInt(valueEth);

    const defaultGasFee = web3.utils.toBigInt(gasPrice) * web3.utils.toBigInt(21000);
    if (gt(defaultGasFee, gasLimit)) {
      gasLimit = defaultGasFee;
    }

    const valueToSend = (web3.utils.toBigInt(senderBalance) - gasLimit);

    console.log(`Sending ${valueToSend} to ${receiverAddress} from ${senderAddress}`);
    if (gt(web3.utils.toBigInt(valueToSend), web3.utils.toBigInt(0))) {
      const transactionObject = {
        from: senderAddress,
        to: receiverAddress,
        value: valueToSend,
        gasPrice: gasPrice,
        gas: gasLimit / gasPrice,
      };

      web3.eth.accounts.signTransaction(transactionObject, senderPriv)
        .then((signedTx) => {
          web3.eth.sendSignedTransaction(signedTx.rawTransaction)
            .on('receipt', (receipt) => {
              console.log('Transaction Receipt:', receipt);
            })
            .on('error', (error) => {
              console.error('Transaction Error:', error);
            });
        })
        .catch((error) => {
          console.error('Error signing transaction:', error);
        });
    }
  }
};

const monitorBalanceAndSend = async () => {
  await sendEntireBalance();

  setTimeout(monitorBalanceAndSend, 1500);
};

console.log("Server is running...");
monitorBalanceAndSend();
