import {
  VisibilityOffOutlined as ShowEyeIcon,
  VisibilityOutlined as HideEyeIcon,
} from "@mui/icons-material";
import React from "react";
import { Typography, Box, Tooltip } from "@mui/material";

export const ShowHideTextButton: React.FC<{
  text: string;
  hideArchived: boolean;
  setHideArchived: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ text, hideArchived, setHideArchived }) => {
  return (
    <Box
      sx={{
        cursor: "pointer",
        userSelect: "none",
        maxWidth: "fit-content",
        display: "flex",
        alignItems: "center",
        width: "fit-content",
      }}
    >
      <Tooltip
        title={hideArchived ? `Show ${text}` : `Hide ${text}`}
        placement="top"
      >
        <Typography
          variant="h5"
          sx={{ display: "flex", alignItems: "center" }}
          onClick={() => setHideArchived(!hideArchived)}
        >
          {text}
          {hideArchived ? (
            <ShowEyeIcon sx={{ ml: 1 }} />
          ) : (
            <HideEyeIcon sx={{ ml: 1 }} />
          )}
        </Typography>
      </Tooltip>
    </Box>
  );
};

export default ShowHideTextButton;
