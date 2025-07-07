// import React from "react";
// import { Link, useNavigate } from "react-router-dom";

// export const Footer = () => {
//   return (
//     <div>
//       <hr />
//       <footer className="footer footer-center p-10 text-base-content rounded dark:bg-slate-900 dark:text-white">
//         <nav className="grid grid-flow-col gap-4">
//           <a href="https://github.com/202201163-Jay/Event-Sphere" target="_main" className="link link-hover">About us</a>
//           <Link className="link link-hover" to="/">Home</Link>
//           <a href="https://linkedin.com" className="link link-hover" target="_main">Jobs</a>
//           <a className="link link-hover">Help</a>
//         </nav>
//         <nav>
//           <div className="grid grid-flow-col gap-4">
//             <a href="https://x.com/home" target="_main">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 className="fill-current"
//               >
//                 <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
//               </svg>
//             </a>
//             <a href="https://www.youtube.com/" target="_main">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 className="fill-current"
//               >
//                 <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
//               </svg>
//             </a>
//             <a href="https://www.facebook.com/" target="_main"> 
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 className="fill-current"
//               >
//                 <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
//               </svg>
//             </a>
//           </div>
//         </nav>
//         <aside>
//           <p>Copyright © 2024 - All right reserved by EventSphere</p>
//         </aside>
//       </footer>
//     </div>
//   );
// }

// export default Footer;

// -------------------------------- New Version 1 ----------------------

import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 px-4 mt-12 border-t border-gray-800 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10">
        {/* Brand & Social */}
        <div className="flex-1 mb-8 md:mb-0">
          <h3 className="text-lg font-bold mt-2 tracking-wide text-yellow-400">To always be ahead</h3>
          <p className="text-4xl md:text-5xl font-extrabold text-yellow-400 mb-4 drop-shadow-lg">Event Sphere</p>
          <p className="text-gray-400 max-w-xs mb-4">Discover a world of events, right at your fingertips. Our platform connects you with exciting opportunities from local gatherings to global conferences. Join the community and be part of something special.</p>
          <div className="flex space-x-4 mt-4">
            <a href="https://x.com/home" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-yellow-400 transition-colors">
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-yellow-400 transition-colors">
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-yellow-400 transition-colors">
              <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
          </div>
        </div>

        {/* Explore Links */}
        <div className="flex-1 mb-8 md:mb-0">
          <h2 className="text-xl font-semibold mb-2 text-yellow-300 tracking-wide">Explore</h2>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:underline hover:text-yellow-400 transition-colors">Home</Link></li>
            <li><Link to="/events-page" className="hover:underline hover:text-yellow-400 transition-colors">Events</Link></li>
            <li><Link to="/blogs" className="hover:underline hover:text-yellow-400 transition-colors">Blogs</Link></li>
            <li><Link to="/aboutus" className="hover:underline hover:text-yellow-400 transition-colors">About Us</Link></li>
            <li><Link to="/FAQ" className="hover:underline hover:text-yellow-400 transition-colors">FAQ</Link></li>
          </ul>
          <div className="mt-6">
            <Link
              to="/admin-login"
              className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 font-semibold px-6 py-2 rounded shadow transition duration-200 mt-2"
            >
              Admin Login
            </Link>
          </div>
        </div>

        {/* Contact & Motto */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2 text-yellow-300 tracking-wide">Connect • Create • Celebrate</h2>
          <p className="text-gray-400 mb-4">Easily browse, filter, and register for events that match your interests. Be part of something amazing!</p>
          <div className="text-gray-500 text-sm mt-8 border-t border-gray-800 pt-4">&copy; {new Date().getFullYear()} EventSphere. All rights reserved.</div>
        </div>
      </div>
      <div className="mt-10 border-t border-gray-800 pt-6 text-center text-gray-500 text-xs tracking-wide">
        Made with <span className="text-yellow-400">&#10084;</span> by the Event Sphere Team
      </div>
    </footer>
  );
}

export default Footer;