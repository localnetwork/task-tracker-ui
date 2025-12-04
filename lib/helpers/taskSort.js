const taskSort = (tasks) => {
  return tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
};

export default taskSort;
