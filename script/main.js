import * as THREE from "three";
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// VARIABLES ------------------------
const cvs = document.getElementById("cvs");

// WINDOW ATTRIB
const attribute_switch = document.getElementsByClassName("Attributes_win")[0];
const tools_switch = document.getElementsByClassName("Tools_win")[0];
const skills_switch = document.getElementsByClassName("skills_win")[0];
const exp_switch = document.getElementsByClassName("Experience_win")[0];
const profile_switch = document.getElementsByClassName("Profile_win")[0];

const loading_screen = document.getElementsByClassName("Loading_screen")[0];
const LS_STATE = document.getElementsByClassName("LS_status")[0];

const EWC_G = document.getElementsByClassName("EWC_G");

// SW WINDOWS
const SW_MAIN = document.getElementsByClassName("sw_main")[0];
const SW_TOOLS = document.getElementsByClassName("sw_tools")[0];
const SW_SKILLS = document.getElementsByClassName("sw_skills")[0];


// TOOLS CHILDRENS
const TOOL_HEADER = document.getElementsByClassName("tools_header")[0];
const TOOLS_TYPE = document.getElementsByClassName("tools_type_x")[0];
const TOOLS_LEVEL = document.getElementsByClassName("tl_1")[0];
const TOOLS_DESC = document.getElementsByClassName("tools_description")[0];
const TOOLS_BTN = document.getElementsByClassName("tools_btn")[0];


// SKILLS CHILDRENS
const SKILLS_BTN = document.getElementsByClassName("skills_seemore_btn")[0];

// SKILLS_DESCRIPTION SHOWN
const RTD      = document.getElementsByClassName("right_tools_desc")['0'];
const RTD_NAME = document.getElementsByClassName("rtd_name")['0'];
const RTD_TYPE = document.getElementsByClassName("rtd_type")['0'];
const RTD_LEVL = document.getElementsByClassName("rtd_level_adj")['0'];
const RTD_DESC = document.getElementsByClassName("rtd_desc")['0'];
const RTD_BTNN = document.getElementsByClassName("rtd_close_btn")['0'];

// PROFILE_SEEMORE SHOWN
const PROF_SN       = document.getElementsByClassName('sw_profile')[0];
const PROF_SN_BTN1  = document.getElementsByClassName('pw_btn1')[0];
const PROF_SN_BTN2  = document.getElementsByClassName('pw_btn2')[0];

for(let i = 0; i < EWC_G.length ; i++) {
    
    let compt_i = Math.sin((i*60)*(Math.PI/180)).toFixed(2);

    EWC_G[i].style.marginLeft = (30*compt_i) + "%";
}

// WINDOW SIZE ------------------------------------------------
const win_size = {
    height: window.innerHeight,
    width:  window.innerWidth
}



// SCENE SETUP ------------------------------------------------
const scene         = new THREE.Scene();
const camera        = new THREE.PerspectiveCamera(
    10,
    win_size.width/win_size.height,
    0.1,
    1000
);

const render        = new THREE.WebGLRenderer({
    canvas: cvs,
    antialias: true
});
render.setSize(win_size.width, win_size.height);
render.setAnimationLoop(loop);
render.shadowMap = true;


//scene.background = new THREE.Color(0x181F34);
scene.background = new THREE.Color(0x252424);

function pointLightCreator(intensity, x, y, z, color = 0xffffff) {
    const pointLight = new THREE.PointLight( color, intensity, 1000 );
    pointLight.position.set( x, y, z );
    scene.add( pointLight );
}

pointLightCreator(500, 0, -1, 20);
pointLightCreator(700, 10, 20, 20);
pointLightCreator(700, 20, 1, 0);
pointLightCreator(100, -10, -5, 0);


var control       = new OrbitControls(camera, render.domElement);
control.saveState();
control.enabled = true;
control.enabeZoom   = true;
control.enablePan   = false;
control.enableDamping = true;



// CAMERA PERSPECTIVE VIEW SETTINGS

 control.maxDistance = 130;
 control.minDistance = 100;


