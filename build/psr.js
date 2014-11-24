(function() {
  window.PSR = {};

}).call(this);

(function() {
  PSR.Figure = (function() {
    Figure.prototype.base = 'http://popdata.unhcr.org/api/stats';

    function Figure(options) {
      var _base, _base1, _base2, _base3;
      if (options == null) {
        options = {};
      }
      this.el = d3.select(options.el);
      this.margin = options.margin || {};
      (_base = this.margin).left || (_base.left = 0);
      (_base1 = this.margin).right || (_base1.right = 0);
      (_base2 = this.margin).top || (_base2.top = 0);
      (_base3 = this.margin).bottom || (_base3.bottom = 0);
      this.width = (options.width || 500) - (this.margin.left || 0) - (this.margin.right || 0);
      this.height = (options.height || 500) - (this.margin.top || 0) - (this.margin.bottom || 0);
    }

    Figure.prototype.render = function() {};

    return Figure;

  })();

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  PSR.PersonsOfConcern = (function(_super) {
    __extends(PersonsOfConcern, _super);

    PersonsOfConcern.prototype.params = {
      groups: [
        {
          column: 'country_of_asylum'
        }, {
          column: 'country_of_origin'
        }
      ],
      select: [
        {
          column: 'country_of_asylum'
        }, {
          column: 'country_of_origin'
        }, {
          column: 'total_population',
          aggregate: 'sum'
        }
      ]
    };

    PersonsOfConcern.prototype.api = '/stats/persons_of_concern';

    PersonsOfConcern.prototype.properties = [
      {
        name: 'country_of_asylum',
        left: false
      }, {
        name: 'country_of_origin',
        left: true
      }
    ];

    function PersonsOfConcern(options) {
      if (options == null) {
        options = {};
      }
      this.reduce = __bind(this.reduce, this);
      this.compare = __bind(this.compare, this);
      this.render = __bind(this.render, this);
      PersonsOfConcern.__super__.constructor.apply(this, arguments);
      this.barHeight = 12;
      this.type = options.type || 'bar';
      this.g = this.el.append('svg').attr('width', this.width + this.margin.left + this.margin.right).attr('height', this.height + this.margin.top + this.margin.bottom).append('g').attr('transform', "translate(" + (this.margin.left || 0) + ", " + (this.margin.top || 0) + ")");
      this.x = d3.scale.linear().range([0, this.width / 2]);
      this.y = {};
      this.colors = {
        background: '#fff',
        country_of_origin: 'green',
        country_of_asylum: 'red',
        deactive: '#ccc'
      };
      this.properties.forEach((function(_this) {
        return function(property) {
          return _this.y[property.name] = d3.scale.ordinal();
        };
      })(this));
    }

    PersonsOfConcern.prototype.render = function(active) {
      var data, raw;
      if (active == null) {
        active = null;
      }
      raw = this.getData();
      data = {};
      this.properties.forEach((function(_this) {
        return function(property) {
          return data[property.name] = raw.reduce((function(memo, d) {
            return _this.reduce(memo, d, property.name, active);
          }), []);
        };
      })(this));
      this.x.domain([
        0, d3.max(data[this.properties[0].name].concat(data[this.properties[1].name]), function(d) {
          return d.total_population;
        })
      ]);
      return this.properties.forEach((function(_this) {
        return function(property) {
          var activeBars, bars, propertyData;
          propertyData = data[property.name];
          _this.y[property.name].domain(propertyData.sort(_this.compare).map(function(d) {
            return d[property.name];
          }));
          _this.y[property.name].rangePoints([0, _this.y[property.name].domain().length * _this.barHeight]);
          bars = _this.g.selectAll(".bar-" + property.name).data(propertyData, function(d) {
            return d[property.name];
          });
          bars.enter().append('rect');
          bars.transition().duration(500).attr('class', function(d) {
            var classList;
            classList = ['bar', "bar-" + property.name, d[property.name]];
            return classList.join(' ');
          }).attr('x', function(d) {
            if (property.left) {
              return 0;
            } else {
              return _this.width - _this.x(d.total_population);
            }
          }).attr('y', function(d) {
            return _this.y[property.name](d[property.name]);
          }).attr('width', function(d) {
            return _this.x(d.total_population);
          }).attr('height', _this.barHeight).style('fill', function(d) {
            if (active != null) {
              return _this.colors.deactive;
            } else {
              return _this.colors[property.name];
            }
          });
          bars.on('click', function(d) {
            return _this.render((active != null) && active.key === d.key && active[active.key] === d[d.key] ? null : d);
          });
          bars.exit().remove();
          console.log(propertyData);
          activeBars = _this.g.selectAll(".bar-" + property.name + "-active").data(propertyData, function(d) {
            return d[property.name];
          });
          activeBars.enter().append('rect');
          activeBars.filter(function(d) {
            return d.active_population != null;
          }).transition().duration(500).attr('class', function(d) {
            var classList;
            classList = ['bar', "bar-" + property.name + "-active", 'bar-active', d[property.name]];
            return classList.join(' ');
          }).attr('x', function(d) {
            if (property.left) {
              return 0;
            } else {
              return _this.width - _this.x(d.active_population);
            }
          }).attr('y', function(d) {
            return _this.y[property.name](d[property.name]);
          }).attr('width', function(d) {
            return _this.x(d.active_population);
          }).attr('height', _this.barHeight).style('fill', function(d) {
            return _this.colors[property.name];
          });
          activeBars.on('click', function(d) {
            return _this.render((active != null) && active.key === d.key && active[active.key] === d[d.key] ? null : d);
          });
          return activeBars.exit().remove();
        };
      })(this));
    };

    PersonsOfConcern.prototype.compare = function(a, b) {
      var v;
      v = b.active_population - a.active_population;
      if (v === 0) {
        return b.total_population - a.total_population;
      } else {
        return v;
      }
    };

    PersonsOfConcern.prototype.reduce = function(memo, d, property, active) {
      var existing, group;
      group = d[property];
      existing = memo.filter(function(d) {
        return d[property] === group;
      });
      if (existing.length === 1) {
        existing = existing[0];
        existing.total_population += d.total_population;
        if ((active != null) && d[active.key] === active[active.key]) {
          existing.active_population += d.total_population;
        }
      } else {
        existing = {};
        existing[property] = group;
        existing.key = property;
        existing.total_population = d.total_population;
        if ((active != null) && d[active.key] === active[active.key]) {
          existing.active_population = d.total_population;
        } else {
          existing.active_population = 0;
        }
        memo.push(existing);
      }
      return memo;
    };

    PersonsOfConcern.prototype.getData = function() {
      return [
        {
          country_of_origin: 'BEN',
          country_of_asylum: 'LISA',
          total_population: 250
        }, {
          country_of_origin: 'DAN',
          country_of_asylum: 'LISA',
          total_population: 150
        }, {
          country_of_origin: 'BEN',
          country_of_asylum: 'MATT',
          total_population: 100
        }, {
          country_of_origin: 'BEN',
          country_of_asylum: 'ED',
          total_population: 150
        }
      ];
    };

    return PersonsOfConcern;

  })(PSR.Figure);

}).call(this);
