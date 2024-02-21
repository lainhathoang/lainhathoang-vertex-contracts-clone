// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IERC20Base.sol";
import "./libraries/ERC20Helper.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Sequencer is OwnableUpgradeable {
    using ERC20Helper for IERC20Base;

    address public admin;

    event TransferCompleted(address indexed from, address indexed to, uint256 amount);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * NOTE: use subaccounts to approve tokens for this contract address before they can use this function
     *
     * @dev Transfer the specified amount of token 1 (address `_tokenAddress1`) to address `_to1`,
     * and transfer the specified amount of token 2 (address `_tokenAddress2`) to address `_to2`.
     *
     * @param _tokenAddress1 The address of token 1.
     * @param _amount1 The amount of token 1 to transfer.
     * @param _to1 The destination address for token 1.
     * @param _tokenAddress2 The address of token 2.
     * @param _amount2 The amount of token 2 to transfer.
     * @param _to2 The destination address for token 2.
     * @return true if the transaction is successful, otherwise returns false.
     */
    function swap(
        address _from1,
        address _to1,
        address _tokenAddress1,
        uint256 _amount1,
        address _from2,
        address _to2,
        address _tokenAddress2,
        uint256 _amount2
    ) internal returns (bool) {
        // check balances of token1 in _from1
        uint256 tokenBalance1 = IERC20Base(_tokenAddress1).balanceOf(_from1);
        require(tokenBalance1 >= _amount1, "Insufficient balance in the contract");

        // transfer amount of token1 to _to1
        bool success1 = IERC20Base(_tokenAddress1).transferFrom(_from1, _to1, _amount1);
        require(success1, "Token1 transfer failed");

        // check balances of token2 in _from2
        uint256 tokenBalance2 = IERC20Base(_tokenAddress2).balanceOf(_from2);
        require(tokenBalance2 >= _amount2, "Insufficient balance in the contract");

        // transfer amount of token2 to _to2
        bool success2 = IERC20Base(_tokenAddress2).transferFrom(_from2, _to2, _amount2);
        require(success2, "Token2 transfer failed");

        emit TransferCompleted(_from1, _to1, _amount1);
        emit TransferCompleted(_from2, _to2, _amount2);
        return true;
    }

    /**
     */
    function sequencerMatchOrder(
        address _sender1,
        address _sender2,
        address _token1,
        address _token2,
        uint256 _amount1,
        uint256 _amount2
    ) public {
        require(
            swap(_sender1, _sender2, _token1, _amount1, _sender2, _sender1, _token2, _amount2),
            "Failed to execute transaction"
        );
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can excute");
        _;
    }
}
