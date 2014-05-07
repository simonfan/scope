//     scope
//     (c) simonfan
//     scope is licensed under the MIT terms.

define("scope",["require","exports","module","lodash","subject"],function(t,i,e){var s=t("lodash"),n=(t("subject"),{create:function(t){return s.extend(s.create(this),t)},evaluate:function(t){return s.isArray(t)?s.map(t,function(t){return this[t]},this):s.isObject(t)?s.mapValues(t,function(t,i){return this[i]||t},this):s.isString(t)?this[t]:void 0},invoke:function(t,i,e){return e=e||this,t=s.isFunction(t)?t:this.evaluate(t),i=this.evaluate(i),s.isArray(i)?t.apply(e,i):t.call(e,i)},assign:function(t,i){return s.isString(t)?this[t]=i:s.isObject(t)&&s.assign(this,t),this}});e.exports=s.bind(n.create,n)});