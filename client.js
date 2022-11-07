/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />

import * as alt from 'alt-client';
import * as native from 'natives';

alt.on("gameEntityCreate", (entity) => {
    if(entity.hasStreamSyncedMeta("isTowingPl")) {
        let player = entity;
        let veh = entity.getStreamSyncedMeta("veh");

        let rope = native.addRope(player.pos.x, player.pos.y, player.pos.z, 0, 0, 0, 5, 3, 5, 1, 1, false, false, false, 5, false, null);

        let vehBone = native.getWorldPositionOfEntityBone(veh, native.getEntityBoneIndexByName(veh, "brakelight_l"));

        native.activatePhysics(rope);
        native.ropeLoadTextures();
        native.attachEntitiesToRope(rope, player, veh, player.pos.x, player.pos.y, player.pos.z, vehBone.x, vehBone.y, vehBone.z, 5, false, false, null, null);

        alt.LocalStorage.set("playerRope", rope);
    }
    if(entity.hasStreamSyncedMeta("isTowing")) {
        let veh2 = entity;
        let veh1 = entity.getStreamSyncedMeta("veh");

        let rope = native.addRope(veh2.pos.x, veh2.pos.y, veh2.pos.z, 0, 0, 0, 5, 3, 5, 1, 1, false, false, false, 5, false, null);

        let vehBone = native.getWorldPositionOfEntityBone(veh1, native.getEntityBoneIndexByName(veh1, "headlight_l"));

        let vehBone2 = native.getWorldPositionOfEntityBone(veh2, native.getEntityBoneIndexByName(veh2, "brakelight_l"));

        native.activatePhysics(rope);
        native.ropeLoadTextures();
        native.attachEntitiesToRope(rope, veh1, veh2, vehBone.x, vehBone.y, vehBone.z, vehBone2.x, vehBone2.y, vehBone2.z, 5, false, false, null, null);

        alt.LocalStorage.set(veh2, rope);

    }
});

alt.on("streamSyncedMetaChange", (entity, key, newValue, oldValue) => {
    
    if(key === "isTowingPl") {
        let player = entity;
        if(newValue) {
            let veh = entity.getStreamSyncedMeta("veh");

            const textEntry = `TEXT_ENTRY_${(Math.random() * 1000).toFixed(0)}`;
             alt.addGxtText(textEntry, veh);
  
                native.beginTextCommandThefeedPost('STRING');
             native.addTextComponentSubstringTextLabel(textEntry);
            native.endTextCommandThefeedPostTicker(false, false);

            let rope = native.addRope(player.pos.x, player.pos.y, player.pos.z, 0, 0, 0, 5, 3, 5, 1, 1, false, false, false, 5, false, null);

            let vehBone = native.getWorldPositionOfEntityBone(veh, native.getEntityBoneIndexByName(veh, "brakelight_l"));

            native.activatePhysics(rope);
            native.ropeLoadTextures();
            native.attachEntitiesToRope(rope, player, veh, player.pos.x, player.pos.y, player.pos.z, vehBone.x, vehBone.y, vehBone.z, 5, false, false, null, null);
    
            alt.LocalStorage.set("playerRope", rope);
        }
        else
        {
            let ropeId = alt.LocalStorage.get("playerRope");
            let veh = player.getStreamSyncedMeta("veh");
            native.detachRopeFromEntity(ropeId, player);
            native.detachRopeFromEntity(ropeId, veh);
            native.ropeUnloadTextures(ropeId);
            native.deleteRope(ropeId);
            alt.LocalStorage.delete("playerRope");
        }
        
    }
    if(key === "isTowing") {
        if(newValue)
        {
            let veh2 = entity;
            let veh1 = entity.getStreamSyncedMeta("veh");
            let rope = native.addRope(veh2.pos.x, veh2.pos.y, veh2.pos.z, 0, 0, 0, 5, 3, 5, 1, 1, false, false, false, 5, false, null);
    
            let vehBone = native.getWorldPositionOfEntityBone(veh1, native.getEntityBoneIndexByName(veh1, "headlight_l"));
    
            let vehBone2 = native.getWorldPositionOfEntityBone(veh2, native.getEntityBoneIndexByName(veh2, "brakelight_l"));
    
            native.activatePhysics(rope);
            native.ropeLoadTextures();
            native.attachEntitiesToRope(rope, veh1, veh2, vehBone.x, vehBone.y, vehBone.z, vehBone2.x, vehBone2.y, vehBone2.z, 5, false, false, null, null);

            alt.LocalStorage.set(veh2, rope);
        }
        else if(newValue!=oldValue)
        {
            let veh2 = entity;
            let veh1 = entity.getStreamSyncedMeta("veh");
            let rope = alt.LocalStorage.get(veh2);
            native.detachRopeFromEntity(rope, veh1);
            native.detachRopeFromEntity(rope, veh2);
            native.ropeUnloadTextures(rope);
            native.deleteRope(rope);
            alt.LocalStorage.delete(veh2);
        }
        
    }
});


alt.onServer("attachRope", (player, vehicle) => {
    let veh = vehicle;

    let vehBone = native.getWorldPositionOfEntityBone(veh, native.getEntityBoneIndexByName(veh, "brakelight_l"));
    
    let rope = native.addRope(veh.pos.x, veh.pos.y, veh.pos.z, 0, 0, 0, 5, 3, 5, 1, 1, false, false, false, 5, false, null);
    
    native.activatePhysics(rope);
    native.ropeLoadTextures();
    native.attachEntitiesToRope(rope, player, vehicle, player.pos.x, player.pos.y, player.pos.z, vehBone.x, vehBone.y, vehBone.z, 5, false, false, null, null);

    const data = {
                 "Player": player,
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
                 "Player": player,
                 "Rope": ropeId,
                 "Veh1": veh1,
                 "Veh2": veh2
    };
    
    alt.emitServer("secondTow", data);
})

alt.onServer("untowPlayer", (player, ropeId, veh) => {

    native.detachRopeFromEntity(ropeId, player);
    native.detachRopeFromEntity(ropeId, veh);
    native.ropeUnloadTextures(ropeId);
    native.deleteRope(ropeId);

    const data = {
        "Player": player,
        "Veh": veh
    }
    
    alt.emitServer("untowPlayer", data);
})

alt.onServer("untowCar", (player, veh1, veh2, rope) => {

    native.detachRopeFromEntity(rope, veh1);
    native.detachRopeFromEntity(rope, veh2);
    native.ropeUnloadTextures(rope);
    native.deleteRope(rope);

    const data = {
        "Player": player,
        "Veh1": veh1,
        "Veh2": veh2
    }
    
    alt.emitServer("untowCar", data);
})