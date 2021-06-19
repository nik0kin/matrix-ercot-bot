/* eslint-disable no-console */
import { MatrixClient } from 'matrix-bot-sdk';
import { helpCommand } from './commands/help';
import { statusCommand } from './commands/status';
// import { createError } from './error';
import { setupDailyNotifications } from './daily';
import { getScrapedErcotData } from './ercot-scrape';
import { createMatrixClient, sendBotReply } from './matrix-bot';
import { Settings, SettingsWithDefaults } from './settings';

let lastDemandCapacity: [number, number] = [-1, -1];

async function poll(settings: SettingsWithDefaults, botClient: MatrixClient) {
  try {
    lastDemandCapacity = await getScrapedErcotData();
  } catch (e) {
    console.error(
      'An error occured while scraping http://www.ercot.com/content/cdr/html/real_time_system_conditions.html',
      e
    );
  }
  setPollTimeout(settings, botClient);
}

function setPollTimeout(
  settings: SettingsWithDefaults,
  botClient: MatrixClient
) {
  setTimeout(() => {
    poll(settings, botClient);
  }, settings.pollFrequency * 1000);
}

/**
 * Starts the Matrix bot
 */
export async function startBot(userSettings: Settings) {
  const settings: SettingsWithDefaults = {
    storageFile: 'bot-storage.json',
    promptWords: ['!ercot'],
    notifications: [],
    autoJoin: false,
    dryRun: false,
    ...userSettings,
  };
  settings.promptWords = settings.promptWords.map((w) => w.toLowerCase());

  // Connect to Matrix
  const botClient = createMatrixClient(settings);
  await botClient.start();

  console.log('ERCOT bot online');

  botClient.on('room.message', async function (roomId, event) {
    if (event.sender === (await botClient.getUserId())) return;
    if (!event.content || !event.content.body) return;

    const reply = (message: string, formattedMessage?: string) => {
      if (!settings.dryRun) {
        sendBotReply(
          botClient,
          roomId,
          {
            sender: event.sender,
            message: event.content.body,
          },
          message,
          formattedMessage
        );
      } else {
        console.log('reply: ' + message);
      }
    };

    const tokens = (event.content.body as string).split(' ');
    const [prompt, commandToken, ...rest] = tokens;

    // check if prompt word is said
    if (!settings.promptWords.includes(prompt.toLowerCase())) return;

    // check command
    const [command /* , arg1, arg2 */] = (commandToken || '').split(':');

    try {
      switch (command.toLowerCase()) {
        case 'help':
          helpCommand(settings, reply);
          break;
        case 'status':
          statusCommand(reply, lastDemandCapacity);
          break;
        default:
          helpCommand(settings, reply, command);
      }
    } catch (e) {
      console.error(
        'An error occured during the command: ' + event.content.body,
        e
      );
    }
  });

  setupDailyNotifications(settings, botClient, () => lastDemandCapacity);

  poll(settings, botClient);
}
