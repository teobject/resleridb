import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  TableHead,
  MenuItem,
  Select,
} from "@mui/material";
import weapon from "../jsons/accessory.json";

const AccessoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [effectTerm, setEffectTerm] = useState("");
  const [elementFilters, setElementFilters] = useState([]);
  const [roleFilters, setRoleFilters] = useState([]);
  const [spdFilter, setSpdFilter] = useState("");
  const [filteredWeapons, setFilteredWeapons] = useState(weapon);

  useEffect(() => {
    setFilteredWeapons(
      weapon.filter(
        (w) =>
          w.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          w.effect.toLowerCase().includes(effectTerm.toLowerCase()) &&
          (elementFilters.length === 0 || elementFilters.includes(w.element)) &&
          (roleFilters.length === 0 || roleFilters.includes(w.role)) &&
          (spdFilter === "" || Number(w.spd) === spdFilter)
      )
    );
  }, [searchTerm, effectTerm, elementFilters, roleFilters, spdFilter]);

  const toggleElementFilter = (element) => {
    setElementFilters((prev) =>
      prev.includes(element)
        ? prev.filter((e) => e !== element)
        : [...prev, element]
    );
  };

  const toggleRoleFilter = (role) => {
    setRoleFilters((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  return (
    <Container>
      <Box my={4}>
        <TextField
          label="武器名で検索"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      <Box my={4}>
        <TextField
          label="効果で検索"
          variant="outlined"
          fullWidth
          value={effectTerm}
          onChange={(e) => setEffectTerm(e.target.value)}
        />
      </Box>
      <Box my={4}>
        <Select
          value={spdFilter}
          onChange={(e) => setSpdFilter(e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="">速度でフィルタ</MenuItem>
          {[...Array(12).keys()].map((i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {i + 1}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
        <img
          src={"../img/アタッカー.png"}
          alt="アタッカー"
          style={{
            border: "1px solid black",
            borderRadius: "8px",
            backgroundColor: roleFilters.includes("アタッカー")
              ? "#00BFFF"
              : "transparent",
          }}
          onClick={() => toggleRoleFilter("アタッカー")}
        />
        <img
          src={"../img/ブレイカー.png"}
          alt="ブレイカー"
          style={{
            border: "1px solid black",
            borderRadius: "8px",
            backgroundColor: roleFilters.includes("ブレイカー")
              ? "#00BFFF"
              : "transparent",
          }}
          onClick={() => toggleRoleFilter("ブレイカー")}
        />
        <img
          src={"../img/ディフェンダー.png"}
          alt="ディフェンダー"
          style={{
            border: "1px solid black",
            borderRadius: "8px",
            backgroundColor: roleFilters.includes("ディフェンダー")
              ? "#00BFFF"
              : "transparent",
          }}
          onClick={() => toggleRoleFilter("ディフェンダー")}
        />
        <img
          src={"../img/サポーター.png"}
          alt="サポーター"
          style={{
            border: "1px solid black",
            borderRadius: "8px",
            backgroundColor: roleFilters.includes("サポーター")
              ? "#00BFFF"
              : "transparent",
          }}
          onClick={() => toggleRoleFilter("サポーター")}
        />
        <img
          src={"../img/火.png"}
          alt="火"
          style={{
            border: "1px solid black",
            borderRadius: "8px",
            backgroundColor: elementFilters.includes("火")
              ? "#00BFFF"
              : "transparent",
          }}
          onClick={() => toggleElementFilter("火")}
        />
        <img
          src={"../img/氷.png"}
          alt="氷"
          style={{
            border: "1px solid black",
            borderRadius: "8px",
            backgroundColor: elementFilters.includes("氷")
              ? "#00BFFF"
              : "transparent",
          }}
          onClick={() => toggleElementFilter("氷")}
        />
        <img
          src={"../img/雷.png"}
          alt="雷"
          style={{
            border: "1px solid black",
            borderRadius: "8px",
            backgroundColor: elementFilters.includes("雷")
              ? "#00BFFF"
              : "transparent",
          }}
          onClick={() => toggleElementFilter("雷")}
        />
        <img
          src={"../img/風.png"}
          alt="風"
          style={{
            border: "1px solid black",
            borderRadius: "8px",
            backgroundColor: elementFilters.includes("風")
              ? "#00BFFF"
              : "transparent",
          }}
          onClick={() => toggleElementFilter("風")}
        />
        <img
          src={"../img/斬.png"}
          alt="斬"
          style={{
            border: "1px solid black",
            borderRadius: "8px",
            backgroundColor: elementFilters.includes("斬")
              ? "#00BFFF"
              : "transparent",
          }}
          onClick={() => toggleElementFilter("斬")}
        />
        <img
          src={"../img/打.png"}
          alt="打"
          style={{
            border: "1px solid black",
            borderRadius: "8px",
            backgroundColor: elementFilters.includes("打")
              ? "#00BFFF"
              : "transparent",
          }}
          onClick={() => toggleElementFilter("打")}
        />
        <img
          src={"../img/突.png"}
          alt="突"
          style={{
            border: "1px solid black",
            borderRadius: "8px",
            backgroundColor: elementFilters.includes("突")
              ? "#00BFFF"
              : "transparent",
          }}
          onClick={() => toggleElementFilter("突")}
        />
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>名前</TableCell>
            <TableCell>HP</TableCell>
            <TableCell>速度</TableCell>
            <TableCell>効果</TableCell>
            <TableCell>属性</TableCell>
            <TableCell>ロール</TableCell>
            <TableCell>備考</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredWeapons.map((w) => (
            <TableRow key={w.no}>
              <TableCell>{w.name}</TableCell>
              <TableCell>{w.hp}</TableCell>
              <TableCell>{w.spd}</TableCell>
              <TableCell>{w.effect}</TableCell>
              <TableCell>{w.element}</TableCell>
              <TableCell>{w.role}</TableCell>
              <TableCell>{w.remark}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default AccessoryPage;
