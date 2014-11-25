# Expected input data
#
# data = [
#   {
#     country_of_asylum: '<country>'
#     country_of_origin: '<country>'
#     total_population: 100
#
#   }
#   ...
# ]
#
class PSR.PersonsOfConcern extends PSR.Figure

  params:
    groups: [
      { column: 'country_of_asylum' },
      { column: 'country_of_origin' }
    ]

    select: [
      { column: 'country_of_asylum' },
      { column: 'country_of_origin' },
      #{ column: 'refugees', aggregate: 'sum' },
      #{ column: 'asylum_seekers', aggregate: 'sum' },
      #{ column: 'idps', aggregate: 'sum' },
      #{ column: 'returned_idps', aggregate: 'sum' },
      #{ column: 'stateless_persons', aggregate: 'sum' },
      #{ column: 'others_of_concern', aggregate: 'sum' },
      { column: 'total_population', aggregate: 'sum' },
    ]

  api: '/stats/persons_of_concern'

  # Defines left and right bar graphs. Should only be 2
  properties: [
    {
      name: 'country_of_asylum'
      left: false
    },
    {
      name: 'country_of_origin'
      left: true
    }
  ]

  constructor: (options = {}) ->
    super

    @barHeight = 12

    @type = options.type or 'bar'

    @g = @el.append('svg')
      .attr('width', @width + @margin.left + @margin.right)
      .attr('height', @height + @margin.top + @margin.bottom)
      .append('g')
        .attr('transform', "translate(#{@margin.left or 0}, #{@margin.top or 0})")


    @x = d3.scale.linear()
      .range([0, @width / 2])

    @barPadding = 4

    @colors =
      background: '#fff'
      country_of_origin: 'green'
      country_of_asylum: 'red'
      deactive: '#ccc'

    @y = d3.scale.linear()
    @y.domain [0, 1]
    @y.range [0, @barHeight + @barPadding]

  render: (active = null) =>

    raw = @getData()
    data = {}

    @properties.forEach (property) =>
      data[property.name] = raw.reduce ((memo, d) => @reduce(memo, d, property.name, active)), []

    @x.domain [0, d3.max(data[@properties[0].name].concat(data[@properties[1].name]), (d) ->
      d.total_population)]

    @properties.forEach (property) =>

      propertyData = data[property.name]

      propertyData.sort(@compare).map((d) -> d[property.name])

      # Render background bars
      bars = @g.selectAll(".bar-#{property.name}").data(propertyData, (d) -> d[property.name])
      bars.enter().append('rect')
      bars
        .transition()
        .duration(500)
          .attr('class', (d) ->
            classList = ['bar', "bar-#{property.name}", d[property.name]]
            classList.join ' ')
          .attr('x', (d) => if property.left then 0 else @width - @x(d.total_population))
          .attr('y', (d, i) => @y(i))
          .attr('width', (d) => @x(d.total_population))
          .attr('height', @barHeight)
          .style('fill', (d) => @colors.deactive)

      bars.on 'click', (d) =>

        @render if active? and active.key == d.key and active[active.key] == d[d.key] then null else d

      bars.exit().remove()

      # render active bars
      activeBars = @g.selectAll(".bar-#{property.name}-active")
        .data(propertyData, (d) -> d[property.name])


      activeBars.enter().append('rect')
      activeBars
        .transition()
        .duration(500)
          .attr('class', (d) ->
            classList = ['bar', "bar-#{property.name}-active", 'bar-active', d[property.name]]
            classList.join ' ')
          .attr('x', (d) => if property.left then 0 else @width - @x(d.active_population))
          .attr('y', (d, i) => @y(i))
          .attr('width', (d) => @x(d.active_population))
          .attr('height', @barHeight)
          .style('fill', (d) => @colors[property.name])

      activeBars.on 'click', (d) =>
        @render if active? and active.key == d.key and active[active.key] == d[d.key] then null else d
      activeBars.exit().remove()




  compare: (a, b) =>
    v = b.active_population - a.active_population

    if v == 0 then b.total_population - a.total_population else v

  reduce: (memo, d, property, active) =>
    group = d[property]

    existing = memo.filter (d) -> d[property] == group

    if existing.length == 1
      existing = existing[0]
      existing.total_population += d.total_population

      if !active? or d[active.key] == active[active.key]
        existing.active_population += d.total_population

    else
      existing = {}
      existing[property] = group
      existing.key = property
      existing.total_population = d.total_population

      if !active? or d[active.key] == active[active.key]
        existing.active_population = d.total_population
      else
        existing.active_population = 0

      memo.push existing

    return memo


  getData: ->
    [
      {
        country_of_origin: 'BEN'
        country_of_asylum: 'LISA'
        total_population: 250
      },
      {
        country_of_origin: 'DAN'
        country_of_asylum: 'LISA'
        total_population: 150
      },
      {
        country_of_origin: 'BEN'
        country_of_asylum: 'MATT'
        total_population: 100
      },
      {
        country_of_origin: 'BEN'
        country_of_asylum: 'ED'
        total_population: 150
      }
    ]
