import { blogType } from './schemaTypes/blog'
import { tournamentType } from './schemaTypes/tournament'
import { settingsType } from './schemaTypes/settings'

export const schema = {
  types: [blogType, tournamentType, settingsType],
}
