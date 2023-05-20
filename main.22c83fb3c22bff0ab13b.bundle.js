/*! For license information please see main.22c83fb3c22bff0ab13b.bundle.js.LICENSE.txt */
(()=>{var e,t={541:(e,t,s)=>{"use strict";var o=s(260);const a="#EAEAA6",i="#719DAF",n="#E99EAE",r="#F2C42A",l="#CA384D",h="#F5D04C";function d(e,t,s,o,a){return new Phaser.GameObjects.Text(e,t,s,o.toString(),Object.assign({fontFamily:"'FEH'",stroke:"black",strokeThickness:2},a))}function c(e){const{text:t,gradient:s}=m(e);return s.addColorStop(0,"white"),s.addColorStop(.5,l),s.addColorStop(1,"white"),t.setFill(s),t}function p(e){const{text:t,gradient:s}=m(e);return s.addColorStop(0,"white"),s.addColorStop(1,r),t.setFill(s),t}function m(e){const t=d(e.scene,e.x,e.y,e.content,e.style),s=t.context.createLinearGradient(0,0,0,t.height);return{text:t,gradient:s}}class g extends o.GameObjects.Container{constructor(e,t,s,a,i){super(e,t,s),this.setData("hero",a),this.setName(a.id),this.image=new o.GameObjects.Image(e,0,0,a.name,"map").setScale(.7).setDepth(1),this.add(this.image),this.team=i;const n=this.image.getBottomCenter().y-20;this.hpBar=new o.GameObjects.Rectangle(e,-13,n,60,5,"team1"===this.team?5562356:16403817).setOrigin(0,0).setDepth(2),this.weaponType=new o.GameObjects.Image(e,-30,-40,"weapons",`${a.getWeapon().color}-${a.getWeapon().type}`),this.hpBarBackground=new o.GameObjects.Rectangle(e,-14,n-1,62,7,0).setOrigin(0,0),this.add(this.hpBarBackground),this.add(this.hpBar),this.add(this.weaponType),this.hpText=d(e,-15,n,a.maxHP,{fontSize:"18px"}).setOrigin(1,.5);const r=this.hpText.context.createLinearGradient(0,0,0,this.hpText.height);r.addColorStop(0,"white"),r.addColorStop(.7,"team1"===this.team?"#54DFF4":"#FA4D69"),this.hpText.setFill(r),this.add(this.hpText),this.setSize(this.image.width,this.image.height)}getInternalHero(){return this.data.get("hero")}update(){const{maxHP:e,stats:{hp:t}}=this.getInternalHero();this.hpText.setText(t.toString());const s=t/e;this.hpBar.displayWidth=60*s}getMovementRange(){const{movementType:e}=this.getInternalHero();return"cavalry"===e?3:"armored"===e?1:2}getWeaponRange(){return["sword","lance","axe","dragonstone"].includes(this.getInternalHero().getWeapon().type)?1:2}}const f=g;class u extends o.GameObjects.Container{constructor(e,t,s,a){super(e,t,s),this.nameplate=new o.GameObjects.Image(e,0,0,"nameplate").setScale(.9,.5).setOrigin(0,.5),this.weaponIcon=new o.GameObjects.Image(e,this.nameplate.getLeftCenter().x+22,this.nameplate.getLeftCenter().y,"weapons",`${a.weaponColor}-${a.weaponType}`).setScale(1.2),this.heroName=d(e,this.nameplate.getCenter().x,this.nameplate.getCenter().y,a.name,{fontSize:"22px"}).setOrigin(.5),this.add([this.nameplate,this.weaponIcon,this.heroName])}updateNameplate({name:e,weaponType:t,weaponColor:s}){this.heroName.setText(e),this.weaponIcon.setFrame(`${s}-${t}`)}}const y=u;class w extends o.GameObjects.Container{constructor(e,t,s){super(e,t,s),this.contentContainer=new o.GameObjects.Rectangle(e,0,0,400,400,1258815).setOrigin(1,0).setAlpha(.7).setStrokeStyle(2,8377056),this.add(this.contentContainer)}setSkillDescription(e){this.skillDesc&&this.remove(this.skillDesc);const t=function(e){const{text:t}=m(e);return t.setColor(h),t.setFontSize(20),t}({scene:this.scene,x:this.contentContainer.getLeftCenter().x+10,y:this.contentContainer.getTopCenter().y+10,content:"Distant Counter"});this.add(t),this.skillDesc=d(this.scene,this.contentContainer.getLeftCenter().x+10,t.getBottomCenter().y+10,e,{wordWrapWidth:450,wordWrapUseAdvanced:!0}),this.add(this.skillDesc)}}const S=w;class x extends o.GameObjects.Container{constructor(e){super(e,0,0);const t=e.textures.createCanvas("gradient",1500,340).getContext(),s=t.createLinearGradient(0,0,1500,0);s.addColorStop(0,"#00CFF2"),s.addColorStop(.15,"#002B43"),s.addColorStop(.25,"#001D30"),s.addColorStop(.7,"#033554"),t.fillStyle=s,t.fillRect(0,0,1500,400),this.add(new o.GameObjects.Image(e,0,0,"gradient").setOrigin(0,.5)),this.heroPortrait=new o.GameObjects.Image(e,-100,-10,"").setOrigin(0),this.add(this.heroPortrait),this.add(new o.GameObjects.Image(e,170,70,"hp plate").setScale(1.15,.6).setOrigin(0,.5)),this.add(d(e,190,54,"HP",{fontSize:"20px"})),this.maxHP=p({scene:this.scene,x:310,y:56,content:"",style:{fontSize:"18px"}}),this.nameplate=new y(e,160,25,{name:"",weaponType:"",weaponColor:""});const i=d(e,590,15,"40+",{fontSize:"20px"});this.atk=d(e,280,89,"",{fontSize:"18px"}).setOrigin(1,0).setColor(a),this.spd=d(e,390,89,"",{fontSize:"18px"}).setOrigin(1,0).setColor(a),this.def=d(e,280,114,"",{fontSize:"18px"}).setOrigin(1,0).setColor(a),this.res=d(e,390,114,"",{fontSize:"18px"}).setOrigin(1,0).setColor(a),this.add([this.nameplate]),this.add([this.atk,this.spd,this.def,this.res]),this.add(new o.GameObjects.Image(e,180,111,"stat-line").setScale(.2,.5).setOrigin(0)),this.add(new o.GameObjects.Image(e,180,136,"stat-line").setScale(.2,.5).setOrigin(0)),this.add(d(e,190,89,"Atk",{fontSize:"18px"})),this.add(d(e,300,89,"Spd",{fontSize:"18px"})),this.add(d(e,190,114,"Def",{fontSize:"18px"})),this.add(d(e,300,114,"Res",{fontSize:"18px"})),this.add(d(e,i.getLeftCenter().x,0,"Lv.",{fontSize:"14px"})),this.add(i),this.S=new o.GameObjects.Image(e,715,i.getBottomCenter().y,"empty-skill").setScale(.5).setOrigin(0,1);const n=new o.GameObjects.Image(e,this.S.getBottomRight().x,this.S.getBottomRight().y,"S").setOrigin(1).setScale(.5);this.add(this.S),this.add(n),this.C=new o.GameObjects.Image(e,690,i.getBottomCenter().y,"empty-skill").setScale(.5).setOrigin(0,1);const r=new o.GameObjects.Image(e,this.C.getBottomRight().x,this.C.getBottomRight().y,"C").setOrigin(1).setScale(.5);this.add(this.C),this.add(r),this.B=new o.GameObjects.Image(e,665,i.getBottomCenter().y,"empty-skill").setScale(.5).setOrigin(0,1);const l=new o.GameObjects.Image(e,this.B.getBottomRight().x,this.B.getBottomRight().y,"B").setOrigin(1).setScale(.5);this.add(this.B),this.add(l),this.A=new o.GameObjects.Image(e,640,i.getBottomCenter().y,"empty-skill").setScale(.5).setOrigin(0,1);const h=new o.GameObjects.Image(e,this.A.getBottomRight().x,this.A.getBottomRight().y,"A").setOrigin(1).setScale(.5);this.add(this.A),this.add(h),this.skillInfos=new S(e,this.S.getCenter().x+10,this.S.getBottomRight().y).setDepth(4).setVisible(!1);const c=new o.GameObjects.Image(this.scene,490,45,"weapon-bg").setOrigin(0,0).setScale(.23,.25);new o.GameObjects.Image(this.scene,490,85,"weapon-bg").setOrigin(0,0).setScale(.23,.25),new o.GameObjects.Image(this.scene,490,125,"weapon-bg").setOrigin(0,0).setScale(.23,.25),new o.GameObjects.Image(this.scene,490,105,"assist-icon").setScale(.45).setOrigin(.25,.5),new o.GameObjects.Image(this.scene,490,135,"special-icon").setScale(.45).setOrigin(.25,.5),this.add(c),this.weaponName=d(this.scene,c.getLeftCenter().x+30,c.getCenter().y,"").setOrigin(0,.5).setStyle({fontSize:"19px"}),this.add(this.weaponName),this.add(new o.GameObjects.Image(this.scene,490,c.getLeftCenter().y,"weapon-icon").setScale(.45).setOrigin(.25,.5)),this.currentHP=p({scene:this.scene,x:250,y:50,content:0,style:{fontSize:"26px"}}),this.add(this.currentHP),this.add(this.maxHP),this.add(this.skillInfos)}setHero(e){const t=e.getInternalHero();this.heroPortrait.setTexture(t.name,t.stats.hp/t.maxHP<.5?"portrait-damaged":"portrait"),this.currentHP.destroy();const s=t.stats.hp<10?c:p;this.currentHP=s({scene:this.scene,x:this.currentHP.x,y:this.currentHP.y,style:{fontSize:"26px"},content:t.stats.hp}),this.add(this.currentHP),this.nameplate.heroName.text!==t.name&&(this.heroPortrait.x=-300,this.scene.tweens.add({targets:this.heroPortrait,x:-100,duration:200})),this.nameplate.updateNameplate({name:t.name,weaponType:t.getWeapon().type,weaponColor:t.getWeapon().color}),this.maxHP.setText(`/ ${t.maxHP}`);for(let e of["atk","def","res","spd"])this[e].setText(t.stats[e].toString());this.weaponName.setText(t.getWeapon().name);for(let e of["A","B","C","S"]){this[e].off("pointerdown");const s=t.skills[e].name;this[e].setTexture("skills",s),this[e].setName(s),this[e].on("pointerdown",(()=>{this.skillInfos.setVisible(!0)}))}}}const k=x;class v extends o.GameObjects.Image{constructor(e,t){super(e,-30,0,`${t} battle`),this.setOrigin(0)}}const H=v;class C extends Phaser.GameObjects.Container{constructor(e){super(e,0,0),this.firstHero={previousHP:null,predictedHP:null,nameplate:null,portrait:null},this.secondHero={previousHP:null,predictedHP:null,nameplate:null,portrait:null},this.attackerStatMods=this.defenderStatMods=new o.GameObjects.Group(e),this.firstSideBg=new o.GameObjects.Rectangle(e,0,0,750,400,9272).setOrigin(0),this.add(this.firstSideBg),this.firstHero.portrait=new H(e,""),this.add(this.firstHero.portrait),this.add(new o.GameObjects.Rectangle(e,750,0,750,400,10104088).setAlpha(.7)),this.secondHero.portrait=new H(e,"").setFlipX(!0).setX(1100).setOrigin(1,0),this.add(this.secondHero.portrait),this.firstHero.nameplate=new y(e,100,20,{name:"",weaponType:"",weaponColor:""}),this.add(this.firstHero.nameplate);const t=45;this.secondHero.nameplate=new y(e,377,20,{name:"",weaponType:"",weaponColor:""});const s=new o.GameObjects.Image(e,250,70,"unit-bg").setScale(.5,.75),a=new o.GameObjects.Image(e,510,70,"unit-bg").setScale(.5,.75);this.add(this.secondHero.nameplate),this.add([s,a]),this.add(d(e,this.firstSideBg.getCenter().x,70,"HP",{fontSize:"22px"}).setOrigin(.5)),this.firstHero.previousHP=p({scene:e,x:210,y:t,style:{fontSize:"36px"},content:""}).setOrigin(1,0),this.firstHero.predictedHP=p({scene:e,x:310,y:t,style:{fontSize:"36px"},content:""}).setOrigin(1,0),this.secondHero.previousHP=p({scene:e,content:"",style:{fontSize:"36px"},x:490,y:t}).setOrigin(1,0);const i=p({scene:e,x:500,y:t,content:"→",style:{fontSize:"36px"}}),n=p({scene:e,x:215,y:t,content:"→",style:{fontSize:"36px"}});this.secondHero.predictedHP=c({scene:e,content:0,x:550,y:t,style:{fontSize:"36px"}}),this.add(this.secondHero.previousHP),this.add(this.secondHero.predictedHP),this.add(i),this.add(n),this.add(this.firstHero.previousHP),this.add(this.firstHero.predictedHP),this.firstPortraitSwitchingTween=e.tweens.create({duration:300,targets:[this.firstHero.portrait],yoyo:!0,alpha:0,onYoyo:()=>{}}),this.secondPortraitSwitchingTween=e.tweens.create({duration:300,targets:[this.secondHero.portrait],yoyo:!0,alpha:0,onYoyo:()=>{}}),this.portraitDisplayTween=e.tweens.create({duration:300,x:800,targets:this.secondHero.portrait})}setForecastData(e){var t;this.koTween&&(null===(t=this.koTween.targets[0])||void 0===t||t.setAlpha(1),this.koTween.stop()),this.remove(this.attackerStatMods.getChildren(),!0),this.remove(this.defenderStatMods.getChildren(),!0),this.attackerStatMods.clear(),this.defenderStatMods.clear();const{attacker:s,defender:o}=e,a=s.statChanges,r=o.statChanges;console.log({defenderStatMods:r});let l=this.firstSideBg.getCenter().x-35;for(let e in a)if(a[e]){const t=d(this.scene,l-40,120,b(e)),s=a[e];this.attackerStatMods.add(t);const o=d(this.scene,l-5,120,`${s>0?"+":""}${s}`,{color:s<0?n:i});this.attackerStatMods.add(o),this.add(o),this.add(t),l-=80}let h=this.firstSideBg.getCenter().x+35;for(let e in r)if(r[e]){const t=d(this.scene,h,120,b(e)),s=r[e];this.defenderStatMods.add(t);const o=d(this.scene,h+35,120,`${s>0?"+":""}${s}`,{color:s<0?n:i});this.defenderStatMods.add(o),this.add(o),this.add(t),h+=80}this.firstHero.nameplate.weaponIcon.setTexture("weapons",s.hero.getInternalHero().getWeapon().color+"-"+s.hero.getInternalHero().getWeapon().type),this.firstHero.nameplate.heroName.setText(s.hero.getInternalHero().name),this.secondHero.nameplate.weaponIcon.setTexture("weapons",o.hero.getInternalHero().getWeapon().color+"-"+o.hero.getInternalHero().getWeapon().type),this.secondHero.nameplate.heroName.setText(o.hero.getInternalHero().name);const m=s.hero.getInternalHero().stats.hp/s.hero.getInternalHero().maxHP<.5?"-damaged":"",g=o.hero.getInternalHero().stats.hp/o.hero.getInternalHero().maxHP<.5?"-damaged":"";this.firstHero.portrait.setTexture(s.hero.getInternalHero().name,"portrait"+m),this.secondHero.portrait.setTexture(o.hero.getInternalHero().name,"portrait"+g),this.secondHero.portrait.x=1100,this.portraitDisplayTween.play();const f=s.startHP<10?c:p,u=s.endHP<10?c:p,y=o.startHP<10?c:p,w=o.endHP<10?c:p;let S;this.firstHero.previousHP.destroy(),this.firstHero.predictedHP.destroy(),this.firstHero.previousHP=f({scene:this.scene,x:this.firstHero.previousHP.x,y:this.firstHero.previousHP.y,content:s.startHP,style:{fontSize:"36px"}}).setOrigin(1,0),0===s.endHP&&(S=this.firstHero.portrait),0===o.endHP&&(S=this.secondHero.portrait),this.koTween=this.scene.tweens.create({duration:1e3,loop:-1,targets:S,yoyo:!0,alpha:.5}),this.koTween.play(),this.firstHero.predictedHP=u({scene:this.scene,x:this.firstHero.predictedHP.x,y:this.firstHero.predictedHP.y,content:s.endHP,style:{fontSize:"36px"}}).setOrigin(1,0),this.add(this.firstHero.predictedHP),this.add(this.firstHero.previousHP),this.secondHero.previousHP.destroy(),this.secondHero.predictedHP.destroy(),this.secondHero.previousHP=y({scene:this.scene,x:this.secondHero.previousHP.x,y:this.secondHero.previousHP.y,content:o.startHP,style:{fontSize:"36px"}}).setOrigin(1,0),this.secondHero.predictedHP=w({scene:this.scene,x:this.secondHero.predictedHP.x,y:this.secondHero.predictedHP.y,content:o.endHP,style:{fontSize:"36px"}}),this.add(this.secondHero.predictedHP),this.add(this.secondHero.previousHP)}runKOTween(e){this.koTween&&this.koTween.destroy(),this.koTween=this.scene.tweens.create({duration:500,loop:-1,targets:[e],yoyo:!0,alpha:.6})}updatePortraits({attacker:e,defender:t}){}updatePortrait(e,t,s,o){}}function b(e){return e[0].toUpperCase()+e.substring(1,e.length)}const P=C;var B=s(944),I=s.n(B);const T=new(I().Hero)({name:"Ryoma",weaponColor:"red",weaponType:"sword",stats:{hp:41,atk:34,spd:39,def:28,res:20},movementType:"flier"}),O=new(I().Hero)({name:"Lyn",stats:{hp:35,atk:33,spd:35,def:18,res:28},movementType:"cavalry"}),A=new(I().Hero)({name:"Ike",stats:{hp:41,atk:36,spd:30,def:35,res:21},movementType:"infantry"}),D=new(I().Hero)({name:"Corrin",stats:{hp:42,atk:35,spd:35,def:31,res:24},movementType:"infantry"}),R=new(I().Hero)({name:"Lucina",movementType:"infantry",stats:{hp:41,atk:34,spd:36,def:27,res:19}}),M=new(I().Hero)({name:"Robin",weaponColor:"colorless",weaponType:"dragonstone",stats:{hp:40,atk:32,spd:35,def:30,res:25},movementType:"flier"}),N=new(I().Hero)({name:"Ephraim",weaponColor:"green",weaponType:"axe",stats:{hp:46,atk:38,spd:27,def:37,res:26},movementType:"armored"}),j=new(I().Hero)({name:"Hector",weaponColor:"green",weaponType:"axe",stats:{hp:47,atk:40,spd:23,def:38,res:26},movementType:"armored"}),W=new(I().Weapon);W.setName("Mulagir").setMight(14).setType("bow").setColor("colorless").setEffectiveness("flier"),W.onEquip=e=>{e.raiseStat("spd",3)},W.onBeforeCombat=({enemy:e,wielder:t})=>{"tome"===e.getWeapon().type&&e.lowerCursor("mapBuff",1),"flier"===e.movementType&&t.raiseCursor("effectiveness",1)};const G=new(I().Weapon);G.setType("sword").setColor("red").setMight(19).setName("Ragnell"),G.onDefense=e=>{e.wielder.raiseCursor("counterattack",1)};const q=new(I().Weapon)({name:"Draconic Rage",might:16,range:1,type:"dragonstone",color:"blue"});q.onBeforeCombat=({wielder:e,enemy:t})=>{let s=0,o=0;for(let t of e.allies)e.getDistance(t)<=2&&s++;for(let s of t.allies)s.getDistance(e)<=2&&o++;s>o&&e.setBattleMods({atk:5,spd:5}),2===t.getWeapon().range&&e.raiseCursor("lowerOfDefAndRes",1)};const F=new(I().Weapon)({name:"Expiration",might:16,range:1,type:"dragonstone",color:"colorless"});F.onEquip=e=>{e.raiseCursor("counterattack",1)},F.onBeforeCombat=({wielder:e,enemy:t})=>{2===t.getWeapon().range&&e.raiseCursor("lowerOfDefAndRes",1)};const z=new(I().Weapon)({name:"Geirskögul",type:"lance",color:"blue",might:16,range:1});z.onBeforeAllyCombat=({ally:e,wielder:t})=>{e.getDistance(t)<=2&&["sword","lance","axe","bow","dagger","beast"].includes(e.getWeapon().type)&&e.setBattleMods({atk:3,spd:3})};const $=new(I().Weapon)({name:"Thunder Armads",type:"axe",color:"green",might:16,range:1});$.onEquip=e=>{e.raiseStat("def",3)},$.onBeforeCombat=({wielder:e,enemy:t})=>{let s=0,o=0;for(let t of e.allies)e.getDistance(t)<=2&&s++;for(let t of e.enemies)e.getDistance(t)<=2&&o++;s>o&&t.lowerCursor("followup",1)};const E=new(I().Weapon);E.setName("Garm").setType("axe").setColor("green").setMight(16).setRange(1),E.onEquip=e=>{e.raiseStat("atk",3)},E.onBeforeCombat=({wielder:e})=>{e.statuses.length&&e.raiseCursor("followup",1)};const V=new(I().Weapon)({range:1,might:16,type:"sword",color:"red",name:"Raijinto"});V.onDefense=({wielder:e})=>{e.raiseCursor("counterattack",1)};const L=new(I().PassiveSkill);L.setName("Distant Counter"),L.setSlot("A"),L.onDefense=({wielder:e})=>{e.raiseCursor("counterattack",1)};const _=new(I().PassiveSkill);_.setName("Vengeful Fighter 3"),_.setSlot("B"),_.onDefense=({wielder:e})=>{e.stats.hp/e.maxHP>=.5&&e.raiseCursor("followup",1)};const K=new(I().PassiveSkill);K.setName("Dragonskin"),K.setSlot("A"),K.onBeforeCombat=({enemy:e})=>{e.getWeapon().effectiveAgainst.includes("flier")&&e.lowerCursor("effectiveness",1)},K.onDefense=({wielder:e})=>{e.setBattleMods({def:4,res:4})};const U=(new(I().PassiveSkill)).setName("Sturdy Blow 2").setSlot("A");U.onInitiate=({wielder:e})=>{e.setBattleMods({atk:4,def:4})};const X=(new(I().PassiveSkill)).setName("Drive Spd 2").setSlot("C");X.onBeforeAllyCombat=({ally:e,wielder:t})=>{t.getDistance(e)<=2&&e.setBattleMods({spd:3})};const Y=new(I().PassiveSkill);Y.setName("Atk/Res Bond 3").setSlot("S"),Y.onBeforeCombat=({wielder:e})=>{for(let t of e.allies)if(1===e.getDistance(t))return void e.setBattleMods({atk:5,res:5})};const J=new(I().PassiveSkill);J.setName("Atk/Def Bond 3").setSlot("A"),J.onBeforeCombat=({wielder:e})=>{for(let t of e.allies)if(1===e.getDistance(t))return void e.setBattleMods({atk:5,def:5})};const Q=(new(I().PassiveSkill)).setName("Atk/Res Form 3").setSlot("S"),Z=(new(I().PassiveSkill)).setName("Sacae's Blessing").setSlot("B");Z.onInitiate=({enemy:e})=>{["sword","axe","lance"].includes(e.getWeapon().type)&&e.lowerCursor("counterattack",1)},Q.onBeforeCombat=({wielder:e})=>{let t=0;for(let s of e.allies)e.getDistance(s)<=2&&t++;const s=Math.min(2*t+1,7);e.setBattleMods({atk:s,res:s})},Y.slot="A";const ee=(new(I().PassiveSkill)).setName("Spd/Res Rein 3").setSlot("C");ee.onBeforeAllyCombat=({wielder:e,enemy:t})=>{e.getDistance(t)<=2&&t.setBattleMods({spd:-4,res:-4})},ee.onBeforeCombat=({enemy:e})=>{e.setBattleMods({spd:-4,res:-4})};const te=(new(I().PassiveSkill)).setName("Kestrel Stance 2").setSlot("A");te.onDefense=({wielder:e})=>{e.setBattleMods({atk:4,spd:4})};const se=(new(I().PassiveSkill)).setName("Atk/Spd Rein 3").setSlot("C");se.onBeforeAllyCombat=({wielder:e,enemy:t})=>{e.getDistance(t)<=2&&t.setBattleMods({atk:-4,spd:-4})},se.onBeforeCombat=({enemy:e})=>{e.setBattleMods({atk:-4,spd:-4})};const oe=(new(I().PassiveSkill)).setName("Warding Breath").setSlot("A");oe.onDefense=({wielder:e})=>{e.setBattleMods({res:4})};const ae=(new(I().PassiveSkill)).setName("Joint Drive Res").setSlot("C");ae.onBeforeAllyCombat=({ally:e,wielder:t})=>{t.getDistance(e)<=2&&e.setBattleMods({res:4})},ae.onBeforeCombat=({wielder:e})=>{for(let t of e.allies)if(e.getDistance(t)<=2)return void e.setBattleMods({res:4})};const ie=(new(I().PassiveSkill)).setName("Seal Atk/Def 2").setSlot("B");ie.onAfterCombat=({enemy:e,wielder:t})=>(e.allies.filter((t=>t.getDistance(e)<=2)),[]);const ne=(new(I().PassiveSkill)).setName("Bushido II").setSlot("B");ne.onBeforeCombat=({wielder:e,enemy:t,damage:s})=>{if(e.raiseCursor("damageIncrease",7),t.getWeapon().effectiveAgainst.includes("flier")&&t.lowerCursor("effectiveness",1),e.getBattleStats().spd>t.getBattleStats().spd){const o=Math.min(40,4*(e.getBattleStats().spd-t.getBattleStats().spd));console.log({reductionPercentage:o,damage:s}),e.raiseCursor("damageReduction",s-Math.floor(s*o))}};const re=(new(I().PassiveSkill)).setSlot("A").setName("Close Def 3");re.onDefense=({wielder:e,enemy:t})=>{1===t.getWeapon().range&&e.setBattleMods({def:6,res:6})};const le=(new(I().PassiveSkill)).setName("Swift Sparrow 3").setSlot("A");le.onInitiate=({wielder:e})=>{e.setBattleMods({atk:6,spd:6})};const he=(new(I().PassiveSkill)).setName("Ostia's Pulse II").setSlot("C");he.onTurnStart=({wielder:e})=>{const t=[];let s={armored:1,infantry:0,flier:0,cavalry:0};const o=[e];for(let t of e.allies)1===e.getDistance(t)&&o.push(t),s[t.movementType]++;for(let e of o)s[e.movementType]<=2&&t.push({targetHeroId:e.id,appliedEffect:{stats:{def:6,res:6}}});return t};const de=(new(I().PassiveSkill)).setName("Windsweep 3").setSlot("B");de.onInitiate=({wielder:e,enemy:t})=>{e.lowerCursor("followup",1),["sword","lance","axe","dagger","bow","beast"].includes(t.getWeapon().type)&&t.lowerCursor("counterattack",1)};const ce=(new(I().PassiveSkill)).setName("Atk/Spd Bond 4").setSlot("S");ce.onBeforeCombat=({wielder:e})=>{for(let t of e.allies)if(1===e.getDistance(t)){const t={atk:7,spd:7};for(let s in e.mapMods)e.mapMods[s]<0&&(t[s]+=-e.mapMods[s],e.mapMods[s]=0);return void e.setBattleMods(t)}};const pe=(new(I().PassiveSkill)).setName("Null Follow-Up 3").setSlot("B");pe.onBeforeCombat=({wielder:e})=>{e.raiseCursor("followup",1)};const me=(new(I().PassiveSkill)).setName("Swordbreaker 3").setSlot("B");me.onBeforeCombat=({wielder:e,enemy:t})=>{"sword"===t.getWeapon().type&&(e.raiseCursor("followup",1),t.lowerCursor("followup",1))};const ge=(new(I().PassiveSkill)).setName("Atk/Def Solo 4").setSlot("S");ge.onBeforeCombat=({wielder:e})=>{for(let t of e.allies)if(1===e.getDistance(t))return;e.setBattleMods({atk:7,def:7})};const fe=(new(I().PassiveSkill)).setName("Spd Smoke 3").setSlot("S"),ue=(new(I().PassiveSkill)).setName("Atk Smoke 3").setSlot("C"),ye=(new(I().PassiveSkill)).setName("Res Smoke 3").setSlot("S"),we=(new(I().PassiveSkill)).setName("Hone Spd 2").setSlot("C"),Se=(new(I().PassiveSkill)).setName("Armor March 3").setSlot("S"),xe=(new(I().PassiveSkill)).setName("Special Fighter 3").setSlot("B");j.equipSkill(L),j.equipSkill(_),j.setWeapon($),j.equipSkill(he),j.equipSkill(Se),Se.slot="C",D.setWeapon(q),D.equipSkill(J),D.equipSkill(Q),D.equipSkill(pe),D.equipSkill(we),R.setWeapon(z),R.equipSkill(U),R.equipSkill(ce),R.equipSkill(X),R.equipSkill(de),N.equipSkill(re),N.setWeapon(E),N.equipSkill(ge),N.equipSkill(Se),N.equipSkill(xe),M.equipSkill(ee),M.setWeapon(F),M.equipSkill(K),M.equipSkill(ye),M.equipSkill(me),O.setWeapon(W),O.equipSkill(le),O.equipSkill(Z),O.equipSkill(ue),O.equipSkill(fe),T.setWeapon(V),T.equipSkill(te),T.equipSkill(se),T.equipSkill(ne),T.equipSkill(fe),A.setWeapon(G),A.equipSkill(ae),A.equipSkill(oe),A.equipSkill(ie),A.equipSkill(Q);const ke=new class{constructor(){this.team1=[],this.team2=[],this.map={};for(let e=1;e<9;e++)this.map[e]=Array.from({length:6}).fill(null)}getDistance(e,t){return Math.abs(e.x-t.x)+Math.abs(e.y-t.y)}moveHero(e,t){const s=e.coordinates;this.map[s.y][s.x]=null,e.coordinates=t,this.map[t.y][t.x]=e}addHero(e,t,s){e.coordinates=s,this[t].push(Object.assign({hero:e},s))}startCombat(e,t){return new(I().Combat)({attacker:e,defender:t}).createCombat()}setAlliesAndEnemies(){for(let e=0;e<this.team1.length;e++){for(let t=e+1;t<this.team1.length;t++)this.team1[e].hero.setAlly(this.team1[t].hero),this.team1[t].hero.setAlly(this.team1[e].hero);for(let t=0;t<this.team2.length;t++)this.team1[e].hero.setEnemy(this.team2[t].hero)}for(let e=0;e<this.team2.length;e++){for(let t=e+1;t<this.team2.length;t++)this.team2[e].hero.setAlly(this.team2[t].hero),this.team2[t].hero.setAlly(this.team2[e].hero);for(let t=0;t<this.team2.length;t++)this.team2[e].hero.setEnemy(this.team1[t].hero)}this.effectRunner=new(I().MapEffectRunner)(this.team1.map((({hero:e})=>e)),this.team2.map((({hero:e})=>e)))}getMapEffects(e,t){return this.effectRunner.runEffects(t,e)}};ke.addHero(j,"team1",{x:4,y:1}),ke.addHero(R,"team1",{y:1,x:2}),ke.addHero(T,"team1",{x:3,y:1}),ke.addHero(M,"team1",{x:5,y:1}),ke.addHero(A,"team2",{y:7,x:6}),ke.addHero(D,"team2",{y:7,x:4}),ke.addHero(N,"team2",{x:3,y:7}),ke.addHero(O,"team2",{y:7,x:5}),ke.setAlliesAndEnemies();const ve=ke,He=125;function Ce(e,t){return{x:e*He-63,y:t*He+90}}function be(e,t){return{x:Math.round((63+e)/He),y:Math.round((t-90)/He)}}class Pe extends Phaser.Scene{constructor(){super({key:"MainScene"}),this.map=[],this.walkCoords=[],this.attackCoords=[],this.displayRange=!1,this.heroes=[],this.team1=[],this.team2=[],this.heroesWhoMoved=[],this.turn="team1",this.rng=new Phaser.Math.RandomDataGenerator,this.terrain=[["wall","floor","floor","floor","floor","floor"],["wall","floor","floor","floor","void","floor"],["floor","floor","floor","floor","floor","floor"],["floor","floor","floor","floor","floor","floor"],["floor","wall","floor","tree","floor","tree"],["floor","tree","floor","floor","floor","wall"],["floor","floor","floor","floor","floor","floor"],["tree","void","void","void","void","tree"]];for(let e=0;e<9;e++){const e=Array.from({length:6}).fill(null);this.map.push(e)}}fillTiles(e,t,s=1){for(let o of e)this.getTile(o).setFillStyle(t,s)}clearTiles(e){for(let t of e)this.getTile(t).setFillStyle(0)}endAction(e){e.image.setTint(7829367),e.disableInteractive(),this.heroesWhoMoved.push(e),this.displayRange=!1,this.children.remove(this.children.getByName("movement-"+e.getInternalHero().name)),this.highlightedHero=null}buildArrowPath(e,t,s){let o=e,a=new Map,i=this.getDistance(e,t);for(a.set(`${e.x}-${e.y}`,e),a.set(`${t.x}-${t.y}`,t);i;){const e=Ie(o).filter((e=>this.heroCanReachTile(s,e)&&this.getDistance(e,t)<i));o=e[0],i=this.getDistance(t,e[0]);const{x:n,y:r}=o;a.set(`${n}-${r}`,o)}return Array.from(a.values()).sort(((t,s)=>this.getDistance(t,e)-this.getDistance(s,e)))}setTurn(e){this.movementAllowedImages.clear();const t="team1"===e?"team2":"team1";this.turn=e,this.heroesWhoMoved=[];for(let t of this[e]){const{x:e,y:s}=be(t.x,t.y);let a={x:e,y:s};t.setInteractive(new o.Geom.Rectangle(0,0,50,50)).setDepth(1),this.input.setDraggable(t,!0);const i=new Phaser.GameObjects.Image(this,t.x,t.y,"movement-allowed").setName(`movement-${t.getInternalHero().name}`).setDepth(0);this.add.existing(i);const n=this.getTile(a.x+"-"+a.y);let r;i.setDisplaySize(n.width,n.height),this.movementAllowedImages.add(i);let l="";t.off("pointerdown"),t.on("pointerdown",(()=>{const e=be(t.x,t.y);this.movementAllowedImages.setVisible(!1);const s=this.children.getByName(`movement-${t.getInternalHero().name}`);s.setVisible(!0),r=this.add.image(s.x,s.y,"rosary").setDisplaySize(s.width,s.height).setScale(1.35).setName("arrow"),this.movementAllowedTween.pause(),this.sound.play("enabled-unit");const o=this.rng.integerInRange(1,3);l&&this.sound.stopByKey(l),this.sound.playAudioSprite(t.getInternalHero().name+" quotes",o.toString(),{volume:.2}),this.unitInfosBanner.setVisible(!0).setHero(t),this.displayRanges(e,t.getMovementRange(),t.getWeaponRange())}));let h="";const c=new o.GameObjects.Image(this,0,0,"end-arrow").setName("end-arrow");this.movementArrows.add(c);let p="";t.on("dragover",((e,s)=>{var o,i;if(s.name!==p)if(p=s.name,this.walkCoords.includes(s.name)&&s.name!==h){this.combatForecast.setVisible(!1),this.unitInfosBanner.setVisible(!0),this.sound.play("hover");const e=s.name.split("-").map(Number),o=this.buildArrowPath(Object.assign({},a),{x:e[0],y:e[1]},t);r.setTexture("rosary"),t.getInternalHero().coordinates=o[o.length-1],this.movementArrows.clear(!0);for(let e=0;e<o.length;e++){const t=o[e-1],s=o[e];if(e&&this.add.existing(c),t&&o[e-2]){const a=Te(o[e-2],s),i=this.getTile(t.x+"-"+t.y);var n=a.x?a.y?`path-${a.y}-${a.x}`:"horizontal":"vertical";const r=new Phaser.GameObjects.Image(this,i.x,i.y,n);this.add.existing(r),this.movementArrows.add(r)}if(1===e){const e=Te(t,s),o="up"===e.y?180:"down"===e.y?0:null,a="left"===e.x?90:"right"===e.x?-90:null,i=null!=o?o:a;r.setTexture("rosary-arrow"),r.setRotation(i*Math.PI/180)}if(1===o.length)this.children.remove(this.children.getByName("end-arrow"));else if(e===o.length-1&&e){const e=o[o.length-1],s=this.getTile(e.x+"-"+e.y);c.x=s.x,c.y=s.y;const a=Te(t,e),i="left"===a.x?180:"right"===a.x?0:null,n="up"===a.y?-90:"down"===a.y?90:null,r=null!=i?i:n;c.setRotation(r*Math.PI/180)}}h=s.name}else if(this.attackCoords.includes(s.name)){const[e,a]=s.name.split("-");if((null!==(i=null===(o=this.map[+a][+e])||void 0===o?void 0:o.team)&&void 0!==i?i:t.team)!==t.team){const s=this.map[+a][+e];this.unitInfosBanner.setVisible(!1);const o=ve.startCombat(t.getInternalHero(),s.getInternalHero());this.combatForecast.setForecastData({attacker:{hero:t,startHP:t.getInternalHero().stats.hp,endHP:o.atkRemainingHP,statChanges:o.atkChanges,turns:1,damage:o.atkDamage},defender:{hero:s,startHP:s.getInternalHero().stats.hp,endHP:o.defRemainingHP,statChanges:o.defChanges,turns:1,damage:o.defDamage}}),this.combatForecast.setVisible(!0)}}})),t.off("dragend"),t.on("dragend",(({upX:e,upY:s})=>{const{x:o,y:i}=be(e,s);if(this.movementArrows.setVisible(!1),this.children.remove(this.children.getByName("arrow")),this.children.remove(this.children.getByName("end-arrow")),!this.walkCoords.includes(o+"-"+i)||this.map[i][o]||a.x===o&&a.y===i)if(this.attackCoords.includes(o+"-"+i)&&this.map[i][o]&&this.map[i][o].team!==t.team){const e=this.getTilesInShallowRange({x:o,y:i},t.getWeaponRange()),[s]=Oe(Array.from(e.keys()),this.walkCoords),[n,r]=s.split("-");this.moveHero(t,a,{x:+n,y:+r}),a.x=+n,a.y=+r;const l=this.map[i][o],h=ve.startCombat(t.getInternalHero(),l.getInternalHero()),c=this.tweens.timeline();c.on("complete",(()=>{this.clearTiles([...this.walkCoords,...this.attackCoords]);const e=[t,l].find((e=>0===e.getInternalHero().stats.hp));e&&this.tweens.add({targets:e,alpha:0,delay:700,onStart:()=>{this.sound.play("ko",{volume:.4})},onComplete:()=>{this.game.input.enabled=!0}})}));for(let e=0;e<h.outcome.length;e++){const t=h.outcome[e],s=this.children.getByName(t.defender.id),o=this.children.getByName(t.attacker.id),a=s.image.getCenter(),i=d(this,s.x+a.x,s.y+a.y,t.damage.toString(),{stroke:"#FFFFFF",strokeThickness:5,color:"red",fontSize:"advantage"===t.advantage||t.effective?"32px":"disadvantage"===t.advantage?"25px":"30px"}).setOrigin(.4).setDepth(3);c.add({targets:o,x:"-="+(o.x-s.x)/2,y:"-="+(o.y-s.y)/2,yoyo:!0,duration:100,onStart:()=>{this.sound.play("hit"),this.add.existing(i),this.combatForecast,this.tweens.add({targets:[i],y:s.image.getTopCenter().y+s.y,yoyo:!0,duration:100,onComplete:()=>{setTimeout((()=>{i.destroy()}),500)},onStart:()=>{s.getInternalHero().stats.hp=t.remainingHP}})},delay:500})}this.game.input.enabled=!1,c.play()}else{const e=Ce(a.x,a.y);this.tweens.add({targets:t,x:e.x,y:e.y,duration:100}),t.getInternalHero().coordinates=Object.assign({},a)}else{this.combatForecast.setVisible(!1),this.unitInfosBanner.setVisible(!0),this.clearTiles([...this.walkCoords,...this.attackCoords]),this.map[a.y][a.x]=null,a.x=o,a.y=i,this.map[a.y][a.x]=t;const e=Ce(o,i);t.x=e.x,t.y=e.y,ve.moveHero(t.getInternalHero(),{x:o,y:i}),this.movementArrows.setVisible(!1),this.movementArrows.clear(!0),this.movementAllowedImages.setVisible(!0),this.movementAllowedTween.resume(),this.children.getByName(`movement-${t.getInternalHero().name}`).setVisible(!1),this.sound.play("confirm",{volume:.4}),this.endAction(t),this.children.remove(c)}}))}this.movementAllowedTween=this.tweens.add({targets:this.movementAllowedImages.getChildren(),loop:-1,yoyo:!0,duration:900,alpha:0});for(let e of this[t])e.off("dragover"),e.off("dragend"),e.setInteractive(),this.children.remove(this.children.getByName("movement-"+e.getInternalHero().name)),e.image.clearTint(),this.input.setDraggable(e,!1),e.off("dragstart"),e.off("pointerdown"),e.on("pointerdown",(()=>{this.displayRanges(be(e.x,e.y),e.getMovementRange(),e.getWeaponRange()),this.sound.play("enabled-unit"),this.highlightedHero=e,this.unitInfosBanner.setVisible(!0).setHero(e)}))}preload(){this.load.image("map","assets/map.webp"),this.load.image("movement-allowed","assets/movement-allowed.png"),this.load.atlas("weapons","assets/sheets/weapons.webp","assets/sheets/weapons.json"),this.load.atlas("skills","assets/sheets/skills.webp","assets/sheets/skills.json"),this.load.audio("enabled-unit","assets/audio/pointer-tap.mp3"),this.load.audio("disabled-unit","assets/audio/feh disabled unit.mp3"),this.load.audio("hit","assets/audio/hit.mp3"),this.load.audio("ko","assets/audio/ko.mp3"),this.load.image("test","assets/unit-bg-test.png"),this.load.audio("hover","assets/audio/hover on tile.mp3"),this.load.audio("confirm","assets/audio/confirm.mp3"),this.load.image("nameplate","assets/nameplate.png"),this.load.image("end-arrow","assets/end-arrow-fixed.png"),this.load.image("path-down-right","assets/path-down-left.png"),this.load.image("path-down-left","assets/path-down-right.png"),this.load.image("path-up-right","assets/path-up-right.png"),this.load.image("path-up-left","assets/path-up-left.png"),this.load.image("horizontal","assets/horizontal.png"),this.load.image("vertical","assets/vertical-fixed.png"),this.load.image("unit-bg","assets/unitbg.png"),this.load.image("rosary","assets/rosary-current.png"),this.load.image("rosary-arrow","assets/rosary-arrow.png"),this.load.image("weapon-icon","assets/weapon_icon.png"),this.load.image("weapon-bg","assets/weapon.png"),this.load.image("assist-icon","assets/assist-icon.png"),this.load.image("special-icon","assets/special-icon.png"),this.load.audio("bgm","assets/audio/leif's army in search of victory.ogg");for(let e of["Corrin","Hector","Ike","Lucina","Lyn","Robin","Ryoma","Ephraim"])this.load.atlas(e,`assets/battle/${e}.webp`,`assets/battle/${e}.json`),this.load.audioSprite(`${e} quotes`,`assets/audio/quotes/${e}.json`,`assets/audio/quotes/${e}.m4a`);this.load.image("hp plate","assets/hp plate.png"),this.load.image("stat-line","assets/stat-glowing-line.png");for(let e of["A","B","C","S"])this.load.image(e,`assets/${e}.png`)}addHero(e,t){const{x:s,y:o}=Ce(e.x,e.y),a=new f(this,s,o,e.hero,t).setInteractive();return this.add.existing(a),this.heroes.push(a),this.map[e.y][e.x]=a,this[t].push(a),a}moveHero(e,t,s){this.map[t.y][t.x]=null,this.map[s.y][s.x]=e;const{x:o,y:a}=Ce(s.x,s.y);e.x=o,e.y=a}getNearestToAttackTile(e,t){const s=this.getTilesInShallowRange(t,e.getWeaponRange());return s.size?s:null}create(){this.movementAllowedImages=this.add.group(),this.movementArrows=this.add.group(),this.add.image(0,0,"test").setOrigin(0).setTint(4338770),this.sound.play("bgm",{volume:.1,loop:!0}),this.unitInfosBanner=this.add.existing(new k(this).setVisible(!1)),this.combatForecast=this.add.existing(new P(this).setVisible(!1)),console.log(ve.getMapEffects("team1","turnStart")),this.add.image(0,150,"map").setDisplaySize(750,1e3).setOrigin(0,0);for(let e=1;e<9;e++)for(let t=1;t<7;t++){const{x:s,y:o}=Ce(t,e),a=t+"-"+e,i=this.add.rectangle(s,o,He,He,0).setAlpha(.2).setName(a).setInteractive(void 0,void 0,!0);i.on("pointerdown",(()=>{const[e,t]=a.split("-");this.map[+t][+e]||(this.clearTiles([...this.walkCoords,...this.attackCoords]),this.displayRange&&this.sound.play("disabled-unit"),this.displayRange=!1,this.movementAllowedImages.setVisible(!0),this.movementAllowedTween.resume(),this.movementArrows.clear(!0))})),this.add.text(i.getCenter().x,i.getCenter().y,a,{fontSize:"18px"})}for(let{hero:e,x:t,y:s}of ve.team1)this.addHero({x:t,y:s,hero:e},"team1");for(let{hero:e,x:t,y:s}of ve.team2)this.addHero({hero:e,x:t,y:s},"team2");this.input.on("drag",((e,t,s,o)=>{t instanceof f&&t.team===this.turn&&(t.x=s,t.y=o)})),this.setTurn("team2")}displayRanges(e,t,s){this.displayRange=!0;const o=this.getTilesInRange(e,t);for(let[t,s]of o.entries())this.heroCanReachTile(this.map[e.y][e.x],s)||o.delete(t);const a=function(e,t){const s=new Map;for(let[o,a]of e.entries())t.has(o)||s.set(o,a);for(let[o,a]of t.entries())e.has(o)||s.set(o,a);return s}(o,this.getTilesInRange(e,s,o,!0)),i=Array.from(o.keys()),n=Array.from(a.keys());for(let e of this.walkCoords)i.includes(e)||this.getTile(e).setFillStyle(0);for(let e of this.attackCoords)n.includes(e)||this.getTile(e).setFillStyle(0);this.walkCoords=i,this.attackCoords=n,this.fillTiles(this.walkCoords,255),this.fillTiles(this.attackCoords,16711680)}getTile(e){return this.children.getByName(e)}getTilesInRange(e,t,s,o){let a=s?Array.from(s.values()):[e];const i=s?new Map(s||void 0):new Map,n=this.map[e.y][e.x];for(let e=0;e<t;e++)a=a.map(Ie).flat(),o||(a=a.filter((e=>this.heroCanReachTile(n,e))));for(let e of a)i.has(`${e.x}-${e.y}`)||i.set(`${e.x}-${e.y}`,e);return i}getTilesInShallowRange(e,t){const s=this.getTilesInRange(e,t);return s.forEach(((o,a)=>{this.getDistance(o,e)!==t&&s.delete(a)})),s}getDistance(e,t){return Math.abs(e.x-t.x)+Math.abs(e.y-t.y)}heroCanReachTile(e,t){const s=this.map[t.y][t.x];if(Boolean(s)&&s.team!==e.team)return!1;const o=this.terrain[t.y-1][t.x-1];if("wall"===o)return!1;if("void"===o)return"flier"===e.getInternalHero().movementType;if("flier"===e.getInternalHero().movementType)return!0;const{x:a,y:i}=be(e.x,e.y);if("cavalry"===e.getInternalHero().movementType&&"trench"===o)return this.getDistance({x:a,y:i},t)<=1;if("tree"===o)switch(e.getInternalHero().movementType){case"cavalry":return!1;case"infantry":return this.getDistance({x:a,y:i},t)<=1;default:return!0}return!0}update(){for(let e of this.heroes)e.update();if(this.heroesWhoMoved.length===this[this.turn].length){const e="team1"===this.turn?"team2":"team1";this.setTurn(e)}}}function Be(e){return e.x>=1&&e.x<=6&&e.y>=1&&e.y<=8}function Ie(e){const{x:t,y:s}=e,o=[e];return o.push({x:t+1,y:s}),o.push({x:t-1,y:s}),o.push({x:t,y:s+1}),o.push({x:t,y:s-1}),o.filter(Be)}function Te(e,t){const s={y:"",x:""};return e.y!==t.y&&(s.y=e.y<t.y?"down":"up"),e.x!==t.x&&(s.x=e.x<t.x?"right":"left"),s}function Oe(e,t){const s=[];for(let o of e)t.includes(o)&&s.push(o);for(let o of t)e.includes(o)&&s.push(o);return Array.from(new Set(s))}class Ae extends Phaser.Scene{constructor(){super({key:"PreloadScene"})}create(){this.scene.start("MainScene")}}const De={type:Phaser.CANVAS,backgroundColor:"#000",scale:{parent:"phaser-game",mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH,width:750,height:1200},scene:[Ae,Pe]};window.addEventListener("load",(()=>{new Phaser.Game(De)}))},204:()=>{console.log("%c %c %c %c %c Built using phaser-project-template %c https://github.com/yandeu/phaser-project-template","background: #ff0000","background: #ffff00","background: #00ff00","background: #00ffff","color: #fff; background: #000000;","background: none")}},s={};function o(e){var a=s[e];if(void 0!==a)return a.exports;var i=s[e]={id:e,loaded:!1,exports:{}};return t[e].call(i.exports,i,i.exports,o),i.loaded=!0,i.exports}o.m=t,e=[],o.O=(t,s,a,i)=>{if(!s){var n=1/0;for(d=0;d<e.length;d++){for(var[s,a,i]=e[d],r=!0,l=0;l<s.length;l++)(!1&i||n>=i)&&Object.keys(o.O).every((e=>o.O[e](s[l])))?s.splice(l--,1):(r=!1,i<n&&(n=i));if(r){e.splice(d--,1);var h=a();void 0!==h&&(t=h)}}return t}i=i||0;for(var d=e.length;d>0&&e[d-1][2]>i;d--)e[d]=e[d-1];e[d]=[s,a,i]},o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var s in t)o.o(t,s)&&!o.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),(()=>{var e={179:0};o.O.j=t=>0===e[t];var t=(t,s)=>{var a,i,[n,r,l]=s,h=0;if(n.some((t=>0!==e[t]))){for(a in r)o.o(r,a)&&(o.m[a]=r[a]);if(l)var d=l(o)}for(t&&t(s);h<n.length;h++)i=n[h],o.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return o.O(d)},s=self.webpackChunkphaser_project_template=self.webpackChunkphaser_project_template||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))})(),o.O(void 0,[216],(()=>o(541)));var a=o.O(void 0,[216],(()=>o(204)));a=o.O(a)})();