// Copyright 2024 wu
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { createContext, useState } from "react";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";

export const SubmitInfoContext = createContext<{
    title: string;
    mainContent: string;
    fileList: ImageUploadItem[];
    resetTitle: Function;
    resetMainContent: Function;
    setFileList: (items: ImageUploadItem[]) => void;
}>({
    title: "",
    mainContent: "",
    fileList: [],
    resetTitle: () => {},
    resetMainContent: () => {},
    setFileList: () => {}
});

export default function SubmitInfoProvider({ children }: { children: React.ReactElement<any, any> }): JSX.Element {
    const [title, setTitle] = useState("");

    const [mainContent, setMainContent] = useState("");

    const [fileList, setFileList] = useState<ImageUploadItem[]>([
        {
            url: "https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60",
        },
    ]);

    /**
     * 重置标题，并填入新标题
     *
     * @remarks
     *
     * @param newTitle - 新标题
     *
     * @beta
     */
    function resetTitle(newTitle: string) {
        setTitle(newTitle);
    }

    /**
     * 重置主要内容，并填入新主要内容
     *
     * @remarks
     *
     * @param newTitle - 新主要内容
     *
     * @beta
     */
    function resetMainContent(newMainContent: string) {
        setMainContent(newMainContent);
    }


    return <SubmitInfoContext.Provider value={{title, mainContent, resetTitle, fileList, setFileList, resetMainContent}}>{children}</SubmitInfoContext.Provider>;
}
