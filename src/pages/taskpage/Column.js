import React from 'react'
import "./taskPage.css";
import { DeleteOutlined } from "@ant-design/icons";
import { DndContext } from "@dnd-kit/core";

const Column = () => {

    const columns = [
        {
          id: "todo",
          title: "Todo",
        },
        {
          id: "doing",
          title: "Work in progress",
        },
        {
          id: "done",
          title: "Done",
        },
      ];
  return (
    <div>
      {/* column render */}
      <DndContext>
      <div className='columns'>
          {columns.map((col) =>(
            <div className="col">
          {/* title */}

            <div className='col-title'>
                <div>0</div>
                <div>{col.title}</div>
                <button>
                <DeleteOutlined />
                </button>
            </div>
            {/* content */}
             <div>cotent</div>
             </div>
          ))}

         
         
        </div>
        </DndContext>
    </div>
  )
}

export default Column
