import { useState, useEffect, useRef } from "react"
import styled from "styled-components"

const boardSize = 19

const GobangTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem auto;
`
const Square = styled.div`
  display: table-cell;
  border: 1px solid ${(props) => props.frameColor || "black"};
  height: 1.5rem;
  width: 1.5rem;
`
const BoardFrame = styled.div`
  min-width: ${boardSize * 1.5}rem;
  min-height: ${boardSize * 1.5}rem;
  margin: 1rem;
  position: relative;
  z-index: 1;
  background: #ccad3317;
`
const FakeBoardFrame = styled.div`
  min-width: ${(boardSize - 1) * 1.5}rem;
  min-height: ${(boardSize - 1) * 1.5}rem;
  margin: 1.75rem;
  position: absolute;
`

const emptyArray = []
for (let i = 0; i < boardSize; i++) {
  emptyArray.push(i)
}
const fakeEmptyArray = []
for (let i = 0; i < boardSize - 1; i++) {
  fakeEmptyArray.push(i)
}

const blackStoneIcon = `🌑`
const whiteStoneIcon = `☀️`

const BlackStone = () => {
  return <div>{blackStoneIcon}</div>
}

const WhiteStone = () => {
  return <div>{whiteStoneIcon}</div>
}
const FakeRow = () => {
  return (
    <div>
      {fakeEmptyArray.map(() => (
        <Square />
      ))}
    </div>
  )
}
const FakeBoard = () => {
  return (
    <FakeBoardFrame>
      {fakeEmptyArray.map(() => (
        <FakeRow />
      ))}
    </FakeBoardFrame>
  )
}

const Row = ({ indexOfY, onHandleOnclick, gobang }) => {
  return (
    <div>
      {emptyArray.map((indexOfX) => (
        <Square
          key={indexOfX}
          coordinate={{ indexOfX, indexOfY }}
          onClick={() => {
            onHandleOnclick(indexOfX, indexOfY)
          }}
          frameColor="transparent"
        >
          {gobang.map((stone) => {
            return (
              stone.x === indexOfX &&
              stone.y === indexOfY &&
              (stone.blackStone ? <BlackStone /> : <WhiteStone />)
            )
          })}
        </Square>
      ))}
    </div>
  )
}

const Board = ({ onHandleOnclick, gobang }) => {
  return (
    <BoardFrame>
      {emptyArray.map((index) => (
        <Row
          key={index}
          indexOfY={index}
          onHandleOnclick={onHandleOnclick}
          gobang={gobang}
        />
      ))}
    </BoardFrame>
  )
}

const countStones = (
  currentStone,
  gobang,
  line,
  [direction, horizontal],
  diagonal
) => {
  let border = direction > 0 ? boardSize - 1 : 0
  const pointOnAxis = horizontal ? currentStone.x : currentStone.y
  const pointOnAltAxis = horizontal ? currentStone.y : currentStone.x
  const borderCond =
    direction > 0
      ? pointOnAxis + 4 * direction <= border
      : pointOnAxis + 4 * direction >= border

  const jLimit = borderCond ? 5 * direction : border - pointOnAxis * direction
  for (
    let j = direction;
    direction > 0 ? j < jLimit : j > jLimit;
    j += direction
  ) {
    let targetPoint = pointOnAxis + j
    let targetAltPoint = pointOnAltAxis
    if (diagonal) {
      targetAltPoint = pointOnAltAxis + j
      if (!horizontal) {
        targetAltPoint = pointOnAltAxis - j
        targetPoint = pointOnAxis + j
      }
    }
    if (
      gobang.filter(
        (stone) =>
          stone.blackStone === currentStone.blackStone &&
          (horizontal ? stone.y : stone.x) === targetAltPoint &&
          (horizontal ? stone.x : stone.y) === targetPoint
      ).length >= 1
    ) {
      line++
      if (line >= 5) {
        return line++
      }
    } else {
      return line
    }
  }
  return line
}

function App() {
  const [gobang, setGobang] = useState([])
  const currentStone = useRef({})
  const [BlackIsnNext, setBlackIsNext] = useState(true)

  const handleOnClick = (x, y) => {
    if (gobang.filter((stone) => stone.x === x && stone.y === y).length > 0) {
      return
    }
    setGobang([{ blackStone: BlackIsnNext, x, y }, ...gobang])
    currentStone.current = { blackStone: BlackIsnNext, x, y }
    setBlackIsNext(!BlackIsnNext)
  }

  useEffect(() => {
    let [line0, line45, line90, line135] = [1, 1, 1, 1]
    const checkWin = (lineLeft, lineRight) => {
      if (lineLeft + lineRight > 5) {
        alert(
          `${
            currentStone.current.blackStone ? blackStoneIcon : whiteStoneIcon
          } win!
按確定後重新開始`
        )
        setGobang([])
      }
    }
    checkWin(
      countStones(currentStone.current, gobang, line0, [1, true], false),
      countStones(currentStone.current, gobang, line0, [-1, true], false)
    )
    checkWin(
      countStones(currentStone.current, gobang, line90, [1, false], false),
      countStones(currentStone.current, gobang, line90, [-1, false], false)
    )
    checkWin(
      countStones(currentStone.current, gobang, line135, [1, true], true),
      countStones(currentStone.current, gobang, line135, [-1, true], true)
    )
    checkWin(
      countStones(currentStone.current, gobang, line45, [1, false], true),
      countStones(currentStone.current, gobang, line45, [-1, false], true)
    )
    ;[currentStone.current.x, currentStone.current.y] = [0, 0]
  })
  return (
    <div>
      <GobangTitle>
        <h1>五子棋</h1>
        <h3>
          {blackStoneIcon} vs {whiteStoneIcon}
        </h3>
        <div>
          {currentStone.current.blackStone ? whiteStoneIcon : blackStoneIcon}{" "}
          的回合
        </div>
      </GobangTitle>
      <Wrapper>
        <Board onHandleOnclick={handleOnClick} gobang={gobang} />
        <FakeBoard />
      </Wrapper>
    </div>
  )
}

export default App
