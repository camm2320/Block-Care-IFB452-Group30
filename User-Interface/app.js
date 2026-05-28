// IMPORTANT:
// Replace this every time you redeploy AccessControl.
const accessControlAddress = "0x8b248A301E7edc03A04250387ea7012a7B0590cF";

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

const medicalRecordsAddress = "0x08686B380d5bFe151CB108E2a41231d0ECeb204B";

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

const insuranceAddress = "0x568943874EBaC68b2B6Bf1e76d04e1af5fA051c5";

const insuranceABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "claimId",
                "type": "uint256"
            }
        ],
        "name": "approveClaim",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "claimCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "claimId",
                "type": "uint256"
            }
        ],
        "name": "getClaim",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "patient",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "doctor",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "treatment",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "enum Insurance.ClaimStatus",
                "name": "status",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "claimId",
                "type": "uint256"
            }
        ],
        "name": "rejectClaim",
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
            },
            {
                "internalType": "string",
                "name": "treatment",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "submitClaim",
        "outputs": [],
        "stateMutability": "nonpayable",
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

async function getInsuranceContract() {
    if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed.");
        throw new Error("MetaMask not installed");
    }

    await switchToGanache();

    const provider = new ethers.BrowserProvider(window.ethereum);

    const code = await provider.getCode(insuranceAddress);

    if (code === "0x") {
        alert("No Insurance contract found at this address on the current Ganache network. Redeploy Insurance and update insuranceAddress in app.js.");
        throw new Error("No contract code found at Insurance address");
    }

    const signer = await provider.getSigner();

    return new ethers.Contract(
        insuranceAddress,
        insuranceABI,
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

function getAssignedPatients() {
    return JSON.parse(localStorage.getItem("assignedPatients")) || {};
}

function saveAssignedPatient(userAddress, patientAddress) {
    const assignedPatients = getAssignedPatients();

    const userKey = userAddress.toLowerCase();
    const patientKey = patientAddress.toLowerCase();

    if (!assignedPatients[userKey]) {
        assignedPatients[userKey] = [];
    }

    if (!assignedPatients[userKey].includes(patientKey)) {
        assignedPatients[userKey].push(patientKey);
    }

    localStorage.setItem(
        "assignedPatients",
        JSON.stringify(assignedPatients)
    );
}

function removeAssignedPatient(userAddress, patientAddress) {
    const assignedPatients = getAssignedPatients();

    const userKey = userAddress.toLowerCase();
    const patientKey = patientAddress.toLowerCase();

    if (!assignedPatients[userKey]) {
        return;
    }

    assignedPatients[userKey] = assignedPatients[userKey].filter(
        patient => patient !== patientKey
    );

    localStorage.setItem(
        "assignedPatients",
        JSON.stringify(assignedPatients)
    );
}

async function displayAssignedPatients() {
    const assignedPatientsList = document.getElementById("assignedPatientsList");

    if (!assignedPatientsList) {
        return;
    }

    if (typeof window.ethereum === "undefined") {
        assignedPatientsList.innerHTML = "<li>MetaMask not installed</li>";
        return;
    }

    const accounts = await window.ethereum.request({
        method: "eth_accounts"
    });

    if (accounts.length === 0) {
        assignedPatientsList.innerHTML = "<li>No wallet connected</li>";
        return;
    }

    const currentUser = accounts[0].toLowerCase();
    const assignedPatients = getAssignedPatients();
    const patients = assignedPatients[currentUser] || [];

    if (patients.length === 0) {
        assignedPatientsList.innerHTML = "<li>No patients selected</li>";
        return;
    }

    assignedPatientsList.innerHTML = "";

    patients.forEach(patient => {
        const listItem = document.createElement("li");
        listItem.textContent = patient;
        assignedPatientsList.appendChild(listItem);
    });
}

displayAssignedPatients();

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
                saveAssignedPatient(doctorAddress, patientAddress);
                displayAssignedPatients();

                alert("Access granted successfully!");
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

            const accounts = await window.ethereum.request({
                method: "eth_accounts"
            });

            const patientAddress = accounts[0];

            removeAssignedPatient(doctorAddress, patientAddress);
            displayAssignedPatients();

            alert("Access revoked successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to revoke access.");
        }
    });
}

displayConnectedWallet();
displayAssignedPatients();

const addRecordButton = document.getElementById("addRecordButton");

