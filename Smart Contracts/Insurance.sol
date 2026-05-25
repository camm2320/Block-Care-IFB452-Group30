// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Insurance {

    enum ClaimStatus {
        Pending,
        Approved,
        Rejected
    }

    struct Claim {
        uint id;
        address patient;
        address doctor;
        string treatment;
        uint amount;
        ClaimStatus status;
    }

    uint public claimCount;

    mapping(uint => Claim) public claims;

    function submitClaim(
        address patient,
        string memory treatment,
        uint amount
    ) public {
        claimCount++;

        claims[claimCount] = Claim(
            claimCount,
            patient,
            msg.sender,
            treatment,
            amount,
            ClaimStatus.Pending
        );
    }

    function approveClaim(uint claimId) public {
        require(claimId > 0 && claimId <= claimCount, "Invalid claim ID");
        claims[claimId].status = ClaimStatus.Approved;
    }

    function rejectClaim(uint claimId) public {
        require(claimId > 0 && claimId <= claimCount, "Invalid claim ID");
        claims[claimId].status = ClaimStatus.Rejected;
    }

    function getClaim(uint claimId)
        public
        view
        returns (
            uint id,
            address patient,
            address doctor,
            string memory treatment,
            uint amount,
            ClaimStatus status
        )
    {
        require(claimId > 0 && claimId <= claimCount, "Invalid claim ID");

        Claim memory c = claims[claimId];

        return (
            c.id,
            c.patient,
            c.doctor,
            c.treatment,
            c.amount,
            c.status
        );
    }
}