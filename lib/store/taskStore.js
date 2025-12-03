import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
let storeHandler = (set, get) => ({
  tasks: null,
  taskFilters: {
    due_date: null,
  },
  setTasks: (tasks) => set({ tasks }),
});
storeHandler = devtools(storeHandler);
storeHandler = persist(storeHandler, { name: "tasks" });
const store = create(storeHandler);
export default store;