// GLTF LOADER ------------------------------------------------
const dLoader = new DRACOLoader();
const Model_loader = new GLTFLoader();

dLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
dLoader.setDecoderConfig({type:'js'});

Model_loader.setDRACOLoader(dLoader);

var model_main, model_map;
var model_main_s, model_map_s;
var mixer;

var HUMAN_MODEL_PERCENT;
var MAPPP_MODEL_PERCENT;

var model_loaded = false;

const url = './assets/model.glb';
Model_loader.load(url, (model) => {
    const root = model.scene;
    model_main = model;
    model_main_s = model.scene;

    root.position.y = -10; //-10
    scene.add(root);
    
    mixer = new THREE.AnimationMixer(model.scene);
    const clip_animation = model.animations;

    const clipper = THREE.AnimationClip.findByName(clip_animation,'breath');
    const actioner = mixer.clipAction(clipper);
    
    actioner.fadeOut(0.2);
    actioner.reset();
    actioner.fadeIn(0.2);
    actioner.play();

},  function(xload) {
    HUMAN_MODEL_PERCENT = xload.loaded / xload.total * 100;
}, function(err) {
    console.log("Error While Loading...");
}
);


const url2 = 'assets/RoadMap.glb';
Model_loader.load(url2, (model) => {
    const root = model.scene;
    model_map = model;
    model_map_s = model.scene;

    root.position.y = 50;
    root.rotation.x = 1.57;
    root.scale.set(0,0,0)

    scene.add(root);
    
},  function(xload) {
    MAPPP_MODEL_PERCENT = xload.loaded / xload.total * 100;
}, function(err) {
    console.log("Error While Loading...");
}
);

// GLTF LOADER FOR TOOLS -------------------------
let TOOLS_MODELS = [];

let TOOLS_FNAME = [
    'assets/laptop.glb',
    'assets/3dprinter.glb',
    'assets/sla.glb',
    'assets/soldering iron.glb',
];

for(let i = 0 ; i < TOOLS_FNAME.length ; i++) {
    Model_loader.load(TOOLS_FNAME[i], (model) => {
        TOOLS_MODELS[i] = model.scene;

        TOOLS_MODELS[i].scale.set(0,0,0);
        //root.scale.set(1.2,1.2,1.2);
        TOOLS_MODELS[i].position.set(0,2,7);
        TOOLS_MODELS[i].rotation.set(0.4,0.4,0);

        scene.add(TOOLS_MODELS[i]);
        
    },  function(xload) {
    //  MAPPP_MODEL_PERCENT = xload.loaded / xload.total * 100;
    }, function(err) {
        console.log("Error While Loading...");
    }
    );

}

var tools_details = [
    [
        'Acer Aspire 7',
        'Creality Ender 3 Pro',
        'Elegoo Mars 3 Pro',
        '60W Soldering Iron'
    ],
    [
        'Laptop',
        '3D Printer',
        '3D Printer',
        'Soldering Tool'
    ],
    [
        'Lv. 100',
        'Lv. 100',
        'Lv. 98',
        'Lv. 95'
    ],
    [
        "The Aspire 7 with Ryzen 5 and RTX 3050 is a versatile laptop designed for performance and productivity. It combines AMD's Ryzen 5 processor with NVIDIA's RTX 3050 graphics card, offering solid gaming and creative capabilities. With a sleek design and a focus on affordability, it's suitable for users looking to balance work and play without breaking the bank.",
        "The Ender 3 Pro is a reliable home 3D printer with a wider Y-axis, a more dependable brand power supply, and added thermal runaway protection for safety. It boasts a print volume of 220 mm x 220 mm x 250 mm, compatibility with 1.75 mm filaments (including PLA, ABS, Wood, TPU, Gradient color, and carbon fiber), and a single 0.4 mm nozzle for precise layering. With a maximum print speed of 180 mm per second, a heated bed reaching 110°C, and connectivity via SD card or card reader, it’s a versatile workhorse for your creative projects.",
        "The Elegoo Mars 3 Pro is a resin 3D printer that combines precision and detail. It features a 6.6-inch 4K monochrome LCD screen with a resolution of 4098 x 2560 pixels. With an XY resolution of 35 microns, it delivers highly detailed prints. The Z-axis resolution of 0.00125 mm ensures exceptional layer accuracy. Anti-aliasing technology smooths edges, and the Matrix UV LED light source ensures efficient and uniform curing. In summary, it’s a gateway to quality resin printing!",
        "A soldering iron is a hand tool used in soldering. It consists of a heated metal tip (known as the bit) and an insulated handle. The tip gets really hot around 800 degrees Fahrenheit and its job is to transfer heat to things like wires, transistor leads, and pads on printed circuit boards (PCBs). Once the appropriate areas are heated properly, solder is applied, creating a permanent bond between two workpieces. Whether you’re fixing electronics, assembling DIY projects, or tinkering with connections, the trusty soldering iron is your go-to heat conductor!"
    ]
];

