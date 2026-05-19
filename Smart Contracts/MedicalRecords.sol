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
            accessControl.hasAccess(patient, msg.sender),
            "No access"
        );

        return records[patient];
    }
}