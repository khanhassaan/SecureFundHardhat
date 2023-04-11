import moment from "moment";
import Web3 from "web3";

export const state = ["Fundraising","Expired","Successful"];
export const projectDataFormatter = (data,contractAddress) =>{
  // const date=new Date(parseInt(data.fundraisingDl)*1000);
  // const fundraisingDL=date.getDate()+"/"+date.getMonth()+1+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
    const formattedData = {
      address:contractAddress,
      creator:data?.projectStarter,
      title:data.title,
      description:data.desc,
      minContribution: data.minContribution,
      // Web3.utils.fromWei(data.minContribution),
      goalAmount: Web3.utils.fromWei(data.goalAmount),
    //    weiToEther(data.goalAmount),
      currentAmount:Web3.utils.fromWei(data.currentAmount),
      state:state[Number(data.currentState)],
      deadline:
      // Date(data.fundraisingDl),
      moment.unix(data.fundraisingDl).toDate().toString(),
      // Date(parseInt(data.fundraisingDl)*1000).slice(0,24),
    //   moment().toDate(),
      timeline:data.projectDeadline,
    //   unixToDate(Number()),
      progress:Math.round((Number(Web3.utils.fromWei(data.currentAmount))/Number(Web3.utils.fromWei(data.goalAmount)))*100)
    }
    return formattedData;
  }


  export const withdrawRequestDataFormatter = (data) =>{
    return{
       requestId:data.requestId,
       totalVote:data.noOfVotes,
       amount:data.amount,
       status:data.isCompleted?"Completed":"Pending",
       desc:data.description,
       reciptant:data.reciptent,
       ipfslink:data.ipfsFileHash
      }
  }