/*
TOOL_HEADER
TOOLS_TYPE
TOOLS_LEVEL
TOOLS_DESC
TOOLS_BTN
*/
var prev_tools_btn_state = true;

TOOLS_BTN.addEventListener('click', function() {
    // console.log(SW_MAIN.style.marginLeft);
     if(prev_tools_btn_state) {SW_MAIN.style.marginLeft = "-100%";SW_TOOLS.style.marginLeft = "0%"; TOOLS_BTN.innerHTML="Close";}
     else                     {SW_TOOLS.style.marginLeft = "-100%";SW_MAIN.style.marginLeft = "0%"; TOOLS_BTN.innerHTML="See More";}
    prev_tools_btn_state = prev_tools_btn_state ? false : true;
   
});


let tool_bug_x = 0;
let x_previous_tools = 0;

let more_tools =(x)=> {
    tool_bug_x = x
    TOOL_HEADER.innerHTML = tools_details[0][x];
    TOOLS_TYPE.innerHTML = tools_details[1][x];
    TOOLS_LEVEL.innerHTML = tools_details[2][x];
    TOOLS_DESC.innerHTML = tools_details[3][x];
    let mt_x = 1.5; 
    if(x == 99) {
       TOOLS_MODELS[x_previous_tools].scale.set(0,0,0); 
    } else {
        
        if(x == 2 || x == 3) mt_x = 0.75;
        else                 mt_x = 1.5;
        
        
        TIMELINE_RESET.to(TOOLS_MODELS[x].scale, {
            x: mt_x,
            y: mt_x,
            z: mt_x,
            duration: 0.1,
            onUpdate: function() {
                camera.lookAt(0,0,0);
            }
        });
       
        TOOLS_MODELS[x_previous_tools].scale.set(0,0,0);
        x_previous_tools = x;
    }
     //console.log(x);
}

