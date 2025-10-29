export default function LoginPsicologo() {
    return (
        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-10 w-full items-center">
            <input className="w-full bg-[#FFE3EB] p-5 rounded-xl shadow-lg text-black placeholder:text-left" type="text" placeholder="CRP ou email" />
            <input className="w-full bg-[#FFE3EB] p-5 rounded-xl shadow-lg text-black placeholder:text-left" type="password" placeholder="Senha" />
            <a className="text-[#D33865] self-start" href="#">Esqueceu a senha?</a>
            <button className="w-full font-bold bg-[#D33865] p-5 rounded-full shadow-lg cursor-pointer">ENTRAR</button>
        </div>
    )
}