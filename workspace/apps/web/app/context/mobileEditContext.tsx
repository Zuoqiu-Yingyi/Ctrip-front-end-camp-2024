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
import { MutableRefObject, createContext, useRef, useState } from "react";
import { ImageUploadItem } from "antd-mobile/es/components/image-uploader";
import imageCompression from "browser-image-compression";
import { Toast } from "antd-mobile";
import { upload } from "@/utils/assets";
import { uploadDraft, uploadSubmit } from "@/utils/draft";
import CanvasDraw from "react-canvas-draw";
import { TRPC } from "../utils/trpc";
import { handleResponse } from "../utils/help";

export const SubmitInfoContext = createContext<{
    title: string;
    mainContent: string;
    fileList: ImageUploadItem[];
    user: MutableRefObject<TRPC>;
    resetTitle: Function;
    resetMainContent: Function;
    // setFileList: (items: ImageUploadItem[]) => void;
    setFileList: (items: ImageUploadItem[]) => void;
    addImage: Function;
    delImage: Function;
    uploadTrvalNote: Function;
    addDraw: Function;
    addPicture: Function
}>({
    title: "",
    mainContent: "",
    fileList: [],
    resetTitle: () => {},
    user: { current: new TRPC() },
    resetMainContent: () => {},
    addImage: () => {},
    setFileList: () => {},
    delImage: () => {},
    uploadTrvalNote: () => {},
    addDraw: () => {},
    addPicture: () => {}
});

export default function SubmitInfoProvider({ children }: { children: React.ReactElement<any, any> }): JSX.Element {
    const drawNum = useRef(0);

    const [title, setTitle] = useState("");

    const [mainContent, setMainContent] = useState("");

    const [fileList, setFileList] = useState<ImageUploadItem[]>([]);

    const uploadImages = useRef<Map<string, Blob>>(new Map());

    const user = useRef<TRPC>(new TRPC());

    const delImages = useRef<Set<string>>(new Set());

    async function submitNewItem() {
        const formData = new FormData();

        for (let item of uploadImages.current.values()) {
            formData.append("file[]", item);
        }

        const assetsUpload = await upload(formData);

        // if (handleResponse(assetsUpload).state === "fail") {
        //     throw Error("Error");;
        // }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const draft = {
                title: title,
                content: mainContent,
                assets: assetsUpload.data.successes.map((success: { uid: string }) => success.uid),
                coordinate: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    altitude_accuracy: position.coords.altitudeAccuracy,
                    heading: position.coords.heading,
                    speed: position.coords.speed,
                },
            };

            let draftId = await uploadDraft(draft, user.current);

            await uploadSubmit(draftId, user.current);
        });
    }

    async function submitNewDraft() {
        const formData = new FormData();

        for (let item of uploadImages.current.values()) {
            formData.append("file[]", item);
        }

        const assetsUpload = await upload(formData);

        navigator.geolocation.getCurrentPosition(async (position) => {
            const draft = {
                title: title,
                content: mainContent,
                assets: assetsUpload.data.successes.map((success: { uid: string }) => success.uid),
                coordinate: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    altitude_accuracy: position.coords.altitudeAccuracy,
                    heading: position.coords.heading,
                    speed: position.coords.speed,
                },
            };

            await uploadDraft(draft, user.current);
        });
    }

    async function uploadTrvalNote(type: "draft" | "submit") {
        console.log(fileList.length);

        console.log(uploadImages.current.size);

        console.log(delImages.current.size);

        if (title === "") {
            Toast.show({
                content: "标题不能为空",
                icon: "fail",
            });
        } else if (mainContent === "") {
            Toast.show({
                content: "内容不能为空",
                icon: "fail",
            });
        } else if (fileList.length !== uploadImages.current.size || delImages.current.size !== 0 || fileList.length === 0) {
            Toast.show({
                content: "图片未准备好",
                icon: "fail",
            });
        } else {
            try {

                if (type === "draft") {
                    await submitNewDraft();
                } else {
                    await submitNewItem();
                }

                Toast.show({
                    content: "上传完成！",
                    icon: "success",
                });

            } catch (error) {
                Toast.show({
                    content: "上传失败！",
                    icon: "fail",
                });
            }
        }
    }

    function addPicture(canvas: HTMLCanvasElement) {
        drawNum.current += 1;

        let drawIndex = drawNum.current;

        setFileList([
            ...fileList,
            {
                key: `picture-${drawIndex}`,
                url: canvas.toDataURL(),
            },
        ]);

        canvas.toBlob((blob: Blob | null) => {
        
            if (blob !== null) {

                imageCompression(blob, {
                    maxSizeMB: 0.6,
                    maxWidthOrHeight: 1080,
                    useWebWorker: true,
                }).then(function (compressedFile) {
                    if (!delImages.current.has(`picture-${drawIndex}`)) {
                        uploadImages.current.set(`draw-${drawIndex}`, compressedFile);
                    } else {
                        delImages.current.delete(`picture-${drawIndex}`);
                    }
                });                
            }

        });
    }

    function addDraw(draw: CanvasDraw | null) {
        drawNum.current += 1;

        let drawIndex = drawNum.current;

        setFileList([
            ...fileList,
            {
                key: `draw-${drawIndex}`,
                url: draw?.getDataURL("image/png", null, "#FFFFFF"),
            },
        ]);

        draw?.canvasContainer.children[1].toBlob((file: File) => {
            imageCompression(file, {
                maxSizeMB: 0.6,
                maxWidthOrHeight: 1080,
                useWebWorker: true,
            }).then(function (compressedFile) {
                if (!delImages.current.has(`draw-${drawIndex}`)) {
                    uploadImages.current.set(`draw-${drawIndex}`, compressedFile);
                } else {
                    delImages.current.delete(`draw-${drawIndex}`);
                }
            });
        });
    }

    function addImage(file: File) {
        imageCompression(file, {
            maxSizeMB: 0.6,
            maxWidthOrHeight: 1080,
            useWebWorker: true,
        }).then(function (compressedFile) {
            if (!delImages.current.has(file.name)) {
                uploadImages.current.set(file.name, compressedFile);
            } else {
                delImages.current.delete(file.name);
            }
        });

        return {
            key: file.name,
            url: URL.createObjectURL(file),
        };
    }

    function delImage(item: ImageUploadItem) {
        if (uploadImages.current.has(item.key as string)) {
            uploadImages.current.delete(item.key as string);
        } else {
            delImages.current.add(item.key as string);
        }

        return true;
    }

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

    return <SubmitInfoContext.Provider value={{ addPicture, user, title, uploadTrvalNote, mainContent, setFileList, resetTitle, fileList, resetMainContent, addImage, delImage, addDraw }}>{children}</SubmitInfoContext.Provider>;
}
