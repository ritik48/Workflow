/* eslint-disable react/prop-types */
import { MdSpaceDashboard } from "react-icons/md";
import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="w-screen h-screen grid grid-cols-[120px_1fr]">
            <aside className="bg-[#ffffff]">
                <div className="font-semibold py-4 bg-[#262537] text-[#e2e2e2] text-md flex justify-center items-center gap-2">
                    <div>Easy Workflow</div>
                    {/* <PiShareNetwork /> */}
                </div>
                <div className="flex flex-col">
                    <NavLink
                        to="/"
                        className="flex flex-col items-center gap-2 border py-4"
                    >
                        <MdSpaceDashboard size={23} />
                        <div className="text-md font-semibold">Dashboard</div>
                    </NavLink>
                </div>
            </aside>
            <div className="bg-[#e7e7e7]">
                <Outlet />
            </div>
        </div>
    );
}
