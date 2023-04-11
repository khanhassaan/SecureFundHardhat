import React, { useState } from "react";
import Head from "next/head";
import { useAsync } from "react-use";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Flex, Box, FormControl, FormLabel,Input,Stack,
Button,Heading,Text,useColorModeValue,InputRightAddon,InputGroup,Alert,AlertIcon,AlertDescription,FormHelperText,
  Textarea,} from "@chakra-ui/react";
import NextLink from "next/link";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { loadCrowdFundingContract } from "../utils/interaction";
import moment from "moment";
import Web3 from "web3";

export default function createcampaign(){

  const [minContri, setMinContri] = useState();
  const [target, setTarget] = useState();
  const [timeline, setTimeLine]=useState([]);
  

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: "onChange",
  });
  const router = useRouter();
  const [error, setError] = useState("");


  async function onSubmit(data){
    timeline.push(moment(data.fwdate1).unix(),moment(data.fwdate2).unix(),moment(data.fwdate3).unix());
    console.log(data.campaignName);
    console.log(data.description);
    console.log(timeline);
    console.log( Web3.utils.toWei(data.target, "ether"));
    console.log(Web3.utils.toWei(data.minimumContribution, "ether"));
    console.log(moment(data.campaignEndDate).unix())
    try {
      const accountAdd=await window.ethereum.request({method : "eth_requestAccounts"});
      const contractAddress=await loadCrowdFundingContract();
      console.log(contractAddress);
      await contractAddress.methods.createProject(
          data.campaignName,
          data.description,
          timeline,
          Web3.utils.toWei(data.target, "ether"),
          Web3.utils.toWei(data.minimumContribution, "ether"),
          moment(data.campaignEndDate).unix()
        )
        .send({
          from: accountAdd[0],
        });

      router.push("/");
    } catch (error) {
      setError(error);
      console.log(error);
    }
  }

  return (
    <div>
    <Head>
      <title>New Campaign</title>
      <meta name="description" content="Create New Campaign" />
      {/* <link rel="icon" href="/logo.svg" /> */}
    </Head>
    <main >
      <Stack spacing={8} mx={"auto"} maxW={"2xl"} py={12} px={6}>
        <Text fontSize={"lg"} color={"teal.400"}>
          <ArrowBackIcon mr={2} />
          <NextLink href="/"> Back to Home</NextLink>
        </Text>
        <Stack>
          <Heading fontSize={"4xl"}>Create a New Campaign 📢</Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
            <FormControl id="campaignName">
                <FormLabel>Campaign Name</FormLabel>
                <Input
                  {...register("campaignName", { required: false })}
                  isDisabled={isSubmitting}
                />
              </FormControl>
              <FormControl id="description">
                <FormLabel>Campaign Description</FormLabel>
                <Textarea
                  {...register("description", { required: false })}
                  isDisabled={isSubmitting}
                />
              </FormControl>
              <FormControl id="minimumContribution">
                <FormLabel>Minimum Contribution Amount</FormLabel>
                <InputGroup>
                  {" "}
                  <Input
                    type="number"
                    step="any"
                    {...register("minimumContribution", { required: false })}
                    isDisabled={isSubmitting}
                    onChange={(e) => {
                      setMinContri(Math.abs(e.target.value));
                    }}
                  />{" "}
                  <InputRightAddon children="ETH" />
                </InputGroup>
              </FormControl>
              <FormControl id="target">
                <FormLabel>Target Amount</FormLabel>
                <InputGroup>
                  <Input
                    type="number"
                    step="any"
                    {...register("target", { required: false })}
                    isDisabled={isSubmitting}
                    onChange={(e) => {
                      setTarget(Math.abs(e.target.value));
                    }}
                  />
                  <InputRightAddon children="ETH" />
                </InputGroup>
               
              </FormControl>
              
              
              {/* Date time picker */}
              <FormControl id="campaignEndDate">
                <FormLabel>Fund Raising  End Date</FormLabel>
                <Input type={"datetime-local"}
                  {...register("campaignEndDate", { required: false })}
                  isDisabled={isSubmitting}
                />
              </FormControl>
              {/* <FormControl id="imageUrl">
                <FormLabel>Image URL</FormLabel>
                <Input
                  {...register("imageUrl", { required: true })}
                  isDisabled={isSubmitting}
                  type="url"
                />
              </FormControl> */}
              
              <FormControl id="fwdate1">
                <FormLabel>Fund Withdrawal Date & Time </FormLabel>
                <Input type={"datetime-local"}
                  {...register("fwdate1", { required: true })}
                  isDisabled={isSubmitting}
                  
                  
                />

              </FormControl>
              <FormControl id="fwdate2">
                <FormLabel> </FormLabel>
                <Input type={"datetime-local"}
                  {...register("fwdate2", { required: false })}
                  isDisabled={isSubmitting}
                 
                />
              </FormControl>
              <FormControl id="fwdate3">
                <FormLabel> </FormLabel>
                <Input type={"datetime-local"}
                  {...register("fwdate3", { required: false })}
                  isDisabled={isSubmitting}
                 
                />
              </FormControl>
              {error ? (
                <Alert status="error">
                  <AlertIcon />
                  <AlertDescription mr={2}> {error}</AlertDescription>
                </Alert>
              ) : null}
              {errors.minimumContribution ||
              errors.name ||
              errors.description ||
              errors.imageUrl ||
              errors.target ? (
                <Alert status="error">
                  <AlertIcon />
                  <AlertDescription mr={2}>
                    {" "}
                    All Fields are Required
                  </AlertDescription>
                </Alert>
              ) : null}
              {/* <Stack spacing={10}>
                {wallet.status === "connected"  ? (
                  <Button
                    bg={"teal.400"}
                    color={"white"}
                    _hover={{
                      bg: "teal.500",
                    }}
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    Create
                  </Button>
                ) : (
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
                )}
              </Stack> */}
              <Stack spacing={10}>
              <Button
                    bg={"teal.400"}
                    color={"white"}
                    _hover={{
                      bg: "teal.500",
                    }}
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    Create
                  </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </main>
  </div>
  );


}