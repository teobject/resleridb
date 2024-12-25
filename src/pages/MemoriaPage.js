import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Grid,
  Container,
  IconButton,
  Modal,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Button,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { toPng } from "html-to-image";
import memoriadata from "../jsons/memoria.json";
import Image from "../components/Image";

const TopPage = () => {
  const [memorias, setMemorias] = useState([]);
  const [filteredMemorias, setFilteredMemorias] = useState([]);
  const [selectedMemoria, setSelectedMemoria] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [effectSearchText, setEffectSearchText] = useState("");
  const [filters, setFilters] = useState({
    role: [],
    element: [],
    // race: [],
    // affiliation: [],
    possession: "all",
  });
  const [sortOrder, setSortOrder] = useState("no");
  const screenshotRef = useRef(null);
  const [spdOptions, setSpdOptions] = useState([]);

  const rarityOptions = ["R", "SR", "SSR"];

  useEffect(() => {
    const storedMemorias = memoriadata.map((memoria) => {
      const storedMemoria = localStorage.getItem(`memoria-${memoria.no}`);
      const parseStoredMemoria = storedMemoria
        ? JSON.parse(storedMemoria)
        : null;
      if (parseStoredMemoria) {
        if (parseStoredMemoria.no === memoria.no) {
          parseStoredMemoria.memoriararerity = memoria.memoriararerity;
          parseStoredMemoria.name = memoria.name;
          parseStoredMemoria.hp = memoria.hp;
          parseStoredMemoria.spd = memoria.spd;
          parseStoredMemoria.atk = memoria.atk;
          parseStoredMemoria.def = memoria.def;
          parseStoredMemoria.matk = memoria.matk;
          parseStoredMemoria.mdef = memoria.mdef;
          parseStoredMemoria.effect = memoria.effect;
          parseStoredMemoria.date = memoria.date;
          localStorage.setItem(
            `memoria-${parseStoredMemoria.no}`,
            JSON.stringify(parseStoredMemoria)
          );
        }
      }
      return storedMemoria ? JSON.parse(storedMemoria) : memoria;
    });
    setMemorias(storedMemorias);
    const initialFilters = {
      ...filters,
      memoriararerity: rarityOptions,
    };
    setFilters(initialFilters);
    filterMemorias(
      storedMemorias,
      searchText,
      initialFilters,
      "date",
      effectSearchText
    );
    const uniqueSpd = [...new Set(memoriadata.map((memoria) => memoria.spd))];
    setSpdOptions(uniqueSpd);
    // eslint-disable-next-line
  }, []);

  const togglePossession = (no) => {
    const updatedMemorias = memorias.map((memoria) => {
      if (memoria.no === no) {
        memoria.possessed = !memoria.possessed;
        localStorage.setItem(`memoria-${no}`, JSON.stringify(memoria));
      }
      return memoria;
    });
    setMemorias(updatedMemorias);
    filterMemorias(
      updatedMemorias,
      searchText,
      filters,
      sortOrder,
      effectSearchText
    );
  };

  const changeRarity = (no, newRarity) => {
    const updatedMemorias = memorias.map((memoria) => {
      if (memoria.no === no) {
        memoria.rarity = newRarity;
        localStorage.setItem(`memoria-${no}`, JSON.stringify(memoria));
      }
      return memoria;
    });
    setMemorias(updatedMemorias);
    filterMemorias(
      updatedMemorias,
      searchText,
      filters,
      sortOrder,
      effectSearchText
    );
  };

  const handleOpenModal = (memoria) => {
    setSelectedMemoria(memoria);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedMemoria(null);
  };

  const handleSearchChange = (event) => {
    const text = event.target.value;
    setSearchText(text);
    filterMemorias(memorias, text, filters, sortOrder, effectSearchText);
  };

  const handleEffectSearchChange = (event) => {
    const text = event.target.value;
    setEffectSearchText(text);
    filterMemorias(memorias, searchText, filters, sortOrder, text);
  };

  const togglePossessionFilter = () => {
    const newFilters = { ...filters };
    newFilters.possession =
      newFilters.possession === "all"
        ? "possessed"
        : newFilters.possession === "possessed"
        ? "notPossessed"
        : "all";
    setFilters(newFilters);
    filterMemorias(
      memorias,
      searchText,
      newFilters,
      sortOrder,
      effectSearchText
    );
  };

  const handleSpdFilterChange = (event) => {
    const spd = event.target.value;
    const newFilters = { ...filters, spd: spd };
    setFilters(newFilters);
    filterMemorias(
      memorias,
      searchText,
      newFilters,
      sortOrder,
      effectSearchText
    );
  };

  const toggleRarityFilter = (rarity) => {
    const newFilters = { ...filters };
    if (
      newFilters.memoriararerity &&
      newFilters.memoriararerity.includes(rarity)
    ) {
      newFilters.memoriararerity = newFilters.memoriararerity.filter(
        (r) => r !== rarity
      );
    } else {
      newFilters.memoriararerity = [
        ...(newFilters.memoriararerity || []),
        rarity,
      ];
    }
    setFilters(newFilters);
    filterMemorias(
      memorias,
      searchText,
      newFilters,
      sortOrder,
      effectSearchText
    );
  };

  const filterMemorias = (
    memorias,
    nameText,
    filters,
    sortOrder,
    effectText
  ) => {
    let filtered = memorias;
    if (nameText) {
      filtered = filtered.filter((memoria) => memoria.name.includes(nameText));
    }
    Object.keys(filters).forEach((filterType) => {
      if (filterType !== "possession" && filters[filterType].length > 0) {
        filtered = filtered.filter((memoria) =>
          filters[filterType].includes(memoria[filterType])
        );
      }
    });
    if (filters.possession === "possessed") {
      filtered = filtered.filter((memoria) => memoria.possessed);
    } else if (filters.possession === "notPossessed") {
      filtered = filtered.filter((memoria) => !memoria.possessed);
    }
    if (effectText) {
      filtered = filtered.filter((memoria) =>
        memoria.effect.includes(effectText)
      );
    }
    if (sortOrder === "name") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered = filtered.sort((a, b) => a.no - b.no);
    }
    setFilteredMemorias(filtered);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    filterMemorias(memorias, searchText, filters, order, effectSearchText);
  };

  const handleScreenshot = () => {
    if (screenshotRef.current === null) {
      return;
    }

    toPng(screenshotRef.current, { backgroundColor: "white" })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "screenshot.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error("Failed to take screenshot", err);
      });
  };

  const romanize = (num) => {
    if (isNaN(num)) return NaN;
    const digits = String(+num).split("");
    const key = [
      "",
      "C",
      "CC",
      "CCC",
      "CD",
      "D",
      "DC",
      "DCC",
      "DCCC",
      "CM",
      "",
      "X",
      "XX",
      "XXX",
      "XL",
      "L",
      "LX",
      "LXX",
      "LXXX",
      "XC",
      "凸無し",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
    ];
    let roman = "";
    let i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
  };

  return (
    <Container>
      <TextField
        label="メモリア名"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchText}
        onChange={handleSearchChange}
      />
      <TextField
        label="効果検索"
        variant="outlined"
        fullWidth
        margin="normal"
        value={effectSearchText}
        onChange={handleEffectSearchChange}
      />
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Select
          value={filters.spd || ""}
          onChange={handleSpdFilterChange}
          displayEmpty
          sx={{ flexGrow: 1 }}
        >
          <MenuItem value="">
            <em>素早さ全て</em>
          </MenuItem>
          {spdOptions.map((spd) => (
            <MenuItem key={spd} value={spd}>
              {spd}
            </MenuItem>
          ))}
        </Select>
        {rarityOptions.map((rarity) => (
          <Button
            key={rarity}
            variant="outlined"
            onClick={() => toggleRarityFilter(rarity)}
            sx={{
              border: "1px solid grey",
              padding: 0,
              flexGrow: 1,
              backgroundColor:
                filters.memoriararerity &&
                filters.memoriararerity.includes(rarity)
                  ? "#00BFFF"
                  : "inherit",
              color:
                filters.memoriararerity &&
                filters.memoriararerity.includes(rarity)
                  ? "white"
                  : "inherit",
              fontWeight:
                filters.memoriararerity &&
                filters.memoriararerity.includes(rarity)
                  ? "bold"
                  : "normal",
            }}
          >
            {rarity}
          </Button>
        ))}
      </Box>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button
          variant="outlined"
          onClick={() => handleSort("date")}
          sx={{
            border: "1px solid grey",
            padding: 0,
            flexGrow: 1,
            backgroundColor: sortOrder === "date" ? "#00bfff" : "inherit",
            color: sortOrder === "date" ? "white" : "inherit",
            fontWeight: sortOrder === "date" ? "bold" : "normal",
          }}
        >
          実装順
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleSort("name")}
          sx={{
            border: "1px solid grey",
            padding: 0,
            flexGrow: 1,
            backgroundColor: sortOrder === "name" ? "#00bfff" : "inherit",
            color: sortOrder === "name" ? "white" : "inherit",
            fontWeight: sortOrder === "name" ? "bold" : "normal",
          }}
        >
          名前順
        </Button>

        <Button
          variant="outlined"
          onClick={togglePossessionFilter}
          sx={{
            border: "1px solid grey",
            padding: 0,
            flexGrow: 1,
            backgroundColor:
              filters.possession !== "all" ? "#00bfff" : "inherit",
            color: filters.possession !== "all" ? "white" : "inherit",
            fontWeight: filters.possession !== "all" ? "bold" : "normal",
          }}
        >
          {filters.possession === "all"
            ? "全て"
            : filters.possession === "possessed"
            ? "所持"
            : "未所持"}
        </Button>
        <Button
          variant="contained"
          onClick={handleScreenshot}
          sx={{
            padding: 0,
            flexGrow: 1,
          }}
        >
          <FileDownloadIcon />
        </Button>
      </Box>
      <Grid
        container
        spacing={2}
        ref={screenshotRef}
        sx={{ padding: "16px 8px" }}
      >
        {filteredMemorias.map((memoria) => (
          <Grid item xs={3} sm={2.4} md={2} lg={1.5} xl={1.2} key={memoria.no}>
            <Box sx={{ position: "relative", width: "100%", margin: "auto" }}>
              <Image
                src={`../img/memoria/${memoria.no}.png`}
                alt={memoria.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: memoria.possessed ? "none" : "grayscale(100%)",
                }}
                onClick={() => togglePossession(memoria.no)}
              />
              <IconButton
                sx={{ position: "absolute", top: 0, right: 0, padding: 0 }}
                onClick={() => handleOpenModal(memoria)}
              >
                <ArticleIcon />
              </IconButton>
            </Box>
            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Select
                value={memoria.possessed ? memoria.rarity : "未所持"}
                onChange={(e) => changeRarity(memoria.no, e.target.value)}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                sx={{ width: "100%" }}
                disabled={!memoria.possessed}
              >
                <MenuItem value="未所持">
                  <em>未所持</em>
                </MenuItem>
                {Array.from({ length: 6 }, (_, i) => (
                  <MenuItem key={i} value={i}>
                    {romanize(i)}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Grid>
        ))}
      </Grid>
      {selectedMemoria && (
        <Modal open={modalOpen} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxHeight: "80%",
              bgcolor: "background.paper",
              p: 4,
              overflow: "auto",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
            <Box sx={{ width: "100%" }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>名前</TableCell>
                    <TableCell>{selectedMemoria.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>レアリティ</TableCell>
                    <TableCell>{selectedMemoria.memoriararerity}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>HP</TableCell>
                    <TableCell>{selectedMemoria.hp}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>スピード</TableCell>
                    <TableCell>{selectedMemoria.spd}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>物攻</TableCell>
                    <TableCell>{selectedMemoria.atk}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>物防</TableCell>
                    <TableCell>{selectedMemoria.def}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>魔攻</TableCell>
                    <TableCell>{selectedMemoria.matk}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>魔防</TableCell>
                    <TableCell>{selectedMemoria.mdef}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>効果</TableCell>
                    <TableCell>{selectedMemoria.effect}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>実装日</TableCell>
                    <TableCell>{selectedMemoria.date}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Modal>
      )}
    </Container>
  );
};

export default TopPage;
