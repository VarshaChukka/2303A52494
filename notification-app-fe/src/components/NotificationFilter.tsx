import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import type { NotificationFilterValue } from '../types/notification';

const filters: NotificationFilterValue[] = ['All', 'Placement', 'Result', 'Event'];

export function NotificationFilter({
  value,
  onChange,
}: {
  value: NotificationFilterValue;
  onChange: (value: NotificationFilterValue) => void;
}) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, nextValue: NotificationFilterValue | null) => {
        if (nextValue) {
          onChange(nextValue);
        }
      }}
      size="small"
      sx={{
        flexWrap: 'wrap',
        gap: 1,
        '& .MuiToggleButtonGroup-grouped': {
          borderRadius: '999px !important',
          border: '1px solid rgba(15, 23, 42, 0.16) !important',
        },
      }}
    >
      {filters.map((type) => (
        <ToggleButton key={type} value={type} sx={{ px: 2.25, textTransform: 'none' }}>
          {type}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}