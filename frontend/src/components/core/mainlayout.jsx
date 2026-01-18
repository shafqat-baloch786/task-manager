import { Outlet } from 'react-router-dom'
import { LayoutSidebar } from "./layoutSidebar";


function MainLayout() {
  return (
        <div className="flex min-h-screen bg-slate-50">
            <LayoutSidebar />
            <Outlet />
        </div>
  )
}

export default MainLayout