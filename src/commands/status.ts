import { formatDemandCapacity } from '../message-formatter';

export async function statusCommand(
  reply: (message: string, formattedMessage?: string) => void,
  demandCapacity: [number, number]
) {
  reply(formatDemandCapacity(demandCapacity));
}
