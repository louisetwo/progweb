import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useCallback, useState } from "react";
import NicknameResult from "../NicknameResult";
import useAPI from "../../hooks/useAPI";

const NicknameSearch = () => {
  const [nickname, setnickname] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { get } = useAPI();

  const handleNicknameChange = useCallback((e) => {
    const { value } = e.target;
    setnickname(value);
  }, []);

  const onSearch = useCallback(async () => {
    try {
      setLoading(true);
      const nicknameResult = await get("/checkNickname", {
        params: { nickname },
      });
      setLoading(false);
      const { data } = nicknameResult;
      setResult(data);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }, [nickname, get]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 64px)",
      }}
    >
      <Box sx={{ marginBottom: "16px" }}>
        <TextField
          id="outlined-basic"
          label="Search nickname"
          variant="outlined"
          value={nickname}
          onChange={handleNicknameChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <IconButton onClick={onSearch}>
                    <Search />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <NicknameResult result={result} />
    </Box>
  );
};

export default NicknameSearch;
