import{_ as H}from"./brx0nZ0_.js";import{u as N}from"./dPU-OSPL.js";import{d as h,s as O,o as A,t as D,x as B,c as o,a as i,r as y,g as a,y as _,z as E,A as x,B as w,D as F,k,J as G,f as W,K as M,L as P,b as m,w as b,h as C}from"./CHzNdNnh.js";const U=`
attribute vec2 position;
void main(){
  gl_Position=vec4(position,0.0,1.0);
}`,X=`
#ifdef GL_ES
precision lowp float;
#endif
uniform vec2 uResolution;
uniform float uTime;
uniform float uHueShift;
uniform float uNoise;
uniform float uScan;
uniform float uScanFreq;
uniform float uWarp;

#define iTime uTime
#define iResolution uResolution

vec4 buf[8];

float rand(vec2 c){
  return fract(sin(dot(c,vec2(12.9898,78.233)))*43758.5453);
}

mat3 rgb2yiq=mat3(0.299,0.587,0.114,0.596,-0.274,-0.322,0.211,-0.523,0.312);
mat3 yiq2rgb=mat3(1.0,0.956,0.621,1.0,-0.272,-0.647,1.0,-1.106,1.703);

vec3 hueShiftRGB(vec3 col,float deg){
  vec3 yiq=rgb2yiq*col;
  float rad=radians(deg);
  float cosh=cos(rad),sinh=sin(rad);
  vec3 yiqShift=vec3(yiq.x,yiq.y*cosh-yiq.z*sinh,yiq.y*sinh+yiq.z*cosh);
  return clamp(yiq2rgb*yiqShift,0.0,1.0);
}

vec4 sigmoid(vec4 x){
  return 1./(1.+exp(-x));
}

vec4 cppn_fn(vec2 coordinate,float in0,float in1,float in2){
  // Ajustado para gerar tons dourados (#FFC000)
  buf[6]=vec4(coordinate.x,coordinate.y,0.8+in0,0.7+in1);
  buf[7]=vec4(0.6+in2,sqrt(coordinate.x*coordinate.x+coordinate.y*coordinate.y),0.,0.);
  buf[0]=mat4(vec4(6.5404263,-3.6126034,0.7590882,-1.13613),vec4(2.4582713,3.1660357,1.2219609,0.06276096),vec4(-5.478085,-6.159632,1.8701609,-4.7742867),vec4(6.039214,-5.542865,-0.90925294,3.251348))*buf[6]+mat4(vec4(0.8473259,-5.722911,3.975766,1.6522468),vec4(-0.24321538,0.5839259,-1.7661959,-5.350116),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(0.21808943,1.1243913,-1.7969975,5.0294676);
  buf[1]=mat4(vec4(-3.3522482,-6.0612736,0.55641043,-4.4719114),vec4(0.8631464,1.7432913,5.643898,1.6106541),vec4(2.4941394,-3.5012043,1.7184316,6.357333),vec4(3.310376,8.209261,1.1355612,-1.165539))*buf[6]+mat4(vec4(5.24046,-13.034365,0.009859298,15.870829),vec4(2.987511,3.129433,-0.89023495,-1.6822904),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(-5.9457836,-6.573602,-0.8812491,1.5436668);
  buf[0]=sigmoid(buf[0]);
  buf[1]=sigmoid(buf[1]);
  buf[2]=mat4(vec4(-15.219568,8.095543,-2.429353,-1.9381982),vec4(-5.951362,4.3115187,2.6393783,1.274315),vec4(-7.3145227,6.7297835,5.2473326,5.9411426),vec4(5.0796127,8.979051,-1.7278991,-1.158976))*buf[6]+mat4(vec4(-11.967154,-11.608155,6.1486754,11.237008),vec4(2.124141,-6.263192,-1.7050359,-0.7021966),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(-4.17164,-3.2281182,-4.576417,-3.6401186);
  buf[3]=mat4(vec4(3.1832156,-13.738922,1.879223,3.233465),vec4(0.64300746,12.768129,1.9141049,0.50990224),vec4(-0.049295485,4.4807224,1.4733979,1.801449),vec4(5.0039253,13.000481,3.3991797,-4.5561905))*buf[6]+mat4(vec4(-0.1285731,7.720628,-3.1425676,4.742367),vec4(0.6393625,3.714393,-0.8108378,-0.39174938),vec4(0.,0.,0.,0.),vec4(0.,0.,0.,0.))*buf[7]+vec4(-1.1811101,-21.621881,0.7851888,1.2329718);
  buf[2]=sigmoid(buf[2]);
  buf[3]=sigmoid(buf[3]);
  buf[4]=mat4(vec4(5.214916,-7.183024,2.7228765,2.6592617),vec4(-5.601878,-25.3591,4.067988,0.4602802),vec4(-10.57759,24.286327,21.102104,37.546658),vec4(4.3024497,-1.9625226,2.3458803,-1.372816))*buf[0]+mat4(vec4(-17.6526,-10.507558,2.2587414,12.462782),vec4(6.265566,-502.75443,-12.642513,0.9112289),vec4(-10.983244,20.741234,-9.701768,-0.7635988),vec4(5.383626,1.4819539,-4.1911616,-4.8444734))*buf[1]+mat4(vec4(12.785233,-16.345072,-0.39901125,1.7955981),vec4(-30.48365,-1.8345358,1.4542528,-1.1118771),vec4(19.872723,-7.337935,-42.941723,-98.52709),vec4(8.337645,-2.7312303,-2.2927687,-36.142323))*buf[2]+mat4(vec4(-16.298317,3.5471997,-0.44300047,-9.444417),vec4(57.5077,-35.609753,16.163465,-4.1534753),vec4(-0.07470326,-3.8656476,-7.0901804,3.1523974),vec4(-12.559385,-7.077619,1.490437,-0.8211543))*buf[3]+vec4(-7.67914,15.927437,1.3207729,-1.6686112);
  buf[5]=mat4(vec4(-1.4109162,-0.372762,-3.770383,-21.367174),vec4(-6.2103205,-9.35908,0.92529047,8.82561),vec4(11.460242,-22.348068,13.625772,-18.693201),vec4(-0.3429052,-3.9905605,-2.4626114,-0.45033523))*buf[0]+mat4(vec4(7.3481627,-4.3661838,-6.3037653,-3.868115),vec4(1.5462853,6.5488915,1.9701879,-0.58291394),vec4(6.5858274,-2.2180402,3.7127688,-1.3730392),vec4(-5.7973905,10.134961,-2.3395722,-5.965605))*buf[1]+mat4(vec4(-2.5132585,-6.6685553,-1.4029363,-0.16285264),vec4(-0.37908727,0.53738135,4.389061,-1.3024765),vec4(-0.70647055,2.0111287,-5.1659346,-3.728635),vec4(-13.562562,10.487719,-0.9173751,-2.6487076))*buf[2]+mat4(vec4(-8.645013,6.5546675,-6.3944063,-5.5933375),vec4(-0.57783127,-1.077275,36.91025,5.736769),vec4(14.283112,3.7146652,7.1452246,-4.5958776),vec4(2.7192075,3.6021907,-4.366337,-2.3653464))*buf[3]+vec4(-5.9000807,-4.329569,1.2427121,8.59503);
  buf[4]=sigmoid(buf[4]);
  buf[5]=sigmoid(buf[5]);
  buf[6]=mat4(vec4(-1.61102,0.7970257,1.4675229,0.20917463),vec4(-28.793737,-7.1390953,1.5025433,4.656581),vec4(-10.94861,39.66238,0.74318546,-10.095605),vec4(-0.7229728,-1.5483948,0.7301322,2.1687684))*buf[0]+mat4(vec4(3.2547753,21.489103,-1.0194173,-3.3100595),vec4(-3.7316632,-3.3792162,-7.223193,-0.23685838),vec4(13.1804495,0.7916005,5.338587,5.687114),vec4(-4.167605,-17.798311,-6.815736,-1.6451967))*buf[1]+mat4(vec4(0.604885,-7.800309,-7.213122,-2.741014),vec4(-3.522382,-0.12359311,-0.5258442,0.43852118),vec4(9.6752825,-22.853785,2.062431,0.099892326),vec4(-4.3196306,-17.730087,2.5184598,5.30267))*buf[2]+mat4(vec4(-6.545563,-15.790176,-6.0438633,-5.415399),vec4(-43.591583,28.551912,-16.00161,18.84728),vec4(4.212382,8.394307,3.0958717,8.657522),vec4(-5.0237565,-4.450633,-4.4768,-5.5010443))*buf[3]+mat4(vec4(1.6985557,-67.05806,6.897715,1.9004834),vec4(1.8680354,2.3915145,2.5231109,4.081538),vec4(11.158006,1.7294737,2.0738268,7.386411),vec4(-4.256034,-306.24686,8.258898,-17.132736))*buf[4]+mat4(vec4(1.6889864,-4.5852966,3.8534803,-6.3482175),vec4(1.3543309,-1.2640043,9.932754,2.9079645),vec4(-5.2770967,0.07150358,-0.13962056,3.3269649),vec4(28.34703,-4.918278,6.1044083,4.085355))*buf[5]+vec4(6.6818056,12.522166,-3.7075126,-4.104386);
  buf[7]=mat4(vec4(-8.265602,-4.7027016,5.098234,0.7509808),vec4(8.6507845,-17.15949,16.51939,-8.884479),vec4(-4.036479,-2.3946867,-2.6055532,-1.9866527),vec4(-2.2167742,-1.8135649,-5.9759874,4.8846445))*buf[0]+mat4(vec4(6.7790847,3.5076547,-2.8191125,-2.7028968),vec4(-5.743024,-0.27844876,1.4958696,-5.0517144),vec4(13.122226,15.735168,-2.9397483,-4.101023),vec4(-14.375265,-5.030483,-6.2599335,2.9848232))*buf[1]+mat4(vec4(4.0950394,-0.94011575,-5.674733,4.755022),vec4(4.3809423,4.8310084,1.7425908,-3.437416),vec4(2.117492,0.16342592,-104.56341,16.949184),vec4(-5.22543,-2.994248,3.8350096,-1.9364246))*buf[2]+mat4(vec4(-5.900337,1.7946124,-13.604192,-3.8060522),vec4(6.6583457,31.911177,25.164474,91.81147),vec4(11.840538,4.1503043,-0.7314397,6.768467),vec4(-6.3967767,4.034772,6.1714606,-0.32874924))*buf[3]+mat4(vec4(3.4992442,-196.91893,-8.923708,2.8142626),vec4(3.4806502,-3.1846354,5.1725626,5.1804223),vec4(-2.4009497,15.585794,1.2863957,2.0252278),vec4(-71.25271,-62.441242,-8.138444,0.50670296))*buf[4]+mat4(vec4(-12.291733,-11.176166,-7.3474145,4.390294),vec4(10.805477,5.6337385,-0.9385842,-4.7348723),vec4(-12.869276,-7.039391,5.3029537,7.5436664),vec4(1.4593618,8.91898,3.5101583,5.840625))*buf[5]+vec4(2.2415268,-6.705987,-0.98861027,-2.117676);
  buf[6]=sigmoid(buf[6]);
  buf[7]=sigmoid(buf[7]);
  buf[0]=mat4(vec4(1.6794263,1.3817469,2.9625452,0.),vec4(-1.8834411,-1.4806935,-3.5924516,0.),vec4(-1.3279216,-1.0918057,-2.3124623,0.),vec4(0.2662234,0.23235129,0.44178495,0.))*buf[0]+mat4(vec4(-0.6299101,-0.5945583,-0.9125601,0.),vec4(0.17828953,0.18300213,0.18182953,0.),vec4(-2.96544,-2.5819945,-4.9001055,0.),vec4(1.4195864,1.1868085,2.5176322,0.))*buf[1]+mat4(vec4(-1.2584374,-1.0552157,-2.1688404,0.),vec4(-0.7200217,-0.52666044,-1.438251,0.),vec4(0.15345335,0.15196142,0.272854,0.),vec4(0.945728,0.8861938,1.2766753,0.))*buf[2]+mat4(vec4(-2.4218085,-1.968602,-4.35166,0.),vec4(-22.683098,-18.0544,-41.954372,0.),vec4(0.63792,0.5470648,1.1078634,0.),vec4(-1.5489894,-1.3075932,-2.6444845,0.))*buf[3]+mat4(vec4(-0.49252132,-0.39877754,-0.91366625,0.),vec4(0.95609266,0.7923952,1.640221,0.),vec4(0.30616966,0.15693925,0.8639857,0.),vec4(1.1825981,0.94504964,2.176963,0.))*buf[4]+mat4(vec4(0.35446745,0.3293795,0.59547555,0.),vec4(-0.58784515,-0.48177817,-1.0614829,0.),vec4(2.5271258,1.9991658,4.6846647,0.),vec4(0.13042648,0.08864098,0.30187556,0.))*buf[5]+mat4(vec4(-1.7718065,-1.4033192,-3.3355875,0.),vec4(3.1664357,2.638297,5.378702,0.),vec4(-3.1724713,-2.6107926,-5.549295,0.),vec4(-2.851368,-2.249092,-5.3013067,0.))*buf[6]+mat4(vec4(1.5203838,1.2212278,2.8404984,0.),vec4(1.5210563,1.2651345,2.683903,0.),vec4(2.9789467,2.4364579,5.2347264,0.),vec4(2.2270417,1.8825914,3.8028636,0.))*buf[7]+vec4(-1.5468478,-3.6171484,0.24762098,0.);
  buf[0]=sigmoid(buf[0]);
  return vec4(buf[0].x,buf[0].y,buf[0].z,1.);
}

void mainImage(out vec4 fragColor,in vec2 fragCoord){
  vec2 uv=fragCoord/uResolution.xy*2.-1.;
  uv.y*=-1.;
  uv+=uWarp*vec2(sin(uv.y*6.283+uTime*0.5),cos(uv.x*6.283+uTime*0.5))*0.05;
  
  // Gerar padrão base com mais variação
  vec4 baseColor = cppn_fn(uv,0.15*sin(0.3*uTime),0.15*sin(0.69*uTime),0.15*sin(0.44*uTime));
  
  // Cor dourada para as linhas (#FFC000)
  vec3 goldColor = vec3(1.0, 0.75, 0.0);
  
  // Calcular intensidade do padrão com mais contraste
  float intensity = (baseColor.r + baseColor.g + baseColor.b) / 3.0;
  intensity = pow(intensity, 0.8); // Aumentar contraste
  
  // Criar threshold mais baixo para mostrar mais linhas
  float threshold = 0.3;
  float lineIntensity = smoothstep(threshold, threshold + 0.4, intensity);
  
  // Aumentar contraste para destacar mais padrões
  lineIntensity = pow(lineIntensity, 0.7);
  
  // Fundo escuro transparente, linhas douradas
  vec3 finalColor = goldColor * lineIntensity;
  float alpha = lineIntensity * 0.6;
  
  // Adicionar variação temporal sutil nas linhas
  alpha *= 0.8 + 0.2 * sin(uTime * 0.4);
  
  fragColor = vec4(finalColor, alpha);
}

void main(){
  vec4 col;
  mainImage(col,gl_FragCoord.xy);
  
  // Aplicar mudança de matiz apenas se especificado
  if (uHueShift != 0.0) {
    col.rgb = hueShiftRGB(col.rgb, uHueShift);
  }
  
  // Scanlines
  float scanline_val=sin(gl_FragCoord.y*uScanFreq)*0.5+0.5;
  col.rgb*=1.-(scanline_val*scanline_val)*uScan;
  
  // Ruído
  col.rgb+=(rand(gl_FragCoord.xy+uTime)-0.5)*uNoise;
  
  gl_FragColor=vec4(clamp(col.rgb,0.0,1.0), col.a);
}`,J=h({__name:"DarkVeil",props:{hueShift:{default:0},noiseIntensity:{default:0},scanlineIntensity:{default:0},speed:{default:.5},scanlineFrequency:{default:0},warpAmount:{default:0},resolutionScale:{default:1}},setup(v){const e=v,s=O("canvasRef");let n=null,t=null,c=null,l=null,r=0;const u=()=>{l&&(cancelAnimationFrame(l),l=null),window.removeEventListener("resize",f)},f=()=>{if(!s.value||!n||!t)return;const d=s.value.parentElement;if(!d)return;const g=d.offsetWidth||window.innerWidth,p=d.offsetHeight||window.innerHeight;n.setSize(g*e.resolutionScale,p*e.resolutionScale),t.uniforms.uResolution.value.set(g,p)},q=()=>{!t||!n||!c||(t.uniforms.uTime.value=(performance.now()-r)/1e3*e.speed,t.uniforms.uHueShift.value=e.hueShift,t.uniforms.uNoise.value=e.noiseIntensity,t.uniforms.uScan.value=e.scanlineIntensity,t.uniforms.uScanFreq.value=e.scanlineFrequency,t.uniforms.uWarp.value=e.warpAmount,n.render({scene:c}),l=requestAnimationFrame(q))},{loadLibrary:I}=N();return A(async()=>{if(!s.value)return;const d=s.value;if(!d.parentElement)return;const p=await I();if(!p)return;const{Renderer:R,Program:L,Mesh:T,Triangle:j,Vec2:V}=p;n=new R({dpr:Math.min(window.devicePixelRatio,2),canvas:d});const S=n.gl,z=new j(S);t=new L(S,{vertex:U,fragment:X,uniforms:{uTime:{value:0},uResolution:{value:new V},uHueShift:{value:e.hueShift},uNoise:{value:e.noiseIntensity},uScan:{value:e.scanlineIntensity},uScanFreq:{value:e.scanlineFrequency},uWarp:{value:e.warpAmount}}}),c=new T(S,{geometry:z,program:t}),window.addEventListener("resize",f),f(),r=performance.now(),q()}),D(()=>{u()}),B(()=>[e.hueShift,e.noiseIntensity,e.scanlineIntensity,e.speed,e.scanlineFrequency,e.warpAmount],()=>{t&&(t.uniforms.uHueShift.value=e.hueShift,t.uniforms.uNoise.value=e.noiseIntensity,t.uniforms.uScan.value=e.scanlineIntensity,t.uniforms.uScanFreq.value=e.scanlineFrequency,t.uniforms.uWarp.value=e.warpAmount)}),(d,g)=>(i(),o("canvas",{ref_key:"canvasRef",ref:s,class:"absolute inset-0 w-full h-full block pointer-events-none"},null,512))}}),K=Object.assign(J,{__name:"UiDarkVeil"}),Q=h({__name:"ContainerScroll",props:{rotate:{default:0},scale:{default:1},rotateX:{default:0}},setup(v){const e=v,s=y(),n=y(e.rotate),t=y(e.scale),c=y(e.rotateX),l=()=>{if(!s.value)return;const r=s.value.getBoundingClientRect(),u=Math.max(0,Math.min(1,(window.innerHeight-r.top)/(window.innerHeight+r.height)));n.value=u*50,t.value=1-u*.1,c.value=u*20};return A(()=>{window.addEventListener("scroll",l),l()}),D(()=>{window.removeEventListener("scroll",l)}),(r,u)=>(i(),o("div",{ref_key:"containerRef",ref:s,class:"flex items-center justify-center relative",style:{perspective:"1000px"}},[a("div",{class:"w-full relative",style:_({rotateX:`${n.value}deg`,transformStyle:"preserve-3d"})},[a("div",{style:_({boxShadow:"0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",borderRadius:`${20*t.value}px`,transform:`scale(${t.value}) rotateX(${c.value}deg)`,transformStyle:"preserve-3d",transformOrigin:"bottom"}),class:"mx-auto w-full border-4 border-[#6C6C6C] p-2 bg-[#222222] md:p-6 transition-all duration-700 ease-out"},[a("div",{style:_({borderRadius:`${16*t.value}px`}),class:"bg-gray-100 h-full w-full overflow-hidden md:rounded-lg md:p-4"},[E(r.$slots,"default")],4)],4)],4)],512))}}),Y=Object.assign(Q,{__name:"UiContainerScroll"}),Z={class:"relative overflow-hidden"},ee={class:"flex animate-loop-scroll"},te={class:"flex min-w-full shrink-0 items-center justify-around gap-8"},ae=["src","alt"],ne={class:"flex min-w-full shrink-0 items-center justify-around gap-8"},se=["src","alt"],oe=h({__name:"LogoLoop",setup(v){const e=[{name:"GitHub",src:"https://cdn.simpleicons.org/github/181717",class:""},{name:"Flutter",src:"https://cdn.simpleicons.org/flutter/02569B",class:"dark:invert-0"},{name:"Supabase",src:"https://cdn.simpleicons.org/supabase/3FCF8E",class:"dark:invert-0"},{name:"Vue",src:"https://cdn.simpleicons.org/vuedotjs/4FC08D",class:"dark:invert-0"},{name:"Nuxt",src:"https://cdn.simpleicons.org/nuxt/00DC82",class:"dark:invert-0"},{name:"OpenAI Gym",src:"https://cdn.simpleicons.org/openaigym/0081A5",class:"dark:invert-0"},{name:"Cloudflare",src:"https://cdn.simpleicons.org/cloudflare/F38020",class:"dark:invert-0"},{name:"Google Play",src:"https://cdn.simpleicons.org/googleplay/414141",class:"dark:invert-0"},{name:"Apple",src:"https://cdn.simpleicons.org/apple/000000",class:""},{name:"Stripe",src:"https://cdn.simpleicons.org/stripe/008CDD",class:"dark:invert-0"},{name:"Node.js",src:"https://cdn.simpleicons.org/nodedotjs/339933",class:"dark:invert-0"}];return(s,n)=>(i(),o("div",Z,[a("div",ee,[a("div",te,[(i(),o(x,null,w(e,t=>a("div",{key:`first-${t.name}`,class:"flex items-center justify-center"},[a("img",{src:t.src,alt:`${t.name} Logo`,class:F(["h-8 w-auto opacity-60 hover:opacity-100 transition-opacity duration-300 dark:invert",t.class])},null,10,ae)])),64))]),a("div",ne,[(i(),o(x,null,w(e,t=>a("div",{key:`second-${t.name}`,class:"flex items-center justify-center"},[a("img",{src:t.src,alt:`${t.name} Logo`,class:F(["h-8 w-auto opacity-60 hover:opacity-100 transition-opacity duration-300 dark:invert",t.class])},null,10,se)])),64))])])]))}}),ie=Object.assign(k(oe,[["__scopeId","data-v-57d333d2"]]),{__name:"UiLogoLoop"}),ce={class:"blur-text-container"},re={key:0,class:"space"},le=h({__name:"BlurText",props:{text:{},delay:{default:0},duration:{default:1e3}},setup(v){const e=v,s=G(()=>e.text.split(" ")),n=(t,c)=>({animationDelay:`${e.delay+t*100+c*50}ms`,animationDuration:`${e.duration}ms`});return(t,c)=>(i(),o("div",ce,[(i(!0),o(x,null,w(s.value,(l,r)=>(i(),o("span",{key:`word-${r}`,class:"word"},[(i(!0),o(x,null,w(l.split(""),(u,f)=>(i(),o("span",{key:`char-${r}-${f}`,class:"char",style:_(n(r,f))},M(u),5))),128)),r<s.value.length-1?(i(),o("span",re)):W("",!0)]))),128))]))}}),$=Object.assign(k(le,[["__scopeId","data-v-4416726e"]]),{__name:"UiBlurText"}),ue={class:"relative min-h-screen"},ve={class:"absolute inset-0 w-full h-full"},de={class:"overflow-hidden relative z-10"},me={class:"relative pt-24"},fe={class:"mx-auto max-w-5xl px-6"},pe={class:"sm:mx-auto lg:mr-auto"},be={initial:{opacity:0},enter:{opacity:1,transition:{staggerChildren:.05,delayChildren:.75}}},he={class:"pt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:pt-12"},ge={class:"mt-4 max-w-2xl text-pretty text-lg text-muted-foreground"},ye=["initial","enter"],_e={initial:{opacity:0},enter:{opacity:1,transition:{staggerChildren:.05,delayChildren:.75}}},xe={class:"relative"},we={class:"bg-background pb-16 pt-16 md:pb-32 w-full"},Se={class:"w-full"},Ce=h({__name:"HeroSection",setup(v){const e={item:{hidden:{opacity:0,filter:"blur(12px)",y:12},visible:{opacity:1,filter:"blur(0px)",y:0,transition:{type:"spring",bounce:.3,duration:1.5}}}};return(s,n)=>{const t=H,c=P("motion");return i(),o("div",ue,[a("div",ve,[m(K,{"hue-shift":0,"noise-intensity":.01,"scanline-intensity":0,speed:.4,"scanline-frequency":0,"warp-amount":.08,"resolution-scale":1})]),a("main",de,[a("section",null,[a("div",me,[a("div",fe,[a("div",pe,[m(t,null,{fallback:b(()=>[...n[0]||(n[0]=[a("div",{class:"opacity-0"},[a("h1",{class:"pt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:pt-12"}," Desenvolvimento de Aplicativos Mobile e Web com Tecnologia de Ponta "),a("p",{class:"mt-4 max-w-2xl text-pretty text-lg text-muted-foreground"}," Na Vale Apps, unimos desenvolvimento mobile, web, design e automação para acelerar o crescimento da sua empresa. Criamos aplicativos iOS, Android e web com soluções sob medida que geram resultados. "),a("div",{class:"mt-6 flex items-center gap-2"})],-1)])]),default:b(()=>[C((i(),o("div",be,[a("h1",he,[m($,{text:"Desenvolvimento de Aplicativos Mobile e Web com Tecnologia de Ponta",delay:500,duration:1200})]),a("p",ge,[m($,{text:"Na Vale Apps, unimos desenvolvimento mobile, web, design e automação para acelerar o crescimento da sua empresa. Criamos aplicativos iOS, Android e web com soluções sob medida que geram resultados.",delay:1500,duration:1e3})]),C(a("div",{initial:e.item.hidden,enter:e.item.visible,class:"mt-6 flex items-center gap-2"},null,8,ye),[[c]])])),[[c]])]),_:1})])]),m(t,null,{fallback:b(()=>[...n[3]||(n[3]=[a("div",{class:"relative opacity-0"},[a("div",{"aria-hidden":"true",class:"bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"}),a("div",{class:"mx-auto max-w-5xl px-6"},[a("img",{class:"bg-background aspect-[15/8] relative hidden rounded-lg dark:block w-full h-full object-cover",src:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2700&h=1440&fit=crop&crop=center",alt:"Dashboard de aplicativo web desenvolvido pela Vale Apps - Interface moderna e responsiva",width:"2700",height:"1440"}),a("img",{class:"aspect-[15/8] relative rounded-lg w-full h-full object-cover dark:hidden",src:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=2700&h=1440&fit=crop&crop=center",alt:"Dashboard de aplicativo web desenvolvido pela Vale Apps - Interface moderna e responsiva",width:"2700",height:"1440"})])],-1)])]),default:b(()=>[C((i(),o("div",_e,[a("div",xe,[n[2]||(n[2]=a("div",{"aria-hidden":"true",class:"bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"},null,-1)),m(Y,null,{default:b(()=>[...n[1]||(n[1]=[a("img",{class:"bg-background aspect-[15/8] relative hidden rounded-lg dark:block w-full h-full object-cover",src:"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=2700&h=1440&fit=crop&crop=center",alt:"Dashboard de aplicativo web desenvolvido pela Vale Apps - Interface moderna e responsiva",width:"2700",height:"1440"},null,-1),a("img",{class:"aspect-[15/8] relative rounded-lg w-full h-full object-cover dark:hidden",src:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=2700&h=1440&fit=crop&crop=center",alt:"Dashboard de aplicativo web desenvolvido pela Vale Apps - Interface moderna e responsiva",width:"2700",height:"1440"},null,-1)])]),_:1})])])),[[c]])]),_:1})])]),a("section",we,[a("div",Se,[n[4]||(n[4]=a("div",{class:"text-center mb-8 px-6"},null,-1)),m(ie)])])])])}}}),$e=Object.assign(k(Ce,[["__scopeId","data-v-02965d66"]]),{__name:"HeroSection"});export{$e as default};
