// IMPORTANT (SEE READ ME FOR INSTRUCTIONS):
// 1. Replace these addresses every time you redeploy the contracts.
const accessControlAddress = "0x8b248A301E7edc03A04250387ea7012a7B0590cF";
const medicalRecordsAddress = "0x08686B380d5bFe151CB108E2a41231d0ECeb204B";
const insuranceAddress = "0x568943874EBaC68b2B6Bf1e76d04e1af5fA051c5";


//Replace the addresses with your meta mask stakeholder address that you are using. 
  const names = {
            "0x2975e30ddbbdb74ac36d8924cc0f5f5c4a782f77": "Jimmy (Patient)",
            "0xff45298ef2e0d44f369fa0e79bdeb0219660a7ef": "Dr Sarah",
            "0xeb7262a13e8918fc732a3a1d34710c7f18fb0627": "Health Insurance Co"
        };


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

const medicalRecordsABI = [
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

const insuranceABI = [
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
        "name": "approveClaim",
        "outputs": [],
        "stateMutability": "nonpayable",
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
    if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed.");
        throw new Error("MetaMask not installed");
    }

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

async function getProviderAndSigner() {
    if (typeof window.ethereum === "undefined") {
        alert("MetaMask is not installed.");
        throw new Error("MetaMask not installed");
    }

    await switchToGanache();

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return { provider, signer };
}

async function getAccessControlContract() {
    const { provider, signer } = await getProviderAndSigner();

    const code = await provider.getCode(accessControlAddress);

    if (code === "0x") {
        alert("No AccessControl contract found. Redeploy AccessControl and update accessControlAddress in app.js.");
        throw new Error("No contract code found at AccessControl address");
    }

    return new ethers.Contract(
        accessControlAddress,
        accessControlABI,
        signer
    );
}

async function getMedicalRecordsContract() {
    const { provider, signer } = await getProviderAndSigner();

    const code = await provider.getCode(medicalRecordsAddress);

    if (code === "0x") {
        alert("No MedicalRecords contract found. Redeploy MedicalRecords and update medicalRecordsAddress in app.js.");
        throw new Error("No contract code found at MedicalRecords address");
    }

    return new ethers.Contract(
        medicalRecordsAddress,
        medicalRecordsABI,
        signer
    );
}

async function getInsuranceContract() {
    const { provider, signer } = await getProviderAndSigner();

    const code = await provider.getCode(insuranceAddress);

    if (code === "0x") {
        alert("No Insurance contract found. Redeploy Insurance and update insuranceAddress in app.js.");
        throw new Error("No contract code found at Insurance address");
    }

    return new ethers.Contract(
        insuranceAddress,
        insuranceABI,
        signer
    );
}

async function getCurrentWallet() {
    if (typeof window.ethereum === "undefined") {
        return null;
    }

    const accounts = await window.ethereum.request({
        method: "eth_accounts"
    });

    if (accounts.length === 0) {
        return null;
    }

    return accounts[0];
}

async function displayConnectedWallet() {
    const walletSpan = document.getElementById("wallet");

    if (!walletSpan) {
        return;
    }

    const wallet = await getCurrentWallet();

    if (!wallet) {
        walletSpan.innerText = "Not connected";
        return;
    }

    walletSpan.innerText = wallet;
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

    const wallet = await getCurrentWallet();

    if (!wallet) {
        assignedPatientsList.innerHTML = "<li>No wallet connected</li>";
        return;
    }

    const currentUser = wallet.toLowerCase();
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

                await displayConnectedWallet();
                await displayAssignedPatients();
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

            if (receipt.status !== 1) {
                alert("Transaction failed.");
                return;
            }

            const patientAddress = await getCurrentWallet();

            const accessResult = await contract.hasAccess(
                patientAddress,
                doctorAddress
            );

            if (accessResult) {
                saveAssignedPatient(doctorAddress, patientAddress);
                await displayAssignedPatients();

                alert("Access granted successfully!");
            } else {
                alert("Transaction completed, but access was not confirmed.");
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

            if (receipt.status !== 1) {
                alert("Transaction failed.");
                return;
            }

            const patientAddress = await getCurrentWallet();

            removeAssignedPatient(doctorAddress, patientAddress);
            await displayAssignedPatients();

            alert("Access revoked successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to revoke access.");
        }
    });
}