// -- SKILLS - 
var SKILLS_DETAILS = [
    [
        " Blender 3D",
        " C Language",
        " C++ Language",
        "Bootstrap",
        " HTML",
        " CSS",
        " JavaScript",
        " Python",
        " Scilab",
        " solidworks",
        " three.js",
    ],[
        "3D CAD",
        "Programming Language",
        "Programming Language",
        "CSS Framework",
        "Mark-up Language",
        "Stylesheet Language",
        "Programming Language",
        "simulation & data analysis",
        "3D CAD",
        "JS Library",
    ], [
        "90",
        "95",
        "90",
        "85",
        "100",
        "98",
        "90",
        "85",
        "86",
        "87",
        "82"
    ], [
        "Blender 3D is a free and open-source 3D creation software used for modeling, sculpting, animation, rendering, and more. I use Blender primarily for 3D modeling figurines, which I then 3D print as part of my creative and production process.",
        "C Language is a powerful, low-level programming language known for its speed and efficiency, widely used in embedded systems and hardware-level programming. I use C primarily for programming Arduino microcontrollers in various electronics projects.",
        "C++ is a high-performance, object-oriented programming language that builds on C, offering greater flexibility and features like classes and inheritance. I use C++ for programming Arduino and other microcontrollers such as the ESP8266 and ESP32 in my embedded systems and IoT projects.",
        "Bootstrap is a popular open-source CSS framework that simplifies web design with pre-built components and responsive layouts. I use Bootstrap to streamline my CSS workflow, allowing for faster and more efficient website styling and design.",
        "HTML (HyperText Markup Language) is the standard language used to structure content on the web. I use HTML for building websites and hybrid applications, providing the foundational layout and elements for user interfaces.",
        "CSS (Cascading Style Sheets) is a stylesheet language used to control the appearance and layout of HTML elements on a web page. I use CSS for designing and styling websites, allowing me to create visually appealing and responsive user interfaces.",
        "JavaScript is a versatile, high-level programming language primarily used for adding interactivity to websites. It was the first programming language I learned, which I initially used to create simple web games. I now use JavaScript as the client-side scripting language for my websites to enhance user interaction and functionality.",
        "Python is a high-level, easy-to-read programming language known for its versatility and wide range of applications. I use Python for mathematical computations, building basic desktop applications, and programming Raspberry Pi for various electronics and automation projects.",
        "Scilab is an open-source software used for numerical computation, data analysis, and simulation, similar to MATLAB. I use Scilab for designing and analyzing electronic systems and signals, making it a valuable tool in my electronics and signal processing work.",
        "SolidWorks is a powerful 3D CAD software used for designing, modeling, and prototyping mechanical parts and assemblies. I use SolidWorks for designing and prototyping components in research projects, robotics, and other engineering applications.",
        "Three.js is a JavaScript library that makes it easy to create and display 3D graphics in web browsers using WebGL. I use Three.js for designing websites and showcasing my 3D designs interactively online.",
    ]
]


let skills_show_det = (x)=> {
    //console.log(x);
    RTD_NAME.innerHTML = SKILLS_DETAILS[0][x];
    RTD_TYPE.innerHTML = SKILLS_DETAILS[1][x];
    RTD_LEVL.innerHTML = SKILLS_DETAILS[2][x];
    RTD_DESC.innerHTML = SKILLS_DETAILS[3][x];
    skills_switch.style.marginRight = "-100%";
    RTD.style.marginRight = 0;
    

};

window.skills_show_det = skills_show_det;

var prev_skills_btn_state = true;

RTD_BTNN.addEventListener('click', function() {
    skills_switch.style.marginRight = "0";
    RTD.style.marginRight = "-100%";
    SW_SKILLS.style.marginLeft = "-100%";
    SW_MAIN.style.marginLeft = "0%";
    SKILLS_BTN.innerHTML="See More";
    prev_skills_btn_state = prev_skills_btn_state ? false : true;
    
});

let SKILL_FNAME = [
    'assets/skills/blender.glb',
   // 'assets/skills/bs.glb',
    'assets/skills/c.glb',
   // 'assets/skills/cdv.glb',
   // 'assets/skills/cpp.glb',
   // 'assets/skills/css.glb',
   // 'assets/skills/html.glb',
    'assets/skills/js.glb',
    //'assets/skills/py.glb',
    'assets/skills/scilab.glb',
    'assets/skills/sw.glb',
    //'assets/skills/threejs.glb',
];


let model_scene_SKILLS;
let MODEL_GROUP_ROT = new THREE.Group();

for(let i = 0 ; i < SKILL_FNAME.length ; i++) {
    Model_loader.load(SKILL_FNAME[i], (model) => {
        var MODEL_GROUP1 = new THREE.Group();

        model_scene_SKILLS = model.scene;

        model_scene_SKILLS.scale.set(1.2, 1.2, 1.2);

        model_scene_SKILLS.position.x = 6;
        MODEL_GROUP1.position.x = 0;

        MODEL_GROUP1.rotation.y = i*72*(Math.PI/180);
        MODEL_GROUP_ROT.rotation.x = 15*(Math.PI/180);

        MODEL_GROUP_ROT.scale.set(0, 0, 0);

        MODEL_GROUP1.add(model_scene_SKILLS);
        MODEL_GROUP_ROT.add(MODEL_GROUP1);
        scene.add(MODEL_GROUP_ROT);
    },  function(xload) {
    //  MAPPP_MODEL_PERCENT = xload.loaded / xload.total * 100;
    }, function(err) {
        console.log("Error While Loading...");
    }
    );

}



