# Expected input data
#
# data = [
#   {
#       "country_of_residence": "IRQ",
#       "country_of_residence_en": "Iraq",
#       "country_of_origin": "AFG",
#       "country_of_origin_en": "Afghanistan",
#       "population_type_code": "RF",
#       "population_type_en": "Refugees",
#       "value": "5",
#       "redacted_flag": null
#   }
# ]
class PSR.Timeseries extends PSR.Figure

  api: '/stats/time_series'

  params:
    groups: [
      { column: 'country_of_residence' }
      { column: 'country_of_origin' }
    ]

  constructor: (options = {}) ->
    super
