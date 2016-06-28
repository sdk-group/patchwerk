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
  get(model_name, query) {
    let Model = discover(model_name);
    let is_colletction = this.isColletction(model_name, query);
    let Description = this.composeDescription(Model, query);
  }
  isColletction(model_name, query) {
    //@NOTE: temp
    let counter = query.counter;

    return query.counter == '*' || _.isArray(query.counter);
  }
  composeDescription(Model, query) {
    let description = Model.description();
    let chain = this.resolveParents(Model, [Model]);

    let keys = _.map(chain, i => i.description().key);
    let params = _.keys(query);

    let complete = _.map(keys, k => {
      let t = k;
      _.forEach(params, param => {
        t = t.replace('{' + param + '}', query[param]);
      });
      return t;
    });
    console.log(complete);
  }
  resolveParents(Model, acc) {
    let parent = Object.getPrototypeOf(Model) || false;

    if (_.isFunction(parent.description)) {
      acc.push(parent);
      this.resolveParents(parent, acc);
    }
    return acc;
  }
}


module.exports = Patchwerk;