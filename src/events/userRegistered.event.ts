import axios from 'axios';
import { UserDTO, SERVICE_URLS, MESSAGE_TOPICS, NotificationChannel, NotificationPayload } from '@indoor-fish/shared-libs';

export async function publishUserRegistered(user: UserDTO): Promise<void> {
  const payload: NotificationPayload = {
    userId: user.id,
    topic: MESSAGE_TOPICS.USER_REGISTERED,
    channel: NotificationChannel.EMAIL,
    data: { name: user.name, email: user.email, role: user.role },
  };
  try {
    await axios.post(`${SERVICE_URLS.NOTIFICATION_SERVICE_URL}/internal/notify`, payload, {
      headers: { 'X-Internal-Service': 'user-service' },
    });
  } catch (err) {
    // Non-fatal: log and continue. Registration still succeeds if notification fails.
    console.error('[userRegistered.event] Failed to notify:', err);
  }
}
