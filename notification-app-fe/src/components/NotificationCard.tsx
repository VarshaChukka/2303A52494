import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';

import type { NotificationItem } from '../types/notification';

const typeColors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'default'> = {
  Event: 'primary',
  Result: 'success',
  Placement: 'warning',
};

export function NotificationCard({ notification }: { notification: NotificationItem }) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        borderColor: 'rgba(15, 23, 42, 0.12)',
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {notification.Message}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(notification.Timestamp).toLocaleString()}
            </Typography>
          </Stack>

          <Chip
            label={notification.Type}
            size="small"
            color={typeColors[notification.Type] ?? 'default'}
            sx={{ fontWeight: 700 }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}