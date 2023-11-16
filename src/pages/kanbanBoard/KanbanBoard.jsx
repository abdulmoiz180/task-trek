import {PlusOutlined, DeleteOutlined} from "@ant-design/icons";
import {Button} from 'antd';
import { useState } from "react";
import "./kanbanBoard.css";
import Column from "./Column";

const KanbanBoard = () =>{
   

    return(
   <div>
    <button>Add Task</button>

    <Column />

   </div>

);
}

export default KanbanBoard;