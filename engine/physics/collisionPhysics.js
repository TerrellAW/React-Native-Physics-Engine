import { Dimensions, Platform } from "react-native";

// Configuration files
import physicsConfig from "../config/physicsConfig";

// Screen dimensions
export const screenWidth = Dimensions.get("window").width;
export const screenHeight = Dimensions.get("window").height;

// Floor height
export const floorHeight = 100;

// Environment collision boxes
export const collisionBoxes = [
  {
    // Floor
    type: "floor",
    width: screenWidth,
    height: floorHeight,
    x: 0,
	y: screenHeight - (floorHeight + 5),
  },
  {
    // Ceiling
    type: "ceiling",
    width: screenWidth,
    height: 1,
    x: 0,
	y: -5,
  },
  {
    // Left wall
    type: "leftWall",
    width: 1,
    height: screenHeight,
    x: 0,
    y: 0,
  },
  {
    // Right wall
    type: "rightWall",
    width: 1,
    height: screenHeight,
    x: screenWidth - 1,
    y: 0,
  },
  {
    // Platform top
    type: "floor",
    width: screenWidth / 4 + 2, // 2 pixel off the platform
    height: 1,
    x: screenWidth - screenWidth / 4 - 2, // 2 pixel off the platform
    y: screenHeight - 430,
  },
  {
    // Platform bottom
    type: "ceiling",
    width: screenWidth / 4 + 2, // 2 pixel off the platform
    height: 1,
    x: screenWidth - screenWidth / 4 - 2, // 2 pixel off the platform
    y: screenHeight - 430 + floorHeight / 4 + 8,
  },
];

// Collision handler
export const handleCollision = (
  box,
  velocityXRef,
  velocityYRef,
  positionYRef,
  playerBox
) => {
  // Bounce multiplier (Default: 0.2, means 20% of velocity goes into bounce)
  const bounceFactor = physicsConfig.bounceFactor;

  switch (box.type) {
    // Calculate bounce based on collision type
    case "floor":
      // Bounce vertically off floor
      if (velocityYRef.current > 0) {
        if (Math.abs(velocityYRef.current) < 1) {
          velocityYRef.current = 0;
          positionYRef.setValue(box.y - playerBox.height);
        } else {
          velocityYRef.current = -velocityYRef.current * bounceFactor; // Reverse vertical velocity and reduce by bounce factor
        }
        // Slipperiness
        velocityXRef.current *= 0.9; // The closer to 1, the more slippery
      }
      break;

    case "ceiling":
      // Bounce vertically off ceiling
      if (velocityYRef.current < 0) {
        velocityYRef.current = -velocityYRef.current * bounceFactor; // Reverse vertical velocity and reduce by bounce factor
      }
      break;

    case "leftWall":
      if (velocityXRef.current < 0) {
        velocityXRef.current = -velocityXRef.current;
      }
      break;

    case "rightWall":
      if (velocityXRef.current > 0) {
        velocityXRef.current = -velocityXRef.current;
      }
      break;
  }
};
