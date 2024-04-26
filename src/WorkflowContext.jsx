/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const WorkflowContext = createContext();

const WorkflowProvider = ({ children }) => {
    const [wid, setWid] = useState(null);
    const [popup, setPopup] = useState(false);
    const [cardId, setCardId] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    return (
        <WorkflowContext.Provider
            value={{
                wid,
                popup,
                setPopup,
                setTitle,
                cardId,
                setCardId,
                description,
                setDescription,
                title,
                setWid,
            }}
        >
            {children}
        </WorkflowContext.Provider>
    );
};

const useWorflowContext = () => {
    const context = useContext(WorkflowContext);
    if (context === undefined) {
        throw new Error("Context was used outside Workflow context provider");
    }
    return context;
};

export { WorkflowProvider, useWorflowContext };
