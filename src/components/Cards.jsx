/* eslint-disable react/prop-types */
import { Handle, NodeToolbar, Position, useReactFlow } from "reactflow";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useWorflowContext } from "../WorkflowContext";

export function Card({ id, data }) {
    const { setNodes } = useReactFlow();
    const { setPopup, setTitle, setDescription, setCardId } =
        useWorflowContext();

    function handleRemoveCard() {
        setNodes((prev) => prev.filter((p) => p.id !== id));
    }

    function handleShowPopup() {
        setTitle(data.title);
        setDescription(data.description);
        setCardId(id);
        setPopup(true);
    }

    return (
        <>
            <NodeToolbar>
                <div className="text-[#585596] flex items-center border gap-10">
                    <div
                        onClick={handleShowPopup}
                        className="hover:text-[#1b1a2b] cursor-pointer"
                    >
                        <MdOutlineModeEditOutline size={20} />
                    </div>
                    <div
                        className="hover:text-[#232238] cursor-pointer"
                        onClick={handleRemoveCard}
                    >
                        <MdOutlineDeleteOutline size={20} />
                    </div>
                </div>
            </NodeToolbar>
            <Handle type="source" position={Position.Right} />
            <div className="h-48 border border-[#c6c5c5] flex flex-col rounded-md shadow-md">
                <div className="bg-[white] gap-2 flex items-center border-[grey] font-semibold px-4 py-1 rounded-md rounded-b-none">
                    <div>{data.type} : </div>
                    <div className="text-[grey]">{data.title}</div>
                </div>
                <div className="bg-[white] flex-grow border border-t-[#cccbcb] rounded-md items-start rounded-t-none flex">
                    {/* <button
                        onClick={handleRemoveCard}
                        className="border border-[#c6c5c5] transition-all duration-200 ease-in-out hover:text-[#d2d1d1] hover:bg-[#191919] mt-auto w-full m-2 rounded-sm"
                    >
                        Delete
                    </button> */}
                </div>
            </div>
            <Handle type="target" position={Position.Left} id="a" />
        </>
    );
}