async function saveMedicalRecordToLocalStorage(patientAddress, illness, description, doctorWallet) {
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
}

async function secureAddMedicalRecord(patientAddress, illness, description) {
    if (!patientAddress) {
        alert("Please enter the patient wallet address.");
        return;
    }

    if (!ethers.isAddress(patientAddress)) {
        alert("Please enter a valid patient Ethereum address.");
        return;
    }

    if (!illness && !description) {
        alert("Please enter medical details.");
        return;
    }

    const doctorWallet = await getCurrentWallet();

    if (!doctorWallet) {
        alert("Please connect your doctor wallet first.");
        return;
    }

    const accessContract = await getAccessControlContract();

    const hasAccess = await accessContract.hasAccess(
        patientAddress,
        doctorWallet
    );

    if (!hasAccess) {
        alert("Access denied. This patient has not granted access, or access has been revoked.");
        return;
    }

    const medicalContract = await getMedicalRecordsContract();

    const diagnosisText = illness
        ? illness + " - " + description
        : description;

    const tx = await medicalContract.addRecord(
        patientAddress,
        diagnosisText
    );

    alert("Transaction sent. Please confirm in MetaMask.");

    const receipt = await tx.wait();

    if (receipt.status !== 1) {
        alert("Transaction failed.");
        return;
    }

    await saveMedicalRecordToLocalStorage(
        patientAddress,
        illness || "Medical Record",
        description || diagnosisText,
        doctorWallet
    );

    localStorage.setItem("currentPatientWallet", patientAddress);

    alert("Medical record added successfully!");
}

const addRecordButton = document.getElementById("addRecordButton");

if (addRecordButton) {
    addRecordButton.addEventListener("click", async () => {
        const patientAddress =
            document.getElementById("recordPatientAddress").value.trim();

        const diagnosis =
            document.getElementById("diagnosisInput").value.trim();

        try {
            await secureAddMedicalRecord(
                patientAddress,
                "Diagnosis / Treatment Notes",
                diagnosis
            );
        } catch (error) {
            console.error(error);
            alert("Failed to add medical record. Make sure the patient has granted this doctor access first.");
        }
    });
}

const addMedicalButton = document.getElementById("addMedicalButton");

if (addMedicalButton) {
    addMedicalButton.addEventListener("click", async () => {
        const patientAddress =
            document.getElementById("recordPatientAddress").value.trim();

        const illness =
            document.getElementById("illnessInput").value.trim();

        const description =
            document.getElementById("descriptionInput").value.trim();

        try {
            await secureAddMedicalRecord(
                patientAddress,
                illness,
                description
            );
        } catch (error) {
            console.error(error);
            alert("Failed to add medical record. Make sure the patient has granted this doctor access first.");
        }
    });
}

const addInsuranceButton = document.getElementById("addInsuranceButton");

