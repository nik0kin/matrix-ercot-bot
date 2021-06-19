import { MatrixClient } from 'matrix-bot-sdk';
import schedule from 'node-schedule';
import { sendMessageToAllJoinedRooms } from './matrix-bot';
import { formatDemandCapacity } from './message-formatter';
import { SettingsWithDefaults } from './settings';

export function setupDailyNotifications(
  settings: SettingsWithDefaults,
  botClient: MatrixClient,
  getDemandCapacity: () => [number, number]
) {
  settings.notifications.forEach((n) => {
    const rule = new schedule.RecurrenceRule();
    if (n.tz) {
      rule.tz = n.tz;
    }
    rule.hour = n.hour;
    rule.minute = n.minute;

    /* const job = */ schedule.scheduleJob(rule, function () {
      const message = formatDemandCapacity(getDemandCapacity());
      if (!settings.dryRun) {
        sendMessageToAllJoinedRooms(botClient, message);
      } else {
        console.log(message);
      }
    });
  });
}
