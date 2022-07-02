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
import "dotenv/config"

export const client = new Client({intents: [Intents.FLAGS.GUILDS]})
const rest = new REST({version: "9"}).setToken(process.env.TOKEN)

client.once("ready", () => {
  console.log("ready")
})
;(async () => {
  await client.login(process.env.TOKEN)

  if (process.env.TEST_GUILD_ID) {
    console.log(
      await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.TEST_GUILD_ID), {
        body: [createEventCommand.toJSON()],
      }),
      "Guild commands updated",
    )
  } else {
    console.log(
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: [createEventCommand.toJSON()],
      }),
      "Global commands updated",
    )
  }
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
