import Link from "next/link";

const Footer = () => {
    return ( 
        <>
            <div>
                <footer className="bg-black p-1 text-white text-center bottom-0 right-0 left-0">
                <div className="mt-1">
                <div className="flex justify-center space-x-4">
                    <Link href="/about" className="text-white hover:text-gray-400">About Us</Link>
                    <Link href="/privacy" className="text-white hover:text-gray-400">Privacy Policy</Link>
                    <Link href="/terms" className="text-white hover:text-gray-400">Terms of Service</Link>
                </div>
                </div>
                    <p className="mt-2">&copy; 2024, All rights reserved</p>

                </footer>
            
            </div>
        </>
     );
}
 
export default Footer;