# Block-Care-IFB452-Group30
## Project Overview
Block Care is a healthcare blockchain prototype that uses smart contracts to support secure medical data exchange between patients, doctors, and insurance companies. 

## Smart Contracts
1. **AccessControl.sol**: Manages patient-authorised access. Patients can grant or revoke doctor access.

2. **MedicalRecords.sol**: Allows authorised doctors to add patient medical records. Access is checked through the `AccessControl` contract.

3. **Insurance.sol**: Allows doctors to submit insurance/subsidy claims, which insurance companies can approve or reject.

## Stakeholders
* **Patient**: Grants/revokes access, views medical records, and views approved insurance records.
* **Doctor**: Views assigned patients, adds medical records, and submits insurance claims.
* **Insurance Company**: Reviews pending claims and approves or rejects them.

## Technologies Used
* Solidity
* Remix IDE
* Ganache
* MetaMask
* HTML
* CSS
* JavaScript
* ethers.js

## Setup Instructions
1. Open the `.sol` files in Remix using Chrome.
2. Compile the contracts using Solidity `0.8.20` and the Paris EVM version.
3. Start Ganache with at least three accounts:
   * Patient
   * Doctor
   * Insurance company
4. Import the first three Ganache accounts into MetaMask using their private keys.
5. In Remix, connect to MetaMask using the browser extension environment.
6. Deploy the contracts in this order:
   1. `AccessControl.sol`
   2. `MedicalRecords.sol`
      * Paste the deployed `AccessControl` address into the constructor before deploying.
   3. `Insurance.sol`
7. Copy the deployed contract addresses into the top of `app.js`:
8. Copy the imported MetaMask stakeholder wallet addresses into the stakeholder wallet section in `app.js`.

## Running the Application
1. Open `landing-page.html` using Live Server, or drag it into a browser tab.
2. Select the correct stakeholder wallet in MetaMask.
3. Click **Connect Wallet** in the app.
4. Confirm the MetaMask connection.
5. Select the matching role for the connected wallet.

## Changing Stakeholders: To switch between patient, doctor, and insurance company:
1. Log out of the Block Care app.
2. Open MetaMask.
3. Go to **Dapp Connections**.
4. Disconnect the Live Server site, such as `127.0.0.1:5500`.
5. Select the next stakeholder wallet.
6. Reconnect through the app.

## Prototype Notes
This project is designed as a local demo using Ganache, Remix, MetaMask, and a browser front-end.

Some wallet and contract addresses are manually added to `app.js` so the app can connect to the correct local accounts and deployed smart contracts. The main blockchain logic, including patient access control, is still handled through the Solidity contracts.

Some display data is also stored in `localStorage` to make the demo easier to run. In a larger production version, this would be replaced with stronger role management and a more reliable way of reading blockchain data, rather than relying on hard-coding.