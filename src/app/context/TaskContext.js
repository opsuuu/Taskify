"use client";

import { createContext, useContext, useState } from "react";

const TaskContext = createContext();

export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [allDatas, setAllDatas] = useState([]);
  return (
    <TaskContext.Provider value={{ allDatas, setAllDatas }}>
      {children}
    </TaskContext.Provider>
  );
};
