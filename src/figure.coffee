class PSR.Figure

  base: 'http://popdata.unhcr.org/api/stats'

  constructor: (options = {}) ->

    @el = d3.select options.el
    @margin = options.margin or {}
    @margin.left or= 10
    @margin.right or= 10
    @margin.top or= 10
    @margin.bottom or= 10

    @width = (options.width or 500) - (@margin.left or 0) - (@margin.right or 0)
    @height = (options.height or 500) - (@margin.top or 0) - (@margin.bottom or 0)

  render: ->
