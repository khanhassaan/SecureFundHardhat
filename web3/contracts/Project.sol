// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

//Using library only for testing smart contract
library Types{
      enum ProjectStates{
        Fundraising,
        Expired,
        Successfull
    }

}

contract Project{


    //States For project(Only for fundraising) 
    // Fundraising= The campaign is accepting funds 
    // expired= Campaign is expired and deadline is passed
    //Successfull= Total amount for the project is received and now the campaign will no receive fund as well
    //  enum ProjectStates{
    //     Fundraising,
    //     Expired,
    //     Successfull
    // }
     //Struct for request
    struct withdrawRequest{
        string description;
        string ipfsFileHash;
        uint256 amount;
        uint256 noOfVotes;
        mapping(address => bool) voters;
        bool isCompleted;
        address payable reciptent;
    }
    //Variables
    address payable projectCreator;
    string projectName;
    string projectDescription;
    uint256[] timeline;
    uint256 targetAmount;
    uint256 public minimumContribution;
    uint256 public numberOfContributors;
    uint256 public raisedAmount;
    uint256 fundraisingDeadline;
    Types.ProjectStates public ProjectCurrentState= Types.ProjectStates.Fundraising;
    
    mapping(address=>uint256) public contributorsList;
    mapping(uint256=>withdrawRequest) public withdrawRequests;
   
    //Number of request made for fund withdrawal
    uint256 public numOfWithdrawRequests = 0;
    uint256 public amountRemaining=raisedAmount;
    uint256 public TotalvoteCount=0;
    //Event for funding received
    event FundingReceived(address contributor, uint amount, uint currentTotal);
    //event for creating request for fund
    event FundWithdrawRequest(
        uint256 requestId,
        string description,
        string ipfsFileHash,
        uint256 amount,
        uint256 noOfVotes,
        bool isCompleted,
        address reciptent
    );
    //Event for voting of fund withdrawl only done by investor
    event VoteForFundWithdrawl(
        address voter,
        uint256 voteCount
    );
    //Event for successfull withdrawl of funds
    event WithdrawlSuccessful(
        uint256 requestId,
        string description,
        string ipfsFileHash,
        uint256 amount,
        uint256 noOfVotes,
        bool isCompleted,
        address reciptent
    );


    constructor(address payable _projectCreator,
    string memory _projectName,
    string memory _projectDescription,
    uint256[] memory _timeline,
    uint256 _targetAmount,
    uint256 _minimumContribution,
    uint256 _fundraisinDeadline
    ) {
            projectCreator=_projectCreator;
            projectName=_projectName;
            projectDescription=_projectDescription;
            timeline=_timeline;
            targetAmount=_targetAmount;
            minimumContribution=_minimumContribution;
            fundraisingDeadline=_fundraisinDeadline;
    }
    
    //creating access only for 
    modifier _isCreater(){
        require(msg.sender== projectCreator,'No Access!');
        _;
    }
    //Checking project state for funding 
    modifier _validateExpiryForFunding(Types.ProjectStates _state){
     require(ProjectCurrentState==_state,'Invalid State Cannot Invest in this campaign');
     require(block.timestamp<fundraisingDeadline,'Deadline Passed!');
     _;
    }
    //Check project state for refund
    modifier _validateExpiry(Types.ProjectStates _state){
     checkCampaignStatus();
     require(ProjectCurrentState==_state,'Invalid State!');   
     _;
    }

    
    //Contribution amount
    function contribution(address _contributor)public _validateExpiryForFunding(Types.ProjectStates.Fundraising) payable{
        require(msg.value>minimumContribution && msg.value<=(targetAmount/2),'Contribution amount too low !');
        if(contributorsList[_contributor]==0){
            numberOfContributors++;
        }
        contributorsList[_contributor]+=msg.value;
        raisedAmount+=msg.value;
        emit FundingReceived(_contributor,msg.value,raisedAmount);
        checkCampaignStatus();
    }

    //Checking campaign funding status
    //check if campaign has got complete funding
    //check if deadline of campaign is passed 
    function checkCampaignStatus()internal{
        if(raisedAmount>=targetAmount){
            ProjectCurrentState=Types.ProjectStates.Successfull;
        }
        else if(block.timestamp>=fundraisingDeadline){
            ProjectCurrentState=Types.ProjectStates.Expired;
        }
    }

    //Refunding Amount if the campaign gets expired
    function refundInvestorsFund()public _validateExpiry(Types.ProjectStates.Expired) returns(bool){
        require(contributorsList[msg.sender] > 0, 'Your contribution to this project is 0!');
        address payable user = payable(msg.sender);
        user.transfer(contributorsList[msg.sender]);
        raisedAmount-=contributorsList[msg.sender];
        contributorsList[msg.sender] = 0;
        return true;
    }


    //Request for funds from front end
    function createFundRequest(string memory _description,string memory _IPFSfileHash, uint256 _amount,address payable _reciptent)public _isCreater() _validateExpiry(Types.ProjectStates.Successfull){
        require((timeline.length*2)>=numOfWithdrawRequests,'Cannot withdraw funds all request has been completed' );
        // require(timeline[numOfWithdrawRequests]<=block.timestamp,'The timeline passed');
        withdrawRequest storage newRequest=withdrawRequests[numOfWithdrawRequests];
        
        newRequest.description=_description;
        newRequest.ipfsFileHash=_IPFSfileHash;
        newRequest.amount=_amount;
        newRequest.noOfVotes=0;
        newRequest.isCompleted=false;
        newRequest.reciptent=_reciptent;
        emit FundWithdrawRequest(
            numOfWithdrawRequests,
            _description,
            _IPFSfileHash,
            _amount,
            0,
            false,
            _reciptent

        );
        numOfWithdrawRequests++;
    }


    //Function for votiing of withdrawl
    function VoteForWithdrawal(uint256 _requestID)public {
        require(contributorsList[msg.sender]>0,'Only contributors can vote for the campaign');
        withdrawRequest storage requestDetails = withdrawRequests[_requestID];
        require(requestDetails.voters[msg.sender]==false,'Youve voted for this campaign');
        requestDetails.voters[msg.sender]==true;
        requestDetails.noOfVotes+=1;
        TotalvoteCount+=1;
        emit VoteForFundWithdrawl(
            msg.sender,
            requestDetails.noOfVotes
        );
    }

    //withdraw requested amount
    function WithdrawRequestedAmount(uint256 _requestID)public _isCreater() _validateExpiry(Types.ProjectStates.Successfull){
        withdrawRequest storage RequestDetails =withdrawRequests[_requestID];
        require(RequestDetails.isCompleted==false,'Request Completed already');
        require(RequestDetails.noOfVotes>numberOfContributors/2,'Vote percentage is less than 50% cannot withdraw fund');
        RequestDetails.reciptent.transfer(RequestDetails.amount);
        raisedAmount=raisedAmount-RequestDetails.amount;
        RequestDetails.isCompleted=true;
        emit WithdrawlSuccessful(
            _requestID,
            RequestDetails.description,
            RequestDetails.ipfsFileHash,
            RequestDetails.amount,
            RequestDetails.noOfVotes,
            true,
            RequestDetails.reciptent
        );
    }

    //Get project details in frontend
    function getProjectDetails() external view returns(
    address payable projectStarter,
    uint256 minContribution,
    uint256[] memory projectDeadline,
    uint256 goalAmount,
    uint256 currentAmount, 
    string memory title,
    string memory desc,
    uint256 fundraisingDl,
    Types.ProjectStates currentState
    ){
        
        projectStarter=projectCreator;
        minContribution=minimumContribution;
        projectDeadline=timeline;
        goalAmount=targetAmount;
        currentAmount=raisedAmount;
        title=projectName;
        desc=projectDescription;
        fundraisingDl=fundraisingDeadline;
        currentState=ProjectCurrentState;
    }


    function getRequestsCount()public view returns(uint256){
        return numOfWithdrawRequests;
    }

    function getVoterCount() public view returns(uint256){
        return numberOfContributors;
    }
    
    

}

