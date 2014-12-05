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
      (_base = this.margin).left || (_base.left = 10);
      (_base1 = this.margin).right || (_base1.right = 10);
      (_base2 = this.margin).top || (_base2.top = 10);
      (_base3 = this.margin).bottom || (_base3.bottom = 10);
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
      this.barPadding = 4;
      this.colors = {
        background: '#fff',
        country_of_origin: 'green',
        country_of_asylum: 'red',
        deactive: '#ccc'
      };
      this.y = d3.scale.linear();
      this.y.domain([0, 1]);
      this.y.range([0, this.barHeight + this.barPadding]);
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
          propertyData.sort(_this.compare).map(function(d) {
            return d[property.name];
          });
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
          }).attr('y', function(d, i) {
            return _this.y(i);
          }).attr('width', function(d) {
            return _this.x(d.total_population);
          }).attr('height', _this.barHeight).style('fill', function(d) {
            return _this.colors.deactive;
          });
          bars.on('click', function(d) {
            return _this.render((active != null) && active.key === d.key && active[active.key] === d[d.key] ? null : d);
          });
          bars.exit().remove();
          activeBars = _this.g.selectAll(".bar-" + property.name + "-active").data(propertyData, function(d) {
            return d[property.name];
          });
          activeBars.enter().append('rect');
          activeBars.transition().duration(500).attr('class', function(d) {
            var classList;
            classList = ['bar', "bar-" + property.name + "-active", 'bar-active', d[property.name]];
            return classList.join(' ');
          }).attr('x', function(d) {
            if (property.left) {
              return 0;
            } else {
              return _this.width - _this.x(d.active_population);
            }
          }).attr('y', function(d, i) {
            return _this.y(i);
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
        if ((active == null) || d[active.key] === active[active.key]) {
          existing.active_population += d.total_population;
        }
      } else {
        existing = {};
        existing[property] = group;
        existing.key = property;
        existing.total_population = d.total_population;
        if ((active == null) || d[active.key] === active[active.key]) {
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

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  PSR.Demographics = (function(_super) {
    __extends(Demographics, _super);

    Demographics.prototype.params = {
      groups: [
        {
          column: 'country_of_residence'
        }
      ],
      select: [
        {
          column: 'country_of_residence'
        }, {
          column: 'female_0_4',
          aggregate: 'sum'
        }, {
          column: 'female_5_11',
          aggregate: 'sum'
        }, {
          column: 'female_12_17',
          aggregate: 'sum'
        }, {
          column: 'female_18_59',
          aggregate: 'sum'
        }, {
          column: 'female_60',
          aggregate: 'sum'
        }, {
          column: 'female_total_value',
          aggregate: 'sum'
        }, {
          column: 'male_0_4',
          aggregate: 'sum'
        }, {
          column: 'male_5_11',
          aggregate: 'sum'
        }, {
          column: 'male_12_17',
          aggregate: 'sum'
        }, {
          column: 'male_18_59',
          aggregate: 'sum'
        }, {
          column: 'male_60',
          aggregate: 'sum'
        }, {
          column: 'male_total_value',
          aggregate: 'sum'
        }, {
          column: 'total_value',
          aggregate: 'sum'
        }
      ]
    };

    Demographics.prototype.api = '/stats/demographics';

    Demographics.prototype.properties = [
      {
        cohort: '0_4'
      }, {
        cohort: '5_11'
      }, {
        cohort: '12_17'
      }, {
        cohort: '18_59'
      }, {
        cohort: '60'
      }
    ];

    Demographics.prototype.male = 'male';

    Demographics.prototype.female = 'female';

    Demographics.prototype.total_value = 'total_value';

    function Demographics(options) {
      if (options == null) {
        options = {};
      }
      this.render = __bind(this.render, this);
      Demographics.__super__.constructor.apply(this, arguments);
      this.r = 3;
      this.cohort = d3.scale.ordinal().domain(this.properties.map(function(d) {
        return d.cohort;
      })).rangeBands([0, this.width]);
      this.x = d3.scale.ordinal().domain([this.male, this.female]).rangeBands([0, this.width / this.cohort.domain().length]);
      this.y = d3.scale.linear().domain([0, 1]).range([this.height, 0]);
      this.colors = {
        background: '#fff',
        male: 'blue',
        female: 'pink',
        deactive: '#ccc'
      };
      this.g = this.el.append('svg').attr('width', this.width + this.margin.left + this.margin.right).attr('height', this.height + this.margin.top + this.margin.bottom).append('g').attr('transform', "translate(" + (this.margin.left || 0) + ", " + (this.margin.top || 0) + ")");
    }

    Demographics.prototype.render = function(active) {
      var cohortsG, raw, self;
      if (active == null) {
        active = null;
      }
      self = this;
      raw = this.getData();
      cohortsG = this.g.selectAll('.cohort').data(this.properties);
      cohortsG.enter().append('g');
      return cohortsG.attr('class', 'cohort').attr('transform', (function(_this) {
        return function(d) {
          return "translate(" + (_this.cohort(d.cohort)) + ", 0)";
        };
      })(this)).each(function(property, i) {
        var g;
        g = d3.select(this);
        return [self.male, self.female].forEach(function(sex) {
          var circles;
          circles = g.selectAll("psr-circle-" + sex + "-" + property.cohort).data(raw);
          circles.enter().append('circle');
          return circles.attr('class', function(d, i) {
            var classList;
            classList = ['psr-circle', "psr-circle-" + sex, "psr-circle-" + sex + "-" + property.cohort];
            return classList.join(' ');
          }).attr('r', self.r).attr('cx', self.x(sex) + self.x.rangeBand() / 2).attr('cy', function(d) {
            return self.y(+d["" + sex + "_" + property.cohort] / +d[self.total_value]);
          }).style('fill', self.colors[sex]);
        });
      });
    };

    Demographics.prototype.getData = function() {
      return [
        {
          country_of_residence: 'BEN',
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
        }, {
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
        }
      ];
    };

    return Demographics;

  })(PSR.Figure);

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  PSR.Timeseries = (function(_super) {
    __extends(Timeseries, _super);

    Timeseries.prototype.api = '/stats/time_series';

    Timeseries.prototype.params = {
      groups: [
        {
          column: 'country_of_residence'
        }, {
          column: 'country_of_origin'
        }
      ]
    };

    function Timeseries(options) {
      if (options == null) {
        options = {};
      }
      Timeseries.__super__.constructor.apply(this, arguments);
    }

    return Timeseries;

  })(PSR.Figure);

}).call(this);
