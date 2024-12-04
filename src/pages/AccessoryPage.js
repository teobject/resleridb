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
import charadata from "../jsons/charadata.json";
import Image from "../components/Image";

const TopPage = () => {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({
    role: [],
    element: [],
    race: [],
    affiliation: [],
    possession: "all",
  });
  const [sortOrder, setSortOrder] = useState("id");
  const screenshotRef = useRef(null);

  useEffect(() => {
    const storedCharacters = charadata.map((character) => {
      const storedCharacter = localStorage.getItem(`accessory-${character.id}`);
      const parseStoredCharacter = storedCharacter
        ? JSON.parse(storedCharacter)
        : null;
      if (parseStoredCharacter) {
        if (parseStoredCharacter.id === character.id) {
          parseStoredCharacter.name = character.name;
          parseStoredCharacter.title = character.title;
          parseStoredCharacter.role = character.role;
          parseStoredCharacter.element = character.element;
          parseStoredCharacter.race = character.race;
          parseStoredCharacter.affiliation = character.affiliation;
          parseStoredCharacter.s1 = character.s1;
          parseStoredCharacter.s2 = character.s2;
          parseStoredCharacter.s1_plus = character.s1_plus;
          parseStoredCharacter.s2_plus = character.s2_plus;
          parseStoredCharacter.accessory_name = character.accessory_name;
          parseStoredCharacter.accessory_effect = character.accessory_effect;
          localStorage.setItem(
            `accessory-${parseStoredCharacter.id}`,
            JSON.stringify(parseStoredCharacter)
          );
        }
      }
      return storedCharacter ? JSON.parse(storedCharacter) : character;
    });
    setCharacters(storedCharacters);
    filterCharacters(storedCharacters, searchText, filters, sortOrder);
    // eslint-disable-next-line
  }, []);

  const togglePossession = (id) => {
    const updatedCharacters = characters.map((character) => {
      if (character.id === id) {
        character.possessed = !character.possessed;
        localStorage.setItem(`accessory-${id}`, JSON.stringify(character));
      }
      return character;
    });
    setCharacters(updatedCharacters);
    filterCharacters(updatedCharacters, searchText, filters, sortOrder);
  };

  const changeRarity = (id, newRarity) => {
    const updatedCharacters = characters.map((character) => {
      if (character.id === id) {
        character.rarity = newRarity;
        localStorage.setItem(`accessory-${id}`, JSON.stringify(character));
      }
      return character;
    });
    setCharacters(updatedCharacters);
    filterCharacters(updatedCharacters, searchText, filters, sortOrder);
  };

  const handleOpenModal = (character) => {
    setSelectedCharacter(character);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCharacter(null);
  };

  const handleSearchChange = (event) => {
    const text = event.target.value;
    setSearchText(text);
    filterCharacters(characters, text, filters, sortOrder);
  };

  const toggleFilter = (filterType, value) => {
    const newFilters = { ...filters };
    if (newFilters[filterType].includes(value)) {
      newFilters[filterType] = newFilters[filterType].filter(
        (item) => item !== value
      );
    } else {
      newFilters[filterType].push(value);
    }
    setFilters(newFilters);
    filterCharacters(characters, searchText, newFilters, sortOrder);
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
    filterCharacters(characters, searchText, newFilters, sortOrder);
  };

  const filterCharacters = (characters, nameText, filters, sortOrder) => {
    let filtered = characters;
    if (nameText) {
      filtered = filtered.filter(
        (character) =>
          character.name.includes(nameText) ||
          character.title.includes(nameText)
      );
    }
    Object.keys(filters).forEach((filterType) => {
      if (filterType !== "possession" && filters[filterType].length > 0) {
        filtered = filtered.filter((character) =>
          filters[filterType].includes(character[filterType])
        );
      }
    });
    if (filters.possession === "possessed") {
      filtered = filtered.filter((character) => character.possessed);
    } else if (filters.possession === "notPossessed") {
      filtered = filtered.filter((character) => !character.possessed);
    }
    if (sortOrder === "name") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered = filtered.sort((a, b) => a.id - b.id);
    }
    setFilteredCharacters(filtered);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    filterCharacters(characters, searchText, filters, order);
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

  const renderFilterButtons = (filterType, options, wrap = false) => (
    <Box
      sx={{
        display: "flex",
        flexWrap: wrap ? "wrap" : "nowrap",
        gap: 1,
        justifyContent: "flex-start",
      }}
    >
      {options.map((option) => (
        <Button
          key={option}
          onClick={() => toggleFilter(filterType, option)}
          sx={{
            backgroundColor: filters[filterType].includes(option)
              ? "#00bfff"
              : "inherit",
            margin: 0,
            border: "1px solid grey",
            padding: 0,
            flexShrink: 0,
            flexBasis: wrap ? "auto" : `calc(100% / ${options.length} - 8px)`,
          }}
        >
          <Image src={`../img/${option}.png`} alt={option} />
        </Button>
      ))}
    </Box>
  );

  return (
    <Container>
      <TextField
        label="キャラクター"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchText}
        onChange={handleSearchChange}
      />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        {renderFilterButtons("role", ["ATK", "SPD", "DEF", "SUP", "HEAL"])}
        {renderFilterButtons("element", ["炎", "水", "雷", "光", "闇"])}
        {renderFilterButtons("race", ["人間", "魔族", "神族"])}
        {renderFilterButtons(
          "affiliation",
          [
            "新星学園",
            "流星学園",
            "流星学園付属",
            "守護天使",
            "ネビュラ",
            "コラプサー",
            "所属なし",
          ],
          true
        )}
      </Box>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button
          variant="outlined"
          onClick={() => handleSort("id")}
          sx={{
            border: "1px solid grey",
            padding: 0,
            flexGrow: 1,
            backgroundColor: sortOrder === "id" ? "#00bfff" : "inherit",
            color: sortOrder === "id" ? "white" : "inherit",
            fontWeight: sortOrder === "id" ? "bold" : "normal",
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
        {filteredCharacters.map((character) => (
          <Grid
            item
            xs={3}
            sm={2.4}
            md={2}
            lg={1.5}
            xl={1.2}
            key={character.id}
          >
            <Box sx={{ position: "relative", width: "100%", margin: "auto" }}>
              <Image
                src={`../img/accessory/${character.id}.png`}
                alt={character.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  aspectRatio: "1 / 1",
                  filter: character.possessed ? "none" : "grayscale(100%)",
                }}
                onClick={() => togglePossession(character.id)}
              />
              <Image
                src={`../img/chara/${character.id}.jpg`}
                alt={character.name}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "30%",
                  height: "auto",
                  objectFit: "cover",
                  border: "1px solid #000",
                  borderRadius: "50%",
                }}
              />
              <IconButton
                sx={{ position: "absolute", top: 0, right: 0, padding: 0 }}
                onClick={() => handleOpenModal(character)}
              >
                <ArticleIcon />
              </IconButton>
            </Box>
            <Box sx={{ textAlign: "center", mt: 1 }}>
              <Select
                value={character.possessed ? character.rarity : "未所持"}
                onChange={(e) => changeRarity(character.id, e.target.value)}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                sx={{ width: "100%" }}
                disabled={!character.possessed}
              >
                <MenuItem value="未所持">
                  <em>未所持</em>
                </MenuItem>
                {Array.from({ length: 5 }, (_, i) => (
                  <MenuItem key={i} value={i}>
                    +{i}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Grid>
        ))}
      </Grid>
      {selectedCharacter && (
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
                    <TableCell>Name</TableCell>
                    <TableCell>{selectedCharacter.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>{selectedCharacter.title}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Role</TableCell>
                    <TableCell>{selectedCharacter.role}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Element</TableCell>
                    <TableCell>{selectedCharacter.element}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Race</TableCell>
                    <TableCell>{selectedCharacter.race}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Affiliation</TableCell>
                    <TableCell>{selectedCharacter.affiliation}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill 1(Lv1)</TableCell>
                    <TableCell>{selectedCharacter.s1}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill 2(Lv1)</TableCell>
                    <TableCell>{selectedCharacter.s2}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill 1+(Lv1)</TableCell>
                    <TableCell>{selectedCharacter.s1_plus}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill 2+(Lv1)</TableCell>
                    <TableCell>{selectedCharacter.s2_plus}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Accessory Name</TableCell>
                    <TableCell>{selectedCharacter.accessory_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Accessory Effect(☆0)</TableCell>
                    <TableCell>{selectedCharacter.accessory_effect}</TableCell>
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
