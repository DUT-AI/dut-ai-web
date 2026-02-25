import Link from "next/link";

export default function ButtonLink({ href, content }: { href: string; content: string }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center gap-3 rounded-full bg-white dark:bg-gray-800 px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#101828] dark:text-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow border border-gray-100 dark:border-gray-700"
        >
            {content}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
        </Link>
    )
}