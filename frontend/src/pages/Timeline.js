  import React, { useState, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  Crown,
  Palette,
  Music,
  Clock,
  Book,
  Landmark,
  Globe,
  Feather,
  Sparkles,
} from "lucide-react";
import CulturalPlatformFooter from "../components/CulturalPlatformFooter";
import { Link } from "react-router-dom";

// 🔸 Spinning Icon
const SpinningIcon = ({ Icon }) => {
  const controls = useAnimation();
  const handleClick = async () => {
    await controls.start({
      rotate: 360,
      transition: { duration: 0.5, ease: "easeInOut" },
    });
    controls.set({ rotate: 0 });
  };
  return (
    <motion.div
      animate={controls}
      onClick={handleClick}
      className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-orange-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center cursor-pointer"
      whileHover={{ scale: 1.15 }}
    >
      <Icon className="w-6 h-6 text-white" />
    </motion.div>
  );
};

// 🔸 Timeline Card
const TimelineCard = ({ item, index, icons }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once: false });
  const Icon = icons[item.icon];
  const isLeft = index % 2 === 0;
  const [expanded, setExpanded] = useState(false);

  return (



    
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 100, scale: 0.9 }
      }
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`relative mb-24 flex flex-col md:flex-row ${
        isLeft ? "md:justify-start" : "md:justify-end"
      } items-center`}
    >
      <motion.div
        whileHover={{ scale: 1.03 }}
        onClick={() => setExpanded(!expanded)}
        className={`cursor-pointer bg-gradient-to-br ${item.bg} border-l-8 border-orange-500 rounded-3xl shadow-2xl p-8 w-full md:w-[500px] transition-all duration-400 ${
          isLeft ? "md:mr-10" : "md:ml-10"
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-600 text-white">
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-orange-700 font-bold text-xl">{item.year}</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
        <p className="text-gray-700 text-base leading-relaxed">{item.desc}</p>
        <p className="mt-3 text-sm text-gray-500 italic">{item.period}</p>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={
            expanded ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
          }
          transition={{ duration: 0.3 }}
          className="overflow-hidden mt-3"
        >
          <p className="text-gray-600 text-sm leading-relaxed">{item.moreInfo}</p>
        </motion.div>

        <div className="mt-2 text-orange-500 text-sm font-semibold">
          {expanded ? "▲ Show Less" : "▼ Read More"}
        </div>
      </motion.div>

      <SpinningIcon Icon={Icon} />
    </motion.div>
  );
};

// 🔸 Main Component
export default function CulturalTimeline() {
  const [lang, setLang] = useState("en");
  const icons = { Crown, Palette, Music, Clock, Book, Landmark, Globe, Feather, Sparkles };

  // English + Marathi timelines
  const timelineData = {
    en: [
      {
        year: "Before 1000 CE",
        title: "Tribal Maharashtra",
        desc: "Indigenous tribes like Warli, Bhil, and Gond express life through art, songs, and dance.",
        period: "Prehistoric & Tribal Era",
        icon: "Palette",
        bg: "from-yellow-50 via-orange-50 to-white",
        moreInfo:
          "Tribal communities developed their unique ways of storytelling through songs and paintings. Warli paintings reflect daily life and unity with nature.",
      },
      {
        year: "1000–1300 CE",
        title: "Yadava Dynasty of Devagiri",
        desc: "Marathi literature gained royal patronage; saints and poets composed early works.",
        period: "Medieval Maharashtra",
        icon: "Book",
        bg: "from-orange-50 via-yellow-50 to-white",
        moreInfo:
          "The Yadava rulers encouraged local language usage in administration and literature. Marathi inscriptions from this period form the foundation of modern Marathi language.",
      },
      {
        year: "1200–1500 CE",
        title: "Bhakti Movement",
        desc: "Saints like Dnyaneshwar, Namdev, and Tukaram composed devotional Abhangs.",
        period: "Spiritual Renaissance",
        icon: "Feather",
        bg: "from-pink-50 via-rose-50 to-white",
        moreInfo:
          "The Bhakti movement used poetry and music to connect spirituality with common people. It unified Maharashtra under the message of devotion and equality.",
      },
      {
        year: "1600s",
        title: "Warli Art Tradition",
        desc: "Tribal Warli paintings flourished as a global symbol of simplicity and nature.",
        period: "Tribal Renaissance",
        icon: "Palette",
        bg: "from-yellow-50 via-orange-50 to-white",
        moreInfo:
          "Warli art became a unique cultural language, depicting harmony between humans and nature through symbolic forms and patterns.",
      },
      {
        year: "1674",
        title: "Maratha Empire Established",
        desc: "Chhatrapati Shivaji Maharaj established Swarajya, inspiring Powadas and folk art.",
        period: "Maratha Dynasty",
        icon: "Crown",
        bg: "from-orange-50 via-yellow-50 to-white",
        moreInfo:
          "Powadas narrated the bravery of Shivaji Maharaj and his warriors. These became part of Maharashtra’s identity and national pride.",
      },
      {
        year: "1700s",
        title: "Lavani & Tamasha Flourish",
        desc: "Rhythmic dance and folk theatre gained immense popularity.",
        period: "Folk Performance Era",
        icon: "Music",
        bg: "from-rose-50 via-orange-50 to-white",
        moreInfo:
          "Lavani songs and Tamasha plays used humor, dance, and rhythm to entertain while also addressing social issues and love stories.",
      },
      {
        year: "1800s",
        title: "Colonial Influence & Reform",
        desc: "British era brought Western art influences; Marathi theatre emerged.",
        period: "Colonial Maharashtra",
        icon: "Book",
        bg: "from-slate-50 via-gray-100 to-white",
        moreInfo:
          "Theatre evolved as a platform for social reform and storytelling. Reformers like Jyotiba Phule and Shahu Maharaj encouraged cultural inclusion.",
      },
      {
        year: "1940s–1960s",
        title: "Folk Revival & Radio Era",
        desc: "Folk songs and Lavani reached every home via radio and cinema.",
        period: "Modernization & Reach",
        icon: "Clock",
        bg: "from-green-50 via-lime-50 to-white",
        moreInfo:
          "Radio programs and stage shows revived interest in traditional music. Artists like Shahir Sable popularized Marathi folk arts globally.",
      },
      {
        year: "2000s–Present",
        title: "Digital Heritage & Globalization",
        desc: "AI archives and digital platforms preserve Marathi folk culture.",
        period: "Digital Maharashtra",
        icon: "Globe",
        bg: "from-blue-50 via-sky-50 to-white",
        moreInfo:
          "Digital projects, AI tools, and YouTube channels are now ensuring Marathi folk songs and traditions reach global audiences.",
      },
    ],

    // Marathi translations
    mr: [
      {
        year: "इ.स. पूर्व 1000 पूर्वी",
        title: "आदिवासी महाराष्ट्र",
        desc: "वारली, भील, गोंड यांसारख्या जमातींनी गाणे, नृत्य आणि चित्रकलेतून जीवन व्यक्त केले.",
        period: "आदिवासी कालखंड",
        icon: "Palette",
        bg: "from-yellow-50 via-orange-50 to-white",
        moreInfo:
          "या काळात जमातींनी निसर्गाशी एकरूप जीवनाचे दर्शन घडवले. वारली चित्रे शेती, सण आणि निसर्गातील सौहार्द दाखवतात.",
      },
      {
        year: "1000–1300 इ.स.",
        title: "यादव वंश – देवगिरी",
        desc: "मराठी साहित्यास शाही आश्रय; संत आणि कविंनी प्रारंभिक रचना केल्या.",
        period: "मध्ययुगीन महाराष्ट्र",
        icon: "Book",
        bg: "from-orange-50 via-yellow-50 to-white",
        moreInfo:
          "यादव राजांनी मराठी भाषेला राजाश्रय दिला. या काळात अभिलेख, भक्ती कविता आणि साहित्यात मराठीची प्रतिष्ठा वाढली.",
      },
      {
        year: "1200–1500 इ.स.",
        title: "भक्ती आंदोलन",
        desc: "ज्ञानेश्वर, नामदेव, तुकाराम, एकनाथ यांच्या अभंगांनी समाज एकत्र आला.",
        period: "आध्यात्मिक पुनर्जागरण",
        icon: "Feather",
        bg: "from-pink-50 via-rose-50 to-white",
        moreInfo:
          "भक्ती चळवळीने धर्म लोकांपर्यंत पोहोचवला. कवितेतून भक्ती, समानता आणि प्रेमाचा संदेश दिला गेला.",
      },
      {
        year: "1600चे दशक",
        title: "वारली चित्रकला",
        desc: "आदिवासी वारली कला – मानव आणि निसर्गातील समतोलाचे प्रतीक.",
        period: "आदिवासी पुनर्जागरण",
        icon: "Palette",
        bg: "from-yellow-50 via-orange-50 to-white",
        moreInfo:
          "वारली चित्रकलेने जगभरात महाराष्ट्राची ओळख निर्माण केली. रेषा आणि आकृत्यांतून दैनंदिन जीवनाचे दर्शन घडवले जाते.",
      },
      {
        year: "1674",
        title: "मराठा साम्राज्य स्थापना",
        desc: "छत्रपती शिवाजी महाराजांनी स्वराज्य स्थापले; पोवाड्यांतून त्यांचा जयघोष झाला.",
        period: "मराठा युग",
        icon: "Crown",
        bg: "from-orange-50 via-yellow-50 to-white",
        moreInfo:
          "शिवाजी महाराजांच्या पराक्रमाचे पोवाडे महाराष्ट्रात लोकमानसाचा भाग बनले. शाहीरी कलेने लोकांमध्ये स्वाभिमान जागवला.",
      },
      {
        year: "1700चे दशक",
        title: "लावणी आणि तमाशा",
        desc: "ताल, नृत्य आणि सामाजिक विषयांनी भरलेली लोकनाट्यकला.",
        period: "लोककला कालखंड",
        icon: "Music",
        bg: "from-rose-50 via-orange-50 to-white",
        moreInfo:
          "लावणी आणि तमाशा हे महाराष्ट्राच्या लोकमनोरंजनाचे प्रमुख स्वरूप बनले. यात समाजाचे प्रतिबिंब आणि विनोद दिसतो.",
      },
      {
        year: "1800चे दशक",
        title: "औपनिवेशिक प्रभाव आणि सुधारणा",
        desc: "ब्रिटिश काळात मराठी नाटक व सुधारणा चळवळ वाढली.",
        period: "औपनिवेशिक महाराष्ट्र",
        icon: "Book",
        bg: "from-slate-50 via-gray-100 to-white",
        moreInfo:
          "शाहीर, नाटककार आणि सुधारकांनी कलामार्फत समाजातील विषमता कमी करण्याचा प्रयत्न केला.",
      },
      {
        year: "1940–1960",
        title: "लोककला पुनरुज्जीवन आणि रेडिओ युग",
        desc: "लावणी, पोवाडे रेडिओ आणि चित्रपटांतून घराघरात पोहोचले.",
        period: "आधुनिक पुनर्जागरण",
        icon: "Clock",
        bg: "from-green-50 via-lime-50 to-white",
        moreInfo:
          "रेडिओवरील कार्यक्रमांनी मराठी लोकसंगीत लोकप्रिय केले. शाहिर साबळे यांसारख्या कलाकारांनी लोककला जागतिक स्तरावर पोहोचवली.",
      },
      {
        year: "2000–आजपर्यंत",
        title: "डिजिटल वारसा",
        desc: "AI आणि डिजिटल माध्यमांतून महाराष्ट्राचा सांस्कृतिक वारसा जपला जात आहे.",
        period: "डिजिटल महाराष्ट्र",
        icon: "Globe",
        bg: "from-blue-50 via-sky-50 to-white",
        moreInfo:
          "डिजिटल प्लॅटफॉर्म्स, यूट्यूब आणि AI प्रकल्पांमुळे मराठी लोकगीतांचा वारसा जगभर पोहोचत आहे.",
      },
    ],
  };

  return (
  <>
     {/* NAVBAR */}
      <header className="bg-[#d32f2f] text-white flex flex-col md:flex-row justify-between items-center px-6 md:px-14 py-5 shadow-lg text-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-wide">
            🎵 महाराष्ट्र सांस्कृतिक मंच
          </h1>
          <p className="text-sm md:text-base font-light">
            Cultural AI Platform for Maharashtra
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-5 mt-3 md:mt-0 text-base md:text-lg font-medium">
          <Link to="/predict" className="hover:underline flex items-center gap-1">
            <Music size={18} /> लोकगीते / Folk Songs
          </Link>

          <Link to="/timeline" className="hover:underline flex items-center gap-1">
            <Clock size={18} /> कालरेषा / Timeline
          </Link>

          <Link to="/cultureexplorer" className="hover:underline flex items-center gap-1">
            <Landmark size={18} /> संस्कृती अन्वेषक / Culture Explorer
          </Link>

          <Link
            to="/contribution"
            className="bg-white text-[#d32f2f] font-semibold px-5 py-2 rounded-lg hover:bg-[#ffe1e1] transition shadow-md"
          >
            योगदान द्या / Contribute
          </Link>
        </nav>
      </header>

      
    {/* Main Timeline Section */}
    <section className="relative min-h-screen py-20 px-4 bg-gradient-to-b from-orange-50 via-yellow-50 to-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <h1 className="text-4xl font-bold text-orange-600 mb-2">
          {lang === "en"
            ? "Cultural Timeline of Maharashtra"
            : "महाराष्ट्राची सांस्कृतिक कालरेषा"}
        </h1>
        <p className="text-gray-600">
          {lang === "en"
            ? "Journey through Maharashtra's rich cultural heritage"
            : "महाराष्ट्राच्या समृद्ध सांस्कृतिक वारशाचा प्रवास"}
        </p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setLang(lang === "en" ? "mr" : "en")}
          className="mt-5 bg-orange-500 text-white px-6 py-2 rounded-full shadow-md"
        >
          {lang === "en" ? "मराठी" : "English"}
        </motion.button>
      </motion.div>

      <div className="relative max-w-5xl mx-auto">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-orange-300 rounded-full"></div>

        {timelineData[lang].map((item, i) => (
          <TimelineCard key={i} item={item} index={i} icons={icons} />
        ))}
      </div>
    </section>

    {/* Footer */}
    <CulturalPlatformFooter />
  </>
);

}
