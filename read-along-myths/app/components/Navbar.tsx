import React from "react";
import Link from "next/link";

const Navbar = () => {
    return (
        <>
            <div className="w-full h-20 bg-black-800 sticky top-0 border-b-8 border-amber-100">
                <div className="container mx-auto px-4 h-full">
                    <div className="flex justify-between items-center h-full">
                        <ul className="hidden md:flex gap-x-6 text-white">
                            <li>
                                <Link href="/">
                                    <p>DIY AI Generated</p>
                                </Link>
                            </li>
                            <li>
                                <Link href="/timeline">
                                    <p>Early Human Migration Timeline</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;