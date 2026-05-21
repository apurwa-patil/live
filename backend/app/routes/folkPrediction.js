import express from 'express';
import axios from 'axios';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Google Transliteration API function
async function googleTransliterate(text) {
    try {
        const url = "https://inputtools.google.com/request";
        const params = {
            text: text,
            itc: "mr-t-i0-und",
            num: 5
        };
        
        const response = await axios.get(url, { params });
        const result = response.data;
        
        if (result[0] === "SUCCESS") {
            return result[1][0][1][0];
        }
        return null;
    } catch (error) {
        console.error("Transliteration error:", error);
        return null;
    }
}

// Python ML model prediction endpoint
async function predictFromPythonModel(text) {
    try {
        // This would call the Python model - for now, we'll simulate the response
        // In a real implementation, you'd use child_process.spawn to call Python script
        // or set up a separate Flask/FastAPI server for the ML model
        
        // Mock prediction based on the folk_antigravity app logic
        const mockPredictions = {
            "default": {
                Title: "Unknown Folk Song",
                Genre: "Lavani",
                Region: "Western Maharashtra", 
                History: "Traditional Marathi folk song with cultural significance."
            }
        };
        
        // Simple keyword-based prediction (mock implementation)
        const lowerText = text.toLowerCase();
        let prediction = { ...mockPredictions.default };
        
        if (lowerText.includes('powada') || lowerText.includes('warrior') || lowerText.includes('battle')) {
            prediction = {
                Title: "Powada",
                Genre: "Powada / Heroic Ballad",
                Region: "Maharashtra",
                History: "Heroic ballad praising Maratha warriors and their valor in battles."
            };
        } else if (lowerText.includes('lavani') || lowerText.includes('dance') || lowerText.includes('romantic')) {
            prediction = {
                Title: "Lavani",
                Genre: "Lavani",
                Region: "Western Maharashtra",
                History: "Traditional folk dance form known for its rhythmic beats and expressive performances."
            };
        } else if (lowerText.includes('bharud') || lowerText.includes('spiritual') || lowerText.includes('religious')) {
            prediction = {
                Title: "Bharud",
                Genre: "Bharud",
                Region: "Central Maharashtra",
                History: "Spiritual folk songs with philosophical and religious themes."
            };
        }
        
        return prediction;
    } catch (error) {
        console.error("Prediction error:", error);
        throw new Error("Failed to process prediction");
    }
}

// POST endpoint for text prediction
router.post('/predict', async (req, res) => {
    try {
        const { text, inputType = 'direct' } = req.body;
        
        if (!text || text.trim().length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide text for prediction" 
            });
        }
        
        let processedText = text;
        
        // If input is roman script, convert to Marathi
        if (inputType === 'roman') {
            const marathiText = await googleTransliterate(text);
            if (marathiText) {
                processedText = marathiText;
            }
        }
        
        // Get prediction from ML model
        const prediction = await predictFromPythonModel(processedText);
        
        res.json({
            success: true,
            data: {
                ...prediction,
                processedText: processedText,
                originalText: text
            }
        });
        
    } catch (error) {
        console.error("Prediction endpoint error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error during prediction" 
        });
    }
});

// POST endpoint for file upload prediction
router.post('/predict-file', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: "Please upload a file" 
            });
        }
        
        // Read file content
        const text = req.file.buffer.toString('utf-8');
        
        if (!text || text.trim().length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "File is empty or contains no readable text" 
            });
        }
        
        // Get prediction
        const prediction = await predictFromPythonModel(text);
        
        res.json({
            success: true,
            data: {
                ...prediction,
                originalText: text
            }
        });
        
    } catch (error) {
        console.error("File prediction error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error processing uploaded file" 
        });
    }
});

// GET endpoint for model status
router.get('/status', (req, res) => {
    res.json({
        success: true,
        message: "Folk song prediction service is running",
        features: [
            "Text prediction",
            "Roman to Marathi transliteration", 
            "File upload support",
            "Multi-genre classification"
        ]
    });
});

export default router;
