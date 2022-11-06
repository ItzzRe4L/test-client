/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />

import * as alt from 'alt-client';
import * as native from 'natives';

alt.onServer("attachRope", (player, vehicle) => {
    let veh = vehicle;

    let vehBone = native.getWorldPositionOfEntityBone(veh, native.getEntityBoneIndexByName(veh, "brakelight_l"));
    
    let rope = native.addRope(veh.pos.x, veh.pos.y, veh.pos.z, 0, 0, 0, 5, 3, 5, 1, 1, false, false, false, 5, false, null);
    
    native.activatePhysics(rope);
    native.ropeLoadTextures();
    native.attachEntitiesToRope(rope, player, vehicle, player.pos.x, player.pos.y, player.pos.z, vehBone.x, vehBone.y, vehBone.z, 5, false, false, null, null);

    const data = {
                 "Rope": rope,
                 "Veh": vehicle
    };
    
    alt.emitServer("firstTow", data);
})

alt.onServer("attachRopeCar", (player, veh1, veh2, ropeId) => {

    let vehBone = native.getWorldPositionOfEntityBone(veh1, native.getEntityBoneIndexByName(veh1, "headlight_l"));

    let vehBone2 = native.getWorldPositionOfEntityBone(veh2, native.getEntityBoneIndexByName(veh2, "brakelight_l"));

    native.detachRopeFromEntity(ropeId, player);

    native.attachEntitiesToRope(ropeId, veh1, veh2, vehBone.x, vehBone.y, vehBone.z, vehBone2.x, vehBone2.y, vehBone2.z, 5, false, false, null, null);
    native.setVehicleBrake(veh1, false);

    const data = {
                 "Rope": ropeId,
                 "Veh1": veh1,
                 "Veh2": veh2
    };
    
    alt.emitServer("secondTow", data);
})