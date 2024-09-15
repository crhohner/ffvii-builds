/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Mesh, Object3D } from "three";
import { useFrame } from "@react-three/fiber";

function isMeshType(object?: Object3D): object is Mesh {
  return object?.type === "Mesh";
}

export function Model(props: any) {
  const { nodes, materials } = useGLTF("/savepoint.glb");
  if (isMeshType(nodes.point)) {
    const myMesh = React.useRef<any>();
    useFrame(({ clock }) => {
      myMesh.current.rotation.y = clock.getElapsedTime();
    });
    return (
      <group {...props} dispose={null}>
        <mesh
          ref={myMesh}
          geometry={nodes.point.geometry}
          material={materials.main}
          position={[0, -3, 0]}
          rotation={[0, Math.PI / 4, 0]}
          scale={[0.784 * 1.5, 0.913 * 1.5, 0.784 * 1.5]}
        />
      </group>
    );
  }
}

useGLTF.preload("/savepoint.glb");