SKILLS_BTN.addEventListener('click', function() {
     //console.log(prev_skills_btn_state.style.marginLeft);
     if(prev_skills_btn_state) {SW_MAIN.style.marginLeft = "-100%";SW_SKILLS.style.marginLeft = "0%"; SKILLS_BTN.innerHTML="Close";}
     else                     {SW_SKILLS.style.marginLeft = "-100%";SW_MAIN.style.marginLeft = "0%"; SKILLS_BTN.innerHTML="See More";}
    prev_skills_btn_state = prev_skills_btn_state ? false : true;
   
});


attribute_switch.style.marginRight = "0%";


// WINDOW CONTROL SWITCH ------
let window_switch = function() {
    let window_layer = arguments[0];
    
 switch(window_layer) {
    case 0:
        selectAnimation(0);
        skills_switch_selection(0);
        more_tools(99);
        //tools_selection_switch(0);
        attribute_switch.style.marginRight = "0%";
        tools_switch.style.marginRight = "-100%";
        skills_switch.style.marginRight = "-100%";
        exp_switch.style.marginRight = "-100%";
        profile_switch.style.marginRight = "-100%";
        // OTHERS
        RTD.style.marginRight = "-100%";

    break;
    case 1:
        selectAnimation(1);
         more_tools(0);
        //tools_selection_switch(0);
        skills_switch_selection(0);
        attribute_switch.style.marginRight = "-100%";
        tools_switch.style.marginRight = "0%";
        skills_switch.style.marginRight = "-100%";
        exp_switch.style.marginRight = "-100%";
        profile_switch.style.marginRight = "-100%";
        // OTHERS
        RTD.style.marginRight = "-100%";
    break;
    case 2:
        selectAnimation(2);
        skills_switch_selection(1);
        more_tools(99);
        //tools_selection_switch(0);
        attribute_switch.style.marginRight = "-100%";
        tools_switch.style.marginRight = "-100%";
        skills_switch.style.marginRight = "0%";
        exp_switch.style.marginRight = "-100%";
        profile_switch.style.marginRight = "-100%";
        // OTHERS
        RTD.style.marginRight = "-100%";
    break;
    case 3:
        skills_switch_selection(0);
        selectAnimation(3);
        exp_zoomer(9);
        more_tools(99);
        //tools_selection_switch(0);
        //console.log(1)
        attribute_switch.style.marginRight = "-100%";
        tools_switch.style.marginRight = "-100%";
        skills_switch.style.marginRight = "-100%";
        exp_switch.style.marginRight = "0%";
        profile_switch.style.marginRight = "-100%";
        // OTHERS
        RTD.style.marginRight = "-100%";
    break;
    case 4:
        selectAnimation(4);
        skills_switch_selection(0);
        more_tools(99);
        //tools_selection_switch(0);
       // console.log(2);
        attribute_switch.style.marginRight = "-100%";
        tools_switch.style.marginRight = "-100%";
        skills_switch.style.marginRight = "-100%";
        exp_switch.style.marginRight = "-100%";
        profile_switch.style.marginRight = "0%";
        // OTHERS
        RTD.style.marginRight = "-100%";
    break;
    }
}

window.window_switch = window_switch;

let TIMELINE_RESET = gsap.timeline();

// SKILLS Selection Hidder --------- 
//MODEL_GROUP_ROT.scale.set(0, 0, 0);
var skills_switch_selection = (x)=> {
    if(x == 1) {
         TIMELINE_RESET.to(MODEL_GROUP_ROT.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.2,
                onUpdate: function() {
                    camera.lookAt(0,0,0);
                }
        });
    } else {
        TIMELINE_RESET.to(MODEL_GROUP_ROT.scale, {
                x: 0,
                y: 0,
                z: 0,
                duration: 0.2,
                onUpdate: function() {
                    camera.lookAt(0,0,0);
                }
        });
    }
}

