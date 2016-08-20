'use strict'

const _ = require('lodash');
const Promise = require('bluebird');

const Templatizer = require('./utils/templatizer.js');

let discover = function(model_name) {
  let name = _.kebabCase(model_name);
  return require(`./classes/${name}.js`)
}
class MetaModel {
  constructor(model_name, emitter) {
    this.Model = discover(model_name);
    this.dependencies = [];
    this.emitter = emitter;
  }
  getKeys(query, options) {
    let templates = this.getTemplates(options);
    let is_colletction = this.Model.isCollection(query);

    return is_colletction ? this._collectionKeys(query, templates) : this._singleObjectKeys(query, templates);
  }
  _collectionKeys(iterator, templates) {
    let keys = new Set();

    _.forEach(templates, template => {
      for (let params of iterator) {
        keys.add(Templatizer(template, params));
      }
    });

    return keys;
  }
  _singleObjectKeys(params, templates) {
    let keys = new Set();
    _.forEach(templates, template => keys.add(Templatizer(template, params)));
    return keys;
  }
  compose(query, options) {
    let keyset = this.getKeys(query, options);
    let keys = [...keyset];
    let Model = this.Model;

    return this.getSoruceData(keys).then(source_hash_map => new Model(source_hash_map));
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
  getSoruceData(keys) {
    return this.emitter.addTask('database.getMulti', {
      args: [keys]
    })
  }
}

module.exports = MetaModel;
