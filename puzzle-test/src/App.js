"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

// Minimal puzzle: 2 squares that cannot overlap or leave the board.
export default function NoOverlapPuzzle() {
  const BOARD_WIDTH = 800;
  const BOARD_HEIGHT = 600;
  const PIECE_SIZE = 150;

  // Left piece: position + last valid position
  const [leftPos, setLeftPos] = useState({ x: 50, y: 225 });
  const [lastLeftPos, setLastLeftPos] = useState({ x: 50, y: 225 });

  // Right piece: position + last valid position
  const [rightPos, setRightPos] = useState({ x: 600, y: 225 });
  const [lastRightPos, setLastRightPos] = useState({ x: 600, y: 225 });

  // Basic bounding-box overlap check for squares
  function boundingBoxOverlap(ax: number, ay: number, bx: number, by: number) {
    return (
      ax < bx + PIECE_SIZE &&
      ax + PIECE_SIZE > bx &&
      ay < by + PIECE_SIZE &&
      ay + PIECE_SIZE > by
    );
  }

  // Clamp position so the square stays within the board
  function clamp(x: number, y: number) {
    const clampedX = Math.max(0, Math.min(x, BOARD_WIDTH - PIECE_SIZE));
    const clampedY = Math.max(0, Math.min(y, BOARD_HEIGHT - PIECE_SIZE));
    return { x: clampedX, y: clampedY };
  }

  // On every drag for the left piece, check new position + overlap
  const handleDragLeft = (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: { delta: { x: number; y: number } }
  ) => {
    // Potential new position
    const newX = leftPos.x + info.delta.x;
    const newY = leftPos.y + info.delta.y;
    // Clamp to board
    const { x: clampedX, y: clampedY } = clamp(newX, newY);

    // Check if it would overlap with the right piece
    if (
      boundingBoxOverlap(
        clampedX,
        clampedY,
        rightPos.x,
        rightPos.y
      )
    ) {
      // Overlap => revert to last valid position
      setLeftPos(lastLeftPos);
    } else {
      // No overlap => accept the new position, update last valid
      setLeftPos({ x: clampedX, y: clampedY });
      setLastLeftPos({ x: clampedX, y: clampedY });
    }
  };

  // On every drag for the right piece, check new position + overlap
  const handleDragRight = (
    e: MouseEvent | TouchEvent | PointerEvent,
    info: { delta: { x: number; y: number } }
  ) => {
    const newX = rightPos.x + info.delta.x;
    const newY = rightPos.y + info.delta.y;
    const { x: clampedX, y: clampedY } = clamp(newX, newY);

    if (
      boundingBoxOverlap(
        leftPos.x,
        leftPos.y,
        clampedX,
        clampedY
      )
    ) {
      // Overlap => revert
      setRightPos(lastRightPos);
    } else {
      // No overlap => accept
      setRightPos({ x: clampedX, y: clampedY });
      setLastRightPos({ x: clampedX, y: clampedY });
    }
  };

  return (
    <div
      style={{
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        position: "relative",
        border: "2px solid #333",
        overflow: "hidden",
        margin: "0 auto",
      }}
    >
      {/* Left Square */}
      <motion.div
        style={{
          position: "absolute",
          left: leftPos.x,
          top: leftPos.y,
          width: PIECE_SIZE,
          height: PIECE_SIZE,
          backgroundColor: "skyblue",
          border: "2px solid blue",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          zIndex: 2, // left on top
          cursor: "grab",
        }}
        drag
        // Instead of onDragEnd, we use onDrag to continuously track movement
        onDrag={handleDragLeft}
        // Constrain so the user can't fling it outside
        dragConstraints={{
          left: 0,
          top: 0,
          right: BOARD_WIDTH - PIECE_SIZE,
          bottom: BOARD_HEIGHT - PIECE_SIZE,
        }}
      >
        Left
      </motion.div>

      {/* Right Square */}
      <motion.div
        style={{
          position: "absolute",
          left: rightPos.x,
          top: rightPos.y,
          width: PIECE_SIZE,
          height: PIECE_SIZE,
          backgroundColor: "lightgreen",
          border: "2px solid green",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          userSelect: "none",
          zIndex: 1,
          cursor: "grab",
        }}
        drag
        onDrag={handleDragRight}
        dragConstraints={{
          left: 0,
          top: 0,
          right: BOARD_WIDTH - PIECE_SIZE,
          bottom: BOARD_HEIGHT - PIECE_SIZE,
        }}
      >
        Right
      </motion.div>
    </div>
  );
}
