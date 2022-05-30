import {Snowflake} from "discord-api-types/globals"
import {Message} from "discord.js"

export interface EventMessageState {
  day: Date
  times: Date[]
}

export interface EventState {
  message: EventMessageState[]
  messageElement: Message
  cantAttend: Record<string, Snowflake[]>
}

export const EVENT_STATE: Record<Snowflake, EventState> = {}
