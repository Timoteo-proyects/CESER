
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

function MainLayout({ onLogout }) {
    return (
        <div className="app-layout">
            <Sidebar />

            <div className="main-area">
                <Header onLogout={onLogout} />

                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MainLayout;