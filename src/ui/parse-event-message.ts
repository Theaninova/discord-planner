import {Message} from "discord.js"
import {extractDate, extractDiscordUsers} from "../util"
import {ParsedMessage} from "./event-message"

export function parseEventMessage(message: Message): ParsedMessage {
  return {
    title: message.embeds[0].title!,
    fields: message.embeds[0].fields!.map(field => ({
      day: extractDate(field.name, "D"),
      times: field.value.split(/\s+/).map(time => ({
        time: extractDate(time, "t"),
        cantAttend: extractDiscordUsers(time),
      })),
    })),
  }
}
