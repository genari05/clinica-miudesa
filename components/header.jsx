import Image from 'next/image'
import Logo from "@/public/logo.png"
import { MdCalendarMonth, MdPeople, MdOutlineAccountCircle } from "react-icons/md";
import Tema from "@/public/Tema.svg"

export default function Header() {
    return (
        <header className="flex h-14 min-w-full items-center justify-between px-15 text-[#D33865] font-bold bg-[#FDFBD4] dark:bg-black">
            <a href="#">
                <Image className="rounded-full" src={Logo} width={40} alt="Logo" title="Clínica Labirinto da Mente" />
            </a>
            <nav className="flex items-center gap-5 text-lg">
                <a className="flex items-center gap-1 hover:border-b-1" href="">
                    <MdCalendarMonth size={20} /> Calendário
                </a>
                <a className="flex items-center gap-1 hover:border-b-1" href="">
                    <MdPeople size={20}/> Pacientes
                </a>
                <div>
                    <a className="flex items-center gap-1 hover:border-b-1" href="#">
                        <MdOutlineAccountCircle size={20} /> Perfil
                    </a>
                    <div>
                    </div>
                </div>
            </nav>
        </header>
    );
}