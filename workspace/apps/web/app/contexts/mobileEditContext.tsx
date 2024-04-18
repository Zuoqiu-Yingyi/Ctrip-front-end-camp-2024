/**
 * Copyright (C) 2024 wu
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
    //
    MutableRefObject,
    createContext,
    useContext,
    useRef,
    useState,
} from "react";
import {
    //
    Toast,
    ImageUploadItem,
} from "antd-mobile";
import imageCompression from "browser-image-compression";
import CanvasDraw from "react-canvas-draw";

import { upload } from "@/utils/assets";
import {
    //
    uploadDraft,
    uploadSubmit,
} from "@/utils/draft";
import { trpc } from "@/utils/trpc";
import { ClientContext } from "./client";

export const SubmitInfoContext = createContext<{
    id: number | null;
    title: string;
    mainContent: string;
    fileList: ImageUploadItem[];
    coordinate?: GeolocationCoordinates;
    // user: MutableRefObject<typeof trpc>;
    saved: boolean;

    setId: (id: number | null) => void;
    setSaved: (saved: boolean) => void;

    resetTitle: Function;
    resetMainContent: Function;
    // setFileList: (items: ImageUploadItem[]) => void;
    setFileList: (items: ImageUploadItem[]) => void;
    addImage: Function;
    delImage: Function;
    uploadTravelNote: Function;
    addDraw: Function;
    addPicture: Function;
    updateCoordinate: Function;
    deleteCoordinate: Function;
}>(undefined as any);

export default function SubmitInfoProvider({ children }: { children: React.ReactElement<any, any> }): JSX.Element {
    const drawNum = useRef(0);

    const [id, setId] = useState<number | null>(null);

    const [title, setTitle] = useState("");

    const [mainContent, setMainContent] = useState("");

    const [saved, setSaved] = useState(true);

    const [fileList, setFileList] = useState<ImageUploadItem[]>([]);

    const [coordinate, setCoordinate] = useState<GeolocationCoordinates | undefined>();

    const uploadImages = useRef<Map<string, Blob>>(new Map());

    // const user = useRef(trpc);

    const { trpc } = useContext(ClientContext);

    const delImages = useRef<Set<string>>(new Set());

    async function submitNewItem() {
        const formData = new FormData();

        console.debug(uploadImages.current);

        for (let item of uploadImages.current.values()) {
            formData.append("file[]", item);
        }

        const assetsUpload = await upload(formData);

        console.debug(assetsUpload.data);

        const draft = {
            title: title,
            content: mainContent,
            coordinate: coordinate,
            assets: assetsUpload.data.successes.map((success: { uid: string }) => success.uid),
        };
        const draftId = await uploadDraft(draft, trpc);
        await uploadSubmit(draftId, trpc);
    }

    async function submitNewDraft() {
        const formData = new FormData();

        for (let item of uploadImages.current.values()) {
            formData.append("file[]", item);
        }

        const assetsUpload = await upload(formData);

        const draft = {
            title: title,
            content: mainContent,
            coordinate: coordinate,
            assets: assetsUpload.data.successes.map((success: { uid: string }) => success.uid),
        };
        await uploadDraft(draft, trpc);
    }

    async function uploadTravelNote(type: "draft" | "submit") {
        console.debug(fileList.length);
        console.debug(uploadImages.current.size);
        console.debug(delImages.current.size);

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
        } else if (
            //
            fileList.length !== uploadImages.current.size ||
            delImages.current.size !== 0 ||
            fileList.length === 0
        ) {
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

    async function updateCoordinate() {
        const position = await new Promise<GeolocationPosition | null>((resolve) => {
            navigator.geolocation.getCurrentPosition(
                //
                resolve,
                () => resolve(null),
                {
                    timeout: 8_000,
                },
            );
        });
        if (position) {
            setCoordinate(position.coords);
            return position.coords;
        } else {
            return null;
        }
    }

    function deleteCoordinate() {
        setCoordinate(undefined);
    }

    function addPicture(canvas: HTMLCanvasElement) {

        drawNum.current += 1;

        const drawIndex = drawNum.current;

        setFileList([
            ...fileList,
            {
                key: `picture-${drawIndex}`,
                url: canvas.toDataURL(),
            },
        ]);

        canvas.toBlob((blob: Blob | null) => {
            if (blob !== null) {
                imageCompression(new File([blob], "temp.png"), {
                    maxSizeMB: 0.6,
                    maxWidthOrHeight: 1080,
                    useWebWorker: true,
                }).then(function (compressedFile) {
                    if (!delImages.current.has(`picture-${drawIndex}`)) {
                        uploadImages.current.set(`picture-${drawIndex}`, compressedFile);
                    } else {
                        delImages.current.delete(`picture-${drawIndex}`);
                    }
                });
            }
        });
    }

    function addDraw(draw: CanvasDraw | null) {

        drawNum.current += 1;

        const drawIndex = drawNum.current;

        setFileList([
            ...fileList,
            {
                key: `draw-${drawIndex}`,
                // @ts-ignore
                url: draw?.getDataURL("image/png", null, "#FFFFFF"),
            },
        ]);

        // @ts-ignore
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

    return (
        <SubmitInfoContext.Provider
            value={{
                saved,

                id,
                title,
                mainContent,
                coordinate,
                fileList,

                setId,
                setSaved,

                addPicture,
                uploadTravelNote,
                setFileList,
                resetTitle,
                resetMainContent,
                addImage,
                delImage,
                addDraw,
                updateCoordinate,
                deleteCoordinate,
            }}
        >
            {children}
        </SubmitInfoContext.Provider>
    );
}
