import Sidebar from "@/src/components/sidebar/sidebar";
import SourceAndBot from "@/src/components/sourceAndBot";
import { useDispatch, useSelector } from "react-redux";
import { getUserFiles, getdataOnHome } from "@/src/store/credentials";
import { useEffect } from "react";

export default function Home() {
  const showChatMobile = useSelector(
    (state) => state?.entities?.credentials?.showChatMobile
  );

  const dispatch = useDispatch();

  const files = useSelector((state) => getUserFiles(state));

  const getDataForuser = async () => {
    let file_data = (await JSON.parse(localStorage.getItem(`file_data`))) || [];
    let assign_data =
      (await JSON.parse(localStorage.getItem(`asign_data`))) || [];
    let folder_data =
      (await JSON.parse(localStorage.getItem(`folder_data`))) || [];

    dispatch(getdataOnHome({ file_data, folder_data, assign_data }));
  };

  useEffect(() => {
    if (!files?.length) getDataForuser();
  }, []);

  return (
    <div className="m-5 pt-5 ">
      <div
        className={`row border rounded px-sm-0 mt-sm-0 mt-5 mb-sm-0 mb-3 px-0 mx-2`}
      >
        <div
          className="col-2 px-0 bg-white"
          style={{
            borderRight: "1px solid lightgrey",
            display: showChatMobile ? "none" : "block",
          }}
        >
          <Sidebar />
        </div>

        <div
          className={`col-${
            showChatMobile ? "12" : "10"
          } col-sm-10 px-0  messageAreaBox`}
        >
          <SourceAndBot />
        </div>
      </div>
    </div>
  );
}
