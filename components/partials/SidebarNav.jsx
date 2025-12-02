import Link from "next/link";

export default function SidebarNav() {
  return (
    <header>
      <nav className="bg-gray-800 p-4 text-white">
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
