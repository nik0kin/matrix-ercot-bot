import marked from 'marked';

import { Settings } from '../settings';

export async function helpCommand(
  settings: Required<Settings>,
  reply: (message: string, formattedMessage?: string) => void,
  invalidCommand?: string
) {
  const message = `${
    invalidCommand
      ? `Unrecognized command: ${invalidCommand}`
      : "Check ERCOT's status"
  }

Usage:
${settings.promptWords.map((word) => `  - \`${word} [COMMAND]\``).join('\n')}

Commands:
  - \`status\`            Display the grid's current Demand/Capacity
  - \`help\`              Display this help message
`;

  reply(message, marked(message));
}

// unused parameter syntax
//   - \`${settings.promptWords[0]} [COMMAND]:[ARG1]:[ARG2]\`
