import React, { useState } from "react";
import { ConnectButton, useAccounts, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading, Button, Text } from "@radix-ui/themes";
import { Transaction } from "@mysten/sui/transactions";
import { toHex, fromHex, bcs, fromBase64 } from "@mysten/bcs";

function App() {
  const accounts = useAccounts(); // 현재 연결된 계정 가져오기
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction(); // 트랜잭션 서명 및 실행
  const [counterId, setCounterId] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const createCounter = async () => {
    if (!accounts || accounts.length === 0) {
      setMessage("Please connect your wallet.");
      return;
    }

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `0x53fb0bdca605ba3883d72f012ffd07022501c9db0f58376829918a7317c12f1b::Counter::create_object`,
        arguments: [],
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
        chain: 'sui:localnet'
      });

      console.log('result:', result);

      // 역직렬화(Deserialize) 샘플 데이터
      const b64Tx = result.bytes;
      const bcsTx = fromBase64(b64Tx);
      console.log('bcs encoded tx:', bcsTx);

      // try {
      //   // 역직렬화
      //   const decoded = TransactionEffects.parse(bcsTx);
      //   console.log("Decoded Object:", JSON.stringify(decoded, null, 2));

      //   // 직렬화
      //   const serialized = TransactionEffects.serialize(decoded).toHex();
      //   console.log("Serialized Hex:", serialized);
      // } catch (error) {
      //   console.error("Error during BCS operations:", error);
      // }

      const newCounterId = result.effects?.created?.[0]?.reference?.objectId;

      if (newCounterId) {
        setCounterId(newCounterId);
        setMessage(`Counter created successfully! ID: ${newCounterId}`);
      } else {
        setMessage("Failed to create Counter.");
      }
    } catch (error) {
      console.error("Error creating Counter:", error);
      setMessage("Transaction failed.");
    }
  };

  const incrementCounter = async () => {
    if (!counterId) {
      setMessage("No Counter ID found. Create a Counter first.");
      return;
    }

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `0x53fb0bdca605ba3883d72f012ffd07022501c9db0f58376829918a7317c12f1b::Counter::increment`,
        arguments: [tx.object(counterId)],
      });

      await signAndExecuteTransaction({
        transaction: tx,
        options: { showEffects: true, showEvents: true },
      });

      setMessage("Counter incremented successfully!");
    } catch (error) {
      console.error("Error incrementing Counter:", error);
      setMessage("Transaction failed.");
    }
  };

  const getCounter = async () => {
    if (!counterId) {
      setMessage("No Counter ID found. Create a Counter first.");
      return;
    }

    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `0x53fb0bdca605ba3883d72f012ffd07022501c9db0f58376829918a7317c12f1b::Counter::get_count`,
        arguments: [tx.object(counterId)],
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
        options: { showEffects: true, showEvents: true },
      });


      const currentCount = result.effects?.events?.[0]?.parsedJson?.value || null;
      setCount(currentCount);
      setMessage(`Counter value: ${currentCount}`);
    } catch (error) {
      console.error("Error fetching Counter value:", error);
      setMessage("Error fetching Counter value.");
    }
  };

  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>Counter Challenge</Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          {/* Counter Actions */}
          <Box mt="4">
            <Button onClick={createCounter}>Create Counter</Button>
            <Button onClick={incrementCounter} disabled={!counterId} ml="2">
              Increment Counter
            </Button>
            <Button onClick={getCounter} disabled={!counterId} ml="2">
              Get Counter Value
            </Button>
          </Box>

          {/* Display Results */}
          <Box mt="4">
            {message && <Text>{message}</Text>}
            {count !== null && <Text>Current Count: {count}</Text>}
          </Box>
        </Container>
      </Container>
    </>
  );
}

export default App;

