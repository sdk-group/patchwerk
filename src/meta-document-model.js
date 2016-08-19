'use strict'

const _ = require('lodash');
const Promise = require('bluebird');

const Templatizer = require('./utils/templatizer.js');

let discover = function(model_name) {
  let name = _.kebabCase(model_name);
  return require(`./classes/${name}.js`)
}

class MetaModel {
  constructor(model_name) {
    this.Model = discover(model_name);
    this.dependencies = [];
  }
  getKeys(query, options) {
    let templates = this.getTemplates(options);
    this.processQuery(query, templates, options);

    return this.processDependencies(query, options).then(() => {
      let iterator = this.makeIterator(query, options);

      let keys = _.transform(templates, (acc, template) => {
        for (let params of iterator) {
          acc.push(Templatizer(template, params));
        }
      }, acc);

      return keys;
    });

  }
  processDependencies(query) {
    const getter = "Magic getter";

    return Promise.mapSeries(this.dependencies, dep => {
      let model = dep.item;
      let keys = model.getKeys(query, options);
      return getter(keys).then(data => this.resolveDependency(item, data, query))
    })
  }
  resolveDependency(item, data, query) {
    if (item.type == 'counter') {
      query.counter = data;
    }
    return true;
  }
  processQuery(query, templates, options) {
    this.processCounters(query, templates);
    //this.processExternalFeilds(query, templates);
    //this.processLinks(query, templates);

    return Promise.resolve(query);
  }
  processCounters(query, templates) {
    if (query.counter == '*') {
      //@NOTE: get top level counter
      let counter_name = _.find(templates, template => !!template.counter);
      let counter = new MetaModel(counter_name);

      this.dependencies.push({
        item: counter,
        type: 'counter'
      });
    }
  }
  getTemplates(options) {
    let model_chain = this.resolveParents();
    //@TODO: resolve links based on model, add them to template list
    return _.transform(model_chain, (acc, item) => {
      let desc = item.description();
      if (!_.find(acc, ['key', desc.key])) acc.push(desc);
    }, []);
  }
  resolveParents() {
    let model = this.Model;
    let acc = [model];
    let current = model;
    let parent = Object.getPrototypeOf(current) || false;

    while (parent) {
      if (_.isFunction(parent.description)) {
        acc.push(parent);
        current = parent;
        let parent = Object.getPrototypeOf(current) || false;
        continue;
      }

      parent = false;
    }

    return acc;
  }
}

module.exports = MetaModel;
dule.exports = MetaModel;
orts = MetaModel;
