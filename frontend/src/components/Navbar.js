
// // // import { Link } from "react-router-dom";

// // // export default function Navbar() {
// // //   return (
// // //     <nav className="bg-red-600 p-6 text-white flex justify-between items-center shadow-lg">
// // //       <div className="flex flex-col">
// // //         <h1 className="font-bold text-2xl">महारष्ट्र सांस्कृतिक मंच</h1>
// // //         <p className="text-sm">Cultural AI Platform for Maharashtra</p>
// // //       </div>
// // //       <div className="flex items-center space-x-8">
// // //         <div className="flex space-x-8 text-sm">
// // //           <Link to="/" className="hover:text-yellow-300 transition">🎵 लोकगीते / Folk Songs</Link>
// // //           <Link to="/timeline" className="hover:text-yellow-300 transition">⏰ कालक्रेष / Timeline</Link>
// // //           <Link to="/cultureexplorer" className="hover:text-yellow-300 transition">🏛️ संस्कृती अन्वेषक / Culture Explorer</Link>
// // //         </div>
// // //         <Link to="/contribution" className="bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
// // //           योगदान चा / Contribute
// // //         </Link>
// // //       </div>
// // //     </nav>
// // //   );
// // // }



// // import { Link } from "react-router-dom";

// // export default function Navbar() {
// //   return (
// //     <nav className="bg-gray-800 p-4 text-white flex flex-wrap justify-between items-center gap-4">
      
// //       <h1 className="font-bold text-lg">
// //         Marathi Folk Songs
// //       </h1>

// //       <div className="flex flex-wrap gap-6">
// //         <Link to="/" className="hover:text-orange-600 transition">
// //           Home
// //         </Link>

// //         <Link to="/predict" className="hover:text-orange-600 transition">
// //           Folk Songs
// //         </Link>

// //         <Link to="/timeline" className="hover:text-orange-600 transition">
// //           Timeline
// //         </Link>

// //         <Link to="/contribution" className="hover:text-orange-600 transition">
// //           Contribution
// //         </Link>

// //         <Link to="/cultureexplorer" className="hover:text-orange-600 transition">
// //           Culture Explorer
// //         </Link>
// //       </div>
// //     </nav>
// //   );
// // }


// import React from "react";
// import { Link } from "react-router-dom";
// import { Music, Clock, Landmark } from "lucide-react";

// export default function Navbar() {
//   return (
//     <header className="fixed top-0 left-0 w-full z-50 bg-[#d32f2f] text-white shadow-lg">
//       <div className="max-w-7xl mx-auto px-6 md:px-14 py-4 flex flex-col md:flex-row justify-between items-center">
        
//         {/* Logo */}
//         <div className="text-center md:text-left">
//           <h1 className="text-2xl font-extrabold tracking-wide">
//             🎵🌸 गीतसंस्कृती
//           </h1>

//           <p className="text-sm md:text-base font-light">
//             Cultural AI Platform for Maharashtra
//           </p>
//         </div>

//         {/* Navigation */}
//         <nav className="flex flex-wrap justify-center gap-5 mt-4 md:mt-0 text-base md:text-lg font-medium">
          
//           <Link
//             to="/predict"
//             className="hover:underline flex items-center gap-1"
//           >
//             <Music size={18} />
//             Folk Songs
//           </Link>

//           <Link
//             to="/timeline"
//             className="hover:underline flex items-center gap-1"
//           >
//             <Clock size={18} />
//             Timeline
//           </Link>

//           <Link
//             to="/cultureexplorer"
//             className="hover:underline flex items-center gap-1"
//           >
//             <Landmark size={18} />
//             Culture Explorer
//           </Link>

//           <Link
//             to="/contribution"
//             className="bg-white text-[#d32f2f] font-semibold px-5 py-2 rounded-lg hover:bg-[#ffe1e1] transition shadow-md"
//           >
//             Contribute
//           </Link>
//         </nav>
//       </div>
//     </header>
//   );
// }


import React from "react";
import { Link } from "react-router-dom";
import { Music, Clock, Landmark, Brain } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#d32f2f] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">

        {/* Logo */}
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-extrabold tracking-wide">
            🎵🌸 गीतसंस्कृती
          </h1>

          <p className="text-sm opacity-90">
            Cultural AI Platform for Maharashtra
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-5 mt-4 md:mt-0 text-sm md:text-base font-medium">

          <Link
            to="/"
            className="hover:text-yellow-200 transition"
          >
            Home
          </Link>

          <Link
            to="/predict"
            className="flex items-center gap-1 hover:text-yellow-200 transition"
          >
            <Music size={18} />
            Folk Songs
          </Link>

          <Link
            to="/timeline"
            className="flex items-center gap-1 hover:text-yellow-200 transition"
          >
            <Clock size={18} />
            Timeline
          </Link>

          <Link
            to="/cultureexplorer"
            className="flex items-center gap-1 hover:text-yellow-200 transition"
          >
            <Landmark size={18} />
            Culture Explorer
          </Link>

          <Link
            to="/storytelling"
            className="flex items-center gap-1 hover:text-yellow-200 transition"
          >
            <Brain size={18} />
            Story Teller
          </Link>

          <Link
            to="/contribution"
            className="bg-white text-[#d32f2f] px-4 py-2 rounded-lg font-semibold hover:bg-orange-100 transition"
          >
            Contribute
          </Link>

        </nav>
      </div>
    </header>
  );
}