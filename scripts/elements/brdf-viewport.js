var __extends=this&&this.__extends||function(e,t){function r(){this.constructor=e}for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i]);e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)},__decorate=this&&this.__decorate||function(e,t,r,i){var o,n=arguments.length,s=3>n?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var a=e.length-1;a>=0;a--)(o=e[a])&&(s=(3>n?o(s):n>3?o(t,r,s):o(t,r))||s);return n>3&&s&&Object.defineProperty(t,r,s),s},BrdfViewport=function(e){function t(){e.call(this),this.visible=!1,this.visible=!0,this.plotObjs={},this.lightDir=new THREE.Vector3(0,1,0)}return __extends(t,e),t.prototype.ready=function(){this._initRenderer(),this.scene=new THREE.Scene,this._setupScene(this.scene)},t.prototype.attached=function(){this.async(this._resize,1)},t.prototype.attributeChanged=function(e,t){this._resize()},t.prototype._initRenderer=function(){var e=300,t=300;this.renderer=new THREE.WebGLRenderer({alpha:!0}),this.renderer.setSize(e,t),this.renderer.setClearColor(0,0),this.appendChild(this.renderer.domElement);var r=new THREE.Vector3(10,10,10);this.camera=new THREE.PerspectiveCamera(75,e/t,.1,1e3),this.camera.position.set(r.x,r.y,r.z),this.camera.lookAt(new THREE.Vector3(0,0,0)),this.cameraControl=new THREE.OrbitControls(this.camera,this.renderer.domElement),this.cameraControl.enablePan=!1,this.cameraControl.addEventListener("change",this.renderJob.bind(this))},t.prototype._setupScene=function(e){var t=new THREE.CircleGeometry(5,32),r=new THREE.MeshBasicMaterial({color:7829248,side:THREE.DoubleSide}),i=new THREE.Mesh(t,r);i.rotation.x=.5*Math.PI,i.material.opacity=.1,e.add(i),e.add(new THREE.GridHelper(10,1));var o=[{v:new THREE.Vector3(1,0,0),color:16711680},{v:new THREE.Vector3(0,1,0),color:65280},{v:new THREE.Vector3(0,0,1),color:255}],n=new THREE.Vector3(0,0,0);o.forEach(function(t,r,i){var o=new THREE.ArrowHelper(t.v,n,10,t.color,1,.5);e.add(o)});var s=new THREE.Vector3(0,1,0);this.lightArrow=new THREE.ArrowHelper(s,n,10,16777062,1,.5),this.viewArrow=new THREE.ArrowHelper(s,n,10,10079487,1,.5),e.add(this.lightArrow),e.add(this.viewArrow)},t.prototype.addPlotObj=function(e,t){var r=pgLib[e],i=JSON.parse(JSON.stringify(plotObjMaterial));i.uniforms=THREE.UniformsUtils.merge([plotObjMaterial.uniforms,r.uniforms]),i.vertexShader=i.vertexShader.replace("{{PHASE_FUNCTION}}",r.brdf);var o=new THREE.ShaderMaterial(i);o.uniforms.uLightPos.value=this.lightDir;var n=new THREE.Mesh(new THREE.SphereGeometry(5,128,32,0,2*Math.PI,0,.5*Math.PI),o);this.scene.add(n),this.plotObjs[t]=n,this.renderJob()},t.prototype.removePlotObj=function(e){this.scene.remove(this.plotObjs[e]),delete this.plotObjs[e],this.renderJob()},t.prototype.updateShaderParam=function(e){var t=e.shaderName;if("all"!==t){var r=e.uuid,i=this.plotObjs[r].material;i.uniforms[e.name].value=e.value}else for(var o in this.plotObjs){var i=this.plotObjs[o].material;i.uniforms[e.name].value=e.value}this.renderJob()},t.prototype.changeVisibility=function(e){this.plotObjs[e.uuid].visible=e.visible,this.renderJob()},t.prototype.renderJob=function(){this.debounce("brdf-viewport-render-job",function(){requestAnimationFrame(this._render.bind(this))},1)},t.prototype._render=function(){this.visible&&(this.cameraControl.update(),this.renderer.render(this.scene,this.camera))},t.prototype._resize=function(){var e=this.clientWidth,t=this.clientHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.renderJob()},t.prototype.changeLightDir=function(e){this.lightDir=e;for(var t in this.plotObjs){var r=this.plotObjs[t];r.material.uniforms.uLightPos.value=e}this.lightArrow.setDirection(e);var i=new THREE.Vector3(-e.x,e.y,-e.z);this.viewArrow.setDirection(i),this.renderJob()},__decorate([property({type:THREE.Scene,observer:"renderJob"})],t.prototype,"scene",void 0),__decorate([property({observer:"renderJob"})],t.prototype,"visible",void 0),__decorate([listen("iron-resize")],t.prototype,"_resize",null),t=__decorate([component("brdf-viewport"),behavior(Polymer.IronResizableBehavior)],t)}(polymer.Base);BrdfViewport.register();