// Character Selector Animation -------------



var selectAnimation = (selector)=> {
    var animations = [
        'breath',
        'ShowItems',
        'Pray',
        'ShowItems',
        'harmshold'
    ];
    
            
    mixer = new THREE.AnimationMixer(model_main.scene);
    const clip_animation = model_main.animations;
    clip_animation.forEach((clips)=> {
        if(clips.name == animations[selector]) {
            
            const actioner = mixer.clipAction(clips);
            
            let camera_zoom_in_out;
            
            if(selector != 0) {
                if(selector != 3) {
                    actioner.setLoop(THREE.LoopOnce);
                    actioner.clampWhenFinished = true;
                    camera_zoom_in_out = 90;
                    control.enabled = false;

                    CHAR_MAP_SWITCH(0);
                     control.minDistance = 90;
                } else {
                     control.minDistance = 0;
                    actioner.setLoop(THREE.LoopOnce);
                    actioner.clampWhenFinished = true;
                    camera_zoom_in_out = 130;
                    control.enabled = false;
                    
                    CHAR_MAP_SWITCH(1);

                }
            }
            else {
                    CHAR_MAP_SWITCH(0);
                control.enabled = true;
                camera_zoom_in_out = 130;
                actioner.setLoop(THREE.LoopRepeat);
            }


            TIMELINE_RESET.to(camera.position, {
                x: 0,
                y: 0,
                z: camera_zoom_in_out,
                duration: 0.25,
                onUpdate: function() {
                    camera.lookAt(0,0,0);
                }
            })
            
            actioner.fadeOut(0.2);
            actioner.reset();
            actioner.fadeIn(0.2);
            actioner.play();
            
        }
        
    });

    // CAMERA UPDATES
     
}

// CHARACTER AND MAP SWITCHER ----------------------
var animationGASP_smoother=(Func, xf = 0, yf = 0, zf = 0, time_len)=> {
    TIMELINE_RESET.to(Func, {
        x: xf,
        y: yf,
        z: zf,
        duration: time_len,
        onUpdate: function() {
            camera.lookAt(10,0,0);
        }
    })
}

var CHAR_MAP_SWITCH =(x)=> {
    switch(x) {
        case 0:
            if(model_main_s && model_map_s) {
                animationGASP_smoother(model_main_s.position, 0, -10, 0, 0.1);
                animationGASP_smoother( model_map_s.position, 0, 50, 0, 0.1);
                model_map_s.scale.set(0,0,0);
            }
        break;
        case 1:
            if(model_main_s && model_map_s) {
                animationGASP_smoother(model_main_s.position, 0, 50, 0, 0.1);
                animationGASP_smoother( model_map_s.position, 0, 0, 0, 0.1);
                animationGASP_smoother(model_map_s.rotation, 1.57, 0, 0, 0.25);
                model_map_s.scale.set(3.5, 3.5, 3.5);
            }
        break;
    }
}

//  EXPERIENCE ------------------------

