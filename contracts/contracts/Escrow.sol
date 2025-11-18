// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Escrow {
    enum State { CREATED, FUNDED, WORK_SUBMITTED, ACCEPTED, DISPUTED, DISTRIBUTED, RESOLVED }

    struct EscrowData {
        address payer;
        address token;
        uint256 amount;
        State state;
        string demandId;
        address[] contributors;
        uint256[] shares;
    }

    mapping(string => EscrowData) public escrows;

    event EscrowCreated(string indexed demandId, address indexed payer, address token, uint256 amount);
    event EscrowFunded(string indexed demandId, uint256 amount);
    event WorkSubmitted(string indexed demandId);
    event EscrowAccepted(string indexed demandId);
    event EscrowDisputed(string indexed demandId, string reason);
    event EscrowDistributed(string indexed demandId, address[] contributors, uint256[] shares);

    function createEscrow(string memory _demandId, address _token, uint256 _amount) external {
        require(_amount > 0, "Amount must be > 0");
        escrows[_demandId] = EscrowData({
            payer: msg.sender,
            token: _token,
            amount: _amount,
            state: State.CREATED,
            demandId: _demandId,
            contributors: new address[](0),
            shares: new uint256[](0)
        });
        emit EscrowCreated(_demandId, msg.sender, _token, _amount);
    }

    function fund(string memory _demandId) external {
        EscrowData storage e = escrows[_demandId];
        require(e.state == State.CREATED, "Not created");
        require(msg.sender == e.payer, "Only payer");
        e.state = State.FUNDED;
        emit EscrowFunded(_demandId, e.amount);
    }

    function submitWork(string memory _demandId) external {
        EscrowData storage e = escrows[_demandId];
        require(e.state == State.FUNDED, "Not funded");
        e.state = State.WORK_SUBMITTED;
        emit WorkSubmitted(_demandId);
    }

    function accept(string memory _demandId, address[] memory _contributors, uint256[] memory _shares) external {
        EscrowData storage e = escrows[_demandId];
        require(e.state == State.WORK_SUBMITTED, "Not submitted");
        require(msg.sender == e.payer, "Only payer");
        require(_contributors.length == _shares.length, "Length mismatch");
        uint256 total = 0;
        for (uint i = 0; i < _shares.length; i++) total += _shares[i];
        require(total == 10000, "Shares must sum to 10000");
        e.contributors = _contributors;
        e.shares = _shares;
        e.state = State.ACCEPTED;
        emit EscrowAccepted(_demandId);
        // 真实分发：调用 token.transfer
        for (uint i = 0; i < _contributors.length; i++) {
            uint256 amt = (e.amount * _shares[i]) / 10000;
            IERC20(e.token).transfer(_contributors[i], amt);
        }
        e.state = State.DISTRIBUTED;
        emit EscrowDistributed(_demandId, _contributors, _shares);
    }

    function dispute(string memory _demandId, string memory reason) external {
        EscrowData storage e = escrows[_demandId];
        require(e.state == State.WORK_SUBMITTED, "Not submitted");
        require(msg.sender == e.payer, "Only payer");
        e.state = State.DISPUTED;
        emit EscrowDisputed(_demandId, reason);
    }

    function getEscrow(string memory _demandId) external view returns (EscrowData memory) {
        return escrows[_demandId];
    }
}