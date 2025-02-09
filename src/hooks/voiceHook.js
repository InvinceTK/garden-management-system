import { useEffect } from "react";

const useVoiceTrigger = (triggerPhrases, onTrigger) => {
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      console.log("Heard:", transcript);
      if (triggerPhrases.some(phrase => transcript.includes(phrase.toLowerCase()))) {
        onTrigger();
      }
    };

    recognition.start();

    return () => recognition.stop();
  }, [triggerPhrases, onTrigger]);
};

export default useVoiceTrigger;
