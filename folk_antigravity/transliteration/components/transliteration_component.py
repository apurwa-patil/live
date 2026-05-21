import streamlit.components.v1 as components


def roman_to_marathi_component(height=350):
    """
    Custom Streamlit component for Roman → Marathi transliteration.
    Returns transliterated Devanagari text.
    """

    html_code = """
    <!DOCTYPE html>
    <html>
    <head>
        <script src="https://unpkg.com/sanscript@1.2.0"></script>
        <style>
            body {
                font-family: sans-serif;
            }
            textarea {
                width: 100%;
                height: 100px;
                font-size: 16px;
                padding: 8px;
                margin-top: 8px;
                margin-bottom: 12px;
                border-radius: 6px;
                border: 1px solid #ccc;
            }
            label {
                font-weight: bold;
            }
        </style>
    </head>
    <body>

        <label>Type in Roman English:</label>
        <textarea id="input" placeholder="e.g. majha gaav kolhapur aahe"></textarea>

        <label>Marathi (Devanagari Output):</label>
        <textarea id="output" readonly></textarea>

        <script>
            const inputBox = document.getElementById("input");
            const outputBox = document.getElementById("output");

            inputBox.addEventListener("input", function() {
                var roman = inputBox.value;
                var devnagari = Sanscript.t(roman, 'itrans', 'devanagari');
                outputBox.value = devnagari;

                // Send data back to Streamlit
                window.parent.postMessage({
                    type: "streamlit:setComponentValue",
                    value: devnagari
                }, "*");
            });
        </script>

    </body>
    </html>
    """

    return components.html(html_code, height=height)
