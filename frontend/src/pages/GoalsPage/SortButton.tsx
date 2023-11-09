import React from "react";
import { Button, Typography, Box } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SortIcon from "@mui/icons-material/Sort"; // This is the default icon for 'Sort'
import FilterListIcon from "@mui/icons-material/FilterList"; // New icon for 'Default'

export interface SortIconMapping {
  icon: React.ElementType;
  label: string;
}

export enum SortOrder {
  Default = "default",
  UpdatedAsc = "updated asc",
  UpdatedDesc = "updated desc",
  AlphabeticalAsc = "a-z",
  AlphabeticalDesc = "z-a",
}

export const sortIconAndLabel = (sortOrder: SortOrder): SortIconMapping => {
  switch (sortOrder) {
    case SortOrder.UpdatedAsc:
      return { icon: ArrowUpwardIcon, label: "Updated" };
    case SortOrder.UpdatedDesc:
      return { icon: ArrowDownwardIcon, label: "Updated" };
    case SortOrder.AlphabeticalAsc:
      return { icon: ArrowDownwardIcon, label: "A-Z" };
    case SortOrder.AlphabeticalDesc:
      return { icon: ArrowUpwardIcon, label: "A-Z" };
    case SortOrder.Default:
    default:
      return { icon: FilterListIcon, label: "Default" }; // New icon for 'Default'
  }
};

interface SortButtonProps {
  sortOrder: SortOrder;
  onSort: () => void;
}

const SortButton: React.FC<SortButtonProps> = ({ sortOrder, onSort }) => {
  const { icon: SortIconComponent, label } = sortIconAndLabel(sortOrder);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        m: 0,
        p: 0,
        flexDirection: "row",
        width: "100%",
        maxWidth: "120px",
      }}
    >
      {/* Static 'Sort' icon and text */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          m: 0,
          p: 0,
          flexDirection: "row",

        }}
      >
        <SortIcon sx={{ fontSize: "1rem", m: 0 }} />
        <Typography variant="subtitle2" sx={{

            userSelect: "none", m: 0, p: 0 }}>
          sort
        </Typography>
      </Box>

      {/* Clickable sort order and icon */}
      <Button onClick={onSort} sx={{ textTransform: "none", m: 0, p: 0 }}>
        <Typography variant="subtitle2" sx={{ userSelect: "none", m: 0, p: 0 }}>
          {label}
        </Typography>
        <SortIconComponent sx={{ fontSize: "1rem", m: 0, p: 0 }} />
      </Button>
    </Box>
  );
};

export default SortButton;
