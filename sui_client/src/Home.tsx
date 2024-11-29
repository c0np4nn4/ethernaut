import React from "react";
import { Link } from "react-router-dom";
import { Container, Heading, Button, Flex } from "@radix-ui/themes";

function Home() {
  return (
    <Container
      style={{
        backgroundColor: "#1E1E2F",
        color: "#FFFFFF",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Heading
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "3rem",
          fontWeight: "bold",
          marginBottom: "1rem",
        }}
      >
        The Suinaut 🚀
      </Heading>
      <p
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "1.25rem",
          marginBottom: "2rem",
          lineHeight: "1.6",
        }}
      >
        A Sui-based dApp challenge game inspired by Ethernaut. Test your skills in Sui Move with fun
        and engaging challenges.
      </p>
      <Flex
        style={{
          gap: "1.5rem",
        }}
      >
        <Link
          to="/challenge_1"
          style={{
            textDecoration: "none",
          }}
        >
          <Button
            style={{
              fontFamily: "Inter, sans-serif",
              backgroundColor: "#6C63FF",
              color: "#FFFFFF",
              padding: "1rem 2.5rem",
              borderRadius: "12px",
              fontSize: "1.125rem",
              fontWeight: "700",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(108, 99, 255, 0.5)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.2)";
            }}
          >
            🔢 Challenge 1: Counter
          </Button>
        </Link>
      </Flex>
    </Container>
  );
}

export default Home;

