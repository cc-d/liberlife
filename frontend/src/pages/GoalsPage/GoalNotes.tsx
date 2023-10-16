import React, { useState } from "react";
import { Box, Typography, TextField, IconButton, Link } from "@mui/material";
import { GoalOut } from "../../api";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

interface GoalNotesProps {
  goal: GoalOut;
  maxNotesWidth: string;
  onSaveNotes: (notes: string | null) => void;
}

const renderFormattedNotes = (goal: GoalOut) => {
  let i = 0;
  const elements: JSX.Element[] = [];
  const notes = goal?.notes || "";

  while (i < notes.length) {
    const startLinkText = notes.indexOf("[", i);
    const endLinkText = notes.indexOf("]", startLinkText + 1); // Ensure we're looking after the start
    const startLinkURL = notes.indexOf("(", endLinkText + 1); // Ensure we're looking after the end of link text
    const endLinkURL = notes.indexOf(")", startLinkURL + 1); // Ensure we're looking after the start of link URL

    // If any of the tags aren't found, break the loop
    if (
      startLinkText === -1 ||
      endLinkText === -1 ||
      startLinkURL === -1 ||
      endLinkURL === -1
    ) {
      break;
    }

    // Push any text before the link
    if (startLinkText > i) {
      elements.push(<span key={i}>{notes.substring(i, startLinkText)}</span>);
    }

    // Extract the link text and URL
    const linkText = notes.substring(startLinkText + 1, endLinkText);
    const linkURL = notes.substring(startLinkURL + 1, endLinkURL);

    // Push the link element
    elements.push(
      <Link
        href={linkURL}
        key={endLinkText}
        target="_blank"
        rel="noopener noreferrer"
      >
        {linkText}
      </Link>
    );

    i = endLinkURL + 1;
  }

  // Add any remaining text after the last link
  if (i < notes.length) {
    elements.push(
      <span key={i}>{notes.substring(i).replaceAll("\n\n\n", "\n")}</span>
    );
  }

  return elements;
};

export const GoalNotes: React.FC<GoalNotesProps> = ({
  goal,
  maxNotesWidth,
  onSaveNotes,
}) => {
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);
  const [editedNotes, setEditedNotes] = useState<string | null | undefined>(
    goal?.notes || ""
  );

  const handleSaveNotes = () => {
    const updatedNotes = editedNotes && editedNotes.trim() ? editedNotes : null;
    onSaveNotes(updatedNotes);
    setIsEditingNotes(false);
  };

  return isEditingNotes ? (
    <>
      <Box display="flex" alignItems="center">
        <TextField
          value={editedNotes || ""}
          onChange={(e) => setEditedNotes(e.target.value)}
          multiline
          sx={{
            flexGrow: 1,
            mt: 0.25,
            minWidth: "400px",
          }}
        />
        <IconButton onClick={handleSaveNotes}>
          <SaveIcon />
        </IconButton>
      </Box>
    </>
  ) : (
    <>
      <Box display="flex" alignItems="center">
        <Typography
          color={goal?.notes ? "textPrimary" : "textSecondary"}
          sx={{
            overflowWrap: "break-word",
            whiteSpace: "pre-wrap",
            flexGrow: 1,
          }}
        >
          {goal?.notes ? renderFormattedNotes(goal) : "add notes..."}
        </Typography>
        <IconButton onClick={() => setIsEditingNotes(true)}>
          <EditIcon />
        </IconButton>
      </Box>
    </>
  );
};

export default GoalNotes;
