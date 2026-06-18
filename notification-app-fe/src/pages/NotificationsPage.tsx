import { useState } from 'react';

import NotificationsIcon from '@mui/icons-material/Notifications';
import {
  Alert,
  AppBar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Pagination,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

import { NotificationCard } from '../components/NotificationCard';
import { NotificationFilter } from '../components/NotificationFilter';
import { useNotifications } from '../hooks/useNotifications';
import { logFrontendEvent } from '../utils/logging';
import type { NotificationFilterValue } from '../types/notification';

export function NotificationsPage() {
  const [filter, setFilter] = useState<NotificationFilterValue>('All');
  const [page, setPage] = useState(1);

  const { notifications, unreadCount, totalPages, loading, error, markAsViewed } = useNotifications(
    filter,
    page,
  );

  const hasNotifications = notifications.length > 0;

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f7f9fc 0%, #eef3fb 100%)' }}>
      <AppBar position="static" elevation={0} color="transparent">
        <Toolbar sx={{ py: 1.5 }}>
          <Container maxWidth="lg" disableGutters>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
              spacing={2}
            >
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: 'grid',
                    placeItems: 'center',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)',
                    color: 'white',
                  }}
                >
                  <NotificationsIcon />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={800} lineHeight={1.1}>
                    Notifications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Campus updates, placements, events, and results in one place.
                  </Typography>
                </Box>
              </Stack>

              <Badge badgeContent={unreadCount} color="primary" max={99} sx={{ alignSelf: { xs: 'flex-end', sm: 'auto' } }}>
                <NotificationsIcon color="action" />
              </Badge>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(15, 23, 42, 0.08)' }}>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} flexWrap="wrap">
                  <Box>
                    <Typography variant="overline" color="text.secondary">
                      Priority inbox
                    </Typography>
                    <Typography variant="h6" fontWeight={800}>
                      Focus on unread items first
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    disableElevation
                    onClick={() => {
                      setPage(1);
                      void logFrontendEvent({
                        stack: 'frontend',
                        level: 'info',
                        package: 'component',
                        message: 'Refresh view clicked',
                      });
                    }}
                  >
                    Refresh view
                  </Button>
                </Stack>

                <Divider />
                <NotificationFilter
                  value={filter}
                  onChange={(nextFilter) => {
                    setFilter(nextFilter);
                    setPage(1);

                    void logFrontendEvent({
                      stack: 'frontend',
                      level: 'info',
                      package: 'component',
                      message: `Filter changed to ${nextFilter}`,
                    });
                  }}
                />
              </Stack>
            </CardContent>
          </Card>

          {loading && (
            <Box display="flex" justifyContent="center" py={8}>
              <Typography color="text.secondary">Loading notifications...</Typography>
            </Box>
          )}

          {!loading && error && <Alert severity="error">Failed to load notifications: {error}</Alert>}

          {!loading && !error && !hasNotifications && (
            <Alert severity="info">No notifications found for the selected filter.</Alert>
          )}

          {!loading && !error && hasNotifications && (
            <Stack spacing={1.5}>
              {notifications.map((notification) => (
                <Box key={notification.ID} onClick={() => markAsViewed(notification.ID)} sx={{ cursor: 'pointer' }}>
                  <NotificationCard notification={notification} />
                </Box>
              ))}
            </Stack>
          )}

          {!loading && totalPages > 1 && (
            <Box display="flex" justifyContent="center" pt={1}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, nextPage) => setPage(nextPage)}
                color="primary"
                shape="rounded"
              />
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
}