let EXPERIENCE_DATA = [
    [
        "Jacobi iterative method Calculator",
        "Snake and Ladder Web Game",
        "Dusty (Vacuum Robot)",
        "ARDUIBOT-3: Automated Grass Cutter",
        "Hoshimi Miyabi",
        "Pole Mounted Transformer",
        "Aquaponics",
        "RatPellentCV"
    ],
    [
        "2023",
        "2022",
        "2018",
        "2024",
        "2025",
        "2023",
        "2024",
        "2024"
    ],
    [
        "The Jacobi Iterative Method Calculator was a simple project I made for our Numerical Methods subject back in college, written in pure vanilla JavaScript.",
        "The Snake and Ladder Web Game was one of my simple hardcoded games made using pure vanilla JavaScript. I created basic graphics for the game, including the snakes, board, and ladders. This project challenged me and took a few weeks to complete.",
        "It was my first project that I handled way back when I was senior high school, I was hired as a robotics programmer and design some basic electronics circuit for it, this Vacuum robot is Science Investigatory Project (S.I.P) at Dao Elementary School. and became one of the contestant in negros.",
        "This was the first project I handled back in senior high school. I was hired as a robotics programmer and also designed basic electronic circuits for it. The vacuum robot was a Science Investigatory Project (S.I.P) at Dao Elementary School and became one of the entries in a competition in Cadiz, Negros Occidental.",
        "Hoshimi Miyabi is a 5-star Agent in Zenless Zone Zero, renowned as the youngest Void Hunter in New Eridu. She is one of the characters in the game, and I created this 3D design because she is one of my favorite and strongest characters.",
        "Designed a 3D model of a pole-mounted transformer for use in laboratory activities by Electrical Technology students at Capiz State University – Main Campus.",
        "Developed both the hardware and software components of AQUAPONICS: A Hybrid Smart Hydroponics and Fish Feeder with Monitoring System, a research project created for a Doctoral Degree thesis.",
        "It is our capstone research back in our college, RatPellentCV: A Control System with Randomly Selected Ultrasonic Sound Frequency Variation (USFV) and Computer Vision, the research aims to develop a pest control system for rat management. By combining USFV technology with CV algorithms, the project seeks to create an innovative approach to repelling rats, inspired by the proven effectiveness of CV in pest monitoring."
    ],
    [
        "./assets/experience/1.png",
        "./assets/experience/2.png",
        "./assets/experience/3.png",
        "./assets/experience/4.png",
        "./assets/experience/5.png",
        "./assets/experience/6.png",
        "./assets/experience/7.png",
        "./assets/experience/8.png"
    ],
    [

    ]
]

const SW_EXP = document.getElementsByClassName("sw_experience")[0];
const SW_EXP_CLOSE = document.getElementsByClassName("swbg_close")[0];

const SWE_CD_NAMES = document.getElementsByClassName("swe_cd_names");
const SWE_CD_YEAR = document.getElementsByClassName("swe_cd_year");
const SWE_CD_DESC = document.getElementsByClassName("swe_cd_desc");

const SWE_SWE_C_SRC_A = document.getElementById("swe_img_srcA");
const SWE_SWE_C_SRC_B = document.getElementById("swe_img_srcB");

let img1 = new Image(),
    img2 = new Image();

let experience_window_samples = (x)=> {

           let dat_catcher = parseInt(x*2);

            img1 = EXPERIENCE_DATA[3][parseInt(dat_catcher)];
            img2 = EXPERIENCE_DATA[3][parseInt(dat_catcher+1)];
            //console.log(SWE_SWE_C_SRC_A.src);
            SWE_SWE_C_SRC_A.src = img1;
            SWE_SWE_C_SRC_B.src = img2;
            
            SWE_CD_NAMES[0].innerHTML = EXPERIENCE_DATA[0][parseInt(dat_catcher)];
            SWE_CD_NAMES[1].innerHTML = EXPERIENCE_DATA[0][parseInt(dat_catcher+1)];

            SWE_CD_YEAR[0].innerHTML = EXPERIENCE_DATA[1][parseInt(dat_catcher)];
            SWE_CD_YEAR[1].innerHTML = EXPERIENCE_DATA[1][parseInt(dat_catcher+1)];

            SWE_CD_DESC[0].innerHTML = EXPERIENCE_DATA[2][parseInt(dat_catcher)];
            SWE_CD_DESC[1].innerHTML = EXPERIENCE_DATA[2][parseInt(dat_catcher+1)];
}


SW_EXP_CLOSE.addEventListener('click', function() {
    SW_EXP.style.marginLeft = "-100%";
     SW_MAIN.style.marginLeft = "0%";
    animationGASP_smoother(model_map_s.position, 0, 0, 0, 0); 
    animationGASP_smoother(model_map_s.rotation, 1.57, 0, 0, 0.1); 
    animationGASP_smoother(camera.position, 0, 0, 130, 0.1);
});


