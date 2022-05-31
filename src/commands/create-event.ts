import {SlashCommandBuilder} from "@discordjs/builders"
import {ButtonInteraction, CommandInteraction, Message, SelectMenuInteraction} from "discord.js"
import {createEventMessage} from "../ui/create-event-message"
import {parseEventMessage} from "../ui/parse-event-message"
import {ParsedField} from "../ui/event-message"

export const createEventCommandName = "create-event"

const channelOptionName = "channel"
const datesOptionName = "dates"
const eventTitleOptionName = "title"

export const createEventSelectCantAttendId = "cant-attend-interaction"
export const createEventFinishButtonId = "event-finish-button"

export const createEventCommand = new SlashCommandBuilder()
  .setName(createEventCommandName)
  .setDescription("Create an event")
  .addStringOption(option =>
    option.setName(eventTitleOptionName).setDescription("The title of the event").setRequired(true),
  )
  .addStringOption(option =>
    option
      .setName(datesOptionName)
      .setDescription("Dates of the event. Example: 2022-06-02@15&16 2022-06-03&@14:30&16")
      .setRequired(true),
  )
  .addChannelOption(option =>
    option.setName(channelOptionName).setDescription("The channel to post the event in").setRequired(false),
  )

function parseDates(dates: string): ParsedField[] {
  return dates.split(" ").map(date => {
    const [day, times] = date.split("@")
    const parsedDate = new Date(day)
    return {
      day: parsedDate,
      times: times.split("&").map(time => {
        const [hour, minute] = time.split(":")
        const date = new Date(parsedDate)
        date.setHours(Number(hour), minute ? Number(minute) : 0)
        return {
          time: date,
          cantAttend: [],
        }
      }),
    }
  })
}

export async function handleCreateEventCommand(interaction: CommandInteraction) {
  const channel = interaction.options.getChannel(channelOptionName) || interaction.channel
  const dates = interaction.options.getString(datesOptionName)
  const title = interaction.options.getString(eventTitleOptionName)!

  if (
    channel?.type !== "GUILD_TEXT" &&
    channel?.type !== "GUILD_PUBLIC_THREAD" &&
    channel?.type !== "GUILD_PRIVATE_THREAD"
  ) {
    await interaction.reply({content: "The channel must be a text channel", ephemeral: true})
    return
  }

  const fields = parseDates(dates!)

  await interaction.reply({content: `:white_check_mark: Event created in ${channel}`, ephemeral: true})
  await channel.send(
    createEventMessage({
      title,
      fields,
    }),
  )
}

export async function handleCreateEventFinishInteraction(interaction: ButtonInteraction) {
  const messageElement = interaction.message as Message
  const message = parseEventMessage(messageElement)

  await interaction.reply({content: ":white_check_mark: Event finished", ephemeral: true})
  await messageElement.edit(createEventMessage(message, false))
}

export async function handleCreateEventSelectInteraction(interaction: SelectMenuInteraction) {
  const messageElement = interaction.message as Message
  const message = parseEventMessage(messageElement)
  const userId = interaction.member!.user.id
  const values = interaction.values.reduce((accumulator, value) => {
    accumulator[value] = value
    return accumulator
  }, {} as Record<string, string>)

  for (const field of message.fields) {
    for (const time of field.times) {
      time.cantAttend = time.cantAttend.filter(id => id !== userId)
      if (values[time.time.toISOString()]) {
        time.cantAttend.push(userId)
      }
    }
  }

  await interaction.reply({content: ":white_check_mark: Dates Updated", ephemeral: true})
  await messageElement.edit(createEventMessage(message))
}
