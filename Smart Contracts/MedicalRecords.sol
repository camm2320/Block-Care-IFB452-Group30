// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AccessControl.sol";

contract MedicalRecords {

    AccessControl accessControl;

    struct Record {
        string diagnosis;
        address doctor;
        uint timestamp;
    }

    mapping(address => Record[]) private records;

    constructor(address accessAddress) {
        accessControl = AccessControl(accessAddress);
    }

    function addRecord(address patient, string memory diagnosis) public {
        require(
            accessControl.hasAccess(patient, msg.sender),
            "No access"
        );

        records[patient].push(Record(
            diagnosis,
            msg.sender,
            block.timestamp
        ));
    }

    function getRecords(address patient) public view returns (Record[] memory) {
        require(
            msg.sender == patient || accessControl.hasAccess(patient, msg.sender),
            "No access"
        );

        return records[patient];
    }

    function getLatestRecord(address patient)
        public
        view
        returns (
            string memory diagnosis,
            address doctor,
            uint256 timestamp
        )
    {
        require(
            msg.sender == patient || accessControl.hasAccess(patient, msg.sender),
            "No access"
        );

        require(records[patient].length > 0, "No records found");

        Record memory latestRecord = records[patient][records[patient].length - 1];

        return (
            latestRecord.diagnosis,
            latestRecord.doctor,
            latestRecord.timestamp
        );
    }
}