import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { shuffle } from "lodash";
import Task  from './Task';


const Column = ( colIndex ) => {

    const dispatch= useDispatch()
    const boards = useSelector((state) => state.boards)
    const board = boards.find((board) => board.isActive === true)
    const col= board.columns.find((col, i) => i === colIndex) 



  return (
    <div className='column'>
        

        {col.tasks.map((task, index) => (
        <Task key={index} taskIndex={index} colIndex={colIndex} />
      ))}
      
    </div>
  )
}

export default Column;
