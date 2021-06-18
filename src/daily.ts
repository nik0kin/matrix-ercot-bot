import { MatrixClient, SimpleFsStorageProvider } from 'matrix-bot-sdk';
import { sendMessageToAllJoinedRooms } from './matrix-bot';
import { formatDemandCapacity } from './message-formatter';
import { SettingsWithDefaults } from './settings';

const DAILY_ALERT_TIME = 1200;

export function checkDaily(
  botClient: MatrixClient,
  settings: SettingsWithDefaults,
  demandCapacity: [number, number]
) {
  const savedValue = (
    botClient.storageProvider as SimpleFsStorageProvider
  ).readValue('nextNotificationTime');
  const nextNotificationTime = savedValue
    ? (JSON.parse(savedValue) as number)
    : getNextDailyNotificationTime();

  if (nextNotificationTime < Date.now()) {
    const message = formatDemandCapacity(demandCapacity);
    if (!settings.dryRun) {
      sendMessageToAllJoinedRooms(botClient, message);
    } else {
      console.log(message);
    }

    (botClient.storageProvider as SimpleFsStorageProvider).storeValue(
      'nextNotificationTime',
      JSON.stringify(getNextDailyNotificationTime(true))
    );
  }
}

function getNextDailyNotificationTime(next?: boolean) {
  const hour = Math.floor(DAILY_ALERT_TIME / 100);
  const minutes = DAILY_ALERT_TIME % 100;
  const currentTime = new Date();
  if (!next || currentTime.getHours() < hour) {
    // ALERT_TIME hasnt occurred today yet
    const date = new Date();
    date.setDate(date.getDate());
    date.setHours(hour);
    date.setMinutes(minutes);
    date.setMilliseconds(0);
    return date.getTime();
  } else {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(hour);
    date.setMinutes(minutes);
    date.setMilliseconds(0);
    return date.getTime();
  }
}
