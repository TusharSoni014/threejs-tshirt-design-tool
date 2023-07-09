import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import "./style.scss";
import state from "../store";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, DecalTypes, FilterTabs } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import downloadImg from "../assets/download.png";
import github from "../assets/github.png";
import {
  AiPicker,
  ColorPicker,
  FilePicker,
  CustomButton,
  Tab,
} from "../components";
import { toast } from "react-hot-toast";

const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatingImg, setGeneratingImg] = useState(false);

  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });

  //show tab content according to active tab selection
  const genetateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return (
          <AiPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (type) => {
    if (!prompt) {
      toast.error("Please Type Something");
    } else {
      try {
        //call backend api function
        setGeneratingImg(true);
        const response = await fetch("http://localhost:4000/api/v1/dalle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });
        const data = await response.json();
        handleDecals(type, `data:image/png;base64,${data.image}`);
      } catch (error) {
        toast.error("Something went wrong. Please try again later.");
      } finally {
        setGeneratingImg(false);
        setActiveEditorTab("");
      }
    }
  };

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result;

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  const handleRedirectToGithub = () => {
    const url = "https://github.com/tusharsoni014";
    window.open(url, "_blank");
  };

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;

      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        break;
    }
    //update the ui after a tab is activated
    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      };
    });
  };

  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="customizer-btn-container absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="editor-btns-container flex item-center">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab, index) => {
                  return (
                    <Tab
                      key={tab.name}
                      tab={tab}
                      handleClick={() => {
                        if (activeEditorTab == tab.name) {
                          setActiveEditorTab("");
                        } else {
                          setActiveEditorTab(tab.name);
                        }
                      }}
                    />
                  );
                })}
                {genetateTabContent()}
              </div>
            </div>
          </motion.div>
          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              title={"Go Back"}
              type="filled"
              handleClick={() => (state.intro = true)}
              customStyles={"w-fit px-4 py-2.5 font-bold text-sm"}
            />
          </motion.div>
          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab, index) => {
              return (
                <Tab
                  key={tab.name}
                  isFilterTab
                  isActiveTab={activeFilterTab[tab.name]}
                  tab={tab}
                  handleClick={() => handleActiveFilterTab(tab.name)}
                />
              );
            })}
            <Tab
              key="download-btn"
              isFilterTab
              tab={{
                name: "Download",
                icon: downloadImg,
              }}
              handleClick={() => downloadCanvasToImage()}
            />
            <Tab
              key="github-btn"
              isFilterTab
              tab={{
                name: "github",
                icon: github,
              }}
              handleClick={handleRedirectToGithub}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
