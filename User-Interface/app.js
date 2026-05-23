const connectButton = document.getElementById("connectWallet");

connectButton.addEventListener("click", async () => {

    if (typeof window.ethereum !== "undefined") {

        try {

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            });

            console.log("Connected:", accounts[0]);

            connectButton.innerText =
                "Connected: " +
                accounts[0].substring(0, 6) +
                "..." +
                accounts[0].substring(accounts[0].length - 4);

        } catch (error) {

            console.log(error);

        }

    } else {

        alert("MetaMask is not installed.");

    }

});