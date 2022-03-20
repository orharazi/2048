import React, {useState, useEffect} from 'react'
import './App.css';
import { Col, Container, Row } from 'react-bootstrap';

function App() {
  const size = 4
  const [loading, setLoading] = useState(true)
  const [stateBoard, setBoard] = useState([])

  //run every change at board
  useEffect(() => {
    if (stateBoard.length === 0) {
      createBoard()
    } else {
      setLoading(false)
    }
  }, [stateBoard])

  //get random numbers
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let random1 = Math.floor(Math.random() * (max - min) + min)
    let random2 = Math.floor(Math.random() * (max - min) + min)
    return [random1, random2]
  }

  //insert numbers to board
  const insertNumbers = (newBoard) => {
    const numIdx = getRandomInt(0, size)
    if (newBoard[numIdx[0]][numIdx[1]] === 0) {
      newBoard[numIdx[0]][numIdx[1]] = 2
      setBoard(newBoard)
    } else {
      //if this column as value - try another one
      insertNumbers(newBoard)
    }
  }

  //create board at first run
  const createBoard = () => {
    const board = []
    for (let i = 0; i < size; i++) {
      let row = []
      for (let j = 0; j < size; j++) {
        row.push(0)
      }
      board.push(row)
    }
    for (let i = 0; i < 2; i++) {
      insertNumbers(board)
    }
  }

  //change board by click at arrows
  const changeBoard = (key) => {
    //copy board and define 'values' to insert current values in board
    let newBoard = [...stateBoard]
    let values = {}

    //change board by values
    const changeBoardIndex = (value, rowIdx, colIdx) => {
      newBoard[rowIdx][colIdx] = value
    }

    // get all values from current board
    stateBoard.forEach((row, rowIdx) => {
      row.forEach((col, colIdx) => {
        let oneIdx = key === "up" || key === "down" ? colIdx : rowIdx
        let secondIdx = key === "up" || key === "down" ? rowIdx : colIdx
        if (col !== 0) {
          let obj = {}
          obj[secondIdx] = col
          if (values[oneIdx] !== undefined) {
            values[oneIdx] = [...values[oneIdx], obj]
          } else {
            values[oneIdx] = [obj]
          }
        }
      })
    })

    //change values in board by keys
    Object.entries(values).forEach(valueInObject => {
      let rowIdx = (key === "up" || key === "down") ? ((key === "down") ? size -1 : 0) : valueInObject[0]
      let oneValues = valueInObject[1]
      let colIdx = key === "up" || key === "down" ? valueInObject[0] : key === "right" ? size -1 : 0
      let totalValue
      
      //change values to 0
      Object.values(oneValues).forEach((value) => {
        if (key === "up" || key === "down") {
          changeBoardIndex(0, Object.keys(value)[0], colIdx)
        } else {
          changeBoardIndex(0, rowIdx, Object.keys(value)[0])
        }
      })
      
      //calc value and change in board
      totalValue = Object.values(oneValues).reduce((total, nextVal) => {
        return total+Object.values(nextVal)[0]
      }, 0)
      
      changeBoardIndex(totalValue, rowIdx, colIdx)
    })
    insertNumbers(newBoard)
    setLoading(true)
  }


  function checkKey(e) {
    let keyCode = e.keyCode
    switch (keyCode) {
      case 37:
        changeBoard("left")
        break;
      case 38:
        changeBoard("up")
        break; 
      case 39:
        changeBoard("right")
        break; 
      case 40:
        changeBoard("down")
        break; 
      default:
        break;
    }
  }


  return (
    <div className="App" onKeyDown={(e) => checkKey(e)} tabIndex="0">
      {loading ? <h1>loading...</h1> :
        <Container>
          {stateBoard.map((row, rowIdx) => {
            return (
              <Row key={rowIdx}>
              {row.map((col, colIdx) => {
                return <Col key={colIdx}><h1>{col}</h1></Col>
              })}
            </Row>
            )
          })}
        </Container>
      }
    </div>
  );
}

export default App;
