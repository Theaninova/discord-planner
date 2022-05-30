import secrets from "../secrets.json"
import {Client, Intents} from "discord.js"
import {REST} from "@discordjs/rest"
import {Routes} from "discord-api-types/v9"
import {
  createEventCommand,
  createEventCommandName,
  createEventFinishButtonId,
  createEventSelectCantAttendId,
  handleCreateEventCommand,
  handleCreateEventFinishInteraction,
  handleCreateEventSelectInteraction,
} from "./commands/create-event"

export const client = new Client({intents: [Intents.FLAGS.GUILDS]})
const rest = new REST({version: "9"}).setToken(secrets.token)

client.once("ready", () => {
  console.log("ready")
})

;(async () => {
  await client.login(secrets.token)

  await rest.put(Routes.applicationGuildCommands(secrets.clientId, secrets.testGuildId), {
    body: [createEventCommand.toJSON()],
  })
})()

client.on("interactionCreate", async interaction => {
  try {
    if (interaction.isCommand()) {
      switch (interaction.commandName) {
        case createEventCommandName:
          await handleCreateEventCommand(interaction)
          return
      }
    } else if (interaction.isButton()) {
      switch (interaction.customId) {
        case createEventFinishButtonId:
          await handleCreateEventFinishInteraction(interaction)
          return
      }
    } else if (interaction.isSelectMenu()) {
      switch (interaction.customId) {
        case createEventSelectCantAttendId:
          await handleCreateEventSelectInteraction(interaction)
          return
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (interaction.isRepliable()) {
      await interaction.reply({content: `:x: ${error.message}`, ephemeral: true})
    } else {
      console.error(error)
    }
  }
})
