/**
 * tracking.js - Augmented Reality JavaScript Framework.
 * @author Eduardo Lundgren <edu@rdo.io>
 * @version v1.0.0-alpha
 * @link http://trackingjs.com
 * @license BSD
 */
!function(t){t.tracking=t.tracking||{},tracking.inherits=function(t,r){function e(){}e.prototype=r.prototype,t.superClass_=r.prototype,t.prototype=new e,t.prototype.constructor=t,t.base=function(t,e){var n=Array.prototype.slice.call(arguments,2);return r.prototype[e].apply(t,n)}},tracking.initUserMedia_=function(r,e){t.navigator.getUserMedia({video:!0,audio:e.audio},function(e){try{r.src=t.URL.createObjectURL(e)}catch(n){r.src=e}},function(){throw Error("Cannot capture user camera.")})},tracking.isNode=function(t){return t.nodeType||this.isWindow(t)},tracking.isWindow=function(t){return!!(t&&t.alert&&t.document)},tracking.merge=function(t,r){for(var e in r)t[e]=r[e];return t},tracking.one=function(t,r){return this.isNode(t)?t:(r||document).querySelector(t)},tracking.track=function(t,r,e){if(t=tracking.one(t),!t)throw new Error("Element not found, try a different element or selector.");if(!r)throw new Error("Tracker not specified, try `tracking.track(element, new tracking.FaceTracker())`.");switch(t.nodeName.toLowerCase()){case"canvas":return this.trackCanvas_(t,r,e);case"img":return this.trackImg_(t,r,e);case"video":return e&&e.camera&&this.initUserMedia_(t,e),this.trackVideo_(t,r,e);default:throw new Error("Element not supported, try in a canvas, img, or video.")}},tracking.trackCanvas_=function(t,r){var e=t.width,n=t.height,i=t.getContext("2d"),a=i.getImageData(0,0,e,n);r.track(a.data,e,n)},tracking.trackImg_=function(t,r){var e=t.width,n=t.height,i=document.createElement("canvas");i.width=e,i.height=n,tracking.Canvas.loadImage(i,t.src,0,0,e,n,function(){tracking.trackCanvas_(i,r)})},tracking.trackVideo_=function(r,e){var n,i,a=document.createElement("canvas"),o=a.getContext("2d"),c=function(){n=r.offsetWidth,i=r.offsetHeight,a.width=n,a.height=i};c(),r.addEventListener("resize",c);var s=function(){t.requestAnimationFrame(function(){if(r.readyState===r.HAVE_ENOUGH_DATA){try{o.drawImage(r,0,0,n,i)}catch(t){}tracking.trackCanvas_(a,e)}s()})};s()},t.URL||(t.URL=t.URL||t.webkitURL||t.msURL||t.oURL),navigator.getUserMedia||(navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia)}(window),function(){tracking.EventEmitter=function(){},tracking.EventEmitter.prototype.events_=null,tracking.EventEmitter.prototype.addListener=function(t,r){if("function"!=typeof r)throw new TypeError("Listener must be a function");return this.events_||(this.events_={}),this.emit("newListener",t,r),this.events_[t]||(this.events_[t]=[]),this.events_[t].push(r),this},tracking.EventEmitter.prototype.listeners=function(t){return this.events_&&this.events_[t]},tracking.EventEmitter.prototype.emit=function(t){var r=this.events_&&this.events_[t];if(r){for(var e=Array.prototype.slice.call(arguments,1),n=0;n<r.length;n++)r[n]&&r[n].apply(this,e);return!0}return!1},tracking.EventEmitter.prototype.on=tracking.EventEmitter.prototype.addListener,tracking.EventEmitter.prototype.once=function(t,r){var e=this;e.on(t,function n(){e.removeListener(t,n),r.apply(this,arguments)})},tracking.EventEmitter.prototype.removeAllListeners=function(t){return this.events_?(t?delete this.events_[t]:delete this.events_,this):this},tracking.EventEmitter.prototype.removeListener=function(t,r){if("function"!=typeof r)throw new TypeError("Listener must be a function");if(!this.events_)return this;var e=this.events_[t];if(Array.isArray(e)){var n=e.indexOf(r);if(0>n)return this;e.splice(n,1)}return this},tracking.EventEmitter.prototype.setMaxListeners=function(){throw new Error("Not implemented")}}(),function(){tracking.Canvas={},tracking.Canvas.loadImage=function(t,r,e,n,i,a,o){var c=this,s=new window.Image;s.onload=function(){var r=t.getContext("2d");t.width=i,t.height=a,r.drawImage(s,e,n,i,a),o&&o.call(c),s=null},s.src=r}}(),function(){tracking.DisjointSet=function(t){if(void 0===t)throw new Error("DisjointSet length not specified.");this.length=t,this.parent=new Uint32Array(t);for(var r=0;t>r;r++)this.parent[r]=r},tracking.DisjointSet.prototype.length=null,tracking.DisjointSet.prototype.parent=null,tracking.DisjointSet.prototype.find=function(t){return this.parent[t]===t?t:this.parent[t]=this.find(this.parent[t])},tracking.DisjointSet.prototype.union=function(t,r){var e=this.find(t),n=this.find(r);this.parent[e]=n}}(),function(){tracking.Image={},tracking.Image.computeIntegralImage=function(t,r,e,n,i,a,o){if(arguments.length<4)throw new Error("You should specify at least one output array in the order: sum, square, tilted, sobel.");var c;o&&(c=tracking.Image.sobel(t,r,e));for(var s=0;e>s;s++)for(var g=0;r>g;g++){var h=s*r*4+4*g,k=~~(.299*t[h]+.587*t[h+1]+.114*t[h+2]);if(n&&this.computePixelValueSAT_(n,r,s,g,k),i&&this.computePixelValueSAT_(i,r,s,g,k*k),a){var u=h-4*r,f=~~(.299*t[u]+.587*t[u+1]+.114*t[u+2]);this.computePixelValueRSAT_(a,r,s,g,k,f||0)}o&&this.computePixelValueSAT_(o,r,s,g,c[h])}},tracking.Image.computePixelValueRSAT_=function(t,r,e,n,i,a){var o=e*r+n;t[o]=(t[o-r-1]||0)+(t[o-r+1]||0)-(t[o-r-r]||0)+i+a},tracking.Image.computePixelValueSAT_=function(t,r,e,n,i){var a=e*r+n;t[a]=(t[a-r]||0)+(t[a-1]||0)+i-(t[a-r-1]||0)},tracking.Image.grayscale=function(t,r,e){for(var n=new Uint8ClampedArray(r*e*4),i=0,a=0,o=0;e>o;o++)for(var c=0;r>c;c++){var s=.299*t[a]+.587*t[a+1]+.114*t[a+2];n[i++]=s,n[i++]=s,n[i++]=s,n[i++]=t[a+3],a+=4}return n},tracking.Image.horizontalConvolve=function(t,r,e,n,i){for(var a=n.length,o=Math.floor(a/2),c=new Float32Array(r*e*4),s=i?1:0,g=0;e>g;g++)for(var h=0;r>h;h++){for(var k=g,u=h,f=4*(g*r+h),l=0,v=0,p=0,y=0,m=0;a>m;m++){var d=k,A=Math.min(r-1,Math.max(0,u+m-o)),w=4*(d*r+A),T=n[m];l+=t[w]*T,v+=t[w+1]*T,p+=t[w+2]*T,y+=t[w+3]*T}c[f]=l,c[f+1]=v,c[f+2]=p,c[f+3]=y+s*(255-y)}return c},tracking.Image.verticalConvolve=function(t,r,e,n,i){for(var a=n.length,o=Math.floor(a/2),c=new Float32Array(r*e*4),s=i?1:0,g=0;e>g;g++)for(var h=0;r>h;h++){for(var k=g,u=h,f=4*(g*r+h),l=0,v=0,p=0,y=0,m=0;a>m;m++){var d=Math.min(e-1,Math.max(0,k+m-o)),A=u,w=4*(d*r+A),T=n[m];l+=t[w]*T,v+=t[w+1]*T,p+=t[w+2]*T,y+=t[w+3]*T}c[f]=l,c[f+1]=v,c[f+2]=p,c[f+3]=y+s*(255-y)}return c},tracking.Image.separableConvolve=function(t,r,e,n,i,a){var o=this.verticalConvolve(t,r,e,i,a);return this.horizontalConvolve(o,r,e,n,a)},tracking.Image.sobel=function(t,r,e){t=this.grayscale(t,r,e);for(var n=new Float32Array(r*e*4),i=new Float32Array([-1,0,1]),a=new Float32Array([1,2,1]),o=this.separableConvolve(t,r,e,i,a),c=this.separableConvolve(t,r,e,a,i),s=0;s<n.length;s+=4){var g=o[s],h=c[s],k=Math.sqrt(h*h+g*g);n[s]=k,n[s+1]=k,n[s+2]=k,n[s+3]=255}return n}}(),function(){tracking.ViolaJones={},tracking.ViolaJones.REGIONS_OVERLAP=.5,tracking.ViolaJones.detect=function(t,r,e,n,i,a,o,c){var s,g=0,h=[],k=new Int32Array(r*e),u=new Int32Array(r*e),f=new Int32Array(r*e);o>0&&(s=new Int32Array(r*e)),tracking.Image.computeIntegralImage(t,r,e,k,u,f,s);for(var l=c[0],v=c[1],p=n*i,y=p*l|0,m=p*v|0;r>y&&e>m;){for(var d=p*a+.5|0,A=0;e-m>A;A+=d)for(var w=0;r-y>w;w+=d)o>0&&this.isTriviallyExcluded(o,s,A,w,r,y,m)||this.evalStages_(c,k,u,f,A,w,r,y,m,p)&&(h[g++]={width:y,height:m,x:w,y:A});p*=i,y=p*l|0,m=p*v|0}return this.mergeRectangles_(h)},tracking.ViolaJones.isTriviallyExcluded=function(t,r,e,n,i,a,o){var c=e*i+n,s=c+a,g=c+o*i,h=g+a,k=(r[c]-r[s]-r[g]+r[h])/(a*o*255);return t>k?!0:!1},tracking.ViolaJones.evalStages_=function(t,r,e,n,i,a,o,c,s,g){var h=1/(c*s),k=i*o+a,u=k+c,f=k+s*o,l=f+c,v=(r[k]-r[u]-r[f]+r[l])*h,p=(e[k]-e[u]-e[f]+e[l])*h-v*v,y=1;p>0&&(y=Math.sqrt(p));for(var m=t.length,d=2;m>d;){for(var A=0,w=t[d++],T=t[d++];T--;){for(var _=0,C=t[d++],E=t[d++],R=0;E>R;R++){var M,x,S,I,D=a+t[d++]*g+.5|0,H=i+t[d++]*g+.5|0,F=t[d++]*g+.5|0,b=t[d++]*g+.5|0,L=t[d++];C?(M=D-b+F+(H+F+b-1)*o,x=D+(H-1)*o,S=D-b+(H+b-1)*o,I=D+F+(H+F-1)*o,_+=(n[M]+n[x]-n[S]-n[I])*L):(M=H*o+D,x=M+F,S=M+b*o,I=S+F,_+=(r[M]-r[x]-r[S]+r[I])*L)}var O=t[d++],U=t[d++],V=t[d++];A+=O*y>_*h?U:V}if(w>A)return!1}return!0},tracking.ViolaJones.mergeRectangles_=function(t){for(var r=new tracking.DisjointSet(t.length),e=0;e<t.length;e++)for(var n=t[e],i=0;i<t.length;i++){var a=t[i];if(tracking.Math.intersectRect(n.x,n.y,n.x+n.width,n.y+n.height,a.x,a.y,a.x+a.width,a.y+a.height)){var o=Math.max(n.x,a.x),c=Math.max(n.y,a.y),s=Math.min(n.x+n.width,a.x+a.width),g=Math.min(n.y+n.height,a.y+a.height),h=(o-s)*(c-g),k=n.width*n.height,u=a.width*a.height;h/(k*(k/u))>=this.REGIONS_OVERLAP&&h/(u*(k/u))>=this.REGIONS_OVERLAP&&r.union(e,i)}}for(var f={},l=0;l<r.length;l++){var v=r.find(l);f[v]?(f[v].total++,f[v].width+=t[l].width,f[v].height+=t[l].height,f[v].x+=t[l].x,f[v].y+=t[l].y):f[v]={total:1,width:t[l].width,height:t[l].height,x:t[l].x,y:t[l].y}}var p=[];return Object.keys(f).forEach(function(t){var r=f[t];p.push({total:r.total,width:r.width/r.total+.5|0,height:r.height/r.total+.5|0,x:r.x/r.total+.5|0,y:r.y/r.total+.5|0})}),p}}(),function(){tracking.Brief={},tracking.Brief.N=128,tracking.Brief.randomOffsets_={},tracking.Brief.getDescriptors=function(t,r,e){for(var n=new Int32Array(e.length*(this.N>>5)),i=0,a=this.getRandomOffsets_(r),o=0,c=0;c<e.length;c+=2)for(var s=r*e[c+1]+e[c],g=0,h=this.N;h>g;g++)t[a[g+g]+s]<t[a[g+g+1]+s]&&(i|=1<<(31&g)),g+1&31||(n[o++]=i,i=0);return n},tracking.Brief.match=function(t,r,e,n){for(var i=t.length>>1,a=e.length>>1,o=new Int32Array(i),c=0;i>c;c++){for(var s=1/0,g=0,h=0;a>h;h++){for(var k=0,u=0,f=this.N>>5;f>u;u++)k+=tracking.Math.hammingWeight(r[c*f+u]^n[h*f+u]);s>k&&(s=k,g=h)}o[c]=g}return o},tracking.Brief.getRandomOffsets_=function(t){if(this.randomOffsets_[t])return this.randomOffsets_[t];for(var r=new Int32Array(2*this.N),e=0,n=0;n<this.N;n++)r[e++]=tracking.Math.uniformRandom(-15,16)*t+tracking.Math.uniformRandom(-15,16),r[e++]=tracking.Math.uniformRandom(-15,16)*t+tracking.Math.uniformRandom(-15,16);return this.randomOffsets_[t]=r,this.randomOffsets_[t]}}(),function(){tracking.Fast={},tracking.Fast.FAST_THRESHOLD=40,tracking.Fast.circles_={},tracking.Fast.findCorners=function(t,r,e){for(var n=this.getCircleOffsets_(r),i=new Int32Array(16),a=[],o=3;e-3>o;o++)for(var c=3;r-3>c;c++){for(var s=o*r+c,g=t[s],h=0;16>h;h++)i[h]=t[s+n[h]];this.isCorner(g,i,this.FAST_THRESHOLD)&&(a.push(c,o),c+=3)}return a},tracking.Fast.isBrighter=function(t,r,e){return t-r>e},tracking.Fast.isCorner=function(t,r,e){if(this.isTriviallyExcluded(r,t,e))return!1;for(var n=0;16>n;n++){for(var i=!0,a=!0,o=0;9>o;o++){var c=r[n+o&15];if(!this.isBrighter(t,c,e)&&(a=!1,i===!1))break;if(!this.isDarker(t,c,e)&&(i=!1,a===!1))break}if(a||i)return!0}return!1},tracking.Fast.isDarker=function(t,r,e){return r-t>e},tracking.Fast.isTriviallyExcluded=function(t,r,e){var n=0,i=t[8],a=t[12],o=t[4],c=t[0];return this.isBrighter(c,r,e)&&n++,this.isBrighter(o,r,e)&&n++,this.isBrighter(i,r,e)&&n++,this.isBrighter(a,r,e)&&n++,3>n&&(n=0,this.isDarker(c,r,e)&&n++,this.isDarker(o,r,e)&&n++,this.isDarker(i,r,e)&&n++,this.isDarker(a,r,e)&&n++,3>n)?!0:!1},tracking.Fast.getCircleOffsets_=function(t){if(this.circles_[t])return this.circles_[t];var r=new Int32Array(16);return r[0]=-t-t-t,r[1]=r[0]+1,r[2]=r[1]+t+1,r[3]=r[2]+t+1,r[4]=r[3]+t,r[5]=r[4]+t,r[6]=r[5]+t-1,r[7]=r[6]+t-1,r[8]=r[7]-1,r[9]=r[8]-1,r[10]=r[9]-t-1,r[11]=r[10]-t-1,r[12]=r[11]-t,r[13]=r[12]-t,r[14]=r[13]-t+1,r[15]=r[14]-t+1,this.circles_[t]=r,r}}(),function(){tracking.Math={},tracking.Math.distance=function(t,r,e,n){var i=e-t,a=n-r;return Math.sqrt(i*i+a*a)},tracking.Math.hammingWeight=function(t){return t-=t>>1&1431655765,t=(858993459&t)+(t>>2&858993459),16843009*(t+(t>>4)&252645135)>>24},tracking.Math.uniformRandom=function(t,r){return t+Math.random()*(r-t)},tracking.Math.intersectRect=function(t,r,e,n,i,a,o,c){return!(i>e||t>o||a>n||r>c)}}(),function(){tracking.Matrix={},tracking.Matrix.forEach=function(t,r,e,n,i){i=i||1;for(var a=0;e>a;a+=i)for(var o=0;r>o;o+=i){var c=a*r*4+4*o;n.call(this,t[c],t[c+1],t[c+2],t[c+3],c,a,o)}}}(),function(){tracking.EPnP={},tracking.EPnP.solve=function(){}}(),function(){tracking.Tracker=function(){tracking.Tracker.base(this,"constructor")},tracking.inherits(tracking.Tracker,tracking.EventEmitter),tracking.Tracker.prototype.track=function(){}}(),function(){tracking.HAARTracker=function(){tracking.HAARTracker.base(this,"constructor")},tracking.inherits(tracking.HAARTracker,tracking.Tracker),tracking.HAARTracker.data={},tracking.HAARTracker.prototype.data=null,tracking.HAARTracker.prototype.edgesDensity=.2,tracking.HAARTracker.prototype.initialScale=1,tracking.HAARTracker.prototype.scaleFactor=1.25,tracking.HAARTracker.prototype.stepSize=1.5,tracking.HAARTracker.prototype.getData=function(){return this.data},tracking.HAARTracker.prototype.getEdgesDensity=function(){return this.edgesDensity},tracking.HAARTracker.prototype.getInitialScale=function(){return this.initialScale},tracking.HAARTracker.prototype.getScaleFactor=function(){return this.scaleFactor},tracking.HAARTracker.prototype.getStepSize=function(){return this.stepSize},tracking.HAARTracker.prototype.track=function(t,r,e){var n=this.getData();if(!n)throw new Error("HAAR cascade data not set.");var i=tracking.ViolaJones.detect(t,r,e,this.getInitialScale(),this.getScaleFactor(),this.getStepSize(),this.getEdgesDensity(),n);this.emit("track",{data:i})},tracking.HAARTracker.prototype.setData=function(t){this.data=t},tracking.HAARTracker.prototype.setEdgesDensity=function(t){this.edgesDensity=t},tracking.HAARTracker.prototype.setInitialScale=function(t){this.initialScale=t},tracking.HAARTracker.prototype.setScaleFactor=function(t){this.scaleFactor=t},tracking.HAARTracker.prototype.setStepSize=function(t){this.stepSize=t}}(),function(){tracking.ColorTracker=function(){tracking.ColorTracker.base(this,"constructor"),this.setColors(["magenta"])},tracking.inherits(tracking.ColorTracker,tracking.Tracker),tracking.ColorTracker.knownColors_={},tracking.ColorTracker.neighbours_={},tracking.ColorTracker.registerColor=function(t,r){tracking.ColorTracker.knownColors_[t]=r},tracking.ColorTracker.getColor=function(t){return tracking.ColorTracker.knownColors_[t]},tracking.ColorTracker.prototype.colors=null,tracking.ColorTracker.prototype.minDimension=20,tracking.ColorTracker.prototype.minGroupSize=30,tracking.ColorTracker.prototype.calculateDimensions_=function(t,r){for(var e=-1,n=-1,i=1/0,a=1/0,o=0;r>o;o+=2){var c=t[o],s=t[o+1];i>c&&(i=c),c>e&&(e=c),a>s&&(a=s),s>n&&(n=s)}return{width:e-i,height:n-a,x:i,y:a}},tracking.ColorTracker.prototype.getColors=function(){return this.colors},tracking.ColorTracker.prototype.getMinDimension=function(){return this.minDimension},tracking.ColorTracker.prototype.getMinGroupSize=function(){return this.minGroupSize},tracking.ColorTracker.prototype.getNeighboursForWidth_=function(t){if(tracking.ColorTracker.neighbours_[t])return tracking.ColorTracker.neighbours_[t];var r=new Int32Array(8);return r[0]=4*-t,r[1]=4*-t+4,r[2]=4,r[3]=4*t+4,r[4]=4*t,r[5]=4*t-4,r[6]=-4,r[7]=4*-t-4,tracking.ColorTracker.neighbours_=r,r},tracking.ColorTracker.prototype.mergeRectangles_=function(t){for(var r,e=[],n=this.getMinDimension(),i=0;i<t.length;i++){var a=t[i];r=!0;for(var o=i+1;o<t.length;o++){var c=t[o];if(tracking.Math.intersectRect(a.x,a.y,a.x+a.width,a.y+a.height,c.x,c.y,c.x+c.width,c.y+c.height)){r=!1;var s=Math.min(a.x,c.x),g=Math.min(a.y,c.y),h=Math.max(a.x+a.width,c.x+c.width),k=Math.max(a.y+a.height,c.y+c.height);c.height=k-g,c.width=h-s,c.x=s,c.y=g;break}}r&&a.width>=n&&a.height>=n&&e.push(a)}return e},tracking.ColorTracker.prototype.setColors=function(t){this.colors=t},tracking.ColorTracker.prototype.setMinDimension=function(t){this.minDimension=t},tracking.ColorTracker.prototype.setMinGroupSize=function(t){this.minGroupSize=t},tracking.ColorTracker.prototype.track=function(t,r,e){for(var n=this.getColors(),i=[],a=0;a<n.length;a++){var o=this.trackColor_(t,r,e,n[a]);o.length&&(i=i.concat(o))}this.emit("track",{data:i})},tracking.ColorTracker.prototype.trackColor_=function(e,n,i,a){var o,c,s,g,h,k=tracking.ColorTracker.knownColors_[a],u=new Int32Array(e.length>>2),f=new Int8Array(e.length),l=this.getMinGroupSize(),v=this.getNeighboursForWidth_(n),p=new Int32Array(e.length),y=[],m=-4;if(!k)return y;for(var d=0;i>d;d++)for(var A=0;n>A;A++)if(m+=4,!f[m]){for(o=0,h=-1,p[++h]=m,p[++h]=d,p[++h]=A,f[m]=1;h>=0;)if(s=p[h--],c=p[h--],g=p[h--],k(e[g],e[g+1],e[g+2],e[g+3],g,c,s)){u[o++]=s,u[o++]=c;for(var w=0;w<v.length;w++){var T=g+v[w],_=c+t[w],C=s+r[w];!f[T]&&_>=0&&i>_&&C>=0&&n>C&&(p[++h]=T,p[++h]=_,p[++h]=C,f[T]=1)}}if(o>=l){var E=this.calculateDimensions_(u,o);E&&(E.color=a,y.push(E))}}return this.mergeRectangles_(y)},tracking.ColorTracker.registerColor("cyan",function(t,r,e){var n=50,i=70,a=t-0,o=r-255,c=e-255;return r-t>=n&&e-t>=i?!0:6400>a*a+o*o+c*c}),tracking.ColorTracker.registerColor("magenta",function(t,r,e){var n=50,i=t-255,a=r-0,o=e-255;return t-r>=n&&e-r>=n?!0:19600>i*i+a*a+o*o}),tracking.ColorTracker.registerColor("yellow",function(t,r,e){var n=50,i=t-255,a=r-255,o=e-0;return t-e>=n&&r-e>=n?!0:1e4>i*i+a*a+o*o});var t=new Int32Array([-1,-1,0,1,1,1,0,-1]),r=new Int32Array([0,1,1,1,0,-1,-1,-1])}(),function(){tracking.EyeTracker=function(){tracking.EyeTracker.base(this,"constructor");var t=tracking.HAARTracker.data.eye;t&&this.setData(new Float64Array(t))},tracking.inherits(tracking.EyeTracker,tracking.HAARTracker)}(),function(){tracking.FaceTracker=function(){tracking.FaceTracker.base(this,"constructor");var t=tracking.HAARTracker.data.face;t&&this.setData(new Float64Array(t))},tracking.inherits(tracking.FaceTracker,tracking.HAARTracker)}(),function(){tracking.MouthTracker=function(){tracking.MouthTracker.base(this,"constructor");var t=tracking.HAARTracker.data.mouth;t&&this.setData(new Float64Array(t))},tracking.inherits(tracking.MouthTracker,tracking.HAARTracker)}();