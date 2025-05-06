// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
}

interface IERC721 {
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

interface IERC1155 {
    function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes calldata data) external;
}

contract AtomicSwap {
    enum TokenType { ERC20, ERC721, ERC1155 }
    struct Offer {
        address tokenAddress;
        uint256 tokenIdOrAmount;
        TokenType tokenType;
    }
    struct Trade {
        address creator;
        address counterParty;
        Offer creatorOffer;
        Offer counterPartyOffer;
        bool creatorConfirmed;
        bool counterPartyConfirmed;
        bool cancelled;
        bool executed;

    }
    mapping(uint256 => Trade) public trades;
    uint256 public tradeCounter;
    event TradeCreated(uint256 tradeId, address creator, address counterParty);
    event TradeConfirmed(uint256 tradeId, address confirmer);
    event TradeCancelled(uint256 tradeId, address canceler);
    event TradeExecuted(uint256 tradeId);
    modifier onlyTradeParticipant(uint256 tradeId) {
        require(msg.sender == trades[tradeId].creator || msg.sender == trades[tradeId].counterParty, "Not authorized");
        _;
    }

    modifier tradeNotCancelled(uint256 tradeId) {
        require(!trades[tradeId].cancelled, "Trade has been cancelled");
        _;
    }

    function createTrade(
        address counterParty,
        address creatorTokenAddress, uint256 creatorTokenIdOrAmount, TokenType creatorTokenType,
        address counterPartyTokenAddress, uint256 counterPartyTokenIdOrAmount, TokenType counterPartyTokenType
     ) external {
        tradeCounter++;
        trades[tradeCounter] = Trade({
            creator: msg.sender,
            counterParty: counterParty,
            creatorOffer: Offer(creatorTokenAddress, creatorTokenIdOrAmount, creatorTokenType),
            counterPartyOffer: Offer(counterPartyTokenAddress, counterPartyTokenIdOrAmount, counterPartyTokenType),
            creatorConfirmed: false,
            counterPartyConfirmed: false,
            cancelled: false,
            executed : false
        });
        emit TradeCreated(tradeCounter, msg.sender, counterParty);
    }

    function confirmTrade(uint256 tradeId) external onlyTradeParticipant(tradeId) tradeNotCancelled(tradeId) {
        Trade storage trade = trades[tradeId];
        if (msg.sender == trade.creator) {
            trade.creatorConfirmed = true;
        } else if (msg.sender == trade.counterParty) {
            trade.counterPartyConfirmed = true;
        }
        emit TradeConfirmed(tradeId, msg.sender);
        if (trade.creatorConfirmed && trade.counterPartyConfirmed) {
            _executeTrade(tradeId);
        }
    }

    function cancelTrade(uint256 tradeId) external onlyTradeParticipant(tradeId) tradeNotCancelled(tradeId) {
        Trade storage trade = trades[tradeId];
        if (msg.sender == trade.creator) {
            trade.cancelled = true;
        }
        emit TradeCancelled(tradeId, msg.sender);
    }

    function _executeTrade(uint256 tradeId) internal {
        Trade storage trade = trades[tradeId];
        // Transfer assets atomically
        _transferAsset(trade.creator, trade.counterParty, trade.creatorOffer);   
       _transferAsset(trade.counterParty, trade.creator, trade.counterPartyOffer);
        trade.executed = true;
        emit TradeExecuted(tradeId);
    }

    function _transferAsset(address from, address to, Offer memory offer) internal {
    if (offer.tokenType == TokenType.ERC20) {
        IERC20(offer.tokenAddress).transferFrom(from, to, offer.tokenIdOrAmount);
    } else if (offer.tokenType == TokenType.ERC721) {
        IERC721(offer.tokenAddress).safeTransferFrom(from, to, offer.tokenIdOrAmount);
    } else if (offer.tokenType == TokenType.ERC1155) {
        IERC1155(offer.tokenAddress).safeTransferFrom(from, to, offer.tokenIdOrAmount, 1, "");
    }
}

}
