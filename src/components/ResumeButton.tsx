import { FaDownload } from "react-icons/fa";

export default function ResumeButton() {
  return (
    <a
      href="/Madiha_Ayaz_CV.pdf"
      download
      className="px-8 py-4 bg-slate-800 dark:bg-slate-700 text-white rounded-full font-semibold hover:bg-slate-700 dark:hover:bg-slate-600 transition-all duration-300 flex items-center gap-2 group shadow"
    >
      <FaDownload className="group-hover:animate-bounce" />
      Resume
    </a>
  );
}