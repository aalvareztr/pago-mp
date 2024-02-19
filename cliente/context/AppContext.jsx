import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppContextProvider = (props) =>{
    
    const [ loading,setLoading ] = useState(false)
    const [ auth,setAuth ] = useState(false)
    const [ clientData,setClientData ] = useState(null)
    const [ pagos,setPagos ] = useState([])
    const [ facturas,setFacturas ] = useState([]);

    return (
        <AppContext.Provider value={{loading,setLoading,auth,setAuth,clientData,setClientData,pagos,setPagos,facturas,setFacturas}}>
            {props.children}
        </AppContext.Provider>
    )
}