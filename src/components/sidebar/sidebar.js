import React from "react";
import styles from "./sidebar.module.scss";
import { BsGlobe2 } from "react-icons/bs";
import { BsChatLeftText, BsFolderCheck } from "react-icons/bs";
import {
  AiOutlineYoutube,
  AiOutlineFileText,
  AiOutlineAudio,
} from "react-icons/ai";
import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";
import { BiVideo } from "react-icons/bi";
import { ViewPoint } from "../libs/common";
import { setCurrentSource } from "@/src/store/credentials";

const Sidebar = () => {
  const dispatch = useDispatch();

  const currentSource = useSelector(
    (state) => state.entities.credentials?.currentSource
  );

  const list = [
    {
      name: "Files",
      icon: <AiOutlineFileText />,
      value: "file",
    },
    {
      name: "Chat",
      icon: <BsChatLeftText />,
      value: "chat",
    },
    {
      name: "Folder",
      icon: <BsFolderCheck />,
      value: "folder",
    },
    {
      name: "Youtube",
      icon: <AiOutlineYoutube />,
      value: "youtube",
    },
    {
      name: "Website",
      icon: <BsGlobe2 />,
      value: "website",
    },
    {
      name: "Video",
      icon: <BiVideo />,
      value: "video",
    },
    {
      name: "Audio",
      icon: <AiOutlineAudio />,
      value: "audio",
    },
  ];

  const view = ViewPoint("700px");

  return (
    <>
      <div className={styles.container}>
        <div className={styles.side}>
          <ul className={`ps-0 ${styles.ul} `}>
            {list?.map((l) => {
              return (
                <li
                  className={styles.li}
                  style={{
                    backgroundColor:
                      currentSource == l?.value ? "rgb(43 43 43)" : "",
                  }}
                  onClick={() => dispatch(setCurrentSource(l?.value))}
                >
                  <span
                    style={{
                      color: currentSource == l?.value ? "white" : "",
                    }}
                    className={`${!view ? "mb-1 mt-2" : "mb-0"} ${styles.a}`}
                  >
                    {l?.icon}
                  </span>
                  <p
                    style={{
                      color: currentSource == l?.value ? "white" : "",
                    }}
                    className={`${!view ? "d-none" : "mb-1"} ${styles.p}`}
                  >
                    {l?.name}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
