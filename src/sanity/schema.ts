import { blogType } from './schemaTypes/blog'
import { tournamentType } from './schemaTypes/tournament'
import { pricingType } from './schemaTypes/pricing'
import { settingsType } from './schemaTypes/settings'

export const schema = {
  types: [blogType, tournamentType, pricingType, settingsType],
}
