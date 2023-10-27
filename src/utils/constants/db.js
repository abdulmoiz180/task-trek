const dbNames = {
    projectCollection: "projects",
    tasksCollectionName: "tasks",
    getTaskCollection: (projectId) => `/${dbNames.projectCollection}/${projectId}/${dbNames.tasksCollectionName}`
}
export  default dbNames;