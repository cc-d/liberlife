import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';

export const retryGetBuildStr = async (
  retries: number = 5
): Promise<string> => {
  try {
    const response = await fetch('build.txt');
    const text = await response.text();
    console.log('Current build:', text);
    return text;
  } catch (error) {
    console.error('Error getting build string', error);
    if (retries > 0) {
      console.log('Retrying...');
      return retryGetBuildStr(retries - 1);
    } else {
      console.log('Max retries reached');
      return 'unknown';
    }
  }
};

export const BuildInfo: React.FC = () => {
  const [buildStr, setBuildStr] = useState<string | null>(null);
  retryGetBuildStr().then((str: string) => setBuildStr(str));

  if (buildStr === null) {
    return <Typography variant="caption">Loading...</Typography>;
  }

  const bsArr = buildStr.replaceAll('\r\n', '\n').split('\n');
  const typoSX = {
    display: 'flex',
    alignSelf: 'self-end',
    pr: 1,
    pb: 1,
    mb: 1,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '100%',
        minHeight: '100px',
      }}
    >
      <Typography
        sx={{
          ...typoSX,
          fontWeight: 'bold',
        }}
        variant="caption"
      >
        Build:
      </Typography>
      {bsArr.map((line: string, i: number) => (
        <Typography
          key={i}
          variant="caption"
          sx={{
            ...typoSX,
          }}
        >
          {i === 0
            ? `${new Date(line).toLocaleString(undefined, {
                dateStyle: 'short',
                timeStyle: 'short',
              })}`
            : line.substring(0, 7)}
        </Typography>
      ))}
    </Box>
  );
};
export default BuildInfo;
