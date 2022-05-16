console.clear();
const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  FileCreateTransaction,
  ContractCreateTransaction,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  ContractCallQuery,
  AccountId,
  AccountBalanceQuery,
  Hbar,
  TransferTransaction,
} = require("@hashgraph/sdk");

require("dotenv").config();

const fs = require("fs");


const myAccountId =  AccountId.fromString(process.env.MY_ACCOUNT_ID);
const myPrivateKey =  PrivateKey.fromString(process.env.MY_PRIVATE_KEY) ;
const client = Client.forTestnet().setOperator(myAccountId, myPrivateKey);

async function main() {

  const contractBytecode = fs.readFileSync("DonerContract_sol_DonerContract.bin")

  const fileCreateTransaction = new FileCreateTransaction()
  .setContents(contractBytecode)
  .setKeys([myPrivateKey])
  .freezeWith(client)
  const fileCreateSign = await fileCreateTransaction.sign(myPrivateKey);
  const fileCreateSubmit = await fileCreateSign.execute(client);
  const fileCreateReceipt = fileCreateSubmit.getReceipt(client);
  const bytecodeFileId = (await fileCreateReceipt).fileId;

  console.log("bytecodeFileId : " +bytecodeFileId.toString() + "\n" );



  const contractInstantiateTransaction = new ContractCreateTransaction()
  .setBytecodeFileId(bytecodeFileId)
  .setGas(100000)
  .setConstructorParameters(new ContractFunctionParameters().addString("mahmoud").addUint256(1000))


  const contractInstantiateSubmit = await contractInstantiateTransaction.execute(client)

  const contractInstantiateReceipt = await contractInstantiateSubmit.getReceipt(client)

  const contractId = contractInstantiateReceipt.contractId

  const contractAddress = contractId.toSolidityAddress();


  console.log("smart contract id : " +contractId)
  console.log("smart contract id in solidity format : " +contractAddress)


  async function getAmountByName(donerName){

    const contractQueryTransaction = new ContractCallQuery()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction("getAmount",new ContractFunctionParameters().addString(donerName));
    const contractQuerySubmit = await contractQueryTransaction.execute(client);
  
    const contractQueryResult = contractQuerySubmit.getUint256(0)
    console.log("query result : " +contractQueryResult)
    return contractQueryResult
  }

  async function setAmount(donerName,amount){

    const contractExecuteTransaction = new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction("setAmount",new ContractFunctionParameters().addString(donerName).addUint256(amount))
  
    const contractExecuteSubmit = await contractExecuteTransaction.execute(client)
    const contractExecuteReceipt = await contractExecuteSubmit.getReceipt(client)
    console.log(" contract status : " + contractExecuteReceipt.status.toString())

  }
  await setAmount("redApple",163)
  console.log(getAmountByName("redApple"))





  
}

main();




// if (myAccountId == null || myPrivateKey == null) {
//   throw new Error(
//     "Environment variables myAccountId and myPrivateKey must be present"
//   );
// }

// console.log(myAccountId);

// const client = Client.forTestnet();
// client.setOperator(myAccountId, myPrivateKey);

// const newAccountPrivateKey = await PrivateKey.generateED25519();
// const newAccountPublicKey = newAccountPrivateKey.publicKey;

// // created a new account

// // ! important : the client is just a way or key to interact with the API
// const newAccount = await new AccountCreateTransaction()
//   .setKey(newAccountPublicKey)
//   .setInitialBalance(Hbar.fromTinybars(1000))
//   .execute(client);

// // ! we created an account so we can get our receipt
// // ! which contains all "transaction" info
// const getReceipt = await newAccount.getReceipt(client);
// const newAccountId = getReceipt.accountId;
// console.log("The new account ID is: " + newAccountId);
// console.log("The new account ID is: " + myAccountId);

// const accountBalance = await new AccountBalanceQuery()
//   .setAccountId(newAccountId)
//   .execute(client);

// console.log(
//   "The new account balance is: " +
//     accountBalance.hbars.toTinybars() +
//     " tinybar."
// );

// const sendHbar = await new TransferTransaction()
//   .addHbarTransfer(myAccountId, Hbar.fromTinybars(-10))
//   .addHbarTransfer(newAccountId, Hbar.fromTinybars(10))
//   .execute(client);

// const transactionReceipt = await sendHbar.getReceipt(client);
// console.log(transactionReceipt.status.toString());

// const queryCost = await new AccountBalanceQuery()
//   .setAccountId(newAccountId)
//   .getCost(client);
// const getNewBalance = await new AccountBalanceQuery()
//   .setAccountId(newAccountId)
//   .execute(client);
// console.log(
//   "The account balance after the transfer is: " +
//     getNewBalance.hbars.toTinybars() +
//     " tinybar."
// );

// console.log("The cost of query is: " + transactionReceipt.tokenId);