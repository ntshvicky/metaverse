// import classes
import Movements from "./movements.js";
import blockchain from "./Web3.js"
import abi from "./abi/abi.json" assert { type: "json" };

import * as THREE from "three";
import { OrbitControls, MapControls } from "../controls/OrbitControls.js";
import { SMART_CONTRACT } from "./contract.js";
import { VRButton } from './VRButton.js';


// Declaration of a new scene with Three.js
const scene = new THREE.Scene();

//Chnage background of scene
scene.background = new THREE.Color(0xbfd1e5)

//render camera in scene
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// VR element rendering
document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;


// Orbit controls
let controls = new OrbitControls(camera, renderer.domElement);


// add light in scene 
const ambient_light = new THREE.AmbientLight(0xbda355);
const direction_light = new THREE.DirectionalLight(0xffffff, 2);
//fit light in scene
ambient_light.add(direction_light);
scene.add(ambient_light)


// creating flat space in metaverse
const geometry_space = new THREE.BoxGeometry(100,0.2,50);
//add material
const material_space = new THREE.MeshPhongMaterial( { color: 0xffffff } );
const space = new THREE.Mesh( geometry_space, material_space );
scene.add( space );

// === Geometric position in metaverse #Cube === //
//create cube shape
const geometry_cube = new THREE.BoxGeometry();
//add material in shape
const material_cube = new THREE.MeshPhongMaterial( { color: 0xdd3333 } );
//add mesh in cube
const cube = new THREE.Mesh( geometry_cube, material_cube );
cube.position.set(10,5,0);
scene.add( cube );
//set camera position
//camera.position.z = 5;


// === Geometric position in metaverse #Cone === //
const geometry_cone = new THREE.ConeGeometry(5,20,32);
const material_cone = new THREE.MeshPhongMaterial( { color: 0xed810a } );
const cone = new THREE.Mesh( geometry_cone, material_cone );
cone.position.set(-10,5,0);
scene.add( cone );

// === Geometric position in metaverse #Cone === //
const geometry_cylinder = new THREE.CylinderGeometry(5,5,5,32);
const material_cylinder = new THREE.MeshPhongMaterial( { color: 0x0000ff } );
const cylinder = new THREE.Mesh( geometry_cylinder, material_cylinder );
cylinder.position.set(20,5,0);
scene.add( cylinder );

window.addEventListener('resize', onWindowResize);

//this need to see flat space from camera
camera.position.set(10,5,40);

// set animate loop for VR 
function animate(){
    renderer.setAnimationLoop(render);
}

function render() {
    cube.rotation.x += 0.05;
    cube.rotation.y += 0.05;

    cone.rotation.x += 0.01;
    cone.rotation.y += 0.01;

    cylinder.rotation.x += 0.05;

    requestAnimationFrame(animate);
    controls.update();
    // Movement to the left
    if (Movements.isPressed(37)) {
        camera.position.x -= 0.5;
    }
    // Upward movement
    if (Movements.isPressed(38)) {
        camera.position.x += 0.5;
        camera.position.y += 0.5;
    }
    // Movement to the right
    if (Movements.isPressed(39)) {
        camera.position.x += 0.5;
    }
    // Downward movement
    if (Movements.isPressed(40)) {
        camera.position.x -= 0.5;
        camera.position.y -= 0.5;
    }

    camera.lookAt(space.position);
    renderer.render(scene, camera);
}
animate();

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

//create new NFT in blockchain
const btnMint = document.getElementById("mint");
btnMint.addEventListener('click', mintNFT);

function mintNFT() {
    var nft_name = document.getElementById("nft_name").value;
    var nft_width = document.getElementById("nft_width").value;
    var nft_height = document.getElementById("nft_height").value;
    var nft_depth = document.getElementById("nft_depth").value;
    var nft_x = document.getElementById("nft_x").value;
    var nft_y = document.getElementById("nft_y").value;
    var nft_z = document.getElementById("nft_z").value;

    // check if metamask is available
    if(typeof window.ethereum == "undefined") {
        rej("You should install Metamask to use it!");
    }

    //create web3 instance
    let web3 = new Web3(window.ethereum);
    let contract = new web3.eth.Contract(abi, SMART_CONTRACT);

    web3.eth.requestAccounts().then((account)=> {

        //get my metamask address
        console.log("-> My account is: ", account);

        document.getElementById("mint").innerHTML = "<i class='fa fa-spinner fa-spin'></i> Wait! Creating property in Metverse"
        document.getElementById("mint").disabled = true;
        //get the current supply from contract
        contract.methods.mint(nft_name, nft_width, nft_height, nft_depth, nft_x, nft_y, nft_z).send({from: account[0], value: 1000000000000000}).then((supply)=> {
            alert("-> New NFT created in Metaverse");
            location.reload()
        });

    });

}

//web3 connection to data minted on blockchain and graphical representation
blockchain.then((result)=> {
    result.building.forEach((building, index) => {
        if(index <= result.supply) {
            // represent NFT as box in scene
            const boxGeometry = new THREE.BoxGeometry(building.w, building.h, building.d);
            const boxMaterial = new THREE.MeshPhongMaterial({color: 0x33fffc});
            const nft = new THREE.Mesh(boxGeometry, boxMaterial);
            nft.position.set(building.x, building.y, building.z);
            scene.add(nft);
        }
    });
})
