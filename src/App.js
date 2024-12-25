import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./components/Header";
import Footer from "./components/Footer";
import TopPage from "./pages/TopPage";
import MemoriaPage from "./pages/MemoriaPage";
import AccessoryPage from "./pages/AccessoryPage";
import WeaponPage from "./pages/WeaponPage";
import ArmorPage from "./pages/ArmorPage";
import PartyManagementPage from "./pages/PartyManagementPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Helmet>
          <title>【レスレリ】レスレリアーナのアトリエ DB</title>
          <meta
            name="description"
            content="レスレリアーナのアトリエ(レスレリ)のキャラクター、装飾品、パーティー編成などを管理するWebツールです。キャラクターや装飾品は所持チェッカーや所持レアリティ管理ができます。詳細でキャラクターデータも閲覧できます。"
          />
          <meta
            property="og:title"
            content="【レスレリ】レスレリアーナのアトリエエ  DB"
          />
          <meta
            property="og:description"
            content="レスレリアーナのアトリエ(レスレリ)のキャラクター、装飾品、パーティー編成などを管理するWebツールです。キャラクターや装飾品は所持チェッカーや所持レアリティ管理ができます。詳細でキャラクターデータも閲覧できます。"
          />
          <meta property="og:image" content="img/ogp.png" />
          <meta property="og:url" content="https://resleridb.pages.dev/" />
          <meta
            name="keywords"
            content="レスレリアーナのアトリエ, レスレリ, DB, ツール, キャラクター所持チェッカー, レスレリDB"
          />
          <meta name="robots" content="index, follow" />
        </Helmet>
        <Header />
        <Switch>
          <Route path="/" exact component={TopPage} />
          <Route path="/memorias" component={MemoriaPage} />
          <Route path="/weapons" component={WeaponPage} />
          <Route path="/armors" component={ArmorPage} />
          <Route path="/accessories" component={AccessoryPage} />
          <Route path="/partymanagement" component={PartyManagementPage} />
        </Switch>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
