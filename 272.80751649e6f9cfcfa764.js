"use strict";(self.webpackChunkrx_puzzle=self.webpackChunkrx_puzzle||[]).push([[272],{9272:(S,g,r)=>{r.r(g),r.d(g,{GuideModule:()=>N});var p=r(8583),h=r(4935),m=r(1933),_=r(2796),e=r(7716),b=r(2522),v=r(9957),A=r(9464),q=r(1095),U=r(7091),C=r(2458);function M(o,s){if(1&o){const t=e.EpF();e.TgZ(0,"button",16),e.NdJ("click",function(){return e.CHM(t),e.oxw(),e.MAs(6).toggle()}),e.TgZ(1,"mat-icon"),e._uU(2,"menu"),e.qZA(),e.qZA()}2&o&&e.Udp("margin-left","-12px")}function O(o,s){if(1&o){const t=e.EpF();e.TgZ(0,"mat-tree-node",17),e.NdJ("click",function(i){return e.CHM(t),e.oxw().onTocNodeClick(i)}),e._UZ(1,"span"),e.TgZ(2,"a",18),e.NdJ("click",function(i){return i.stopPropagation()}),e._uU(3),e.qZA(),e.qZA()}if(2&o){const t=s.$implicit;e.xp6(1),e.Udp("width",8*t.depth,"px"),e.xp6(1),e.uIk("href",t.href,e.LSH),e.xp6(1),e.hij(" ",t.name," ")}}function y(o,s){if(1&o&&(e.TgZ(0,"mat-nested-tree-node"),e.TgZ(1,"div",19),e._UZ(2,"span"),e._uU(3),e.TgZ(4,"mat-icon"),e._uU(5,"chevron_right"),e.qZA(),e.qZA(),e.TgZ(6,"div"),e.GkF(7,20),e.qZA(),e.qZA()),2&o){const t=s.$implicit,n=e.oxw();e.xp6(1),e.ekj("is-expanded",n.tocTreeControl.isExpanded(t)),e.xp6(1),e.Udp("width",8*t.depth,"px"),e.xp6(1),e.hij(" ",t.name," "),e.xp6(3),e.ekj("is-hidden",!n.tocTreeControl.isExpanded(t))}}const Z=function(){return{shape:"circle",color:""}};let w=(()=>{class o{constructor(t,n){this.renderer=t,this.elementRef=n,this.sidenavAnimationDisabled=!1,this.tocDataSource=new m.WX,this.tocTreeControl=new _.VY(i=>i.children)}ngOnInit(){this.initToc(),requestAnimationFrame(()=>{this.tocTreeControl.expandAll()})}ngDoCheck(){this.updateSidenavMode()}isInternalNode(t,n){return n.children.length>0}onTocNodeClick(t){var n;if("side"!==this.sidenav.mode&&this.sidenav.close(),!t)return;const i=t.target;null===(n=i.querySelector("a"))||void 0===n||n.click();const c=[i];let l=i.parentElement;for(;l&&!l.classList.contains("mat-tree");){if(l.classList.contains("mat-nested-tree-node")){const a=l.querySelector(".mat-tree-node");a&&c.push(a)}l=l.parentElement}const u="is-selected";this.elementRef.nativeElement.querySelectorAll("mat-sidenav ."+u).forEach(a=>this.renderer.removeClass(a,u)),c.forEach(a=>this.renderer.addClass(a,u))}initToc(){const t=[];this.elementRef.nativeElement.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(i=>{const c=i;if(!c.innerText.trim().startsWith("#"))return;const l=c.innerText.split(/[#>]/).map(d=>d.trim()).filter(d=>d);if(0===l.length)return;let a,u=t;l.forEach((d,J)=>{a=u.find(R=>R.name===d),a||(a={name:d,children:[],depth:J,href:""},u.push(a)),u=a.children});const x=l.map(d=>d.replace(/\s/g,"-")).join(">");if(!a)return;const z=a.name;a.href="/guide#"+x,this.renderer.setProperty(c,"id",x),this.renderer.setProperty(c,"innerText",z)}),this.tocDataSource.data=t,this.tocTreeControl.dataNodes=t}updateSidenavMode(){const n=this.elementRef.nativeElement.clientWidth<=959?"over":"side";this.sidenav.mode!==n&&requestAnimationFrame(()=>{this.sidenav.mode=n,this.sidenav.opened="side"===n,this.sidenavAnimationDisabled=!0,requestAnimationFrame(()=>this.sidenavAnimationDisabled=!1)})}}return o.\u0275fac=function(t){return new(t||o)(e.Y36(e.Qsj),e.Y36(e.SBq))},o.\u0275cmp=e.Xpm({type:o,selectors:[["rxp-guide"]],viewQuery:function(t,n){if(1&t&&e.Gf(h.JX,7),2&t){let i;e.iGM(i=e.CRH())&&(n.sidenav=i.first)}},decls:137,vars:15,consts:[["color","primary",1,"mat-elevation-z4"],["mat-icon-button","","onclick","this.blur()",3,"margin-left","click",4,"ngIf"],["position","start"],["sidenav",""],[3,"dataSource","treeControl"],["matTreeNodeToggle","","matRipple","",3,"click",4,"matTreeNodeDef"],[4,"matTreeNodeDef","matTreeNodeDefWhen"],[1,"example-picture"],[1,"scaled"],["src","eNrtVNFOgzAU_RXT7EETTBhbgPG2MXQbGdncMhOMDwWvQAItlmI2yf59xblExcyq8Unf2nNO7j2956YVojlPKCmQVaEMsyCFYgZsAQ8lkBCQ1e4qL7iTJZwnJBoTDuwRp8jSVLUm12MOmU1LwoVcIBHF6XRfClk3FSpinItKCCkopCll9XGr_OPfwm-3CkrEvPej5ZtnRXGIS3B34q62L4yhO9Imdn_lmh3N13y9t9QvPQcd0pSLJkxYmMIrtm54Hkho8JfrSHt4w7KYZkFZHG-fA-E4ouS4gRjWH4lCKZdNH79l8_06fLYFg5Htz83-ZDXRNW3gTD2789MtkMg2_GP5y7xQqkFTJJc-Z5gU95RlwJrfwHJkqkZ3MexdXxlzb2YKBc2BYU6ZCxshfUryU9xSToLWWV12B0Rc6Fk","mode","picture"],["src","eNrtk11LwzAYhf-KvOxCoUJazT56Zz-mm2yMFTqdeJHW163QJjVJxVH235c6B4Jsol66u-Scwwmch9QgSp0JrsCtoWAyyVFNUEb4UiFPEVz70vrQwyLTOuOLAdcoX1kOrkNIY74NNBa-qLg2caMsBMtH2ypwH2pQS1aaJgALUpEL2RzX1lH_lf64tiAze2-n1av3hNrhMt6TuRO7T_3ZfNoOSExD2h1P_M7VcBx3AtjR_B9o5FIUSaU-2c1i5-znob9CO8zqjvSve4HT9mjU9To96kX2vbeHVZrJNMd97x52j_o3dLRkXD0LWaD8-plu7NCJnWh6MZtTMhraJiFKlEwLeYurZnzBU6ZPWcs6SVpnTfMGUgKeVQ","mode","picture"],["src","eNrtk11LwzAYhf-KvOxCoUJazT56Zz-mm2yMFTqdeJHW163QJjVJxVH235c6B4Jsfty6u-Scwwmch9QgSp0JrsCtoWAyyVFNUEb4UiFPEVz70vrQwyLTOuOLAdcoX1kOrkNIY74NNBa-qLg2caMsBMtH2ypwH2pQS1aaJgALUpEL2RzX1lH_k_64tiAze2-n1av3hNrhMt6TuRO7T_3ZfNoOSExD2h1P_M7VcBx3AtjR_N9o5FIUSaU-2c2S5-z3oZ9CO8zqjvSve4HT9mjU9To96kX2vbeHVZrJNMd97x52j_o3dLRkXD0LWaD8-plu7NCJnWh6MZtTMhraJiFKlEwLeYurZnzBU6ZPWcs6SVpnTfMGCWqeVQ","mode","picture"],[1,"clipped-by-concat",3,"marble"],["src","eNrtk19LwzAUxb-KXPagUKEp67R9G2W163BYKq1_8CGt167QJjVJxVH23Zc6Bw4Vda_uLTn35NzL_ZEOeKNKziS4HdRUZBXKKxQxPrfIcgSXDI13fVKXSpWsmDKF4oVW4Fqm2Rdfpwprj7dMabtWCk6ry00UuPcdyAVtdBKAATmvuOiPK-Og76U_rAwo9b43q1XLN4fc4tK1R303iW97iT2_Hoe246S3YRxZWhp5BLY0d9GIBa-zVn7o1Cef5jtz_Mp0gPY1tB9YjUjiR4GXjpObdOb7QTKfRN-w-uskeSnyCver_js6SlAmn7ioUXz-TMFZQqy7aOhE52FKLmLt4A0KqriY4VJb9asCj-nAOMoGJ33wGiPanrk","mode","picture"],["src","eNrtk19rgzAUxb_KuPRhAwdGajd9K1JnLSsTh-4Pe4juzgqauCSOFel3b1xbWNnKRp_7lpx7cu7l_kgHvFElZxLcDmoqsgrlHYoY31tkOYJLhsZWn9SlUiUrpkyh-KAVuJZp9sXPqcLa4y1T2q6VgtPqdhMF7nMHckEbnQRgQM4rLvrjyjjpR-kvKwNKve_NatXyyyF3uHTtVd9N4tteYs_vx6HtOOljGEeWlkYegR3NfTRiweusld869cmX-d4c_zKdoP0O7Q9WI5L4UeCl4-Qhnfl-kMwn0QFWhzrmpcgrPK56orOlowRl8o2LGsXPzxRcJcR6ioZOdB2m5CbWDt6goIqLGS61Vb8q8JwOjLNscNEHrwFFCp65","mode","picture"],[1,"clipped-by-merge",3,"marble"],["mat-icon-button","","onclick","this.blur()",3,"click"],["matTreeNodeToggle","","matRipple","",3,"click"],[3,"click"],["matRipple","","matTreeNodeToggle","",1,"mat-tree-node"],["matTreeNodeOutlet",""]],template:function(t,n){if(1&t&&(e.TgZ(0,"mat-toolbar",0),e.YNc(1,M,3,2,"button",1),e.TgZ(2,"p"),e._uU(3,"Guide"),e.qZA(),e.qZA(),e.TgZ(4,"mat-sidenav-container"),e.TgZ(5,"mat-sidenav",2,3),e.TgZ(7,"mat-tree",4),e.YNc(8,O,4,4,"mat-tree-node",5),e.YNc(9,y,8,7,"mat-nested-tree-node",6),e.qZA(),e.qZA(),e.TgZ(10,"mat-sidenav-content"),e.TgZ(11,"section"),e.TgZ(12,"h3"),e._uU(13,"# Introduction > What is RxPuzzle?"),e.qZA(),e.TgZ(14,"p"),e._uU(15," It is a web app that allows you to study ReactiveX in the form of a puzzle. "),e.qZA(),e.TgZ(16,"p"),e._uU(17," You can learn how operators work and how to use it while solving puzzles. "),e.qZA(),e.TgZ(18,"p"),e._uU(19," Operators that can be used for puzzles are mainly combination operators and time-related operators that are difficult to understand without marble diagrams. "),e.qZA(),e.TgZ(20,"p"),e._uU(21," Some operators are missing during the gamification, but it is enough help to you learn ReactiveX if you can understand operators that used for puzzles. "),e.qZA(),e.qZA(),e.TgZ(22,"section"),e.TgZ(23,"h3"),e._uU(24,"# Introduction > Glossary"),e.qZA(),e.TgZ(25,"p"),e._uU(26,"Let's define some terms for ease of explanation later."),e.qZA(),e.TgZ(27,"dl"),e.TgZ(28,"dt"),e._uU(29,"Operator"),e.qZA(),e.TgZ(30,"dd"),e._uU(31,"It is the same as the operator in ReactiveX."),e.qZA(),e.TgZ(32,"dt"),e._uU(33,"Sequence"),e.qZA(),e.TgZ(34,"dd"),e._uU(35," Here, it means sequence of marbles."),e._UZ(36,"br"),e._uU(37," This is represented in the same way as the Observable in marble diagrams. "),e.qZA(),e.TgZ(38,"dt"),e._uU(39,"Transformer"),e.qZA(),e.TgZ(40,"dd"),e._uU(41," It transforms input sequences into output sequences through selected operator. "),e.qZA(),e.qZA(),e.qZA(),e.TgZ(42,"section"),e.TgZ(43,"h3"),e._uU(44,"# Introduction > How to Play"),e.qZA(),e.TgZ(45,"p"),e._uU(46,"When the stage starts, you'll see the following."),e.qZA(),e.TgZ(47,"ul"),e.TgZ(48,"li"),e._uU(49,"One or more input sequences"),e.qZA(),e.TgZ(50,"li"),e._uU(51,"One or more transformers"),e.qZA(),e.TgZ(52,"li"),e._uU(53,"One goal sequence"),e.qZA(),e.qZA(),e.TgZ(54,"p"),e._uU(55," To clear the stage, You must make the last output sequence same to goal sequence. To do so, you need to look at input sequences and goal sequence and select correct operators from transformers. "),e.qZA(),e.TgZ(56,"p"),e._uU(57," If press play button, transformers work with selected operator. When the last output sequence timeline is filled, you can check the stage result. "),e.qZA(),e.TgZ(58,"p"),e._uU(59," Please note that for gamification, transformers work with additional rules in some cases. "),e.qZA(),e.qZA(),e.TgZ(60,"section"),e.TgZ(61,"h3"),e._uU(62,"# Additional Rules > Marble Combination Rules"),e.qZA(),e.TgZ(63,"p"),e._uU(64," It's kind of a marble accumulation rule. This rule exists to prevent the operator from complicating the output sequence. If the operator requires a function that handles multiple marbles, the function corresponding to this rule applies. When combined, different rules apply to the color and shape of marble, which are as follows. "),e.qZA(),e._UZ(65,"br"),e.TgZ(66,"p"),e._uU(67,"The color combination rules:"),e.qZA(),e.TgZ(68,"ol"),e.TgZ(69,"li"),e._uU(70," If two marbles have the same color, that color is the combined color. "),e.qZA(),e.TgZ(71,"li"),e._uU(72," If one of the two marbles is colorless, the color of the other marble becomes the combined color. "),e.qZA(),e.TgZ(73,"li"),e._uU(74," If the two marbles are not colorless and have different colors, then the colorless is the combined color. "),e.qZA(),e.qZA(),e._UZ(75,"br"),e.TgZ(76,"p"),e._uU(77,"The shape combination rules:"),e.qZA(),e.TgZ(78,"ol"),e.TgZ(79,"li"),e._uU(80," If two marbles have different shapes, the combined shape is a circle. "),e.qZA(),e.TgZ(81,"li"),e._uU(82," If one of the two marbles is a circle, the shape of the other marble becomes the combined shape. "),e.qZA(),e.TgZ(83,"li"),e._uU(84,"If two marbles are circle, the combined shape is also a circle."),e.qZA(),e.TgZ(85,"li"),e._uU(86," If two marbles are same polygon, the combined shape becomes a polygon with an increased number of sides. "),e.qZA(),e.TgZ(87,"li"),e._uU(88," If two marbles are hexagon (maximum sides), the combined shape becomes a rhombus (minimum sides). "),e.qZA(),e.qZA(),e._UZ(89,"br"),e.TgZ(90,"p"),e._uU(91," Additionally, in the case of an operator that emits an array such as "),e.TgZ(92,"i"),e._uU(93,"buffer"),e.qZA(),e._uU(94," or "),e.TgZ(95,"i"),e._uU(96,"zip"),e.qZA(),e._uU(97,", it is automatically reduced by the combination rule. "),e.qZA(),e._UZ(98,"br"),e.TgZ(99,"p"),e._uU(100,"The example of the combination rule:"),e.qZA(),e.TgZ(101,"div",7),e.TgZ(102,"div",8),e._UZ(103,"rxp-sandbox",9),e.qZA(),e.qZA(),e.qZA(),e.TgZ(104,"section"),e.TgZ(105,"h3"),e._uU(106,"# Additional Rules > Sequence Clipping Rules"),e.qZA(),e.TgZ(107,"p"),e._uU(108," This rule exists for preventing unseen marbles are in the output sequence, such as if it exceeds the maximum length or emit multiple marbles at a specific time. "),e.qZA(),e.TgZ(109,"p"),e._uU(110," This rule ensures that only visible marbles exist in the sequence. However, it is recommended to avoid situations in which this rule applies when making a stage. Because a player may be confused as the transformer work differently in specific cases. "),e.qZA(),e.TgZ(111,"p"),e._uU(112," This rule can be applied to merge-related operators, concat-related operators, and "),e.TgZ(113,"i"),e._uU(114,"combineLatest"),e.qZA(),e._uU(115," operator. The following pictures are examples of situations in which the rule applies, and the x-marked marble means the marble that is removed by the rule. "),e.qZA(),e._UZ(116,"br"),e.TgZ(117,"p"),e._uU(118,"If the maximum length is exceeded:"),e.qZA(),e.TgZ(119,"div",7),e.TgZ(120,"div",8),e._UZ(121,"rxp-sandbox",10),e.qZA(),e.qZA(),e.TgZ(122,"div",7),e.TgZ(123,"div",8),e._UZ(124,"rxp-sandbox",11),e._UZ(125,"rxp-marble",12),e.qZA(),e.qZA(),e._UZ(126,"br"),e.TgZ(127,"p"),e._uU(128,"If multiple marbles are emitted at a specific time:"),e.qZA(),e.TgZ(129,"div",7),e.TgZ(130,"div",8),e._UZ(131,"rxp-sandbox",13),e.qZA(),e.qZA(),e.TgZ(132,"div",7),e.TgZ(133,"div",8),e._UZ(134,"rxp-sandbox",14),e._UZ(135,"rxp-marble",15),e.qZA(),e.qZA(),e.qZA(),e._UZ(136,"footer"),e.qZA(),e.qZA()),2&t){const i=e.MAs(6);e.xp6(1),e.Q6J("ngIf","over"===i.mode),e.xp6(3),e.ekj("no-transition",n.sidenavAnimationDisabled),e.Q6J("@.disabled",n.sidenavAnimationDisabled),e.xp6(3),e.Q6J("dataSource",n.tocDataSource)("treeControl",n.tocTreeControl),e.xp6(2),e.Q6J("matTreeNodeDefWhen",n.isInternalNode),e.xp6(116),e.ekj("should-remove",!0),e.Q6J("marble",e.DdM(13,Z)),e.xp6(10),e.ekj("should-remove",!0),e.Q6J("marble",e.DdM(14,Z))}},directives:[b.Ye,p.O5,h.TM,h.JX,m.gi,m.fQ,h.Rh,v.w,A.z,q.lW,U.Hw,m.uo,m.eu,C.wG,m.GZ,m.Ar],styles:['[_nghost-%COMP%]{display:flex;flex-direction:column;align-items:stretch;height:100%}mat-toolbar[_ngcontent-%COMP%]{z-index:4;flex:none;height:56px}mat-sidenav-container[_ngcontent-%COMP%]{z-index:0;flex:auto;height:-moz-fit-content;height:fit-content}mat-sidenav[_ngcontent-%COMP%]{overflow-x:hidden;overflow-y:auto;height:100%;width:250px}mat-sidenav.mat-drawer-side[_ngcontent-%COMP%]{background:var(--theme-background)}mat-sidenav[_ngcontent-%COMP%]   mat-tree[_ngcontent-%COMP%]{background:inherit}mat-sidenav-content[_ngcontent-%COMP%]{scroll-behavior:smooth;display:flex;flex-direction:column;align-items:center}mat-sidenav-content[_ngcontent-%COMP%] > section[_ngcontent-%COMP%]{flex:auto;width:min(max(70%,300px),700px);margin-bottom:2rem}mat-sidenav-content[_ngcontent-%COMP%] > footer[_ngcontent-%COMP%]{flex:none;width:100%;height:2rem;background:var(--theme-primary)}.mat-tree-node[_ngcontent-%COMP%]{padding-left:8px;min-height:0px;height:40px;color:var(--theme-secondary-text)}.mat-tree-node[_ngcontent-%COMP%] > .mat-icon[_ngcontent-%COMP%]{position:absolute;right:0px}.mat-tree-node[_ngcontent-%COMP%]:hover{background:var(--theme-hover);color:var(--theme-text)}.mat-tree-node[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{pointer-events:none;text-decoration:none;color:inherit}.is-selected[_ngcontent-%COMP%]{color:var(--theme-accent)}.mat-tree-node[_ngcontent-%COMP%]{transition-property:opacity,height;transition-duration:.1s;transition-timing-function:var(--theme-standard-easing)}.mat-tree-node[_ngcontent-%COMP%] > .mat-icon[_ngcontent-%COMP%]{transition:transform .1s var(--theme-standard-easing);transform:rotate(90deg)}.is-hidden[_ngcontent-%COMP%]   .mat-tree-node[_ngcontent-%COMP%]{pointer-events:none;opacity:0;height:0px}.mat-tree-node[_ngcontent-%COMP%]:not(.is-expanded) > .mat-icon[_ngcontent-%COMP%]{transform:none}[aria-level="1"].mat-tree-node[_ngcontent-%COMP%], [aria-level="1"][_ngcontent-%COMP%] > .mat-tree-node[_ngcontent-%COMP%]{font-size:1rem}rxp-marble[_ngcontent-%COMP%]{width:22px;height:22px}dt[_ngcontent-%COMP%]{font-weight:bolder}dd[_ngcontent-%COMP%]{margin-left:unset;margin-bottom:8px;padding-left:16px}ul[_ngcontent-%COMP%], ol[_ngcontent-%COMP%]{padding-left:24px}li[_ngcontent-%COMP%]{margin-bottom:8px}.example-picture[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;width:100%;height:auto;overflow:hidden;border-radius:8px;border:var(--theme-secondary-text) solid 2px;margin:0 0 16px;background:var(--theme-hover)}.example-picture[_ngcontent-%COMP%]   .scaled[_ngcontent-%COMP%]{margin:-40px 0;transform:scale(.75)}.example-picture[_ngcontent-%COMP%]   .clipped-by-merge[_ngcontent-%COMP%]{position:absolute;z-index:1;top:218px;left:49px}.example-picture[_ngcontent-%COMP%]   .clipped-by-concat[_ngcontent-%COMP%]{position:absolute;z-index:1;top:218px;left:335px}']}),o})();var f=r(3806),T=r(1258),P=r(7627);const k=[{path:"",component:w}];let N=(()=>{class o{}return o.\u0275fac=function(t){return new(t||o)},o.\u0275mod=e.oAB({type:o}),o.\u0275inj=e.cJS({imports:[[P.Bz.forChild(k),p.ez,f.q,T.i],p.ez,f.q,T.i]}),o})()}}]);