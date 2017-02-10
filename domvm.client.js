/*
 https://github.com/leeoniya/domvm (2.x-dev, client)
*/
(function(y,n){"object"===typeof exports&&"undefined"!==typeof module?module.exports=n():"function"===typeof define&&define.amd?define(n):y.domvm=n()})(this,function(){function y(a){a=typeof a;return"string"===a||"number"===a}function n(a){return"function"===typeof a}function F(a){for(var b=arguments,d=1;d<b.length;d++)for(var c in b[d])a[c]=b[d][c];return a}function W(a,b){for(var d=[],c=b;c<a.length;c++)d.push(a[c]);return d}function xa(a,b){for(var d in a)if(a[d]!==b[d])return!1;return!0}function X(a,
b){var d=a.length;if(b.length!=d)return!1;for(var c=0;c<d;c++)if(a[c]!==b[c])return!1;return!0}function Y(a){function b(){d=0;a.apply(c,e)}if(!Z)return a;var d,c,e;return function(){c=this;e=arguments;d||(d=Z(b))}}function ya(a,b,d){return function(){return a.apply(d,b)}}function G(a,b){switch(b){case "value":case "checked":case "selected":case "selectedIndex":return!0}return!1}function aa(a){B=a.is;ba=a.val;ca=a.sub;da=a.unsub}function H(a,b){var d=ca(a,function(a){d&&(null!=b.node&&b.redraw(),da(d))});
return ba(a)}function ea(a,b){var d=(a.attrs||z).style,c=b?(b.attrs||z).style:null;if(null==d||y(d))a.el.style.cssText=d;else{for(var e in d){var f=d[e];B(f)&&(f=H(f,a.vm()));if(null==c||null!=f&&f!==c[e]){var g=a.el.style,h=e,k;k=e;k=isNaN(f)||za[k]?f:f+"px";g[h]=k}}if(c)for(var fa in c)null==d[fa]&&(a.el.style[fa]="")}}function ga(a,b,d,c,e){if(a)e?(a=d.parent,a&&a.el&&a.el.offsetHeight):M.push([b,d,c]);else return b(d,c)}function p(a,b,d,c){var e=b.hooks[a];if(e){var f=0===a.lastIndexOf("did",
0);return l(e)?e.map(function(a){return ga(f,a,b,d)}):ga(f,e,b,d,c)}}function w(){}function N(a,b,d,c){var e=new w;e.type=1;null!=c&&(e.flags=c);null!=b&&(null!=b._key&&(e.key=b._key),null!=b._ref&&(e.ref=b._ref),null!=b._hooks&&(e.hooks=b._hooks),null!=b._raw&&(e.raw=b._raw),null!=b._data&&(e.data=b._data),null!=b._flags&&(e.flags=b._flags),null==e.key&&(null!=e.ref?e.key=e.ref:null!=b.id?e.key=b.id:null!=b.name&&(e.key=b.name)),e.attrs=b);b=ha[a];if(null==b){var f,g,h;for(ha[a]=b={tag:(f=a.match(/^[-\w]+/))?
f[0]:"div",id:(g=a.match(/#([-\w]+)/))?g[1]:null,"class":(h=a.match(/\.([-\w.]+)/))?h[1].replace(/\./g," "):null,attrs:null};f=Aa.exec(a);)null==b.attrs&&(b.attrs={}),b.attrs[f[1]]=f[2]||""}a=b;e.tag=a.tag;if(a.id||a["class"]||a.attrs){f=e.attrs||{};a.id&&null==f.id&&(f.id=a.id);a["class"]&&(e._class=a["class"],f["class"]=a["class"]+(null!=f["class"]?" "+f["class"]:""));if(a.attrs)for(var k in a.attrs)null==f[k]&&(f[k]=a.attrs[k]);e.attrs=f}null!=d&&(e.body=d);return e}function ia(a){var b=a.hooks,
d=null!=a.vmid?a.vm():null;d&&d.hooks&&p("willUnmount",d);b=b&&p("willRemove",a);a.flags&2||!l(a.body)||a.body.forEach(ia);return b}function O(a,b,d){var c=b._node,e=c.hooks,f=null!=c.vmid?c.vm():null;if(!(c.flags&2)&&l(c.body))for(var g=0;g<c.body.length;g++)O(b,c.body[g].el);a.removeChild(b);f&&(u[f.id]=null);e&&p("didRemove",c,null,d);f&&f.hooks&&p("didUnmount",f,null,d)}function C(a,b){var d=ia(b._node);null!=d&&"object"===typeof d&&n(d.then)?d.then(ya(O,[a,b,!0])):O(a,b)}function t(a,b,d){var c=
b._node,e=c.hooks,f=b.parentNode,g=f||null==c.vmid?null:c.vm();g&&g.hooks&&p("willMount",g);g&&(u[g.id]=g);e&&p(f?"willReinsert":"willInsert",c);a.insertBefore(b,d);e&&p(f?"didReinsert":"didInsert",c);g&&g.hooks&&p("didMount",g)}function ja(a,b,d){var c;for(c=a.target;null==c._node;)c=c.parentNode;c=c._node;!1===b.apply(null,d.concat(a,c,c.vm()))&&(a.preventDefault(),a.stopPropagation())}function ka(a,b){return function(d){ja(d,a,b)}}function Ba(a){return function(b){for(var d in a)if(b.target.matches(d)){var c=
a[d],e=l(c),f=e?c[0]:c,c=e?c.slice(1):[];ja(b,f,c)}}}function P(a,b,d,c){d!==c&&(a=a.el,l(d)?null!=c&&X(d,c)||(d=ka(d[0],d.slice(1)),a[b]=d):(d=n(d)&&d!=c?ka(d,[]):Ba(d),a[b]=d))}function Q(a,b,d,c){var e=a.el;null==d?a.el.removeAttribute(b):"class"==b?e.className=d:"id"==b||"boolean"==typeof d||c?e[b]=d:"."==b[0]?e[b.substr(1)]=d:e.setAttribute(b,d)}function la(a,b){var d=a.attrs||z,c=b.attrs||z,e=a.tag,f;for(f in d){var g=d[f],h=G(e,f),k=h?a.el[f]:c[f];B(g)&&(d[f]=g=H(g,a.vm()));g!==k&&("style"==
f?ea(a,b):"_"==f[0]||(0===f.lastIndexOf("on",0)?P(a,f,g,k):Q(a,f,g,h)))}for(f in c)f in d||"_"==f[0]||(c=a,g=f,G(e,f)||0===f.lastIndexOf("on",0)?c.el[g]="":c.el.removeAttribute(g))}function I(a,b,d,c){5==a.type&&(b=a.model,d=a.key,c=a.opts,a=a.view);return new D(a,b,d,c)}function J(a,b,d){for(var c,e=0;e<a.length;e++)c=a[e],4==c.type?J(a[e].body,b,d):(c.flatIdx=b.length,c.flatParent=d,b.push(c));return b}function R(a){for(var b=!1,d=0;d<a.body.length;d++){var c=a.body[d],e=c.type;4>=e?t(a.el,v(c)):
5==e?(c=I(c.view,c.model,c.key,c.opts)._redraw(a,d,!1),e=c.node.type,t(a.el,v(c.node))):6==e&&(c=u[c.vmid],c._redraw(a,d),e=c.node.type,t(a.el,c.node.el));4==e&&(b=!0)}return b}function v(a,b){if(null==a.el)if(1==a.type){a.el=b||K.createElement(a.tag);if(null!=a.attrs){var d=a.attrs,c;for(c in d){var e=d[c],f=G(a.tag,c);B(e)&&(d[c]=e=H(e,a.vm()));"style"==c?ea(a):"_"==c[0]||(0===c.lastIndexOf("on",0)?P(a,c,e):null!=e&&Q(a,c,e,f))}}l(a.body)?R(a)&&(a.flatBody=J(a.body,[],a)):null!=a.body&&""!==a.body&&
(a.raw?a.el.innerHTML=a.body:a.el.textContent=a.body)}else 2==a.type?a.el=b||K.createTextNode(a.body):3==a.type?a.el=b||K.createComment(a.body):4==a.type&&(a.el=b||K.createDocumentFragment(),R(a));a.el._node=a;return a.el}function Ca(a,b){return b[a.idx+1]}function Da(a,b){return b[a.idx-1]}function Ea(a,b){return b[a.flatIdx+1]}function Fa(a,b){return b[a.flatIdx-1]}function Ga(a){return a.parent}function Ha(a){return a.flatParent}function Ia(a,b){return a._node.flatIdx-b._node.flatIdx}function ma(a,
b,d,c){d=d.previousSibling;c=c.nextSibling;a(d,c);return{lftSib:d?d.nextSibling:b.firstChild,rgtSib:c?c.previousSibling:b.lastChild}}function Ja(a,b,d,c,e,f){var g=(f=f?e.flatIdx==d.flatIdx+1:e.idx==d.idx+1)?!1:b._node==e,h=f?!0:c._node==d;return g||h?ma(function(d,f){h&&t(a,c,b);g&&t(a,b,f)},a,b,c):null}function Ka(a,b,d,c){return ma(function(d,f){for(var e,h=b;h!==f;h=h.nextSibling){b=e=h;for(var k=h.nextSibling;k!==f;k=k.nextSibling)0<c(e,k)&&(e=k);e!==h&&(t(a,e,b),h=e)}},a,b,d)}function La(a,
b){return a._node.idx-b._node.idx}function na(a,b,d){if(d){var c=a.el,e=a.flatBody,f=b.flatBody;b=Ha;var g=Fa,h=Ea}else c=a.el,e=a.body,f=b.body,b=Ga,g=Da,h=Ca;var k=e[0],l=e[e.length-1],r=(f[0]||z).el,f=(f[f.length-1]||z).el,q,m,p;a:for(;;){for(;;)if(r&&b(m=r._node)!=a)q=r.nextSibling,null!=m.vmid?m.vm().unmount(!0):C(c,r),r=q;else if(null==k)break a;else if(null==k.el)t(c,v(k),r),k=h(k,e);else if(k.el===r)k=h(k,e),r=r.nextSibling;else break;for(;;)if(f&&b(p=f._node)!=a)q=f.previousSibling,null!=
p.vmid?p.vm().unmount(!0):C(c,f),f=q;else if(l==k)break a;else if(null==l.el)q=v(l),t(c,q,f?f.nextSibling:null),l=g(l,e);else if(l.el===f)l=g(l,e),f=f.previousSibling;else break;(q=Ja(c,r,k,f,l,d))||(q=Ka(c,r,f,d?Ia:La));r=q.lftSib;f=q.rgtSib}}function Ma(a,b,d,c){for(d=d||0;d<b.length;d++){c=b[d];if(5==a.type&&null!=c.vmid){var e=u[c.vmid];if(e.view==a.view&&e.key==a.key)return c}if(c.el._node==c&&a.tag===c.tag&&a.type===c.type&&(a.key===c.key||null==c.key))return c}return null}function Na(a,b){var d;
a:{d=a.key;var c=0,e=b.length-1,f;if(2147483647>=e)for(;c<=e;)if(f=c+e>>1,b[f].key===d){d=f;break a}else b[f].key<d?c=f+1:e=f-1;else for(;c<=e;)if(f=Math.floor((c+e)/2),b[f].key===d){d=f;break a}else b[f].key<d?c=f+1:e=f-1;d=-1}return-1<d?b[d]:null}function S(a,b,d){b.hooks&&p("willRecycle",b,a);var c=a.el=b.el,e=b.body,f=a.body;c._node=a;if(2==a.type&&f!==e)c.nodeValue=f;else{null==a.attrs&&null==b.attrs||la(a,b);var g=l(e),h=l(f);if(g)if(h){c=a;e=b;c.flags&4?(f=e.body.slice(),f.sort(Oa),g=Na):(f=
e.body,g=Ma);for(var k,h=0,t=c.body,r=!1,q=0;q<t.length;q++){var m=t[q],n=m.type;4>=n?(k=g(m,f,h))&&S(m,k):5==n?(m=(k=g(m,f,h))?u[k.vmid]._update(m.model,c,q):I(m.view,m.model,m.key,m.opts)._redraw(c,q,!1),n=m.node.type):6==n&&(m=u[m.vmid]._update(m.model,c,q),n=m.node.type);4==n&&(r=!0);c.list||null==k||k.idx!=h||h++}if(!(c.flags&1))if(1==c.type)r&&(c.flatBody=J(c.body,[],c)),na(c,e,r);else if(4==c.type&&d){for(c=c.parent;1!=c.type;)c=c.parent;e={flatBody:c.flatBody};c.flatBody=J(c.body,[],c);na(c,
e,!0)}}else{if(f!==e)if(null!=f)a.raw?c.innerHTML=f:c.textContent=f;else for(;c.firstChild;)C(c,c.firstChild)}else h?(c.firstChild&&c.removeChild(c.firstChild),R(a)):f!==e&&(a.raw?c.innerHTML=f:c.firstChild?c.firstChild.nodeValue=f:c.textContent=f);b.hooks&&p("didRecycle",b,a)}}function Oa(a,b){return a.key>b.key?1:a.key<b.key?-1:0}function oa(a){var b=new w;b.type=2;b.body=a;return b}function pa(a,b,d){for(var c=["refs"].concat(b.replace("^","").split(".")),e=a,f;f=c.shift();)e[f]=0==c.length?d:
e=e[f]||{};var g;"^"==b[0]&&(g=a.parent())&&pa(g,b,d)}function A(a,b,d,c,e){if(6!=a.type&&5!=a.type)if(a.parent=b,a.idx=d,a.vmid=c,null!=e&&"string"==typeof e&&"^"==e[0]&&(a.ref=e),null!=a.ref&&pa(a.vm(),a.ref,a),l(a.body))for(b=a.body,d=0;d<b.length;d++)c=b[d],!1===c||null==c?b.splice(d--,1):l(c)?(e=d--,b.splice.apply(b,[e,1].concat(c))):(null==c.type&&(b[d]=c=oa(""+c)),2==c.type?null==c.body||""==c.body?b.splice(d--,1):0<d&&2==b[d-1].type?(b[d-1].body+=c.body,b.splice(d--,1)):A(c,a,d):A(c,a,d));
else B(a.body)&&(a.body=H(a.body,a.vm()))}function D(a,b,d,c){var e=Pa++,f=this;f.api={};f.id=e;f.view=a;f.model=b;f.key=null==d?b:d;a=a.call(f,f,b,d);n(a)?f.render=a:(a.diff&&(f.diff(a.diff),delete a.diff),F(f,a));u[e]=f;c&&(f.opts=c,c.hooks&&f.hook(c.hooks),c.diff&&f.diff(c.diff));f._redrawAsync=Y(function(a){return f._redraw()});f._updateAsync=Y(function(a){return f._update(a)})}function L(a){if(M.length)for(a=a.node,a&&a.el&&a.el.offsetHeight;a=M.shift();)a[0](a[1],a[2])}function qa(a,b,d,c){var e,
f;null==d?null!=b&&b.constructor==Object?e=b:f=b:(e=b,f=d);return N(a,e,f,c)}function ra(a,b,d,c){var e=arguments.length,f,g,h;1==e?(f="frag",h=a):2==e?(f=a,h=b):3==e&&(f=a,g=b,h=d);e=N(f,g,h,c);e.type=4;return e}function T(a,b,d,c){this.view=a;this.model=b;this.key=null==d?b:d;this.opts=c}function sa(a,b,d,c){return new T(a,b,d,c)}function U(a){this.vmid=a.id}function ta(a){return new U(a)}function ua(a){var b=new w;b.type=1;b.el=b.key=a;return b}function Qa(){}function va(a,b){var d=a.body;if(l(d))for(var c=
0;c<d.length;c++){var e=d[c];null!=e.vmid?b.push(u[e.vmid]):va(e,b)}return b}function wa(a,b){a.el=b;b._node=a;var d=a.attrs,c;for(c in d){var e=d[c],f=G(a.tag,c);"style"==c||"_"==c[0]||(0===c.lastIndexOf("on",0)?P(a,c,e):null!=e&&f&&Q(a,c,e,f))}if(l(a.body)){d=b.firstChild;c=0;e=a.body[c];do 5==e.type?e=I(e.view,e.model,e.key,e.opts)._redraw(a,c,!1).node:6==e.type&&(e=e.node||e._redraw(a,c,!1).node),wa(e,d);while((d=d.nextSibling)&&(e=a.body[++c]))}}var V="undefined"!=typeof window,Z=(V?window:{}).requestAnimationFrame,
z={},l=Array.isArray,za={animationIterationCount:!0,boxFlex:!0,boxFlexGroup:!0,columnCount:!0,counterIncrement:!0,flex:!0,flexGrow:!0,flexOrder:!0,flexPositive:!0,flexShrink:!0,"float":!0,fontWeight:!0,gridColumn:!0,lineHeight:!0,lineClamp:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,transform:!0,transformOrigin:!0,widows:!0,zIndex:!0,zoom:!0},ha={},Aa=/\[(\w+)(?:=(\w+))?\]/g,B=function(){return!1},ba=null,ca=null,da=null,M=[],Ra=w.prototype={constructor:w,type:null,vm:function(){var a=this;do if(null!=
a.vmid)return u[a.vmid];while(a.parent&&(a=a.parent))},vmid:null,key:null,ref:null,data:null,hooks:null,raw:!1,el:null,tag:null,attrs:null,body:null,flags:0,_class:null,idx:null,parent:null,flatIdx:null,flatParent:null,flatBody:null},K=V?document:null,Pa=0,u={},x=D.prototype={constructor:D,id:null,view:null,key:null,model:null,opts:null,node:null,hooks:null,render:null,parent:function(){for(var a=this.node;a=a.parent;)if(null!=a.vmid)return u[a.vmid];return null},root:function(){for(var a=this.node;a.parent;)a=
a.parent;return u[a.vmid]},api:null,refs:null,mount:function(a,b){if(b){for(;a.firstChild;)a.removeChild(a.firstChild);this._redraw(null,null,!1);a.nodeName.toLowerCase()!=this.node.tag?(v(this.node),t(a.parentNode,this.node.el,a),a.parentNode.removeChild(a)):v(this.node,a)}else this._redraw(null,null),a&&t(a,this.node.el);a&&L(this);return this},unmount:function(a){var b=this.node;C(b.el.parentNode,b.el);a||L(this)},redraw:function(a){a?this._redraw():this._redrawAsync();return this},update:function(a,
b){b?this._update(a):this._updateAsync(a);return this},_update:function(a,b,d,c){null!=a&&this.model!==a&&(this.hooks&&p("willUpdate",this,a),this.model=a);return this._redraw(b,d,c)},_redraw:function(a,b,d){var c=null==a,e=this.node&&this.node.el&&this.node.el.parentNode,f=this.node;if(e&&null!=this._diff&&this._diff())return f&&a&&(a.body[b]=f,f.parent=a),this;e&&this.hooks&&p("willRedraw",this);this.refs&&(this.refs=null);var g=this.render.call(this,this,this.model,this.key);this.node=g;a?(A(g,
a,b,this.id,this.key),a.body[b]=g):f&&f.parent?(A(g,f.parent,f.idx,this.id,this.key),f.parent.body[f.idx]=g):A(g,null,null,this.id,this.key);!1!==d&&(f?f.tag!==g.tag?(f.vmid=g.vmid=null,a=f.el.parentNode,b=f.el.nextSibling,C(a,f.el),t(a,v(g),b),f.el=g.el,g.vmid=this.id):S(g,f,c):v(g));e&&this.hooks&&p("didRedraw",this);c&&e&&L(this);return this},_redrawAsync:null,_updateAsync:null,hook:function(a){this.hooks=this.hooks||F({},this.hooks,a)}};T.prototype={constructor:T,type:5,view:null,model:null,key:null,
opts:null};U.prototype={constructor:U,type:6,vmid:null};var E={_views:u,ViewModel:D,VNode:w,createView:I,defineElement:qa,defineText:oa,defineComment:function(a){var b=new w;b.type=3;b.body=a;return b},defineFragment:ra,defineView:sa,injectView:ta,injectElement:ua,FIXED_BODY:1,FAST_REMOVE:2,KEYED_LIST:4};x._diff=null;x.diff=function(a){var b=this;if(n(a))var d=a;else var d=a.vals,c=a.then;var e=d(b,b.model,b.key,b.opts),f=l(e)?X:xa;b._diff=function(){var a=d(b,b.model,b.key,b.opts),h=f(e,a);h||(null!=
c&&!1===c(b,e,a)&&(h=!0),e=a);return h}};Ra.patch=function(a){var b;a:{if(null!=a.type){if(null!=this.vmid){b=void 0;break a}A(a,this.parent,this.idx,null,null);this.parent.body[this.idx]=a;S(a,this);L(a.vm())}else{b=Object.create(this);b.attrs=F({},this.attrs);a=F(this.attrs,a);if(null!=this._class){var d=a["class"];a["class"]=null!=d&&""!=d?this._class+" "+d:this._class}la(this,b)}b=void 0}return b};E.h=function(a){return(y(a)?qa:n(a)?sa:V&&a instanceof HTMLElement?ua:a instanceof D?ta:l(a)?ra:
Qa).apply(null,arguments)};E.defineElementSpread=function(a){var b=arguments,d=b.length,c,e;if(1<d){c=1;var f=b[1];null!=f&&f.constructor==Object&&(e=b[1],c=2);c=d==c+1&&(y(b[c])||l(b[c]))?b[c]:W(b,c)}return N(a,e,c)};x.events=null;x.emit=function(a){var b=arguments,d=this;do{var c=d.events;if(c=c?c[a]:null){c.apply(null,W(b,1));break}}while(d=d.parent())};x.on=function(a,b){null==this.events&&(this.events={});if(y(a))this.events[a]=b;else{var d=a;for(a in d)this.on(a,d[a])}};x.body=function(){return va(this.node,
[])};"undefined"!=typeof flyd&&aa({is:function(a){return flyd.isStream(a)},val:function(a){return a()},sub:function(a,b){return flyd.on(b,a)},unsub:function(a){return a.end(!0)}});E.streamCfg=aa;E.prop=function(a,b,d,c){return function(e,f){"undefined"!=typeof e&&e!==a&&(a=e,!1!==f&&n(b)&&b.apply(d,c));return a}};x.attach=function(a){null==this.node&&this._redraw(null,null,!1);wa(this.node,a);return this};return E});