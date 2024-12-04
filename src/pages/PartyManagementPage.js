import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Grid,
  Button,
  TextField,
  Autocomplete,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import charadata from "../jsons/charadata.json";
import Image from "../components/Image";
import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";

const PartyManagementPage = () => {
  const [characters, setCharacters] = useState([]);
  const [parties, setParties] = useState([{ name: "", members: [], memo: "" }]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [partyToDelete, setPartyToDelete] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setCharacters(charadata);

    const storedParties = localStorage.getItem("parties");
    if (storedParties) {
      setParties(JSON.parse(storedParties));
    }
  }, []);

  const addToParty = (partyIndex, character) => {
    if (
      parties[partyIndex].members.length < 5 &&
      !parties[partyIndex].members.some((c) => c.no === character.no)
    ) {
      const newParties = [...parties];
      newParties[partyIndex].members = [
        ...newParties[partyIndex].members,
        character,
      ];
      setParties(newParties);
      setSelectedCharacters((prev) => {
        const newSelected = [...prev];
        newSelected[partyIndex] = null;
        return newSelected;
      });
    }
  };

  const removeFromParty = (partyIndex, characterNo) => {
    const newParties = [...parties];
    newParties[partyIndex].members = newParties[partyIndex].members.filter(
      (c) => c.no !== characterNo
    );
    setParties(newParties);
  };

  const handleMemoChange = (partyIndex, memo) => {
    const newParties = [...parties];
    newParties[partyIndex].memo = memo;
    setParties(newParties);
  };

  const handleNameChange = (partyIndex, name) => {
    const newParties = [...parties];
    newParties[partyIndex].name = name;
    setParties(newParties);
  };

  const saveParty = (partyIndex) => {
    const newParties = [...parties];
    localStorage.setItem("parties", JSON.stringify(newParties));
  };

  const addParty = () => {
    setParties([...parties, { name: "", members: [], memo: "" }]);
    setSelectedCharacters([...selectedCharacters, null]);
  };

  const handleOpenDialog = (index) => {
    setPartyToDelete(index);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPartyToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (partyToDelete !== null) {
      const newParties = parties.filter((_, i) => i !== partyToDelete);
      setParties(newParties);
      setSelectedCharacters(
        selectedCharacters.filter((_, i) => i !== partyToDelete)
      );
      localStorage.setItem("parties", JSON.stringify(newParties));
      handleCloseDialog();
    }
  };

  const handleOpenModal = (character) => {
    setSelectedCharacter(character);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCharacter(null);
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        {parties.map((party, index) => (
          <Box sx={{ mt: 4 }} key={index}>
            <TextField
              label="パーティー名"
              fullWidth
              value={party.name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2} wrap="nowrap">
              {party.members.map((character, i) => (
                <Grid item xs={2.4} sm={2} md={1.5} lg={1.2} key={i}>
                  <Box sx={{ position: "relative", textAlign: "center" }}>
                    <Image
                      src={`../img/chara/${character.no}.png`}
                      alt={character.name}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        padding: 0,
                      }}
                      onClick={() => handleOpenModal(character)}
                    >
                      <ArticleIcon />
                    </IconButton>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => removeFromParty(index, character.no)}
                      sx={{ mt: 1 }}
                    >
                      削除
                    </Button>
                  </Box>
                </Grid>
              ))}
              {Array.from({ length: 5 - party.members.length }).map((_, i) => (
                <Grid item xs={2.4} sm={2} md={1.5} lg={1.2} key={i}>
                  <Box sx={{ textAlign: "center" }}>
                    <Autocomplete
                      options={characters}
                      getOptionLabel={(option) =>
                        `[${option.title}]${option.name}`
                      }
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          {...props}
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Avatar
                            src={`../img/chara/${option.no}.png`}
                            alt={option.name}
                            sx={{
                              mr: 2,
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                            }}
                          />
                          {option.name}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="キャラクターを選択"
                          variant="outlined"
                        />
                      )}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          addToParty(index, newValue);
                        }
                      }}
                      value={selectedCharacters[index] || null}
                      sx={{ width: "100%" }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
            <TextField
              label="メモ"
              multiline
              fullWidth
              rows={4}
              value={party.memo}
              onChange={(e) => handleMemoChange(index, e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => saveParty(index)}
              sx={{ mt: 2 }}
            >
              パーティー保存
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleOpenDialog(index)}
              sx={{ mt: 2, ml: 2 }}
            >
              パーティー削除
            </Button>
          </Box>
        ))}
        <Button
          variant="contained"
          color="success"
          onClick={addParty}
          sx={{ mt: 4 }}
        >
          パーティー追加
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>確認</DialogTitle>
        <DialogContent>
          <DialogContentText>
            本当にこのパーティーを削除しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            キャンセル
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>

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
                    <TableCell>名前</TableCell>
                    <TableCell>{selectedCharacter.name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>サブネーム</TableCell>
                    <TableCell>{selectedCharacter.sub_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>役割</TableCell>
                    <TableCell>{selectedCharacter.role}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>属性</TableCell>
                    <TableCell>{selectedCharacter.element}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ギフト1</TableCell>
                    <TableCell>{selectedCharacter.gift_1}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ギフト2</TableCell>
                    <TableCell>{selectedCharacter.gift_2}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ギフト3</TableCell>
                    <TableCell>{selectedCharacter.gift_3}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ギフト左</TableCell>
                    <TableCell>{selectedCharacter.gift_left}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>ギフト右</TableCell>
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
                    <TableCell>スキル1</TableCell>
                    <TableCell>{selectedCharacter.skill_1}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>スキル1属性</TableCell>
                    <TableCell>{selectedCharacter.skill_1_element}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>スキル1ダメージ</TableCell>
                    <TableCell>{selectedCharacter.skill_1_damage}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>スキル1ブレイク</TableCell>
                    <TableCell>{selectedCharacter.skill_1_break}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>スキル1ヒール</TableCell>
                    <TableCell>{selectedCharacter.skill_1_heal}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>スキル1ウェイト</TableCell>
                    <TableCell>{selectedCharacter.skill_1_weight}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>スキル1効果</TableCell>
                    <TableCell>{selectedCharacter.skill_1_effect}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>スキル2</TableCell>
                    <TableCell>{selectedCharacter.skill_2}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>スキル2属性</TableCell>
                    <TableCell>{selectedCharacter.skill_2_element}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>スキル2ダメージ</TableCell>
                    <TableCell>{selectedCharacter.skill_2_damage}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>スキル2ブレイク</TableCell>
                    <TableCell>{selectedCharacter.skill_2_break}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>スキル2ヒール</TableCell>
                    <TableCell>{selectedCharacter.skill_2_heal}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>スキル2ウェイト</TableCell>
                    <TableCell>{selectedCharacter.skill_2_weight}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>スキル2効果</TableCell>
                    <TableCell>{selectedCharacter.skill_2_effect}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>バーストスキル</TableCell>
                    <TableCell>{selectedCharacter.skill_burst}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>バーストスキル属性</TableCell>
                    <TableCell>
                      {selectedCharacter.skill_burst_element}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>バーストスキルダメージ</TableCell>
                    <TableCell>
                      {selectedCharacter.skill_burst_damage}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>バーストスキルブレイク</TableCell>
                    <TableCell>{selectedCharacter.skill_burst_break}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>バーストスキルヒール</TableCell>
                    <TableCell>{selectedCharacter.skill_burst_heal}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>バーストスキルウェイト</TableCell>
                    <TableCell>
                      {selectedCharacter.skill_burst_weight}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>バーストスキル効果</TableCell>
                    <TableCell>
                      {selectedCharacter.skill_burst_effect}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>アビリティ1</TableCell>
                    <TableCell>{selectedCharacter.abillity_1}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>アビリティ2</TableCell>
                    <TableCell>{selectedCharacter.abillity_2}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>リーダースキル</TableCell>
                    <TableCell>{selectedCharacter.leader_skill}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>タグ</TableCell>
                    <TableCell>{selectedCharacter.tag}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>日付</TableCell>
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

export default PartyManagementPage;
