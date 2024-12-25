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
import GroupIcon from "@mui/icons-material/Group";
import SellIcon from "@mui/icons-material/Sell";

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
        <ListItem button component={Link} to="/memorias" onClick={toggleMenu}>
          <ListItemIcon>
            <SellIcon />
          </ListItemIcon>
          <ListItemText primary="メモリア管理" />
        </ListItem>
        <ListItem button component={Link} to="/weapons" onClick={toggleMenu}>
          <ListItemIcon>
            <img
              src={"../img/武器.png"}
              alt="武器"
              style={{ width: 24, height: 24 }}
            />
          </ListItemIcon>
          <ListItemText primary="武器一覧" />
        </ListItem>
        <ListItem button component={Link} to="/armors" onClick={toggleMenu}>
          <ListItemIcon>
            <img
              src={"../img/防具.png"}
              alt="防具"
              style={{ width: 24, height: 24 }}
            />
          </ListItemIcon>
          <ListItemText primary="防具一覧" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/accessories"
          onClick={toggleMenu}
        >
          <ListItemIcon>
            <img
              src={"../img/装飾品.png"}
              alt="装飾品"
              style={{ width: 24, height: 24 }}
            />
          </ListItemIcon>
          <ListItemText primary="装飾品一覧" />
        </ListItem>
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
