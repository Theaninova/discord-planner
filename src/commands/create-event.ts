import {SlashCommandBuilder} from "@discordjs/builders"
import {
  ButtonInteraction,
  CommandInteraction,
  SelectMenuInteraction,
} from "discord.js"
import {EVENT_STATE} from "../state"
import {createEventMessage} from "../ui/create-event-message"
import {client} from "../app"

export const createEventCommandName = "create-event"

const channelOptionName = "channel"
const datesOptionName = "dates"

export const createEventSelectCantAttendId = "cant-attend-interaction"
export const createEventFinishButtonId = "event-finish-button"

export const createEventCommand = new SlashCommandBuilder()
  .setName(createEventCommandName)
  .setDescription("Create an event")
  .addChannelOption(option => option.setName(channelOptionName).setDescription("The channel to post the event in").setRequired(true))
  .addStringOption(option => option.setName(datesOptionName).setDescription("Dates of the event").setRequired(true))

function parseDates(dates: string): {
  day: Date
  times: Date[]
}[] {
  return dates.split(" ")
    .map(date => {
      const [day, times] = date.split("@")
      const parsedDate = new Date(day)
      return {
        day: parsedDate,
        times: times.split("&").map(time => {
          const [hour, minute] = time.split(":")
          const date = new Date(parsedDate)
          date.setHours(Number(hour), minute ? Number(minute) : 0)
          return date
        }),
      }
    })
}

export async function handleCreateEventCommand(interaction: CommandInteraction) {
  const channel = interaction.options.getChannel(channelOptionName)
  const dates = interaction.options.getString(datesOptionName)

  if (channel?.type !== "GUILD_TEXT") {
    await interaction.reply("The channel must be a text channel")
    return
  }

  const parsedDates = parseDates(dates!)

  await interaction.reply(`:white_check_mark: Event created in ${channel}`)

  const config = {
    message: parsedDates,
    cantAttend: {},
  }

  const message = await channel.send(createEventMessage(config))

  EVENT_STATE[channel.id] = {
    messageElement: message,
    ...config,
  }
}

export async function handleCreateEventFinishInteraction(interaction: ButtonInteraction) {
  const config = EVENT_STATE[interaction.channelId]
  if (!config) {
    await interaction.reply("No event in this channel")
    return
  }

  delete EVENT_STATE[interaction.channelId]

  await interaction.reply(":white_check_mark: Event finished")
  await config.messageElement.edit(createEventMessage(config, false))
}

export async function handleCreateEventSelectInteraction(interaction: SelectMenuInteraction) {
  const config = EVENT_STATE[interaction.channelId]
  if (!config) {
    await interaction.reply("No event in this channel")
    return
  }
  const userId = interaction.member!.user.id

  for (const key in config.cantAttend) {
    const filtered = config.cantAttend[key].filter(id => id !== userId)
    if (filtered.length === 0) {
      delete config.cantAttend[key]
    } else {
      config.cantAttend[key] = filtered
    }
  }

  for (const value of interaction.values) {
    config.cantAttend[value] = config.cantAttend[value] || []
    config.cantAttend[value].push(userId)
  }

  await interaction.reply(":white_check_mark: Dates Updated")
  await config.messageElement.edit(createEventMessage(config))
}
