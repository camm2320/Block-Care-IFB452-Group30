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

    // Submit a new insurance claim
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

    // Approve a claim
    function approveClaim(uint claimId) public {
        claims[claimId].status = ClaimStatus.Approved;
    }

    // Reject a claim
    function rejectClaim(uint claimId) public {
        claims[claimId].status = ClaimStatus.Rejected;
    }

    // View claim details
    function getClaim(uint claimId)
        public
        view
        returns (
            uint,
            address,
            address,
            string memory,
            uint,
            ClaimStatus
        )
    {
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