// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";
import "./Logger.sol";

contract Faucet is Owned, Logger {
    mapping(address => bool) private funders;
    mapping(uint => address) private lutFunders;
    uint public numberOfFunders;

    modifier limitWithdrawAmount(uint withdrawAmount) {
        require(
            withdrawAmount <= 100000000000000000,
            "Can not withdraw more than 0.1 ether"
        );
        _;
    }

    receive() external payable {}

    function emitLog() public pure override returns (bytes32) {
        return "Hello World";
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function addFunds() external payable {
        address _funder = msg.sender;
        if (!funders[_funder]) {
            numberOfFunders++;
            funders[_funder] = true;
            lutFunders[numberOfFunders++] = _funder;
        }
    }

    function getFunderAtIndex(uint8 index) external view returns (address) {
        return lutFunders[index];
    }

    function withdraw(
        uint withdrawAmount
    ) external limitWithdrawAmount(withdrawAmount) {
        payable(msg.sender).transfer(withdrawAmount);
    }

    function getAllFunders() public view returns (address[] memory) {
        address[] memory _funders = new address[](numberOfFunders);
        for (uint8 i = 0; i < numberOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }

        return _funders;
    }
}
