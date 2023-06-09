import Head from "next/head";
import NextLink from "next/link";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react"
import {
    Box,FormControl,FormLabel,Input,Stack,Button,Heading,Text,useColorModeValue,InputRightAddon,InputGroup,Alert,AlertIcon,
    AlertDescription,FormErrorMessage,FormHelperText,Textarea, InputAddon, InputRightElement
  } from "@chakra-ui/react";
import { NFTStorage } from 'nft.storage'
import { useAsync } from "react-use";
import { createNewWithdrawRequest, createWithdrawRequest, walletAddress } from "../../../../utils/interaction";
import Web3 from "web3";

//   export async function getServerSideProps({params}){
//     const campaignId=params.id;
//     return{
//         props:{
//             campaignId:campaignId
//         }
//     }
//   }



const API_TOKEN =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDEzQzRiMkIzNkJDMzU2NjJGQmU3QTE4NzYwQkViMjZGODkwMGRCNDYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4MjUwODQyNDM0OCwibmFtZSI6IkxZIFByb2plY3QifQ.GDav0yxBaEQZ24ggwXtlI-1ViWvXefS2iwYB1RVv7vo";

const NFT_STORAGE_CLIENT=new NFTStorage({
  token:API_TOKEN
})





  export default function NewRequest(props) {
    const router = useRouter();
    const { id } = router.query;
    const {
      handleSubmit,
      register,
      formState: { isSubmitting, errors },
    } = useForm({
      mode: "onChange",
    });
    const [error, setError] = useState("");

    //File handling related hooks 
    // setting and getting files
    const [loadingIPFS,setIPFSLoading]=useState(false);
    const[uploaded,setUploaded]=useState(false);
    const[file, setFile]=useState(null);
    const[ifpsURL,setIPFSurl]=useState();

    // // const [inUSD, setInUSD] = useState();
    // // const [ETHPrice, setETHPrice] = useState(0);
    // useAsync(async () => {
    //   try {
    //     // const result = await getETHPrice();
    //     // setETHPrice(result);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }, []);
    async function onSubmit(data) {
      // console.log(id)
      // console.log(data);
      // console.log(Web3.utils.toWei(data.value));
      //   const campaign = Campaign(id);
      console.log(ifpsURL);
      try {
      const accountAdd=await window.ethereum.request({method : "eth_requestAccounts"});
      console.log(accountAdd[0]);
      const IPFSFilehash=ifpsURL;
      await createNewWithdrawRequest(id,Web3.utils.toWei(data.value),accountAdd[0],IPFSFilehash,data.description)
        router.push(`/campaign/${id}`);
      } catch (err) {
        setError(err.message);
        console.log(err);
      }
    }

    const fileHandler=(e)=>{
      console.log(e.target.files[0]);
      setFile(e.target.files[0]);
      setUploaded(false);
    }
  async function uploadToIPFS(data){
    setIPFSLoading(true);
    console.log("called");
    const cid=await NFT_STORAGE_CLIENT.storeBlob(file);
    console.log("https://"+cid+".ipfs.nftstorage.link");
    setIPFSurl("https://"+cid+".ipfs.nftstorage.link");
    setIPFSLoading(false)
    setUploaded(true);
  }
    return (
      <div>
        <Head>
          <title>Create a Withdrawal Request</title>
          <meta name="description" content="Create a Withdrawal Request" />
          {/* <link rel="icon" href="/logo.svg" /> */}
        </Head>
        <main>
          <Stack spacing={8} mx={"auto"} maxW={"2xl"} py={12} px={6}>
            <Text fontSize={"lg"} color={"teal.400"} justifyContent="center">
              <ArrowBackIcon mr={2} />
              <NextLink href={`/campaign_created`}>
                Back to Requests
              </NextLink>
            </Text>
            <Stack>
              <Heading fontSize={"4xl"}>Create a Withdrawal Request 💸</Heading>
            </Stack>
            <Box
              rounded={"lg"}
              bg={useColorModeValue("white", "gray.700")}
              boxShadow={"lg"}
              p={8}
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                  <FormControl id="description">
                    <FormLabel>Request Description</FormLabel>
                    <Textarea
                      {...register("description", { required: true })}
                      isDisabled={isSubmitting}
                    />
                  </FormControl>
                  <FormControl id="value">
                    <FormLabel>Amount in Ether</FormLabel>
                    <InputGroup>
                      {" "}
                      <Input
                        type="number"
                        {...register("value", { required: true })}
                        isDisabled={isSubmitting}
                        // onChange={(e) => {
                        //   setInUSD(Math.abs(e.target.value));
                        // }}
                        step="any"
                      />{" "}
                      <InputRightAddon children="ETH" />
                    </InputGroup>
                    {/* {inUSD ? (
                      <FormHelperText>
                        ~$ {getETHPriceInUSD(ETHPrice, inUSD)}
                      </FormHelperText>
                    ) : null} */}
                  </FormControl>
  
                  <FormControl id="recipient">
                    <FormLabel htmlFor="recipient">
                      Recipient Ethereum Wallet Address
                    </FormLabel>
                    
                    <Input
                      name="recipient"
                      {...register("recipient", {
                        required: true,
                      })}
                      isDisabled={isSubmitting}
                    />
                  </FormControl>
                  <FormControl id="pdfFile">
                    <FormLabel htmlFor="pdfFile">
                      Choose File
                    </FormLabel>
                  
                   
                    <Input
                      
                      name="pdfFile"
                      {...register("pdfFile", {
                        required: false,
                      })}
                      isDisabled={isSubmitting}
                      type="file"
                      accept="application/pdf"
                      onChange={fileHandler}
                      
                    />
                    
                    
                  </FormControl>
                  
                  <Button
                        bg={"teal.400"}
                        color={"white"}
                        _hover={{
                          bg: "teal.500",
                        }}
                        isLoading={loadingIPFS}
                        isDisabled={uploaded}
                        type="button"
                        onClick={uploadToIPFS}
                      >
                        Upload File to IPFS
                      </Button>
                  {errors.description || errors.value || errors.recipient ? (
                    <Alert status="error">
                      <AlertIcon />
                      <AlertDescription mr={2}>
                        {" "}
                        All Fields are Required
                      </AlertDescription>
                    </Alert>
                  ) : null}
                  {error ? (
                    <Alert status="error">
                      <AlertIcon />
                      <AlertDescription mr={2}> {error}</AlertDescription>
                    </Alert>
                  ) : null}
                  <Stack spacing={10}>
                    {/* {wallet.status === "connected" ? ( */}
                      <Button
                        bg={"teal.400"}
                        color={"white"}
                        _hover={{
                          bg: "teal.500",
                        }}
                        isDisabled={!uploaded}
                        isLoading={isSubmitting}
                        type="submit"
                      >
                        Create Withdrawal Request
                      </Button>
                    {/* ) 
                     : (
                      <Stack spacing={3}>
                        <Button
                          color={"white"}
                          bg={"teal.400"}
                          _hover={{
                            bg: "teal.300",
                          }}
                          onClick={() => wallet.connect()}
                        >
                          Connect Wallet{" "}
                        </Button>
                        <Alert status="warning">
                          <AlertIcon />
                          <AlertDescription mr={2}>
                            Please Connect Your Wallet First to Create a Campaign
                          </AlertDescription>
                        </Alert>
                      </Stack>
                    )} */}
                  </Stack>
                </Stack>
              </form>
            </Box>
          </Stack>
        </main>
      </div>
    );
  }