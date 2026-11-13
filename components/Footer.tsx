function Footer() {
  return (
    <footer className="bg-[#18181B] px-4 py-5 text-center text-sm text-gray-400">
      <p>
        Developed by{" "}
        <span className="font-semibold text-white">Aarohi Modi</span>
      </p>

      <p className="mt-1">
        Built with <span className="text-red-500">Next.js</span>
        {" & "}
        <span className="text-sky-400">Tailwind CSS</span>
      </p>

      <p className="mt-2 text-xs text-gray-600">
        © 2026 Next Movie. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
