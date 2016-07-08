function loadShader(n){var o=document.createElement("script");o.setAttribute("type","text/javascript"),o.setAttribute("src","assets/brdfs/"+n+".js"),document.getElementsByTagName("head")[0].appendChild(o)}var pgLib={},figureMaterial={uniforms:{thetaH:{type:"f",value:0}},vertexShader:"\nuniform float thetaH;\n\nfloat BRDF(vec3 L, vec3 V, vec3 N)\n{\n    vec3 H = normalize(L+V);\n    float n = 10.0;\n    float ior = 1.5;\n\n    float NdotH = dot(N, H);\n    float VdotH = dot(V, H);\n    float NdotL = dot(N, L);\n    float NdotV = dot(N, V);\n\n    float x = acos(NdotH) * n;\n    float D = exp( -x*x);\n    float G = (NdotV < NdotL) ?\n        ((2.0*NdotV*NdotH < VdotH) ?\n         2.0*NdotH / VdotH :\n         1.0 / NdotV)\n        :\n        ((2.0*NdotL*NdotH < VdotH) ?\n         2.0*NdotH*NdotL / (VdotH*NdotV) :\n         1.0 / NdotV);\n\n    // fresnel\n    float c = VdotH;\n    float g = sqrt(ior*ior + c*c - 1.0);\n    float F = 0.5 * pow(g-c,2.0) / pow(g+c,2.0) * (1.0 + pow(c*(g+c)-1.0,2.0) / pow(c*(g-c)+1.0,2.0));\n\n    float val = NdotH < 0.0 ? 0.0 : D * G;\n    return val;\n}\n\nvec3 rotate( vec3 v, vec3 axis, float angle )\n{\n    vec3 n;\n    axis = normalize( axis );\n    n = axis * dot( axis, v );\n    return n + cos(angle)*(v-n) + sin(angle)*cross(axis, v);\n}\n\nvoid main(void)\n{\n    float thetaD = position.x;\n\n    vec3 N = vec3(0,0,1); // normal\n    vec3 X = vec3(1,0,0); // tangent\n    vec3 Y = vec3(0,1,0); // bitangent\n\n    // synthesize L and V vectors\n    vec3 L = rotate(rotate(N, X, thetaD), Y, thetaH);\n    vec3 H = rotate(N, Y, thetaH);\n    vec3 V = 2.0 * dot(L,H) * H - L;\n\n    float value = BRDF(L, V, N);\n\n    // gl_Position = projectionMatrix * modelViewMatrix * vec4(thetaD, value, 0.0, 1.0);\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);\n}\n    ",fragmentShader:"\nvoid main() {\n    gl_FragColor = vec4( 1.0, 1.0, 0.0, 0.5 );\n}\n    "},plotObjMaterial={uniforms:{uLightPos:{type:"v3",value:new THREE.Vector3(0,1,0)},uDisplayColor:{type:"c",value:new THREE.Color},uMultiplyCos:{type:"1i",value:0}},derivatives:!0,vertexShader:"\nuniform vec3 uLightPos;\nuniform int uMultiplyCos;\n\nvarying vec4 vPosition;\n\n{{PHASE_FUNCTION}}\n\nvoid main(void)\n{\n    vec3 N = vec3(0.0, 1.0, 0.0);\n    vec3 L = normalize(uLightPos.xyz);\n    vec3 V = normalize(position.xyz);\n    vec3 pos = position.xyz * BRDF(L, V, N);\n\n    if (uMultiplyCos == 1) {\n        pos *= max(dot(N, L), 0.0);\n    }\n\n    vPosition = modelViewMatrix * vec4(pos, 1.0);\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\n}\n    ",fragmentShader:"\nuniform vec3 uDisplayColor;\nvarying vec4 vPosition;\n\nvoid main() {\n    vec3 V = vPosition.xyz;\n    vec3 N = normalize(cross(dFdx(V.xyz), dFdy(V.xyz)));\n    vec3 L = vec3(0.0, 0.0, 1.0);\n    float cosTerm = max(dot(N, L), 0.0);\n\n    gl_FragColor = vec4(uDisplayColor * cosTerm, 1.0);\n}"},modelMaterial={uniforms:{uLightPos:{type:"v3",value:new THREE.Vector3(0,1,0)},uLightColor:{type:"c",value:new THREE.Color(16777215)}},vertexShader:"\nvarying vec3 vNormal;\nvarying vec4 vPosition;\n\nvoid main(void)\n{\n    vNormal = normalMatrix * normal;\n\n    vPosition = modelViewMatrix * vec4(position, 1.0);\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n        ",fragmentShader:"\nuniform vec3 uLightPos;\nuniform vec3 uLightColor;\n\nvarying vec3 vNormal;\nvarying vec4 vPosition;\n\n{{PHASE_FUNCTION}}\n\nvoid main() {\n    vec4 lightPos = viewMatrix * vec4(uLightPos, 0.0);\n    vec3 N = normalize(vNormal);\n    vec3 L = normalize(vec3(lightPos));\n    vec3 V = normalize(vec3(-vPosition));\n\n    float cosTerm = max(dot(N, L), 0.0);\n    gl_FragColor.rgb = uLightColor * cosTerm * BRDF(L, V, N);\n    gl_FragColor.a = 1.0;\n}\n        "};