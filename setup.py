#!/usr/bin/env python3
"""
AI Story Generator Setup Script
This script helps users set up API keys for the AI story generator.
"""

import os
import sys
from pathlib import Path

def create_env_file():
    """Create .env file from .env.example"""
    env_example_path = Path(".env.example")
    env_path = Path(".env")
    
    if env_path.exists():
        print("✅ .env file already exists")
        return False
    
    if not env_example_path.exists():
        print("❌ .env.example file not found")
        return False
    
    # Copy .env.example to .env
    with open(env_example_path, 'r') as example_file:
        content = example_file.read()
    
    with open(env_path, 'w') as env_file:
        env_file.write(content)
    
    print("✅ Created .env file from .env.example")
    print("📝 Please edit .env file and add your API keys")
    return True

def check_api_keys():
    """Check if API keys are configured"""
    gemini_key = os.getenv("GEMINI_API_KEY")
    groq_key = os.getenv("GROQ_API_KEY")
    
    print("\n🔑 API Key Status:")
    print(f"Gemini API: {'✅ Configured' if gemini_key else '❌ Not configured'}")
    print(f"Groq API: {'✅ Configured' if groq_key else '❌ Not configured'}")
    
    if not gemini_key and not groq_key:
        print("\n⚠️  No API keys configured. The system will use template-based fallback stories.")
        print("📖 For better AI-generated stories, configure at least one API key:")
        print("   • Gemini API: https://makersuite.google.com/app/apikey (Free tier available)")
        print("   • Groq API: https://console.groq.com/keys (Generous free tier)")
        return False
    
    return True

def install_dependencies():
    """Install required Python packages"""
    print("\n📦 Installing dependencies...")
    
    try:
        import subprocess
        result = subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                              capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Dependencies installed successfully")
            return True
        else:
            print(f"❌ Failed to install dependencies: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Error installing dependencies: {e}")
        return False

def test_server():
    """Test if the server can start"""
    print("\n🧪 Testing server startup...")
    
    try:
        import subprocess
        import time
        
        # Start server in background
        server_process = subprocess.Popen([sys.executable, "ai_story_generator.py"], 
                                        stdout=subprocess.PIPE, 
                                        stderr=subprocess.PIPE)
        
        # Give it a moment to start
        time.sleep(3)
        
        # Check if process is still running
        if server_process.poll() is None:
            print("✅ Server started successfully")
            server_process.terminate()
            return True
        else:
            print("❌ Server failed to start")
            stdout, stderr = server_process.communicate()
            if stderr:
                print(f"Error: {stderr.decode()}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing server: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 AI Story Generator Setup")
    print("=" * 40)
    
    # Change to the correct directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Step 1: Create .env file
    create_env_file()
    
    # Step 2: Install dependencies
    if not install_dependencies():
        print("\n❌ Setup failed during dependency installation")
        return False
    
    # Step 3: Check API keys
    api_keys_configured = check_api_keys()
    
    # Step 4: Test server
    if not test_server():
        print("\n❌ Setup failed during server test")
        return False
    
    # Final instructions
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next Steps:")
    print("1. Edit .env file to add your API keys (optional but recommended)")
    print("2. Run: python ai_story_generator.py")
    print("3. Open your browser and navigate to the frontend")
    print("4. Start generating AI-powered Marathi stories!")
    
    if not api_keys_configured:
        print("\n💡 Tip: Configure API keys for better AI-generated stories")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
