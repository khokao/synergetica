import { createContext, useContext, useState } from "react";

export const DnDContext = createContext([null, (_) => {}]);

export const DnDProvider = ({ children }) => {
  const [dndCategory, setDnDCategory] = useState(null);

  return <DnDContext.Provider value={[dndCategory, setDnDCategory]}>{children}</DnDContext.Provider>;
};

export const useDnD = () => {
  return useContext(DnDContext);
};
