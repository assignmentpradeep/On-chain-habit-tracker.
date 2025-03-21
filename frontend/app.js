const contractAddress = "";
const abi = [
    {
        "inputs": [
            { "internalType": "address payable", "name": "_recipient", "type": "address" },
            { "internalType": "uint256", "name": "_feeBps", "type": "uint256" }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "donate",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "recipient",
        "outputs": [{ "internalType": "address payable", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalDonations",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let contract;
let userAccount;

async function connectWallet() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        userAccount = accounts[0];
        contract = new web3.eth.Contract(abi, contractAddress);
        loadData();
    } else {
        alert("Please install MetaMask!");
    }
}

async function donate() {
    const amount = document.getElementById("donationAmount").value;
    if (!amount || isNaN(amount) || amount <= 0) {
        alert("Enter a valid donation amount!");
        return;
    }

    await contract.methods.donate().send({ from: userAccount, value: web3.utils.toWei(amount, "ether") });
    loadData();
}

async function loadData() {
    const totalDonations = await contract.methods.totalDonations().call();
    const recipient = await contract.methods.recipient().call();

    document.getElementById("totalDonations").innerText = web3.utils.fromWei(totalDonations, "ether");
    document.getElementById("recipientAddress").innerText = recipient;
}

// Auto-connect to wallet on page load
window.onload = connectWallet;
