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

  useEffect(() => {
    const storedCharacters = charadata.map((character) => {
      const storedCharacter = localStorage.getItem(`character-${character.no}`);
      const parseStoredCharacter = storedCharacter
        ? JSON.parse(storedCharacter)
        : null;
      if (parseStoredCharacter) {
        if (parseStoredCharacter.no === character.no) {
          parseStoredCharacter.name = character.name;
          parseStoredCharacter.sub_name = character.sub_name;
          parseStoredCharacter.role = character.role;
          parseStoredCharacter.element = character.element;
          parseStoredCharacter.gift_1 = character.gift_1;
          parseStoredCharacter.gift_2 = character.gift_2;
          parseStoredCharacter.gift_3 = character.gift_3;
          parseStoredCharacter.gift_left = character.gift_left;
          parseStoredCharacter.gift_right = character.gift_right;
          parseStoredCharacter.hp = character.hp;
          parseStoredCharacter.spd = character.spd;
          parseStoredCharacter.atk = character.atk;
          parseStoredCharacter.def = character.def;
          parseStoredCharacter.matk = character.matk;
          parseStoredCharacter.mdef = character.mdef;
          parseStoredCharacter.skill_1 = character.skill_1;
          parseStoredCharacter.skill_1_element = character.skill_1_element;
          parseStoredCharacter.skill_1_damage = character.skill_1_damage;
          parseStoredCharacter.skill_1_break = character.skill_1_break;
          parseStoredCharacter.skill_1_heal = character.skill_1_heal;
          parseStoredCharacter.skill_1_weight = character.skill_1_weight;
          parseStoredCharacter.skill_1_effect = character.skill_1_effect;
          parseStoredCharacter.skill_2 = character.skill_2;
          parseStoredCharacter.skill_2_element = character.skill_2_element;
          parseStoredCharacter.skill_2_damage = character.skill_2_damage;
          parseStoredCharacter.skill_2_break = character.skill_2_break;
          parseStoredCharacter.skill_2_heal = character.skill_2_heal;
          parseStoredCharacter.skill_2_weight = character.skill_2_weight;
          parseStoredCharacter.skill_2_effect = character.skill_2_effect;
          parseStoredCharacter.skill_burst = character.skill_burst;
          parseStoredCharacter.skill_burst_element =
            character.skill_burst_element;
          parseStoredCharacter.skill_burst_damage =
            character.skill_burst_damage;
          parseStoredCharacter.skill_burst_break = character.skill_burst_break;
          parseStoredCharacter.skill_burst_heal = character.skill_burst_heal;
          parseStoredCharacter.skill_burst_weight =
            character.skill_burst_weight;
          parseStoredCharacter.skill_burst_effect =
            character.skill_burst_effect;
          parseStoredCharacter.abillity_1 = character.abillity_1;
          parseStoredCharacter.abillity_2 = character.abillity_2;
          parseStoredCharacter.leader_skill = character.leader_skill;
          parseStoredCharacter.tag = character.tag;
          parseStoredCharacter.date = character.date;
          localStorage.setItem(
            `character-${parseStoredCharacter.no}`,
            JSON.stringify(parseStoredCharacter)
          );
        }
      }
      return storedCharacter ? JSON.parse(storedCharacter) : character;
    });
    setCharacters(storedCharacters);
    filterCharacters(
      storedCharacters,
      searchText,
      filters,
      sortOrder,
      effectSearchText
    );
    // eslint-disable-next-line
  }, []);

  const togglePossession = (no) => {
    const updatedCharacters = characters.map((character) => {
      if (character.no === no) {
        character.possessed = !character.possessed;
        localStorage.setItem(`character-${no}`, JSON.stringify(character));
      }
      return character;
    });
    setCharacters(updatedCharacters);
    filterCharacters(
      updatedCharacters,
      searchText,
      filters,
      sortOrder,
      effectSearchText
    );
  };

  const changeRarity = (no, newRarity) => {
    const updatedCharacters = characters.map((character) => {
      if (character.no === no) {
        character.rarity = newRarity;
        localStorage.setItem(`character-${no}`, JSON.stringify(character));
      }
      return character;
    });
    setCharacters(updatedCharacters);
    filterCharacters(
      updatedCharacters,
      searchText,
      filters,
      sortOrder,
      effectSearchText
    );
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
    filterCharacters(characters, text, filters, sortOrder, effectSearchText);
  };

  const handleEffectSearchChange = (event) => {
    const text = event.target.value;
    setEffectSearchText(text);
    filterCharacters(characters, searchText, filters, sortOrder, text);
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
    filterCharacters(
      characters,
      searchText,
      newFilters,
      sortOrder,
      effectSearchText
    );
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
    filterCharacters(
      characters,
      searchText,
      newFilters,
      sortOrder,
      effectSearchText
    );
  };

  const filterCharacters = (
    characters,
    nameText,
    filters,
    sortOrder,
    effectText
  ) => {
    let filtered = characters;
    if (nameText) {
      filtered = filtered.filter(
        (character) =>
          character.name.includes(nameText) ||
          character.sub_name.includes(nameText)
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
    if (effectText) {
      filtered = filtered.filter(
        (character) =>
          character.skill_1_effect.includes(effectText) ||
          character.skill_2_effect.includes(effectText) ||
          character.skill_burst_effect.includes(effectText)
      );
    }
    if (sortOrder === "name") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered = filtered.sort((a, b) => a.no - b.no);
    }
    setFilteredCharacters(filtered);
  };

  const handleSort = (order) => {
    setSortOrder(order);
    filterCharacters(characters, searchText, filters, order, effectSearchText);
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
      <TextField
        label="スキル効果検索"
        variant="outlined"
        fullWidth
        margin="normal"
        value={effectSearchText}
        onChange={handleEffectSearchChange}
      />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        {renderFilterButtons("role", [
          "アタッカー",
          "ブレイカー",
          "ディフェンダー",
          "サポーター",
        ])}
        {renderFilterButtons("element", [
          "火",
          "氷",
          "雷",
          "風",
          "斬",
          "打",
          "突",
        ])}
        {/* {renderFilterButtons('race', ['人間', '魔族', '神族'])}
        {renderFilterButtons('affiliation', ['新星学園', '流星学園', '流星学園付属', '守護天使', 'ネビュラ', 'コラプサー', '所属なし'], true)} */}
      </Box>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <Button
          variant="outlined"
          onClick={() => handleSort("no")}
          sx={{
            border: "1px solid grey",
            padding: 0,
            flexGrow: 1,
            backgroundColor: sortOrder === "no" ? "#00bfff" : "inherit",
            color: sortOrder === "no" ? "white" : "inherit",
            fontWeight: sortOrder === "no" ? "bold" : "normal",
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
            key={character.no}
          >
            <Box sx={{ position: "relative", width: "100%", margin: "auto" }}>
              <Image
                src={`../img/chara/${character.no}.png`}
                alt={character.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: character.possessed ? "none" : "grayscale(100%)",
                }}
                onClick={() => togglePossession(character.no)}
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
                onChange={(e) => changeRarity(character.no, e.target.value)}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                sx={{ width: "100%" }}
                disabled={!character.possessed}
              >
                <MenuItem value="未所持">
                  <em>未所持</em>
                </MenuItem>
                {Array.from({ length: 5 }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
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
                    <TableCell>Sub Name</TableCell>
                    <TableCell>{selectedCharacter.sub_name}</TableCell>
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
                    <TableCell>Gift 1</TableCell>
                    <TableCell>{selectedCharacter.gift_1}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gift 2</TableCell>
                    <TableCell>{selectedCharacter.gift_2}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gift 3</TableCell>
                    <TableCell>{selectedCharacter.gift_3}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gift Left</TableCell>
                    <TableCell>{selectedCharacter.gift_left}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gift Right</TableCell>
                    <TableCell>{selectedCharacter.gift_right}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>HP</TableCell>
                    <TableCell>{selectedCharacter.hp}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>SPD</TableCell>
                    <TableCell>{selectedCharacter.spd}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ATK</TableCell>
                    <TableCell>{selectedCharacter.atk}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>DEF</TableCell>
                    <TableCell>{selectedCharacter.def}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>MATK</TableCell>
                    <TableCell>{selectedCharacter.matk}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>MDEF</TableCell>
                    <TableCell>{selectedCharacter.mdef}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill 1</TableCell>
                    <TableCell>{selectedCharacter.skill_1}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill 1 Element</TableCell>
                    <TableCell>{selectedCharacter.skill_1_element}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill 1 Damage</TableCell>
                    <TableCell>{selectedCharacter.skill_1_damage}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill 1 Break</TableCell>
                    <TableCell>{selectedCharacter.skill_1_break}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill 1 Heal</TableCell>
                    <TableCell>{selectedCharacter.skill_1_heal}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill 1 Weight</TableCell>
                    <TableCell>{selectedCharacter.skill_1_weight}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill 1 Effect</TableCell>
                    <TableCell>{selectedCharacter.skill_1_effect}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill 2</TableCell>
                    <TableCell>{selectedCharacter.skill_2}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill 2 Element</TableCell>
                    <TableCell>{selectedCharacter.skill_2_element}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill 2 Damage</TableCell>
                    <TableCell>{selectedCharacter.skill_2_damage}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill 2 Break</TableCell>
                    <TableCell>{selectedCharacter.skill_2_break}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill 2 Heal</TableCell>
                    <TableCell>{selectedCharacter.skill_2_heal}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill 2 Weight</TableCell>
                    <TableCell>{selectedCharacter.skill_2_weight}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill 2 Effect</TableCell>
                    <TableCell>{selectedCharacter.skill_2_effect}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill Burst</TableCell>
                    <TableCell>{selectedCharacter.skill_burst}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill Burst Element</TableCell>
                    <TableCell>
                      {selectedCharacter.skill_burst_element}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill Burst Damage</TableCell>
                    <TableCell>
                      {selectedCharacter.skill_burst_damage}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill Burst Break</TableCell>
                    <TableCell>{selectedCharacter.skill_burst_break}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill Burst Heal</TableCell>
                    <TableCell>{selectedCharacter.skill_burst_heal}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill Burst Weight</TableCell>
                    <TableCell>
                      {selectedCharacter.skill_burst_weight}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Skill Burst Effect</TableCell>
                    <TableCell>
                      {selectedCharacter.skill_burst_effect}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Abillity 1</TableCell>
                    <TableCell>{selectedCharacter.abillity_1}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Abillity 2</TableCell>
                    <TableCell>{selectedCharacter.abillity_2}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Leader Skill</TableCell>
                    <TableCell>{selectedCharacter.leader_skill}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tag</TableCell>
                    <TableCell>{selectedCharacter.tag}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>{selectedCharacter.date}</TableCell>
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
