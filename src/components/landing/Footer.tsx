import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="w-full py-6 px-4 bg-transparent text-gray-400">
      <Separator className="mb-6" />
      <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
        <Link to="/privacy" className="hover:text-gray-300">Privacy Policy</Link>
        <span>•</span>
        <Link to="/terms" className="hover:text-gray-300">Terms of Service</Link>
        <span>•</span>
        <Link to="/cookies" className="hover:text-gray-300">Cookie Policy</Link>
        <span>•</span>
        <span>© {new Date().getFullYear()} ResumeAI. All rights reserved.</span>
      </div>
    </footer>
  );
};