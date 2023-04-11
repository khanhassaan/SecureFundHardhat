import Web3 from "web3";
import CrowdFund from '../../artifacts/contracts/CrowdFund.sol/CrowdFund.json';
import Project from '../../artifacts/contracts/Project.sol/Project.json';
import { projectDataFormatter, withdrawRequestDataFormatter } from "./helper";

const crowdFundingContractAddress ="0xD6A108A2E80367073D418F40Aa04cFA866b0969e";
// "0xAd4dea702670DCFAFE7D4Ce45Fc2b6717D4412DE";
// "0xec906776F55796665906c5eb4E25cfD89C3Fb3fF";
// "0x13c3bb6C95b031a8edD3a0d1a787E54b2d411faf";
// "0x25dB04F809Ddfb17511656bAF1d04E8442382881"; 
// "0x71C31B92944Ce5cE87c54493D3FD844aC7ab7401";

const web3=new Web3(Web3.givenProvider||"http://localhost:8545");


export const walletAddress=async()=>{
  const accountAdd=await web3.eth.getAccounts();
  // const accountAdd=await window.ethereum.request({method : "eth_requestAccounts"});
  return accountAdd[0];
}

export const loadCrowdFundingContract = async() =>{
    const crowdFunding =  new web3.eth.Contract(CrowdFund.abi,crowdFundingContractAddress);
    return crowdFunding;
  }

export const loadProjectContract=async(projectID)=>{
  const ProjectContract=  new web3.eth.Contract(Project.abi,projectID);
  return ProjectContract
}

  //
  export const getAllFunding = async() =>{
   const getcaller=await loadCrowdFundingContract();
    const fundingProjectList = await getcaller.methods.getTotalProjects().call();
    
     const projectContracts = [];
     const projects = [];
  
     await Promise.all(fundingProjectList.map(async (data)=>{
      var projectConnector = new web3.eth.Contract(Project.abi,data);
      const details = await projectConnector.methods.getProjectDetails().call()
      projectContracts.push(projectConnector);
      const formattedProjectData = projectDataFormatter(details,data)
      projects.push(formattedProjectData)
     }))
     return projects;
  
  }

  export const getProjectInformation = async(projectID) =>{
     
      // const projectContracts = [];
      
      var projectConnector = new web3.eth.Contract(Project.abi,projectID);
      const details = await projectConnector.methods.getProjectDetails().call()
      const formattedProjectData = projectDataFormatter(details,projectID)
      return formattedProjectData;
   
   }

   export const contributeToProject =async (contractAddress, amount,account)=>{
    const getcaller=await loadCrowdFundingContract();
    // const fundingProjectList = await getcaller.methods.getTotalProjects().call();
    // const {contractAddress,amount,account} = data;
    await getcaller.methods.contribute(contractAddress).send({from:account,value:amount})
    .on('error', function(error){ 
      console.log(error);
    })
   }

   export const createNewWithdrawRequest = async (projectID,amount,recipient,IPFSFilehash,description) =>{
    // const {description,amount,recipient,account} = data;
    var projectConnector = new web3.eth.Contract(Project.abi,projectID);
     const request= await projectConnector.methods.createFundRequest(description,IPFSFilehash,amount,recipient).send({from:recipient})
      .on('error', function(error){ 
          console.log(error);
        })
        console.log(request);
      // .on('receipt', function(receipt){
      //   const withdrawReqReceipt = receipt.events.FundWithdrawRequest.returnValues;
      //   const formattedReqData = withdrawRequestDataFormatter(withdrawReqReceipt,withdrawReqReceipt.requestId)
      //   return formattedReqData
      // })
      // .on('error', function(error){ 
      //   console.log(error.message);
      // })
  }


  export const getAllWithdrawRequest = async (ProjectID) =>{
    var projectConnector = new web3.eth.Contract(Project.abi,ProjectID);
    var withdrawRequestCount = await projectConnector.methods.numOfWithdrawRequests().call();
    var withdrawRequests = [];
  
    for(var i=1;i<=withdrawRequestCount;i++){
      const req = await projectConnector.methods.withdrawRequests(i-1).call();
      withdrawRequests.push(withdrawRequestDataFormatter({...req,requestId:i-1}));
      // console.log(withdrawRequests[0].amount);
    }
    return withdrawRequests;
  }

// export const getVoterCount=async(projectID)=>{
//   var projectConnector = new Web3.eth.Contract(Project.abi,projectID);
//   var getVoteEvent = await projectConnector.methods.numOfWithdrawRequests().call();
//   const getVoteCount = await getVoteEvent.getPastEvents("ContributionReceived",{
//     filter: { contributor: account },
//     fromBlock: 0,
//     toBlock: 'latest'
//   })

// }

export const getRequestCount=async(projectID)=>{
  var projectConnector = new web3.eth.Contract(Project.abi,projectID);
  const requestCount = await projectConnector.methods.getRequestsCount().call();
  return requestCount;
}
export const getVoteCount=async(projectID)=>{
  var projectConnector = new web3.eth.Contract(Project.abi,projectID);
  const approversCount = await projectConnector.methods.getVoterCount().call();
  
  return approversCount;
}

export const voteWithdrawRequest = async (projectID,reqId,account) =>{
  var projectConnector = new web3.eth.Contract(Project.abi,projectID);
  await projectConnector.methods.voteWithdrawRequest(reqId).send({from:account})


}
