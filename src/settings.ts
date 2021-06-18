export interface Settings {
  //// SETUP ////

  /**
   * Matrix Homeserver
   *  Eg. "https://matrix-federation.matrix.org"
   */
  homeserverUrl: string;
  /**
   * Access Token of the bot account
   *   See https://t2bot.io/docs/access_tokens/ for a simple way to generate
   */
  matrixAccessToken: string;
  /**
   * File used as temporary storage by the bot
   *   Optional. Eg. `bot-storage.json`
   */
  storageFile?: string;

  //// OPERATIONS ////

  /**
   * Words to prompt the bot to respond.
   *   Defaults to `'!ercot'`
   */
  promptWords?: string[];
  /**
   * Dry run indicates that no messages will be sent to Matrix
   *   Defaults to `false`
   */
  dryRun?: boolean;
  /**
   * Frequency of the bot polling PinballMap's API (in seconds)
   */
  pollFrequency: number;
  /**
   * Should the bot auto accept invites to rooms?
   *   Defaults to `false`
   */
  autoJoin?: boolean;
}

export type SettingsWithDefaults = Required<Settings>;
