// eslint-disable-next-line unicorn/prevent-abbreviations
export interface IProcessEnv {
  TOKEN: string
  TEST_GUILD_ID?: string
  CLIENT_ID: string
}

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface,unicorn/prevent-abbreviations
    interface ProcessEnv extends IProcessEnv {}
  }
}
