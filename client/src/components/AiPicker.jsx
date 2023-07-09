import React from "react";
import CustomButton from "./CustomButton";
import Loader from "./Loader";

const AiPicker = ({ prompt, setPrompt, generatingImg, handleSubmit }) => {
  return (
    <div className="aipicker-container">
      <textarea
        className="aipicker-textarea"
        rows={5}
        placeholder="Ask AI for Pattern..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="flex flex-wrap gap-3">
        {generatingImg ? (
          <div className="loader-container">
          <Loader />
          </div>
        ) : (
          <>
            <CustomButton
              type="outline"
              title="AI Logo"
              customStyles="text-xs"
              handleClick={() => handleSubmit("logo")}
            />
            <CustomButton
              type="filled"
              title={"AI Texture"}
              customStyles={"text-xs"}
              handleClick={() => handleSubmit("full")}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AiPicker;
