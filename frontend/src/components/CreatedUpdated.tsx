import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { GoalOut } from '../api';
import SyncIcon from '@mui/icons-material/Sync';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const covertDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', // 3-letter month
    day: 'numeric', // 1-2 length day
  });
};

export const CreateUpdateElem: React.FC<{ goal: GoalOut; isType: string }> = ({
  goal,
  isType,
}) => {
  const dIconSX = {
    fontSize: '0.8rem',
    m: 0,
    p: 0,
    mr: 0.25,
  };

  const elemType = isType.toLocaleLowerCase().includes('create')
    ? 'created'
    : 'updated';

  const dIcon =
    elemType === 'created' ? (
      <AddCircleOutlineIcon sx={dIconSX} />
    ) : (
      <SyncIcon sx={dIconSX} />
    );
  return (
    <Tooltip title={`${elemType} on`} arrow placement="top-start">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flexGrow: 0,
          alignSelf: 'bottom',
          justifyContent: 'bottom',
          p: 0.25,
          pl: elemType === 'created' ? 0.25 : 0.75,
        }}
      >
        {dIcon}
        <Typography
          variant="caption"
          sx={{
            display: 'flex',
            m: 0,
            p: 0,
            maxWidth: '100%',
            flexGrow: 1,
          }}
          noWrap
        >
          {covertDate(
            isType.toLocaleLowerCase().includes('create')
              ? goal.created_on
              : goal.updated_on
          )}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default CreateUpdateElem;
