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
    useRef,
    useState,
} from "react";
import {
    //
    Toast,
    ImageUploadItem,
} from "antd-mobile";
import CanvasDraw from "react-canvas-draw";

import { upload } from "@/utils/assets";
import {
    //
    uploadDraft,
    uploadSubmit,
} from "@/utils/draft";
import { trpc } from "@/utils/trpc";
import { handleError } from "@/utils/message";
import { IDraft } from "@/types/response";
import { imageOptimizer, uid2path } from "@/utils/image";
import { blob2dataURL } from "@/utils/file";

export enum DraftField {
    title,
    content,
    coordinate,
    assets,
}

export const SubmitInfoContext = createContext<{
    id: number | null;
    title: string;
    mainContent: string;
    fileList: ImageUploadItem[];
    coordinate?: GeolocationCoordinates;
    assets: string[];
    user: MutableRefObject<typeof trpc>;
    saved: boolean;

    queryDraft: (id: number) => any;

    setId: (id: number | null) => void;
    setAssets: (assets: string[]) => void;
    setSaved: (saved: boolean) => void;
    setFileList: (items: ImageUploadItem[]) => void;

    resetTitle: Function;
    resetMainContent: Function;
    // setFileList: (items: ImageUploadItem[]) => void;
    uploadTravelNote: Function;

    addImage: (file: File) => ImageUploadItem;
    delImage: (item: ImageUploadItem) => boolean;
    addDraw: (draw: CanvasDraw | null) => void;
    addPicture: (canvas: HTMLCanvasElement) => void;
    addFileList: (files: FileList) => void;

    updateCoordinate: Function;
    deleteCoordinate: Function;
}>(undefined as any);

export default function SubmitInfoProvider({ children }: { children: React.ReactElement<any, any> }): JSX.Element {
    const drawNum = useRef(0);

    const [id, setId] = useState<number | null>(null);
    const [title, setTitle] = useState("");
    const [mainContent, setMainContent] = useState("");
    const [coordinate, setCoordinate] = useState<GeolocationCoordinates | undefined>();
    const [assets, setAssets] = useState<string[]>([]);

    const [saved, setSaved] = useState(true);
    const changed = useRef(new Set<DraftField>());

    const [fileList, setFileList] = useState<ImageUploadItem[]>([]);

    const uploadImages = useRef<Map<string, Blob>>(new Map());

    const user = useRef(trpc);

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

        const draft = {
            title: title,
            content: mainContent,
            coordinate: coordinate,
            assets: assetsUpload.data.successes.map((success: { uid: string }) => success.uid),
        };
        const draftId = await uploadDraft(draft, user.current);
        await uploadSubmit(draftId, user.current);
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
        await uploadDraft(draft, user.current);
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
                // TODO: 重构以区分创建与更新
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
            changed.current.add(DraftField.coordinate);
            setCoordinate(position.coords);
            return position.coords;
        } else {
            return null;
        }
    }

    function deleteCoordinate() {
        changed.current.add(DraftField.coordinate);
        setCoordinate(undefined);
    }

    function addFileList(files: FileList) {
        const images: ImageUploadItem[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            if (file) {
                images.push(addImage(file));
            }
        }
        setFileList([...fileList, ...images]);
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

        canvas.toBlob(async (blob: Blob | null) => {
            if (blob !== null) {
                const compressedFile = await imageOptimizer(new File([blob], "temp.png"));
                if (!delImages.current.has(`picture-${drawIndex}`)) {
                    uploadImages.current.set(`draw-${drawIndex}`, compressedFile);
                } else {
                    delImages.current.delete(`picture-${drawIndex}`);
                }
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
        draw?.canvasContainer.children[1].toBlob(async (file: File) => {
            const compressedFile = await imageOptimizer(file);
            if (!delImages.current.has(`draw-${drawIndex}`)) {
                uploadImages.current.set(`draw-${drawIndex}`, compressedFile);
            } else {
                delImages.current.delete(`draw-${drawIndex}`);
            }
        });
    }

    function addImage(file: File): ImageUploadItem {
        imageOptimizer(file).then(function (compressedFile) {
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

    /**
     * 删除图片
     */
    function delImage(item: ImageUploadItem) {
        if (uploadImages.current.has(item.key as string)) {
            uploadImages.current.delete(item.key as string);
            URL.revokeObjectURL(item.url);
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
        changed.current.add(DraftField.title);
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
        changed.current.add(DraftField.content);
        setMainContent(newMainContent);
    }

    /**
     * 查询草稿内容
     */
    async function queryDraft(id_: number) {
        try {
            const response = await user.current.draft.list.query({ ids: [id_] });
            handleError(response);
            const drafts: IDraft[] = (response.data?.drafts as any[]) ?? [];
            if (drafts.length > 0) {
                const draft = drafts[0];
                setTitle(draft.title);
                setMainContent(draft.content);
                setCoordinate(
                    draft.coordinate
                        ? {
                              latitude: draft.coordinate.latitude,
                              longitude: draft.coordinate.longitude,
                              accuracy: draft.coordinate.accuracy,
                              altitude: draft.coordinate.altitude,
                              altitudeAccuracy: draft.coordinate.altitude_accuracy,
                              heading: draft.coordinate.heading,
                              speed: draft.coordinate.speed,
                          }
                        : undefined,
                );
                setFileList(
                    draft.assets.map((asset) => {
                        return {
                            key: `asset-${asset.index}`,
                            url: uid2path(asset.asset_uid),
                            extra: asset,
                        };
                    }),
                );
            }
        } catch (error) {}
    }

    return (
        <SubmitInfoContext.Provider
            value={{
                user,
                saved,

                id,
                title,
                mainContent,
                coordinate,
                assets,

                fileList,

                queryDraft,

                setId,
                setAssets,
                setSaved,
                setFileList,

                addPicture,
                uploadTravelNote,
                resetTitle,
                resetMainContent,

                addImage,
                delImage,
                addDraw,
                addFileList,

                updateCoordinate,
                deleteCoordinate,
            }}
        >
            {children}
        </SubmitInfoContext.Provider>
    );
}
