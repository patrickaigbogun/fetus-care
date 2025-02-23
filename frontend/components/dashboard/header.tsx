import HeaderTitle from "./header_logo";
import ProfileButton from "./profile_button";
import Image from "next/image";



export default function Header() {

	return (
		<nav className=" flex flex-row justify-between p-2 bg-purple-200/60 " >
			<HeaderTitle >Dashboard</HeaderTitle>
			<Image
				src="/logo.svg"
				alt="Logo"
				width={44}
				className="max-w-[32px]"
				height={44}
			/>
			<ProfileButton src="" fallback={"PA"} />
		</nav>
	);
}