import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useSnapshot } from "valtio";

import state from "../store";

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);

  useFrame((state, delta) => {
    const isBreakPoint = window.innerWidth <= 1280;
    const isMobileWidth = window.innerWidth <= 768;

    //set the initial state of the model object
    let targetPosition = [-0.4, 0, 2];

    if (snap.intro) {
      if (isBreakPoint) {
        targetPosition = [0, 0, 2];
      }
      if (isMobileWidth) {
        targetPosition = [0, 0.2, 2.5];
      }
    } else {
      //else here means we are on customizer page.
      if (isMobileWidth) {
        targetPosition = [0, 0, 2.5];
      } else {
        targetPosition = [0, 0, 2];
      }
    }

    //set modal camera position
    easing.damp3(state.camera.position, targetPosition, 0.25, delta);

    //set the modal rotation smoothly
    easing.dampE(
      group.current.rotation,
      [-state.pointer.y / 8, state.pointer.x / 8, 0],
      0.25,
      delta
    );
  });
  return <group ref={group}>{children}</group>;
};

export default CameraRig;
