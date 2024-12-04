import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import BuildIcon from "@mui/icons-material/Build";
import GroupIcon from "@mui/icons-material/Group"; // パーティー管理のアイコンを追加

const Menu = ({ open, toggleMenu }) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={toggleMenu}
      sx={{ "& .MuiDrawer-paper": { width: 250, backgroundColor: "#f5f5f5" } }}
    >
      <Box sx={{ p: 2, backgroundColor: "#3f51b5", color: "white" }}>
        <Typography variant="h6" noWrap>
          メニュー
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button component={Link} to="/" onClick={toggleMenu}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="ホーム" />
        </ListItem>
        {/* <ListItem button component={Link} to="/accessories" onClick={toggleMenu}>
          <ListItemIcon>
            <BuildIcon />
          </ListItemIcon>
          <ListItemText primary="装飾品管理" />
        </ListItem> */}
        <ListItem
          button
          component={Link}
          to="/partymanagement"
          onClick={toggleMenu}
        >
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="パーティー管理" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Menu;
