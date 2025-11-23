import { Link, Outlet } from "react-router";
import logo from '@/assets/logo.png'
import { SunIcon } from "lucide-react";
import ProfileButton from "./header/profile-button";
import ThemeButton from "./header/theme-button";
export default function GlobalLayout(){
    return(
        <div className="flex min-h-[100vh] flex-col">
            <header className="h-15 border-b">
                <div className="flex justify-between h-full max-w-175 w-full m-auto px-4">
                    <Link to={"/"} className="flex items-center gap-2">
                    <img 
                    className="h-14"
                    src={logo} 
                    alt="Moment의 로고,그 순간(Moment)을 기록한 모양이다 "/>
                        <div className="font-bold">Moment</div>
                    </Link>
                    <div className="flex items-center gap-5">
                        <ThemeButton />
                        <ProfileButton />
                    </div>
                </div>
            </header>
            <main className="flex-1 max-w-175 w-full m-auto px-4 py-6 border-x">
                <Outlet />
            </main>
            <footer className="border-t py-10 text-muted-foreground text-center">@조태진</footer>
        </div>
    )
}