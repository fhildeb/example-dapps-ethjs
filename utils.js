async function connectWeb3() {

  // Check if Browser is Chrome or Firefox
  if (
    navigator.userAgent.indexOf("Firefox") != -1 ||
    navigator.userAgent.indexOf("Chrome") != -1
  ) {
    
    // Check if browser extension is installed
    try {

      // Get account
      if (window.ethereum) {

        // Request account
        let account = await ethereum.request({ method: "eth_accounts" });

        // If no account was found
        if (!account.length) {

          // Show login button 
          el("#login").style.display = "block";
          return false;
        } 
        else {
          return true;
        }
      }
    
    // Provider not set or invalid
    } catch (e) {

      // Show install extension notice
      el("#install").style.display = "block";
      return false;
    }
  }
  // Browser is not supported
  else {

    // Show unsupported browser notice
    el("#browser").style.display = "block";
    return false;
  }
}

async function checkNetwork() {
  try{

    // Access web3
    const web3 = new Web3(window.ethereum);

    // Get account
    let account = await ethereum.request({ method: "eth_accounts" });

    // Get the bytecode of the address or smart contract
    let bytecode = await web3.eth.getCode(account[0]);

    // If address is EOA, likely a 3rd party extension is used
    if (bytecode == '0x') {

      // Show 3rd party extension notice
      el("#extension").style.display = "block";

      // Get its network ID
      const networkID = await web3.eth.net.getId();

      // Check if its connected to the wrong network
      if (networkID !== 22) {
        
        // Show wrong network notice
        el("#network").style.display = "block";
        return false;

      }
      /**
       * 3rd party extension is connected to the right network.
       * Check if balance on network is enough to send transactions
       */
      await checkMinimalBalance();
      return true;
    }

    // Likely installed the UP extension
    return true;
  }
  catch(e){

    /**
     *  Extension not installed or locked:
     *  connectWeb3() needs to be run before
     */ 
    return false;
  }
  
}

async function checkMinimalBalance() {
  const web3 = new Web3(window.ethereum);
  let accounts = await ethereum.request({ method: "eth_accounts" });
  if(web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether') > 0.25){
    el("#lowBalance").style.display = "block";
  }
}

async function addLuksoTestnet() {
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainId: '0x16',
          chainName: 'LUKSO L14',
          nativeCurrency: {
            name: 'LUKSO',
            symbol: 'LYXt',
            decimals: 18,
          },
          rpcUrls: ['https://rpc.l14.lukso.network'],
          blockExplorerUrls: ['https://blockscout.com/lukso/l14'],
        },
      ],
    });
  } catch (err) {
    // User denied access
  }
};