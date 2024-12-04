import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "./Menu";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <AppBar position="fixed" style={{ backgroundColor: "rgb(78 69 74)" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h5"
            style={{
              flexGrow: 1,
              textAlign: "center",
              whiteSpace: "pre-wrap", // 改行を許可
              overflowWrap: "break-word", // 空白で改行
            }}
          >
            レスレリ DB
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* ヘッダーの高さ分のスペースを確保 */}
      <Menu open={menuOpen} toggleMenu={toggleMenu} />
    </>
  );
};

export default Header;
