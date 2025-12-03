import {
  Bell,
  Bookmark,
  CircleEllipsis,
  Clipboard,
  ClipboardList,
  House,
  Mail,
  Search,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import UserCard from "../cards/UserCard";
export default function SidebarNav() {
  const router = useRouter();
  const menuLinks = [
    {
      name: "Home",
      href: "/",
      icon: <House size={30} className="text-white" />,
    },
    {
      name: "Explore",
      href: "/explore",
      icon: <Search size={30} className="text-white" />,
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: <Bell size={30} className="text-white" />,
    },
    {
      name: "Messages",
      href: "/messages",
      icon: <Mail size={30} className="text-white" />,
    },
    {
      name: "Bookmarks",
      href: "/bookmarks",
      icon: <Bookmark size={30} className="text-white" />,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <User size={30} className="text-white" />,
    },
    {
      name: "More",
      href: "/more",
      icon: <CircleEllipsis size={30} className="text-white" />,
    },
  ];
  return (
    <div className="sidebar border-r border-[#303030] pr-[70px]">
      <header className="text-white pl-[130px] max-w-[350px] w-full py-5 ">
        <div className="mt-2">
          <Link href="/">
            <Image
              src="/logo.webp"
              className="brightness-100"
              alt="Logo"
              width={50}
              height={50}
            />
          </Link>
        </div>
        <nav className="py-[50px] text-[20px]">
          <ul className="flex flex-col gap-y-2">
            {menuLinks.map((link) => (
              <li key={link.name} className="">
                <Link
                  href={link.href}
                  className={`${
                    router.pathname === link.href ? "font-bold" : "font-medium"
                  } flex hover:bg-[#151515] py-[15px] px-[20px] text-white items-center gap-[25px] rounded-[50px]`}
                >
                  <span className="w-[30px] block">{link.icon}</span>
                  {link.name}
                </Link>
              </li>
            ))}
            <li className="pl-[20px]">
              <button className="bg-[#eff3f4] cursor-pointer w-full text-black font-bold px-[30px] py-[15px] rounded-[50px] mt-[20px] hover:opacity-90">
                Add Task
              </button>
            </li>
          </ul>
        </nav>

        <div className="">
          <UserCard />
        </div>
      </header>
    </div>
  );
}
