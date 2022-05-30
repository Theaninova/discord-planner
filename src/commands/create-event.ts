import {SlashCommandBuilder} from "@discordjs/builders"
import {ButtonInteraction, CommandInteraction, SelectMenuInteraction} from "discord.js"
import {EVENT_STATE} from "../state"
import {createEventMessage} from "../ui/create-event-message"

export const createEventCommandName = "create-event"

const channelOptionName = "channel"
const datesOptionName = "dates"
const eventTitleOptionName = "title"

export const createEventSelectCantAttendId = "cant-attend-interaction"
export const createEventFinishButtonId = "event-finish-button"

export const createEventCommand = new SlashCommandBuilder()
  .setName(createEventCommandName)
  .setDescription("Create an event")
  .addChannelOption(option =>
    option.setName(channelOptionName).setDescription("The channel to post the event in").setRequired(true),
  )
  .addStringOption(option =>
    option.setName(eventTitleOptionName).setDescription("The title of the event").setRequired(true),
  )
  .addStringOption(option =>
    option
      .setName(datesOptionName)
      .setDescription("Dates of the event. Example: 2022-06-02@15&16 2022-06-03&@14:30&16")
      .setRequired(true),
  )

function parseDates(dates: string): {
  day: Date
  times: Date[]
}[] {
  return dates.split(" ").map(date => {
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
  const title = interaction.options.getString(eventTitleOptionName)!

  if (channel?.type !== "GUILD_TEXT") {
    await interaction.reply({content: "The channel must be a text channel", ephemeral: true})
    return
  }

  const parsedDates = parseDates(dates!)

  await interaction.reply({content: `:white_check_mark: Event created in ${channel}`, ephemeral: true})

  const config = {
    message: parsedDates,
    title,
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
    await interaction.reply({content: "No event in this channel", ephemeral: true})
    return
  }

  delete EVENT_STATE[interaction.channelId]

  await interaction.reply({content: ":white_check_mark: Event finished", ephemeral: true})
  await config.messageElement.edit(createEventMessage(config, false))
}

export async function handleCreateEventSelectInteraction(interaction: SelectMenuInteraction) {
  const config = EVENT_STATE[interaction.channelId]
  if (!config) {
    await interaction.reply({content: "No event in this channel", ephemeral: true})
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

  await interaction.reply({content: ":white_check_mark: Dates Updated", ephemeral: true})
  await config.messageElement.edit(createEventMessage(config))
}
