import { createSlice } from "@reduxjs/toolkit";

export const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: [

        ]
    },
    reducers: {
        updateTaskStatus: (state, action) => {
            const { taskId, newStatus} = action.payload;
            const taskToUpdate = state.tasks.find((task) => task.id === taskId);

            //condition
            if(taskToUpdate){
               // removing previous status
                state.tasks = state.tasks.filter((task) => task.id !== taskId);

                //updating status
                taskToUpdate.status= newStatus;
                taskToUpdate.column= newStatus;
                 state.tasks.push(taskToUpdate);

            }
        }
    }
})

export const { updateTaskStatus } = taskSlice.actions;
export default taskSlice.reducer;
   

