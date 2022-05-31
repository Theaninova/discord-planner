import {Snowflake} from "discord-api-types/globals"

export interface ParsedTime {
  time: Date
  cantAttend: Snowflake[]
}

export interface ParsedField {
  day: Date
  times: ParsedTime[]
}

export interface ParsedMessage {
  title: string
  fields: ParsedField[]
}
