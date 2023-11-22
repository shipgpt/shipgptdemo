import React from "react";
import UploadButton from "./sources/uploadButton";
import YoutubeButton from "./sources/youtubeButton";
import WebButton from "./sources/webButton";
import { useSelector } from "react-redux";
import Bot from "./bot";
import FolderButton from "./sources/folderButton";
import VideoButton from "./sources/videoButton";
import AudioButton from "./sources/audioButton";

const SourceAndBot = () => {
  const currentSource = useSelector(
    (state) => state.entities.credentials?.currentSource
  );

  return (
    <>
      {currentSource == "file" ? (
        <div className="uploadOptions">
          <UploadButton />
        </div>
      ) : currentSource == "folder" ? (
        <div className="uploadOptions">
          {" "}
          <FolderButton />
        </div>
      ) : currentSource == "youtube" ? (
        <div className="uploadOptions">
          <YoutubeButton />
        </div>
      ) : currentSource == "website" ? (
        <div className="uploadOptions">
          <WebButton />
        </div>
      ) : currentSource == "video" ? (
        <div className="uploadOptions">
          <VideoButton />
        </div>
      ) : currentSource == "audio" ? (
        <div className="uploadOptions">
          <AudioButton />
        </div>
      ) : currentSource == "chat" ? (
        <Bot />
      ) : (
        <Bot />
      )}
    </>
  );
};

export default SourceAndBot;