if (addInsuranceButton) {
    addInsuranceButton.addEventListener("click", async () => {
        const patientAddress =
            document.getElementById("insurancePatientAddress").value.trim();

        const coverage =
            document.getElementById("coverageInput").value.trim();

        const subsidy =
            document.getElementById("subsidyInput").value.trim();

        const eligibility =
            document.getElementById("eligibilityInput").value.trim();

        if (!patientAddress || !coverage || !subsidy || !eligibility) {
            alert("Please fill in all insurance fields.");
            return;
        }

        if (!ethers.isAddress(patientAddress)) {
            alert("Please enter a valid patient wallet address.");
            return;
        }

        const companyWallet = await getCurrentWallet();

        if (!companyWallet) {
            alert("Please connect the insurance wallet first.");
            return;
        }

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

const submitClaimButton = document.getElementById("submitClaimButton");

if (submitClaimButton) {
    submitClaimButton.addEventListener("click", async () => {
        const patientAddress =
            document.getElementById("claimPatientAddress").value.trim();

        const treatment =
            document.getElementById("claimTreatment").value.trim();

        const amount =
            document.getElementById("claimAmount").value.trim();

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

            const tx = await contract.submitClaim(
                patientAddress,
                treatment,
                amount
            );

            alert("Transaction sent. Please confirm in MetaMask.");

            const receipt = await tx.wait();

            if (receipt.status === 1) {
                const count = await contract.claimCount();

                alert(
                    "Claim submitted successfully! Claim ID: " +
                    count.toString()
                );
            } else {
                alert("Transaction failed.");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to submit claim.");
        }
    });
}

function getClaimStatusName(statusNumber) {
    const statuses = ["Pending", "Approved", "Rejected"];
    return statuses[Number(statusNumber)] || "Unknown";
}

async function approveClaimAndSave(claimId) {
    const contract = await getInsuranceContract();

    const claimBeforeApproval = await contract.getClaim(claimId);

    const patientAddress = claimBeforeApproval[1];
    const treatment = claimBeforeApproval[3];
    const amount = claimBeforeApproval[4].toString();

    const tx = await contract.approveClaim(claimId);

    alert("Transaction sent. Please confirm in MetaMask.");

    const receipt = await tx.wait();

    if (receipt.status !== 1) {
        alert("Transaction failed.");
        return;
    }

    const companyWallet = await getCurrentWallet();

    const approvedInsuranceRecord = {
        patientAddress,
        coverage: "Approved",
        subsidy: treatment,
        eligibility: "$" + amount + " approved",
        companyWallet
    };

    const existingInsurance =
        JSON.parse(localStorage.getItem("insuranceRecords")) || [];

    const alreadySaved = existingInsurance.some(record =>
        record.patientAddress.toLowerCase() === patientAddress.toLowerCase() &&
        record.subsidy === treatment &&
        record.eligibility === "$" + amount + " approved"
    );

    if (!alreadySaved) {
        existingInsurance.push(approvedInsuranceRecord);

        localStorage.setItem(
            "insuranceRecords",
            JSON.stringify(existingInsurance)
        );
    }

    alert("Claim approved and added to the patient insurance page.");

    await displayPendingClaims();
}

async function rejectClaimAndRemove(claimId) {
    const contract = await getInsuranceContract();

    const tx = await contract.rejectClaim(claimId);

    alert("Transaction sent. Please confirm in MetaMask.");

    const receipt = await tx.wait();

    if (receipt.status === 1) {
        alert("Claim rejected. It will no longer appear in pending claims.");
        await displayPendingClaims();
    } else {
        alert("Transaction failed.");
    }
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
            await approveClaimAndSave(claimId);
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
            await rejectClaimAndRemove(claimId);
        } catch (error) {
            console.error(error);
            alert("Failed to reject claim.");
        }
    });
}

const viewClaimButton = document.getElementById("viewClaimButton");

if (viewClaimButton) {
    viewClaimButton.addEventListener("click", async () => {
        const claimId =
            document.getElementById("viewClaimIdInput").value.trim();

        const claimOutput =
            document.getElementById("claimOutput");

        if (!claimId) {
            alert("Please enter a claim ID.");
            return;
        }

        try {
            const contract = await getInsuranceContract();

            const claim = await contract.getClaim(claimId);

            claimOutput.innerHTML =
                "Claim ID: " + claim[0].toString() + "<br>" +
                "Patient: " + claim[1] + "<br>" +
                "Doctor: " + claim[2] + "<br>" +
                "Treatment: " + claim[3] + "<br>" +
                "Amount: $" + claim[4].toString() + "<br>" +
                "Status: " + getClaimStatusName(claim[5]);
        } catch (error) {
            console.error(error);
            alert("Failed to view claim.");
        }
    });
}

