import {EventState} from "../state"
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

export function createEventMessage(config: Omit<EventState, 'messageElement'>, includeInteraction = true): MessageOptions & MessageEditOptions {
  const selected = config.message
    .flatMap(({times}) => times)
    .find(time => !config.cantAttend[time.toISOString()])!

  const embed = new MessageEmbed()
    .setTitle("Next event dates")
    .setDescription(`Please choose the dates you **can't** attend.

Current selection: ${toDiscordTime(selected, 'F')}`)
    .addFields(config.message.map(({day, times}) => ({
      name: `${toDiscordTime(day, "D")} (${toDiscordTime(day, "R")})`,
      value: times.map(time => {
        const cantAttend = config.cantAttend[time.toISOString()]
        const discordTime = toDiscordTime(time, "t")
        return cantAttend ? `~~${discordTime}~~ (${cantAttend.map(mentionDiscordUser)})` : discordTime
      }).join("\n"),
      inline: true,
    })))

  const menuSelectValues = config.message.flatMap(({times}) => times)

  return {
    embeds: [embed], components: includeInteraction ? [
      new MessageActionRow().addComponents([
        new MessageSelectMenu()
          .setCustomId(createEventSelectCantAttendId)
          .setPlaceholder("Can't attend")
          .setMinValues(0)
          .setMaxValues(menuSelectValues.length)
          .addOptions(menuSelectValues.map(time => ({
            label: time.toLocaleString(),
            value: time.toISOString(),
          }))),
      ]),
      new MessageActionRow().addComponents([
        new MessageButton()
          .setLabel("Close Event")
          .setCustomId(createEventFinishButtonId)
          .setStyle("DANGER"),
      ]),
    ] : [],
  }
}
