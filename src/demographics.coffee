# Expected input data
#
#
# data = [
#   {
#     country_of_residence: '<CNTRY>'
#     "female_0_4": "479",
#     "female_5_11": "548",
#     "female_12_17": "351",
#     "female_18_59": "*",
#     "female_60": "127",
#     "female_total_value": "1506",
#     "male_0_4": "481",
#     "male_5_11": "723",
#     "male_12_17": "384",
#     "male_18_59": "744",
#     "male_60": "78",
#     "male_total_value": null,
#     "total_value": "5100"
#   }
# ]
class PSR.Demographics extends PSR.Figure

  params:
    groups: [
      { column: 'country_of_residence' },
    ]

    select: [
      { column: 'country_of_residence' },
      { column: 'female_0_4', aggregate: 'sum' },
      { column: 'female_5_11', aggregate: 'sum' },
      { column: 'female_12_17', aggregate: 'sum' },
      { column: 'female_18_59', aggregate: 'sum' },
      { column: 'female_60', aggregate: 'sum' },
      { column: 'female_total_value', aggregate: 'sum' },
      { column: 'male_0_4', aggregate: 'sum' },
      { column: 'male_5_11', aggregate: 'sum' },
      { column: 'male_12_17', aggregate: 'sum' },
      { column: 'male_18_59', aggregate: 'sum' },
      { column: 'male_60', aggregate: 'sum' },
      { column: 'male_total_value', aggregate: 'sum' },
      { column: 'total_value', aggregate: 'sum' },
    ]


  api: '/stats/demographics'

  properties: [
    {
      cohort: '0_4'
    },
    {
      cohort: '5_11'
    },
    {
      cohort: '12_17'
    },
    {
      cohort: '18_59'
    },
    {
      cohort: '60'
    },
  ]

  male: 'male'
  female: 'female'
  total_value: 'total_value'

  constructor: (options = {}) ->
    super

    @r = 3

    @cohort = d3.scale.ordinal()
      .domain(@properties.map (d) -> d.cohort)
      .rangeBands([0, @width])

    @x = d3.scale.ordinal()
      .domain([@male, @female])
      .rangeBands([0, @width / @cohort.domain().length])

    @y = d3.scale.linear()
      .domain([0, 1])
      .range([@height, 0])

    @colors =
      background: '#fff'
      male: 'blue'
      female: 'pink'
      deactive: '#ccc'


    @g = @el.append('svg')
      .attr('width', @width + @margin.left + @margin.right)
      .attr('height', @height + @margin.top + @margin.bottom)
      .append('g')
        .attr('transform', "translate(#{@margin.left or 0}, #{@margin.top or 0})")

  render: (active = null) =>

    self = @

    raw = @getData()

    cohortsG = @g.selectAll('.cohort').data(@properties)
    cohortsG.enter().append('g')
    cohortsG.attr('class', 'cohort')
      .attr('transform', (d) => "translate(#{@cohort(d.cohort)}, 0)")
      .each((property, i) ->
        g = d3.select(@)

        [self.male, self.female].forEach (sex) ->
          circles = g.selectAll("psr-circle-#{sex}-#{property.cohort}").data(raw)
          circles.enter().append('circle')
          circles.attr('class', (d, i) ->
            classList = ['psr-circle',
              "psr-circle-#{sex}",
              "psr-circle-#{sex}-#{property.cohort}"]
            classList.join ' ')
            .attr('r', self.r)
            .attr('cx', self.x(sex) + self.x.rangeBand() / 2)
            .attr('cy', (d) -> self.y(+d["#{sex}_#{property.cohort}"] / +d[self.total_value]))
            .style('fill', self.colors[sex])

      )


  getData: ->
    [
      {
        country_of_residence: 'BEN'
        "female_0_4": "479",
        "female_5_11": "548",
        "female_12_17": "351",
        "female_18_59": "0",
        "female_60": "127",
        "female_total_value": "1506",
        "male_0_4": "481",
        "male_5_11": "723",
        "male_12_17": "384",
        "male_18_59": "744",
        "male_60": "78",
        "male_total_value": "3400",
        "total_value": "5100"
      },
      {
        "country_of_residence": "IRQ",
        "location_name": "Anbar : Muhafazah - Province ",
        "female_0_4": "140",
        "female_5_11": "287",
        "female_12_17": "303",
        "female_18_59": "398",
        "female_60": "766",
        "female_total_value": "1894",
        "male_0_4": "167",
        "male_5_11": "226",
        "male_12_17": "239",
        "male_18_59": "531",
        "male_60": "1204",
        "male_total_value": null,
        "total_value": "4000"
    },

    ]
