//     Iterator
//     (c) simonfan
//     Iterator is licensed under the MIT terms.

//     Deep
//     (c) simonfan
//     Deep is licensed under the MIT terms.

//     scope
//     (c) simonfan
//     scope is licensed under the MIT terms.

define("__scope/iteration",["require","exports","module","lodash"],function(e,t){var r=e("lodash");t.each=function(){var e,t,n;if(r.isFunction(arguments[0])){t=arguments[0],n=arguments[1];for(var i in this)t.call(n,this[i],i)}else if(e=arguments[0],t=arguments[1],n=arguments[2],r.isRegExp(e))for(var i in this)e.test(this[i])&&t.call(n,this[i],i);else r.isArray(e)&&r.each(e,function(e){t.call(n,this[e],e)});return this},t.eachOwn=function(){var e,t,n;return r.isFunction(arguments[0])?(t=arguments[0],n=arguments[1],r.each(this,t,n)):(e=arguments[0],t=arguments[1],n=arguments[2],r.isRegExp(e)?r.each(this,function(r,i){e.test(i)&&t.call(n,r,i)}):r.isArray(e)&&r.each(e,function(e){this.hasOwnProperty(e)&&t.call(n,this[e],e)},this)),this}}),define("iterator/base",["subject","lodash"],function(e,t){var r=e({initialize:function(e,t){this.data=e,t=t||{},this.currentIndex=t.startAt||-1,this.options=t,this.evaluate=t.evaluate||t.evaluator||this.evaluate},move:function(e){return this.index(this.currentIndex+e),this},evaluate:function(e){return e},evaluator:function(e){return this.evaluate=e,this},start:function(){return this.currentIndex=-1,this},end:function(){return this.currentIndex=this.length(),this},index:function(e){if(e>this.length()-1||0>e)throw new Error("No such index "+e);return this.currentIndex=e,this},countBefore:function(){return this.currentIndex+1},countAfter:function(){return this.length()-(this.currentIndex+1)},range:function(e,t){for(var r=[];t>=e;)r.push(this.at(e)),e++;return r},hasNext:function(){return this.currentIndex<this.length()-1},next:function(){return this.move(1),this.current()},nextN:function(e){for(var t=[],r=this.currentIndex+e-1;this.hasNext()&&this.currentIndex<=r;)t.push(this.next());return t},hasPrevious:function(){return this.currentIndex>0},previous:function(){return this.move(-1),this.current()},previousN:function(e){for(var t=[],r=this.currentIndex-e+1;this.hasPrevious()&&this.currentIndex>=r;)t.push(this.previous());return t},current:function(){return this.at(this.currentIndex)},value:function(){return this.data}});r.proto({hasPrev:r.prototype.hasPrevious,prev:r.prototype.previous,prevN:r.prototype.previousN});var n=["map","filter","compact","difference"];return t.each(n,function(e){r.proto(e,function(){var r=t(this.data);r=r[e].apply(r,arguments);var n=this.constructor(r.value());return n})}),r}),define("iterator/array",["require","exports","module","./base","lodash"],function(e){var t=e("./base"),r=e("lodash"),n=t.extend({at:function(e){return this.evaluate(this.data[e],e)},length:function(){return this.data.length}}),i=["push","reverse","shift","sort","splice","unshift"];return r.each(i,function(e){n.proto(e,function(){return this.data[e].apply(this.data,arguments),this})}),r.each(["concat","slice"],function(e){n.proto(e,function(){var t=this.data[e].apply(this.data,arguments);return this.constructor(t)})}),n}),define("iterator/object",["require","exports","module","./base","lodash"],function(e){var t=e("./base"),r=e("lodash"),n=t.extend({initialize:function(e,n){n=n||{},t.prototype.initialize.apply(this,arguments),this.order=n.order||r.keys(e)},keyAt:function(e){return this.order[e]},at:function(e){var t=this.keyAt(e),r=this.data[t];return this.evaluate(r,t)},length:function(){return this.order.length},nextKey:function(){return this.keyAt(this.currentIndex+1)},currentKey:function(){return this.keyAt(this.currentIndex)},previousKey:function(){return this.keyAt(this.currentIndex-1)},map:function(e){var t={};return r.each(this.order,function(r,n){t[r]=e(this.data[r],r,n)}.bind(this)),this.constructor(t)}});return n.proto("constructor",n),n}),define("itr",["require","exports","module","./iterator/array","./iterator/object","lodash"],function(e){var t=e("./iterator/array"),r=e("./iterator/object"),n=e("lodash"),i=function(e){var i;return n.isArray(e)?i=t:n.isObject(e)&&(i=r),i.apply(this,arguments)};return i.object=r,i.array=t,i}),define("__deep__/keys",["require","exports","module"],function(){return function(e){return e.replace(/\[(["']?)([^\1]+?)\1?\]/g,".$2").replace(/^\./,"").split(".")}}),define("__deep__/walker",["require","exports","module","lodash","itr","./keys"],function(e,t,r){var n=e("lodash"),i=e("itr"),a=e("./keys"),s=i.object.extend({nextStep:function(){var e=new RegExp("^"+this.currentKey()+"\\.");return this.nextKey().replace(e,"")},currentStep:function(){var e=new RegExp("^"+this.previousKey()+"\\.");return this.currentKey().replace(e,"")},previousStep:function(){var e=this.previousKey()||"";return n.last(e.split("."))},remainingSteps:function(){var e=new RegExp("^"+this.currentKey()+"\\.");return this.destination().replace(e,"")},destination:function(){return n.last(this.order)}});r.exports=function(e,t){t=n.isArray(t)?t:a(t);var r={"":e},i=[""];return n.every(t,function(a,s){var u=n.first(t,s+1).join(".");return i.push(u),e=e[a],r[u]=e,!n.isUndefined(e)}),s(r,{order:i})}}),define("__deep__/getset",["require","exports","module","lodash","./keys"],function(e,t){var r=e("lodash"),n=e("./keys");t.get=function(e,t){return t=r.isArray(t)?t:n(t),r.reduce(t,function(e,t){return e[t]},e)},t.set=function(e,i,a){i=r.isArray(i)?i:n(i);var s=i.pop();e=t.get(e,i),e[s]=a}}),define("deep",["require","exports","module","lodash","./__deep__/keys","./__deep__/walker","./__deep__/getset"],function(e){var t=e("lodash"),r={};return r.parseKeys=e("./__deep__/keys"),r.walker=e("./__deep__/walker"),t.extend(r,e("./__deep__/getset")),r}),define("__scope/evaluation/string/parse",["require","exports","module","lodash"],function(e,t,r){function n(e){var t={};return e[1]?(t.type="literal",t.value=e[1]):e[2]?(t.type="evaluated",t.value=e[2]):e[3]?(t.type="array",t.value=s(e[3])):e[4]&&(t.type="object",t.value=a(e[4])),t}function i(e){var t=e.match(l);return n(t)}function a(e){for(var t,r={},n=new RegExp(d,"g");t=n.exec(e);)t[1]?r[t[1]]={type:"evaluated",value:t[1]}:t[2]&&(r[t[2]]=i(t[3]));return r}function s(e){for(var t,r=[],i=new RegExp(v,"g");t=i.exec(e);)r.push(n(t));return r}var u=(e("lodash"),"\\s*"),o="([^$[{,]+)",c="\\$([^,]+)?",h="\\["+u+"(.*?)"+u+"\\](?!.*?\\])",p="\\{"+u+"(.*?)"+u+"\\}(?!.*?\\})",f=[u+"(?:",o,"|",c,"|",h,"|",p,")"+u].join(""),l=new RegExp(f),d=[u+"(?:",c+u+"(?:,|$)|","(?:",o,":"+u,"(.*?)"+u+"(?:,(?!.*?})|$)",")",")"].join(""),v=f+"(?:,|$)";r.exports=i}),define("__scope/evaluation/string/index",["require","exports","module","lodash","deep","./parse"],function(e,t,r){function n(e,t,r){var n;return"literal"===t.type?n=t.value:"evaluated"===t.type?n=o.get(e,t.value):"array"===t.type?n=a(e,t.value,r):"object"===t.type&&(n=i(e,t.value,r)),n}function i(e,t,r){var i={};return u.each(t,function(t,a){i[a]=n(e,t,r)}),i}function a(e,t,r){var i=[];return u.each(t,function(t){i.push(n(e,t,r))},e),i}function s(e,t,r){return t=c(t),n(e,t,r)}var u=e("lodash"),o=e("deep"),c=e("./parse");r.exports=s}),define("__scope/evaluation/array",["require","exports","module","lodash"],function(e,t,r){function n(e,t,r){var n={};return r.own?a.each(t,function(t){n[t]=a.isString(t)&&e.hasOwnProperty(t)?e[t]:e.evaluateOwn(t,r)}):a.each(t,function(t){n[t]=a.isString(t)?e[t]:e.evaluate(t,r)}),n}function i(e,t,r){return r.own?a.map(t,function(t){return a.isString(t)&&e.hasOwnProperty(t)?e[t]:e.evaluateOwn(t,r)}):a.map(t,function(t){return a.isString(t)?e[t]:e.evaluate(t,r)})}var a=e("lodash");r.exports=function(e,t,r){return r&&"object"===r.format?n(e,t,r):i(e,t,r)}}),define("__scope/evaluation/object",["require","exports","module","lodash"],function(e,t,r){var n=e("lodash");r.exports=function(e,t,r){var i={};return r.own?n.each(t,function(t,r){e.hasOwnProperty(r)&&(i[r]=e[r])}):n.each(t,function(t,r){i[r]=e[r]}),n.defaults(i,t),i}}),define("__scope/evaluation/regexp",["require","exports","module","lodash"],function(e,t,r){e("lodash");r.exports=function(e,t,r){var n={};return r.own?e.eachOwn(function(e,r){t.test(r)&&(n[r]=e)}):e.each(function(e,r){t.test(r)&&(n[r]=e)}),n}}),define("__scope/evaluation/index",["require","exports","module","lodash","./string/index","./array","./object","./regexp"],function(e,t){var r=e("lodash"),n=e("./string/index"),i=e("./array"),a=e("./object"),s=e("./regexp");t.evaluate=function(e,t){return t=t||{},r.isArray(e)?i(this,e,t):r.isRegExp(e)?s(this,e,t):r.isObject(e)?a(this,e,t):r.isString(e)?n(this,e,t):void 0}}),define("__scope/invocation",["require","exports","module","lodash"],function(e,t){var r=e("lodash");t.invoke=function(e,t){if(r.isString(e)){var n=e;if(e=this[n],!e)throw new Error(n+" not defined.")}var i=this.evaluate(t);return i=r.isArray(i)?i:[i],e.apply(this,i.concat(Array.prototype.slice.call(arguments,2)))},t.partial=function(e,t){return t=t||[],r.partial(this.invoke,e,t)},t.fn=function(){return r.isObject(arguments[0])?r.each(arguments[0],function(e,t){this.fn(t,e.fn,e.args)},this):this[arguments[0]]=this.partial(arguments[1],arguments[2]),this}}),define("scope",["require","exports","module","lodash","subject","./__scope/iteration","./__scope/evaluation/index","./__scope/invocation"],function(e,t,r){var n=e("lodash"),i=e("subject"),a={enumerable:!1},s={enumerable:!1,writable:!1},u=r.exports=i({initialize:function(e,t){this.assign(e,t)}},a);u.proto({create:function(e,t){var r=i.assign(n.create(this),e,t);return i.assign(r,{parentScope:this},a),r},assign:function(){var e,t;return n.isString(arguments[0])?(e={}[arguments[0]]=arguments[1],t=arguments[2]):n.isObject(arguments[0])&&(e=arguments[0],t=arguments[1]),i.assign(this,e,t),this}},s),u.assignProto(e("./__scope/iteration"),s).assignProto(e("./__scope/evaluation/index"),a).assignProto(e("./__scope/invocation"),a)});