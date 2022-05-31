import {Snowflake} from "discord-api-types/globals"

export function toUnixTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000)
}

export function toDiscordTime(date: Date, type: "F" | "R" | "D" | "t"): string {
  return `<t:${toUnixTimestamp(date)}:${type}>`
}

export function mentionDiscordUser(id: Snowflake): string {
  return `<@${id}>`
}

export function extractDate(text: string, type: "F" | "R" | "D" | "t"): Date {
  const match = text.match(new RegExp(`<t:(\\d+):${type}>`))
  if (!match) throw new Error(`Could not extract date from ${text}`)
  return new Date(Number(match[1]) * 1000)
}

export function extractDiscordUsers(text: string): Snowflake[] {
  return [...text.matchAll(/<@(\d+)>/g)].map(match => match[1])
}