var exp_zoomer = (args)=> {
    
    if(args  != 9) experience_window_samples(args);

   

    var mx = 3.5, my = 3.5, mz = 3.5;
    switch(args) {
        case 0:
            
           SW_EXP.style.marginLeft = "0%";
           SW_MAIN.style.marginLeft = "-100%";
           animationGASP_smoother(model_map_s.position, 1, 5.5, 0, 0.1); 
           animationGASP_smoother(model_map_s.rotation, 1.22, 0, 0, 0.1); 
           animationGASP_smoother(camera.position, 0, 0, 50, 0.1);
        break;
        case 1:
            SW_EXP.style.marginLeft = "0%";
             SW_MAIN.style.marginLeft = "-100%";
            animationGASP_smoother(model_map_s.position, -4.5, 2, 0, 0.1); 
            animationGASP_smoother(model_map_s.rotation, 1.22, 0, 0, 0.1); 
            animationGASP_smoother(camera.position, 0, 0, 50, 0.1);
        break;
        case 2:
            SW_EXP.style.marginLeft = "0%";
             SW_MAIN.style.marginLeft = "-100%";
            animationGASP_smoother(model_map_s.position, 5, -2, 0, 0.1); 
            animationGASP_smoother(model_map_s.rotation, 1.22, 0, 0, 0.1); 
            animationGASP_smoother(camera.position, 0, 0, 50, 0.1);    
        break;
        case 3:
            SW_EXP.style.marginLeft = "0%";
             SW_MAIN.style.marginLeft = "-100%";
            animationGASP_smoother(model_map_s.position, -2.5, -6, 0, 0.1); 
            animationGASP_smoother(model_map_s.rotation, 1.22, 0, 0, 0.1); 
            animationGASP_smoother(camera.position, 0, 0, 50, 0.1);
        break;
    }


    if(args == 9) animationGASP_smoother(camera.position, 0, 0, 130, 0.1);
    

    TIMELINE_RESET.to(model_map_s.scale, {
            x: mx,
            y: my,
            z: mz,
            duration: 0.1,
            onUpdate: function() {
                camera.lookAt(10,0,0);
            }
    })
};





window.exp_zoomer = exp_zoomer;



// OBJECT POSITION ------------------------------------------------

camera.position.z = 130;
camera.position.y = 9;

const clock = new THREE.Clock();

let jumper_anim = 0, jumper_anim_sin;

function loop() {
    if(tool_bug_x == 99) {
         TOOLS_MODELS[x_previous_tools].scale.set(0,0,0);
    }
    if(model_scene_SKILLS) {
        MODEL_GROUP_ROT.rotation.y += 0.005;
        //console.log(model_scene_SKILLS);
    }

    jumper_anim += 1;
    jumper_anim_sin = 0.3*Math.sin(jumper_anim * (Math.PI/180));


    let LOAD_STATUS = (parseFloat(HUMAN_MODEL_PERCENT) + parseFloat(MAPPP_MODEL_PERCENT)) / 2;
    LS_STATE.innerHTML = LOAD_STATUS.toFixed(2);
    if(LOAD_STATUS == 100) {
        loading_screen.style.display = "none";
    }

    
        // TOOLS_MODELS.position.y = 1+jumper_anim_sin;
    for(let i = 0; i < 4 ; i++) {
        if(TOOLS_MODELS[i]) {
          TOOLS_MODELS[i].position.y = 1.5+jumper_anim_sin;   
        }
    }

    var delta = clock.getDelta();
    if(mixer) mixer.update(delta*0.5);

    control.update();
    render.render(scene, camera);
}

var PROF_SN_STATE = true;

PROF_SN_BTN1.addEventListener('click', function() {
     //console.log(prev_skills_btn_state.style.marginLeft);
     if(PROF_SN_STATE) {SW_MAIN.style.marginLeft = "-100%";PROF_SN.style.marginLeft = "0%"; PROF_SN_BTN1.innerHTML="Close";}
     else                     {PROF_SN.style.marginLeft = "-100%";SW_MAIN.style.marginLeft = "0%"; PROF_SN_BTN1.innerHTML="See More";}
    PROF_SN_STATE = PROF_SN_STATE ? false : true;
   
});


window.more_tools = more_tools;
document.getElementsByClassName("consoler")[0].innerHTML = win_size.width + " X " + win_size.height;


