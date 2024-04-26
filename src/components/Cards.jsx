/* eslint-disable react/prop-types */
import { Handle, Position, useReactFlow } from "reactflow";

export function Card({ id, data }) {
    const { setNodes } = useReactFlow();

    function handleRemoveCard() {
        setNodes((prev) => prev.filter((p) => p.id !== id));
    }

    return (
        <>
            <Handle type="source" position={Position.Right} />
            <div className="h-48 border border-[#c6c5c5] flex flex-col rounded-md shadow-md">
                <div className="bg-[#efefeffb] gap-2 flex items-center border-[grey] font-semibold px-4 py-1 rounded-md rounded-b-none">
                    <div>{data.type} : </div>
                    <div className="text-[grey]">{data.type}</div>
                </div>
                <div className="bg-[#efefeffb] flex-grow border border-t-[#cccbcb] rounded-md items-start rounded-t-none flex">
                    <button
                        onClick={handleRemoveCard}
                        className="border border-[#c6c5c5] transition-all duration-200 ease-in-out hover:text-[#d2d1d1] hover:bg-[#191919] mt-auto w-full m-2 rounded-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
            <Handle type="target" position={Position.Left} id="a" />
        </>
    );
}
