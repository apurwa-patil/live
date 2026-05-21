function LanguageToggle({ lang, setLang }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <button onClick={() => setLang("en")} style={{ marginRight: "10px" }}>
        {lang === "en" ? "Read in English" : "इंग्रजीत वाचा"}
      </button>
      <button onClick={() => setLang("mr")}>
        {lang === "en" ? "Read in Marathi" : "मराठीत वाचा"}
      </button>
    </div>
  );
}

export default LanguageToggle;
