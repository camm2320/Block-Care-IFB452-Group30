// IMPORTANT:
// Replace this every time you redeploy AccessControl.
const accessControlAddress = "0x721F18ec14204740f6bB150445A62CD482684D85";

// Ganache chain ID 1337 = 0x539
const GANACHE_CHAIN_ID = "0x539";

const accessControlABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "grantAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "revokeAccess",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "access",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "patient",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "hasAccess",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const medicalRecordsAddress = "0xD44c2F1a0978CD759df5E25C396e87015c35ABae";

const medicalRecordsABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "accessAddress",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "patient",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "diagnosis",
                "type": "string"
            }
        ],
        "name": "addRecord",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "patient",
                "type": "address"
            }
        ],
        "name": "getRecords",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "diagnosis",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "doctor",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct MedicalRecords.Record[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

async function connectWallet() {
    if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed.");
        return null;
    }

    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
    });

    return accounts[0];
}

async function switchToGanache() {
    const currentChainId = await window.ethereum.request({
        method: "eth_chainId"
    });

    if (currentChainId !== GANACHE_CHAIN_ID) {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: GANACHE_CHAIN_ID }]
        });
    }
}

async function getAccessControlContract() {
    if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed.");
        throw new Error("MetaMask not installed");
    }

    await switchToGanache();

    const provider = new ethers.BrowserProvider(window.ethereum);

    const code = await provider.getCode(accessControlAddress);

    if (code === "0x") {
        alert(
            "No AccessControl contract found at this address on the current Ganache network. Redeploy AccessControl and update accessControlAddress in app.js."
        );
        throw new Error("No contract code found at AccessControl address");
    }

    const signer = await provider.getSigner();

    return new ethers.Contract(
        accessControlAddress,
        accessControlABI,
        signer
    );
}

async function getMedicalRecordsContract() {
    if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed.");
        throw new Error("MetaMask not installed");
    }

    await switchToGanache();

    const provider = new ethers.BrowserProvider(window.ethereum);

    const code = await provider.getCode(medicalRecordsAddress);

    if (code === "0x") {
        alert("No MedicalRecords contract found at this address on the current Ganache network. Redeploy MedicalRecords and update medicalRecordsAddress in app.js.");
        throw new Error("No contract code found at MedicalRecords address");
    }

    const signer = await provider.getSigner();

    return new ethers.Contract(
        medicalRecordsAddress,
        medicalRecordsABI,
        signer
    );
}

async function displayConnectedWallet() {
    const walletSpan = document.getElementById("wallet");

    if (!walletSpan) {
        return;
    }

    if (typeof window.ethereum === "undefined") {
        walletSpan.innerText = "MetaMask not installed";
        return;
    }

    const accounts = await window.ethereum.request({
        method: "eth_accounts"
    });

    if (accounts.length > 0) {
        walletSpan.innerText = accounts[0];
    } else {
        walletSpan.innerText = "Not connected";
    }
}

const connectButton = document.getElementById("connectWallet");

if (connectButton) {
    connectButton.addEventListener("click", async () => {
        try {
            await switchToGanache();

            const account = await connectWallet();

            if (account) {
                connectButton.innerText =
                    "Connected: " +
                    account.substring(0, 6) +
                    "..." +
                    account.substring(account.length - 4);
            }
        } catch (error) {
            console.error("Wallet connection failed:", error);
            alert("Wallet connection failed.");
        }
    });
}

const grantAccessButton = document.getElementById("grantAccessButton");

if (grantAccessButton) {
    grantAccessButton.addEventListener("click", async () => {

        const doctorAddress = document.getElementById("doctorAddress").value.trim();

        if (!doctorAddress) {
            alert("Please enter a wallet address.");
            return;
        }

        if (!ethers.isAddress(doctorAddress)) {
            alert("Please enter a valid Ethereum address.");
            return;
        }

        try {
            const contract = await getAccessControlContract();

            const tx = await contract.grantAccess(doctorAddress);

            alert("Transaction sent. Please confirm in MetaMask.");

            const receipt = await tx.wait();

            const accounts = await window.ethereum.request({
                method: "eth_accounts"
            });

            const patientAddress = accounts[0];

            const accessResult = await contract.hasAccess(patientAddress, doctorAddress);

            if (accessResult) {
                alert("Access granted successfully!");
            } else {
                alert("Transaction succeeded, but access still returned false. Check addresses.");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to grant access.");
        }
    });
}

const revokeAccessButton = document.querySelector(".revoke");

if (revokeAccessButton) {
    revokeAccessButton.addEventListener("click", async () => {
        const doctorAddress = document.getElementById("doctorAddress").value.trim();

        if (!doctorAddress) {
            alert("Please enter a wallet address.");
            return;
        }

        if (!ethers.isAddress(doctorAddress)) {
            alert("Please enter a valid Ethereum address.");
            return;
        }

        try {
            const contract = await getAccessControlContract();

            const tx = await contract.revokeAccess(doctorAddress);

            alert("Transaction sent. Please confirm in MetaMask.");

            const receipt = await tx.wait();

            alert("Access revoked successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to revoke access.");
        }
    });
}

displayConnectedWallet();

const addRecordButton = document.getElementById("addRecordButton");

if (addRecordButton) {
    addRecordButton.addEventListener("click", async () => {
        const patientAddress = document.getElementById("recordPatientAddress").value.trim();
        const diagnosis = document.getElementById("diagnosisInput").value.trim();

        if (!patientAddress) {
            alert("Please enter the patient wallet address.");
            return;
        }

        if (!ethers.isAddress(patientAddress)) {
            alert("Please enter a valid patient Ethereum address.");
            return;
        }

        if (!diagnosis) {
            alert("Please enter diagnosis or treatment notes.");
            return;
        }

        try {
            const contract = await getMedicalRecordsContract();

            const tx = await contract.addRecord(patientAddress, diagnosis);

            alert("Transaction sent. Please confirm in MetaMask.");

            const receipt = await tx.wait();

            if (receipt.status === 1) {
                alert("Medical record added successfully!");
            } else {
                alert("Transaction failed.");
            }

        } catch (error) {
            console.error(error);
            alert("Failed to add medical record. Make sure the patient has granted this doctor access first.");
        }
    });
}