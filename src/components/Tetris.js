import React, { useState } from 'react'
import { createStage, checkCollision } from '../gameHelpers'

import {StyledTetrisWrapper, StyledTetris} from './styles/StyledTetris'

import { useInterval } from '../hooks/useInterval'
import { usePlayer } from '../hooks/usePlayer'
import { useStage } from '../hooks/useStage'
import { useGameStatus } from '../hooks/useGameStatus'

import Stage from './Stage'
import Display from './Display'
import StartButton from './StartButton'

const Tetris = () => {
  const [dropTime, setDropTime] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer()
  const [stage, setStage, rowsCleared] = useStage(player, resetPlayer)
  const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared)

  //console.log('re-render')

  const startGame = () => {
    // Reset everything
    setStage(createStage())
    //console.log("interval on", 1000)
    setDropTime(1000)
    resetPlayer()
    setGameOver(false)
    setScore(0)
    setRows(0)
    setLevel(0)
  }
  
  const move = (e) => {
    e.preventDefault()

    if (!gameOver) {
      // Left Arrow
      if (e.keyCode === 37) {
        movePlayer(-1)

      // Right Arrow
      } else if (e.keyCode === 39) {
        movePlayer(1)

      // Down Arrow
      } else if (e.keyCode === 40) {
        dropPlayer()

      // Up Arrow
      } else if (e.keyCode === 38) {
        playerRotate(stage, 1)

      // Spacebar
      } else if (e.keyCode === 32) {
        playerRotate(stage, -1)

      
      } else {
        console.log(e.keyCode)
      }
    }
  }
  
  const movePlayer = dir => {
    if(!checkCollision(player, stage, {x: dir, y: 0})) {
      updatePlayerPos({ x: dir, y: 0 })
    }
  }
  
  const drop = () => {
    // Increase level when player has cleared 10 rows
    if (rows > (level + 1) * 10) {
      setLevel(prev => prev + 1)

      const time = 1000 / (level + 1) //* 200
      // Also increase speed
      //console.log("interval on", time)
      setDropTime(time)
    }
    if (!checkCollision(player, stage, {x: 0, y: 1})) {
      updatePlayerPos({ x: 0, y: 1, collided: false})
    } else {
      // Game Over
      if (player.pos.y < 1) {
        console.log("Game Over!")
        setGameOver(true)
        //console.log("interval off")
        setDropTime(null)
      }
      updatePlayerPos({x: 0, y: 0, collided: true})
    }
  }

  const keyUp = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 40) {
        const time = 1000 / (level + 1) //* 200
        //console.log("interval on", time)
        setDropTime(time)
      }
    }
  }

  const dropPlayer = () => {
    //console.log("interval off")
    setDropTime(null)
    drop()
  }

  useInterval(() => {
    drop()
  }, dropTime)
    
  return (
    <StyledTetrisWrapper
      role="button"
      tabIndex="0"
      onKeyDown={e => move(e)}
      onKeyUp={keyUp}
    >
      <StyledTetris>
        <Stage stage={stage}/>
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text="Game Over" />
          ) : (
            <div>
              <Display text={`Score: ${score}`} />
              <Display text={`Rows: ${rows}`} />
              <Display text={`Level: ${level}`} />
            </div>
          )}
          <StartButton callBack={startGame}/>
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  )
}

export default Tetris