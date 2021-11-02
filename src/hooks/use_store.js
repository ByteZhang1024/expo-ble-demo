import { useContext } from "react";
import { StoresContext } from "../contents";

export const useStores = () => useContext(StoresContext);
