import React, { createContext, useState } from 'react';

const GlobalContext = createContext(null);

const GlobalContextProvider = (props) => {
    const [children, setChildren] = useState([]);

    return (
        <GlobalContext.Provider
            value={{children, setChildren}}>
            {props.children}
        </GlobalContext.Provider>
    )
}

export {GlobalContext, GlobalContextProvider};