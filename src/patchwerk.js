'use strict'

let _ = require('lodash');

let discover = function(model_name) {
  let name = _.kebabCase(model_name);
  return require(`./Classes/${name}.js`)
}

class Patchwerk {
  constructor(emitter) {
    this.emitter = emitter;
  }
  get(model_def, query) {
    let Model = _.isString(model_def) ? discover(model_def) : model_def;

    let is_colletction = this.isCollection(Model, query);

    return this.processQuery(Model, query)
      .then(params => this.composeDescription(Model, params))
      .then(keyset => {
        let uniq_subset = _.uniq(_.flatten(keyset));

        return this.emitter.addTask('database.getMulti', {
            args: [uniq_subset]
          })
          .then((data) => {
            let composed = _.map(keyset, keys => {
              let datachain = _.map(keys, key => data[key]);
              let id = _.head(keys);

              return new Model(id, datachain);
            });

            return is_colletction ? composed : _.head(composed);
          });
      });
  }
  isCollection(Model, query) {
    //@NOTE: temp
    let counter = query.counter;

    return query.counter == '*' || _.isArray(query.counter);
  }
  processQuery(Model, query) {
    let is_colletction = this.isCollection(Model, query);

    if (!is_colletction) return Promise.resolve([query])

    if (query.counter == '*') {
      let counterquery = _.cloneDeep(query);
      _.unset(counterquery, 'counter');
      let counter_name = Model.description().counter;

      return this.get(counter_name, counterquery)
        .then(counter => counter.range(counterquery))
        .then(range => _.map(range, index => _.set(_.clone(query), 'counter', index)));
    }
  }
  composeDescription(Model, params) {
    //@NOTE: temp decision for explicitly specified key
    //@TODO: build query from keys
    if (_.head(params).key) return [_.castArray(_.head(params).key)];

    let description = Model.description();
    let chain = this.resolveParents(Model, [Model]);
    let keys = _.map(chain, i => i.description().key);

    return this.templatize(keys, params);
  }
  templatize(key_templates, values) {
    return _.map(values, value => _.map(key_templates, base => this.applyTemplate(base, value)));
  }
  applyTemplate(template_string, params) {
    return _.reduce(params, (template, value, param) => template.replace('{' + param + '}', value), template_string);
  }
  resolveParents(Model, acc) {
    let parent = Object.getPrototypeOf(Model) || {};

    if (_.isFunction(parent.description)) {
      acc.push(parent);
      this.resolveParents(parent, acc);
    }

    return acc;
  }
}


module.exports = Patchwerk;