if (addRecordButton) {
    addRecordButton.addEventListener("click", async () => {
        const patientAddress = document.getElementById("recordPatientAddress").value.trim();
        localStorage.setItem(
    "currentPatientWallet",
    patientAddress
);
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

// Doctor save medical info button
const addMedicalButton =
    document.getElementById("addMedicalButton");

if (addMedicalButton) {

    addMedicalButton.addEventListener("click", async () => {

        const patientAddress =
            document.getElementById("recordPatientAddress").value;

        const illness =
            document.getElementById("illnessInput").value;

        const description =
            document.getElementById("descriptionInput").value;

        const accounts =
            await ethereum.request({
                method: "eth_accounts"
            });

        const doctorWallet = accounts[0];

        const newRecord = {
            patientAddress,
            illness,
            description,
            doctorWallet
        };

        const existingRecords =
            JSON.parse(localStorage.getItem("medicalRecords")) || [];

        existingRecords.push(newRecord);

        localStorage.setItem(
            "medicalRecords",
            JSON.stringify(existingRecords)
        );

        alert("Medical record added successfully.");
    });
}


// Insurance save button code
const addInsuranceButton =
    document.getElementById("addInsuranceButton");

if (addInsuranceButton) {

    addInsuranceButton.addEventListener("click", async () => {

        const patientAddress =
            document.getElementById("insurancePatientAddress").value;

        const coverage =
            document.getElementById("coverageInput").value;

        const subsidy =
            document.getElementById("subsidyInput").value;

        const eligibility =
            document.getElementById("eligibilityInput").value;

        const accounts =
            await ethereum.request({
                method: "eth_accounts"
            });

        const companyWallet = accounts[0];

        const newInsuranceRecord = {
            patientAddress,
            coverage,
            subsidy,
            eligibility,
            companyWallet
        };

        const existingInsurance =
            JSON.parse(localStorage.getItem("insuranceRecords")) || [];

        existingInsurance.push(newInsuranceRecord);

        localStorage.setItem(
            "insuranceRecords",
            JSON.stringify(existingInsurance)
        );

        alert("Insurance record added successfully.");
    });
}

// Insurance submit claim button
const submitClaimButton = document.getElementById("submitClaimButton");

if (submitClaimButton) {
    submitClaimButton.addEventListener("click", async () => {
        const patientAddress = document.getElementById("claimPatientAddress").value.trim();
        const treatment = document.getElementById("claimTreatment").value.trim();
        const amount = document.getElementById("claimAmount").value.trim();

        if (!patientAddress || !treatment || !amount) {
            alert("Please fill in all claim fields.");
            return;
        }

        if (!ethers.isAddress(patientAddress)) {
            alert("Please enter a valid patient address.");
            return;
        }

        try {
            const contract = await getInsuranceContract();

            const tx = await contract.submitClaim(patientAddress, treatment, amount);

            alert("Transaction sent. Please confirm in MetaMask.");

            const receipt = await tx.wait();

            if (receipt.status === 1) {
                const count = await contract.claimCount();
                alert("Claim submitted successfully! Claim ID: " + count.toString());
            } else {
                alert("Transaction failed.");
            }

        } catch (error) {
            console.error(error);
            alert("Failed to submit claim.");
        }
    });
}

const approveClaimButton = document.getElementById("approveClaimButton");

if (approveClaimButton) {
    approveClaimButton.addEventListener("click", async () => {
        const claimId = document.getElementById("claimIdInput").value.trim();

        if (!claimId) {
            alert("Please enter a claim ID.");
            return;
        }

        try {
            const contract = await getInsuranceContract();

            const tx = await contract.approveClaim(claimId);

            alert("Transaction sent. Please confirm in MetaMask.");

            const receipt = await tx.wait();

            if (receipt.status === 1) {
                alert("Claim approved successfully!");
            } else {
                alert("Transaction failed.");
            }

        } catch (error) {
            console.error(error);
            alert("Failed to approve claim.");
        }
    });
}

const rejectClaimButton = document.getElementById("rejectClaimButton");

if (rejectClaimButton) {
    rejectClaimButton.addEventListener("click", async () => {
        const claimId = document.getElementById("claimIdInput").value.trim();

        if (!claimId) {
            alert("Please enter a claim ID.");
            return;
        }

        try {
            const contract = await getInsuranceContract();

            const tx = await contract.rejectClaim(claimId);

            alert("Transaction sent. Please confirm in MetaMask.");

            const receipt = await tx.wait();

            if (receipt.status === 1) {
                alert("Claim rejected successfully!");
            } else {
                alert("Transaction failed.");
            }

        } catch (error) {
            console.error(error);
            alert("Failed to reject claim.");
        }
    });
}

// Insurance approve claim button
const viewClaimButton = document.getElementById("viewClaimButton");

if (viewClaimButton) {
    viewClaimButton.addEventListener("click", async () => {
        const claimId = document.getElementById("viewClaimIdInput").value.trim();
        const claimOutput = document.getElementById("claimOutput");

        if (!claimId) {
            alert("Please enter a claim ID.");
            return;
        }

        try {
            const contract = await getInsuranceContract();

            const claim = await contract.getClaim(claimId);

            const statuses = ["Pending", "Approved", "Rejected"];

            claimOutput.innerHTML =
                "Claim ID: " + claim[0].toString() + "<br>" +
                "Patient: " + claim[1] + "<br>" +
                "Doctor: " + claim[2] + "<br>" +
                "Treatment: " + claim[3] + "<br>" +
                "Amount: " + claim[4].toString() + "<br>" +
                "Status: " + statuses[Number(claim[5])];

        } catch (error) {
            console.error(error);
            alert("Failed to view claim.");
        }
    });
}


// DISPLAY MEDICAL RECORDS FOR LOGGED IN PATIENT
const medicalContainer =
    document.getElementById("medicalRecordsContainer");

if (medicalContainer) {

    ethereum.request({
        method: "eth_accounts"
    }).then(accounts => {

        const currentPatient = accounts[0];

        const medicalRecords =
            JSON.parse(localStorage.getItem("medicalRecords")) || [];

        const patientRecords =
            medicalRecords.filter(record =>
                record.patientAddress.toLowerCase() ===
                currentPatient.toLowerCase()
            );

        patientRecords.forEach(record => {

            const card = document.createElement("div");

            card.classList.add("record-card");

            card.innerHTML = `
                <ul>

                    <li>
                        <strong>${record.illness}</strong>
                    </li>

                    <li>
                        ${record.description}
                    </li>

                </ul>

                <div class="wallet-box">
                    Doctor Wallet:
                    ${record.doctorWallet}
                </div>
            `;

            medicalContainer.appendChild(card);
        });
    });
}

// DISPLAY INSURANCE RECORDS FOR LOGGED IN PATIENT
const insuranceContainer =
    document.getElementById("insuranceRecordsContainer");

if (insuranceContainer) {

    ethereum.request({
        method: "eth_accounts"
    }).then(accounts => {

        const currentPatient = accounts[0];

        const insuranceRecords =
            JSON.parse(localStorage.getItem("insuranceRecords")) || [];

        const patientInsurance =
            insuranceRecords.filter(record =>
                record.patientAddress.toLowerCase() ===
                currentPatient.toLowerCase()
            );

        patientInsurance.forEach(record => {

            const card = document.createElement("div");

            card.classList.add("record-card");

            card.innerHTML = `
                <ul>

                    <li>
                        <strong>
                            Coverage Status:
                            ${record.coverage}
                        </strong>
                    </li>

                    <li>
                        Subsidy:
                        ${record.subsidy}
                    </li>

                    <li>
                        Eligibility:
                        ${record.eligibility}
                    </li>

                </ul>

                <div class="wallet-box">
                    Insurance Wallet:
                    ${record.companyWallet}
                </div>
            `;

            insuranceContainer.appendChild(card);
        });
    });
}

// DISPLAY CURRENT PATIENT WALLET
const currentPatientSpan =
    document.getElementById("currentPatientWallet");

if (currentPatientSpan) {

    const savedPatient =
        localStorage.getItem("currentPatientWallet");

    if (savedPatient) {
        currentPatientSpan.innerText = savedPatient;
    }
}

// DISPLAY USER ROLE NAME
const userName =
    document.getElementById("userName");

if (userName) {

    ethereum.request({
        method: "eth_accounts"
    }).then(accounts => {

       const wallet = accounts[0].toLowerCase();

        // DEMO HARD-CODED ROLE NAMES
        const names = {

    "0x2975e30ddbbdb74ac36d8924cc0f5f5c4a782f77": "Jimmy (Patient)",

    "0xff45298ef2e0d44f369fa0e79bdeb0219660a7ef": "Dr Sarah",

    "0xeb7262a13e8918fc732a3a1d34710c7f18fb0627": "Health Insurance Co"

};

        userName.innerText =
            names[wallet] || "User";

    });
}

// ROLE SECURITY CHECKS
const roleWallets = {

    patient: [
        "0x2975e30ddbbdb74ac36d8924cc0f5f5c4a782f77"
    ],

    doctor: [
        "0xff45298ef2e0d44f369fa0e79bdeb0219660a7ef"
    ],

    insurance: [
        "0xeb7262a13e8918fc732a3a1d34710c7f18fb0627"
    ]
};

async function checkRoleAccess(role, dashboardPage) {

    const accounts = await ethereum.request({
        method: "eth_accounts"
    });

    if (accounts.length === 0) {
        alert("Please connect wallet first.");
        return;
    }

    const wallet =
        accounts[0].toLowerCase();

    const allowedWallets =
        roleWallets[role];

    if (allowedWallets.includes(wallet)) {

        window.location.href = dashboardPage;

    } else {

        window.location.href =
            "landing-error.html";
    }
}