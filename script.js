// Elements
const StartBtn = document.querySelector("#img");
const StopBtn = document.querySelector("#btn1");
const Aud = document.querySelector("#aud");

// Check for Speech Recognition API
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  console.error("SpeechRecognition is not supported in this browser.");
  alert("SpeechRecognition not supported in your browser. Please use Chrome.");
} else {
  const recognition = new SpeechRecognition();
  recognition.continuous = true; // Keep recognition running
  recognition.lang = "en-US"; // Set language
  let stopR = false;

  // Start recognition
  function startRecognition() {
    recognition.start();
  }

  // Stop recognition
  function stopRecognition() {
    recognition.stop();
  }

  // Auto-restart recognition if not stopped manually
  recognition.onend = () => {
    if (!stopR) {
      setTimeout(startRecognition, 500);
    }
  };

  // Voice recognition starts
  recognition.onstart = () => console.log("Voice recognition active");

  // Voice recognition result processing
  recognition.onresult = (event) => {
    const transcript = event.results[event.resultIndex][0].transcript.toLowerCase();
    console.log("Heard:", transcript);

    if (transcript.includes("hello")) {
      readOut("Hello! My name is Bing. How may I help you?");
    } 
    if (transcript.includes("what is score")) {
      readOut("Hello! My name is Bing. How may I help you?");
    }
    if (transcript.includes("tell me today's date")) {
      readOut("today is 25 january 2025");
    }
    else if (transcript.includes("tell me top news")) {
      readOut("These are the top news headlines.");
      getNews(); // Fetch and read out the news
    } 
    else if (transcript.includes("open youtube")) {
      readOut("Opening YouTube.");
      window.open("https://www.youtube.com/");
    } 
    else if (transcript.includes("play")) {
      const query = transcript.replace("play", "").trim().replace(/ /g, "+");
      readOut(`Searching YouTube for ${query}`);
      window.open(`https://www.youtube.com/results?search_query=${query}`);
    }
     else if (transcript.includes("open google")) {
      readOut("Opening Google.");
      window.open("https://www.google.com/");
    } 
    else if (transcript.includes("search for")) {
      const query = transcript.split("search for")[1]?.trim();
      if (query) {
        readOut(`Searching Google for ${query}`);
        window.open(`https://www.google.com/search?q=${query.replace(/ /g, "+")}`);
      } else {
        readOut("I didn't catch what to search for. Please try again.");
      }
    } else if (transcript.includes("open instagram")) {
      readOut("Opening Instagram.");
      window.open("https://www.instagram.com/");
    } else if (transcript.includes("shutdown")) {
      readOut("Goodbye! Shutting down voice recognition.");
      stopR = true;
      stopRecognition();
    } else if (transcript.includes("convert to micro version")) {
      convertToMicroVersion();
    } else if (transcript.includes("convert to normal")) {
      convertToNormal();
    }
  };

  // Resize the current tab content to a small box and hide all elements except the Start button
  function convertToMicroVersion() {
    document.body.style.width = "400px";
    document.body.style.height = "200px";
    document.body.style.margin = "0 auto";
    document.body.style.overflow = "hidden";
    document.body.style.transition = "all 0.3s ease";

    const allElements = document.querySelectorAll("body *");
    allElements.forEach((element) => {
      if (element !== StartBtn) {
        element.style.display = "none";
      }
    });

    StartBtn.style.display = "block";
    StartBtn.style.margin = "auto";

    readOut("The current tab has been resized, and all other elements are hidden except for the Start button.");
  }

  // Restore the content to its normal state
  function convertToNormal() {
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.body.style.margin = "0";
    document.body.style.overflow = "auto";

    const allElements = document.querySelectorAll("body *");
    allElements.forEach((element) => {
      element.style.display = "block";
    });

    readOut("The current tab has been restored to normal view.");
  }

  // Handle errors
  recognition.onerror = (event) => {
    console.error("Speech Recognition Error:", event.error);
    readOut("An error occurred with voice recognition. Please try again.");
  };

  // Onload function
  window.onload = () => {
    // Play audio first
    Aud.play();
     // .then(() => {
      //  console.log("Audio played successfully.");
        Aud.onended = () => {
          //readOut("");
          readOut("Launching successfully,      Hello! My name is Bing. How may I help you sir?");
          setTimeout(() => {
            startRecognition();
          }, 500);
        };
      }
    /////  .catch((err) => {
      ////  console.error("Audio playback failed:", err);
      //  readOut("Please ensure your browser allows autoplay for audio.");
//});
 // };

  // Start speech recognition on StartBtn click
  StartBtn.addEventListener("click", startRecognition);

  // Stop speech recognition on StopBtn click
  StopBtn.addEventListener("click", () => {
    stopR = true;
    stopRecognition();
    readOut("Voice recognition stopped.");
  });

  // Jarvis speech synthesis
  async function readOut(message) {
    const speech = new SpeechSynthesisUtterance(message);
    const voices = await ensureVoicesLoaded();
    speech.voice = voices[0] || speech.voice; // Use the first voice available
    speech.volume = 1; // Full volume
    window.speechSynthesis.speak(speech);
    console.log("Speaking:", message);
  }

  // Ensure voices are loaded
  function ensureVoicesLoaded() {
    return new Promise((resolve) => {
      const voices = speechSynthesis.getVoices();
      if (voices.length) {
        resolve(voices);
      } else {
        speechSynthesis.onvoiceschanged = () => resolve(speechSynthesis.getVoices());
      }
    });
  }
}
  
// News Setup
async function getNews() {
  const url = "https://newsapi.org/v2/top-headlines?country=in&apiKey=e5517130fad640a5945511df2e741493";
  try {
    const response = await fetch(url);
    const data = await response.json();
    const articles = data.articles.slice(0, 10); // Top 10 news
    for (const [index, article] of articles.entries()) {
      const message = `News ${index + 1}: ${article.title}`;
      await readOut(message);
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    readOut("Failed to fetch news. Please try again later.");
  }
}
