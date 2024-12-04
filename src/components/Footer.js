import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        p: 2,
        backgroundColor: "rgb(78 69 74)",
        color: "white",
        textAlign: "center",
        position: "initial",
        left: 0,
        paddingTop: "16px",
        padding: 0,
        paddingBottom: "16px",
        width: "100%",
        bottom: 0,
      }}
    >
      <Typography variant="body2">
        本サイトで扱うデータは「©コーエーテクモゲームス / Akatsuki Games
        Inc.」様に帰属します。
      </Typography>
      <Typography variant="body2">© teobject</Typography>
    </Box>
  );
};

export default Footer;
