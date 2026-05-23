// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AccessControl {
    
    mapping(address => mapping(address => bool)) public access;

    function grantAccess(address user) public {
        access[msg.sender][user] = true;
    }

    function revokeAccess(address user) public {
        access[msg.sender][user] = false;
    }

    function hasAccess(address patient, address user) public view returns (bool) {
        return access[patient][user];
    }
}