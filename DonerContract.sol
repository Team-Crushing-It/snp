// SPDX-License-Identifier: MIT


pragma solidity >=0.7.0 <0.9.0;

contract DonerContract{

    mapping (string => uint) public donersMap;

    constructor (string memory _donerName , uint _donationAmount) public{

        donersMap[_donerName] = _donationAmount;

    }

    function setAmount(string memory _donerName , uint _donationAmount ) public{

        donersMap[_donerName] = _donationAmount;
    }

        function getAmount(string memory _donerName  ) public view returns(uint){

        return donersMap[_donerName] ;
    }

} 

