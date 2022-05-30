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
