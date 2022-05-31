import {
  MessageActionRow,
  MessageButton,
  MessageEditOptions,
  MessageEmbed,
  MessageOptions,
  MessageSelectMenu,
} from "discord.js"
import {createEventFinishButtonId, createEventSelectCantAttendId} from "../commands/create-event"
import {mentionDiscordUser, toDiscordTime} from "../util"
import {ParsedMessage} from "./event-message"

export function createEventMessage(
  message: ParsedMessage,
  inProgress = true,
): MessageOptions & MessageEditOptions {
  const selected = message.fields.flatMap(({times}) => times).find(time => time.cantAttend.length === 0)!.time

  const embed = new MessageEmbed()
    .setTitle(message.title)
    .setDescription(
      inProgress
        ? `Please choose the dates you **can't** attend.

Current selection: ${toDiscordTime(selected, "F")}`
        : toDiscordTime(selected, "F"),
    )
    .addFields(
      message.fields.map(({day, times}) => ({
        name: `${toDiscordTime(day, "D")} (${toDiscordTime(day, "R")})`,
        value: times
          .map(time => {
            const discordTime = toDiscordTime(time.time, "t")
            return time.cantAttend.length > 0
              ? `~~${discordTime}~~ (${time.cantAttend.map(mentionDiscordUser)})`
              : discordTime
          })
          .join("\n"),
        inline: true,
      })),
    )

  const menuSelectValues = message.fields.flatMap(({times}) => times)

  return {
    embeds: [embed],
    components: inProgress
      ? [
          new MessageActionRow().addComponents([
            new MessageSelectMenu()
              .setCustomId(createEventSelectCantAttendId)
              .setPlaceholder("Can't attend")
              .setMinValues(0)
              .setMaxValues(menuSelectValues.length)
              .addOptions(
                menuSelectValues.map(time => ({
                  label: time.time.toLocaleString(),
                  value: time.time.toISOString(),
                })),
              ),
          ]),
          new MessageActionRow().addComponents([
            new MessageButton()
              .setLabel("Close Event")
              .setCustomId(createEventFinishButtonId)
              .setStyle("DANGER"),
          ]),
        ]
      : [],
  }
}
