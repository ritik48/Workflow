/* eslint-disable react/prop-types */
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    SelectionMode,
    addEdge,
    useEdgesState,
    useNodesState,
} from "reactflow";
import { Card } from "../components/Cards";

function Nav({ title, onAddCard }) {
    const [cardOption, setCardOption] = useState("not_selected");
    const navigate = useNavigate();

    return (
        <div className="flex bg-[white] shadow-md pr-10">
            <div className="flex">
                <button
                    className="px-6 py-3 border border-[#bebebe]"
                    onClick={() => navigate(-1)}
                >
                    <IoIosArrowRoundBack size={25} />
                </button>
                <div className="flex items-center justify-center text-[#585596] gap-4 px-3 py-1 border border-[#bebebe] border-l-0 font-semibold">
                    {/* <GoPlus size={25} /> */}
                    <select
                        value={cardOption}
                        onChange={(e) => {
                            if (e.target.value === "not_selected") return;
                            setCardOption(e.target.value);
                            onAddCard(e.target.value);
                        }}
                        className="border rounded-md px-2 py-1 border-[grey] outline-none cursor-pointer"
                    >
                        <option value={"not_selected"}>
                            Select card to add
                        </option>
                        <option value={"Landing"}>Landing</option>
                        <option value={"Checkout"}>Checkout</option>
                        <option value={"Thank You"}>Thank You</option>
                        <option value={"Custom card"}>Custom card</option>
                    </select>
                </div>
            </div>
            <div className="w-full flex justify-center font-semibold items-center gap-2">
                <div>Workflow name : </div>
                <div className="text-[#5d5c5c]">
                    {!title ? "Loading..." : title}
                </div>
            </div>
        </div>
    );
}

export function Workflow() {
    const { id } = useParams();
    const [workflow, setWorkflow] = useState(null);

    const updatingNodes = useRef(null);

    const [initialNodes, setInitialNodes] = useState([]);
    const [initialEdges, setInitialEdges] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const exists = localStorage.getItem("workflows")
            ? JSON.parse(localStorage.getItem("workflows")).find(
                  (w) => w.id === id
              )
            : null;

        if (!exists) {
            navigate("/");
            return;
        }
        setWorkflow(exists);

        setInitialNodes(exists.cards);
        setInitialEdges(exists.edges);
    }, [navigate, id]);

    function handleAddCard(card_type) {
        const new_card = {
            id: uuidv4(),
            data: { type: card_type },
            type: "card",
            position: { x: 0, y: 0 },
        };

        let items = JSON.parse(localStorage.getItem("workflows"));
        let prev_cards = items.find((item) => item.id === id).cards;

        prev_cards = [...prev_cards, new_card];

        let updatedWorkflows = items.map((item) => {
            if (item.id === id) {
                return { ...item, cards: prev_cards };
            }
            return item;
        });

        localStorage.setItem("workflows", JSON.stringify(updatedWorkflows));
        setInitialNodes(prev_cards);
    }

    return (
        <div className="h-full flex flex-col">
            <Nav title={workflow?.title} onAddCard={handleAddCard} />
            {workflow && (
                <Flow
                    initialEdges={initialEdges}
                    initial={initialNodes}
                    updatingNodes={updatingNodes}
                    workflow_id={id}
                />
            )}
        </div>
    );
}

const nodeTypes = {
    card: Card,
};

function Flow({ initialEdges, initial, workflow_id }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onConnect = useCallback(
        (connection) => {
            const edge = {
                ...connection,
                animated: true,
                id: `${edges.length} + 1`,
                type: "customEdge",
            };
            setEdges((prevEdges) => addEdge(edge, prevEdges));
        },
        [edges, setEdges]
    );

    useEffect(() => {
        setNodes(initial);
        setEdges(initialEdges);
    }, [initial, setNodes, initialEdges, setEdges]);

    useEffect(() => {
        const interval = setInterval(() => {
            const w = JSON.parse(localStorage.getItem("workflows")).map((f) => {
                if (f.id === workflow_id) {
                    return {
                        ...f,
                        cards: [...nodes],
                        edges: [...edges],
                        steps: nodes.length,
                    };
                } else {
                    return f;
                }
            });
            localStorage.setItem("workflows", JSON.stringify(w));
        }, 1000);

        return () => clearInterval(interval);
    }, [nodes, workflow_id, edges]);

    return (
        <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            selectionMode={SelectionMode.Partial}
            // fitView
        >
            <Controls />
            <MiniMap />
            {/* <MiniMap nodeStrokeWidth={3} /> */}
            <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
    );
}