async function displayPendingClaims() {
    const pendingClaimsContainer =
        document.getElementById("pendingClaimsContainer");

    if (!pendingClaimsContainer) {
        return;
    }

    pendingClaimsContainer.innerHTML = "";

    try {
        const contract = await getInsuranceContract();
        const count = await contract.claimCount();

        let hasPendingClaims = false;

        for (let i = 1; i <= Number(count); i++) {
            const claim = await contract.getClaim(i);
            const status = Number(claim[5]);

            if (status !== 0) {
                continue;
            }

            hasPendingClaims = true;

            const card = document.createElement("div");

            card.classList.add("record-card");

            card.innerHTML = `
                <ul>
                    <li><strong>Claim ID:</strong> ${claim[0].toString()}</li>
                    <li><strong>Patient:</strong> ${claim[1]}</li>
                    <li><strong>Doctor:</strong> ${claim[2]}</li>
                    <li><strong>Treatment:</strong> ${claim[3]}</li>
                    <li><strong>Amount:</strong> $${claim[4].toString()}</li>
                    <li><strong>Status:</strong> Pending</li>
                </ul>

                <div class="buttons">
                    <button
                        class="grant approve-pending-claim"
                        data-claim-id="${claim[0].toString()}"
                    >
                        Approve
                    </button>

                    <button
                        class="revoke reject-pending-claim"
                        data-claim-id="${claim[0].toString()}"
                    >
                        Reject
                    </button>
                </div>
            `;

            pendingClaimsContainer.appendChild(card);
        }

        if (!hasPendingClaims) {
            pendingClaimsContainer.innerHTML = "<p>No pending claims.</p>";
        }

        document.querySelectorAll(".approve-pending-claim").forEach(button => {
            button.addEventListener("click", async () => {
                try {
                    await approveClaimAndSave(button.dataset.claimId);
                } catch (error) {
                    console.error(error);
                    alert("Failed to approve claim.");
                }
            });
        });

        document.querySelectorAll(".reject-pending-claim").forEach(button => {
            button.addEventListener("click", async () => {
                try {
                    await rejectClaimAndRemove(button.dataset.claimId);
                } catch (error) {
                    console.error(error);
                    alert("Failed to reject claim.");
                }
            });
        });
    } catch (error) {
        console.error(error);

        pendingClaimsContainer.innerHTML =
            "<p>Unable to load pending claims. Check the Insurance contract address.</p>";
    }
}

const medicalContainer =
    document.getElementById("medicalRecordsContainer");

if (medicalContainer) {
    getCurrentWallet().then(currentPatient => {
        if (!currentPatient) {
            medicalContainer.innerHTML = "<p>Please connect your wallet.</p>";
            return;
        }

        const medicalRecords =
            JSON.parse(localStorage.getItem("medicalRecords")) || [];

        const patientRecords =
            medicalRecords.filter(record =>
                record.patientAddress.toLowerCase() ===
                currentPatient.toLowerCase()
            );

        if (patientRecords.length === 0) {
            medicalContainer.innerHTML = "<p>No medical records found.</p>";
            return;
        }

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

const insuranceContainer =
    document.getElementById("insuranceRecordsContainer");

if (insuranceContainer) {
    getCurrentWallet().then(currentPatient => {
        if (!currentPatient) {
            insuranceContainer.innerHTML = "<p>Please connect your wallet.</p>";
            return;
        }

        const insuranceRecords =
            JSON.parse(localStorage.getItem("insuranceRecords")) || [];

        const patientInsurance =
            insuranceRecords.filter(record =>
                record.patientAddress.toLowerCase() ===
                currentPatient.toLowerCase()
            );

        if (patientInsurance.length === 0) {
            insuranceContainer.innerHTML = "<p>No insurance records found.</p>";
            return;
        }

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

const currentPatientSpan =
    document.getElementById("currentPatientWallet");

if (currentPatientSpan) {
    const savedPatient =
        localStorage.getItem("currentPatientWallet");

    if (savedPatient) {
        currentPatientSpan.innerText = savedPatient;
    } else {
        currentPatientSpan.innerText = "No current patient";
    }
}

const userName =
    document.getElementById("userName");

if (userName) {
    getCurrentWallet().then(wallet => {
        if (!wallet) {
            userName.innerText = "User";
            return;
        }

        wallet = wallet.toLowerCase();


        userName.innerText =
            names[wallet] || "User";
    });
}

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
    const wallet = await getCurrentWallet();

    if (!wallet) {
        alert("Please connect wallet first.");
        return;
    }

    const lowerWallet =
        wallet.toLowerCase();

    const allowedWallets =
        roleWallets[role];

    if (allowedWallets && allowedWallets.includes(lowerWallet)) {
        window.location.href = dashboardPage;
    } else {
        window.location.href = "landing-error.html";
    }
}

window.checkRoleAccess = checkRoleAccess;

displayConnectedWallet();
displayAssignedPatients();
displayPendingClaims();