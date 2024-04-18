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
import { useTranslation } from "react-i18next";

import {
    //
    Toast,
    ImageUploadItem,
} from "antd-mobile";
import CanvasDraw from "react-canvas-draw";
import { nanoid } from "nanoid";
import { dequal } from "dequal";

import { upload } from "@/utils/assets";
import { type TRPC } from "@/utils/trpc";
import {
    //
    handleError,
    handleResponse,
} from "@/utils/message";
import {
    //
    type ICoordinate,
    type TCuid,
    type IDraft,
} from "@/types/response";
import {
    //
    imageOptimizer,
    uid2path,
} from "@/utils/image";
import { ClientContext } from "./client";
import {
    //
    canvas2blob,
    blob2dataURL,
    dataURL2blob,
} from "@/utils/file";

export enum DraftField {
    title,
    content,
    coordinate,
    assets,
}

export interface IImageUploadItemBaseExtra {
    uploaded: boolean;
}

export interface IImageUploadItemUploadedExtra extends IImageUploadItemBaseExtra {
    uploaded: true;
    uid: TCuid;
    index?: number;
}

export interface IImageUploadItemLocaleExtra extends IImageUploadItemBaseExtra {
    uploaded: false;
    file: Blob;
}

export type TImageUploadItemExtra = IImageUploadItemUploadedExtra | IImageUploadItemLocaleExtra;

export interface IImageUploadItem extends ImageUploadItem {
    key: string;
    extra: TImageUploadItemExtra;
}

export const SubmitInfoContext = createContext<{
    client: MutableRefObject<TRPC>;
    changed: MutableRefObject<Set<DraftField>>;
    original: IDraft | null;

    id: number | null;
    title: string;
    content: string;
    coordinate: ICoordinate | null;

    fileList: ImageUploadItem[];
    fileListMaxCount: number;

    init: () => void;
    queryDraft: (id: number) => any;

    setId: (id: number | null) => void;

    setFileList: (items: IImageUploadItem[]) => void;

    updateTitle: (title: string) => void;
    updateContent: (content: string) => void;
    uploadTravelNote: (type: "draft" | "publish") => Promise<void>;

    addDraw: (draw: CanvasDraw) => Promise<void>;
    addPhoto: (canvas: HTMLCanvasElement) => Promise<void>;
    addFiles: (files: FileList) => Promise<void>;

    addImage: (file: File) => Promise<IImageUploadItem>;
    delImage: (item: ImageUploadItem) => boolean;

    updateCoordinate: () => Promise<ICoordinate | null>;
    deleteCoordinate: () => void;
}>(undefined as any);

export default function SubmitInfoProvider({ children }: { children: React.ReactElement<any, any> }): JSX.Element {
    const { t } = useTranslation();
    const { trpc } = useContext(ClientContext);

    const client = useRef(trpc);
    const changed = useRef(new Set<DraftField>());

    const [id, setId] = useState<number | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [coordinate, setCoordinate] = useState<ICoordinate | null>(null);

    const [fileList, setFileList] = useState<IImageUploadItem[]>([]);
    const [original, setOriginal] = useState<IDraft | null>(null);

    const fileListMaxCount = 9;

    /**
     * 批量上传资源文件
     */
    async function uploadAssets(): Promise<IImageUploadItem[]> {
        const formData = new FormData();

        fileList.forEach((item) => {
            if (item.extra.uploaded === false) {
                formData.append(item.key, item.extra.file);
            }
        });

        try {
            const response = await upload(formData);
            handleResponse(response);
            const successes = response.data.successes;
            const file_list = fileList.map<IImageUploadItem>((item) => {
                const success = successes.find((success) => success.fieldname === item.key);
                if (success) {
                    return {
                        key: `asset-${success.uid}`,
                        url: uid2path(success.uid),
                        extra: {
                            uploaded: true,
                            uid: success.uid,
                        },
                    };
                } else {
                    return item;
                }
            });
            setFileList(file_list);
            return file_list;
        } catch (error) {
            handleError(error);
            return fileList;
        }
    }

    /**
     * 更新草稿
     */
    async function uploadTravelNote(type: "draft" | "publish") {
        // console.debug(fileList.length);

        if (title === "") {
            Toast.show({
                content: t("input.draft.title.rules.required.message"),
                icon: "fail",
            });
            return;
        }

        if (title.length > 32) {
            Toast.show({
                content: t("input.draft.title.rules.length.message"),
                icon: "fail",
            });
            return;
        }

        if (content === "") {
            Toast.show({
                content: t("input.draft.content.rules.required.message"),
                icon: "fail",
            });
            return;
        }

        if (fileList.length < 1) {
            Toast.show({
                content: t("input.draft.assets.rules.required.message"),
                icon: "fail",
            });
            return;
        }

        if (fileList.length > fileListMaxCount) {
            Toast.show({
                content: t("input.draft.assets.rules.length.message", { maxCount: fileListMaxCount }),
                icon: "fail",
            });
            return;
        }

        const file_list = await uploadAssets(); // 上传未上传的图片
        const assets = file_list //
            .filter((item) => item.extra.uploaded)
            .map((item) => (item.extra as IImageUploadItemUploadedExtra).uid);

        if (assets.length < file_list.length) {
            Toast.show({
                content: t("input.draft.assets.rules.un-uploaded.message"),
                icon: "fail",
            });
            return;
        }

        if (
            dequal(
                assets,
                original?.assets.map((asset) => asset.asset_uid),
            )
        ) {
            changed.current.delete(DraftField.assets);
        } else {
            changed.current.add(DraftField.assets);
        }

        switch (type) {
            default:
            case "draft":
                if (changed.current.size > 0) {
                    const state = await createOrUpdateDraft(assets);
                    switch (state) {
                        case 0:
                        default:
                            break;

                        case 1:
                            Toast.show({
                                content: t("actions.draft.create.prompt.success"),
                                icon: "success",
                            });
                            break;

                        case 2:
                            Toast.show({
                                content: t("actions.draft.update.prompt.success"),
                                icon: "success",
                            });
                            break;
                    }
                }
                break;

            case "publish": {
                const state = await publishDraft(assets);
                if (state) {
                    Toast.show({
                        content: t("actions.draft.publish.prompt.success"),
                        icon: "success",
                    });
                }
                break;
            }
        }
    }

    /**
     * 创建或更新草稿
     */
    async function createOrUpdateDraft(assets: TCuid[]): Promise<number> {
        try {
            const response = id
                ? await client.current.draft.update.mutate({
                      id,
                      title: changed.current.has(DraftField.title) ? title : undefined,
                      content: changed.current.has(DraftField.content) ? content : undefined,
                      coordinate: changed.current.has(DraftField.coordinate) ? coordinate : undefined,
                      assets: changed.current.has(DraftField.assets) ? assets : undefined,
                  })
                : await client.current.draft.create.mutate({
                      title,
                      content,
                      coordinate,
                      assets,
                  });
            handleResponse(response);

            const draft: IDraft = response.data?.draft as any;

            setId(draft.id);
            setOriginal(draft);

            changed.current.clear();

            return id ? 2 : 1;
        } catch (error) {
            handleError(error);
            return 0;
        }
    }

    /**
     * 发布草稿
     */
    async function publishDraft(assets: TCuid[]): Promise<boolean> {
        if (changed.current.size > 0) {
            const state = await createOrUpdateDraft(assets);
            if (!state) return false;
        }

        if (id) {
            try {
                const response = await client.current.review.submit.mutate({ draft_id: id });
                handleResponse(response);
                return true;
            } catch (error) {
                handleError(error);
                return false;
            }
        }
        return false;
    }

    /**
     * 更新坐标
     */
    async function updateCoordinate(): Promise<ICoordinate | null> {
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
            const coordinate = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude,
                altitude_accuracy: position.coords.altitudeAccuracy,
                heading: position.coords.heading,
                speed: position.coords.speed,
            } satisfies ICoordinate;
            if (dequal(coordinate, original?.coordinate)) {
                changed.current.delete(DraftField.coordinate);
            } else {
                changed.current.add(DraftField.coordinate);
            }
            setCoordinate(coordinate);

            Toast.show({
                content: t("actions.draft.coordinate.update.prompt.success"),
                icon: "success",
            });
            return coordinate;
        } else {
            Toast.show({
                content: t("actions.draft.coordinate.update.prompt.fail"),
                icon: "fail",
            });
            return null;
        }
    }

    /**
     * 删除坐标
     */
    function deleteCoordinate() {
        if (dequal(null, original?.coordinate)) {
            changed.current.delete(DraftField.coordinate);
        } else {
            changed.current.add(DraftField.coordinate);
        }
        Toast.show({
            content: t("actions.draft.coordinate.delete.prompt.success"),
            icon: "success",
        });
        setCoordinate(null);
    }

    /**
     * 添加画板的绘图
     */
    async function addDraw(draw: CanvasDraw) {
        // console.debug(draw);

        // @ts-ignore
        const url = draw.getDataURL(
            //
            "image/png", // 图片格式
            null, // 背景图片
            "#FFFFFF", // 背景颜色
        );
        const blob = dataURL2blob(url);
        if (blob) {
            const key = `draw-${nanoid()}`;
            const file = await imageOptimizer(new File([blob], `${key}.png`, { type: blob.type }));

            setFileList([
                ...fileList,
                {
                    key,
                    url,
                    extra: {
                        uploaded: false,
                        file,
                    },
                },
            ]);
        }
    }

    /**
     * 添加系统相机拍摄的文件列表
     */
    async function addFiles(files: FileList) {
        const images: IImageUploadItem[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            if (file) {
                const item = await addImage(file);
                images.push(item);
            }
        }
        setFileList([...fileList, ...images]);
    }

    /**
     * 添加拍摄的照片
     */
    async function addPhoto(canvas: HTMLCanvasElement) {
        const key = `photo-${nanoid()}`;
        const blob = await canvas2blob(canvas);

        if (blob) {
            const url = canvas.toDataURL("image/webp");
            const file = await imageOptimizer(new File([blob], `${key}.webp`, { type: blob.type }));

            setFileList([
                ...fileList,
                {
                    key,
                    url,
                    extra: {
                        uploaded: false,
                        file,
                    },
                },
            ]);
        }
    }

    /**
     * 相册组件添加图片
     */
    async function addImage(file: File): Promise<IImageUploadItem> {
        const compressedFile = await imageOptimizer(file);
        const key = `file-${nanoid()}`;
        const url = await blob2dataURL(compressedFile);

        return {
            key,
            url,
            extra: {
                uploaded: false,
                file: compressedFile,
            },
        };
    }

    /**
     * 相册组件删除图片
     */
    function delImage(item: ImageUploadItem): boolean {
        const file_list = fileList.filter((file) => file.key !== item.key);
        if (file_list.length < fileList.length) {
            setFileList(file_list);
            return true;
        } else {
            return false;
        }
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
    function updateTitle(newTitle: string) {
        if (dequal(newTitle, original?.title)) {
            changed.current.delete(DraftField.title);
        } else {
            changed.current.add(DraftField.title);
        }
        setTitle(newTitle);
    }

    /**
     * 重置正文，并填入新主要内容
     *
     * @remarks
     *
     * @param newContent - 新正文
     *
     * @beta
     */
    function updateContent(newContent: string) {
        if (dequal(newContent, original?.content)) {
            changed.current.delete(DraftField.content);
        } else {
            changed.current.add(DraftField.content);
        }
        setContent(newContent);
    }

    /**
     * 查询草稿内容
     */
    async function queryDraft(id_: number) {
        try {
            const response = await client.current.draft.list.query({ ids: [id_] });
            handleResponse(response);
            const drafts: IDraft[] = (response.data?.drafts as any[]) ?? [];
            if (drafts.length > 0) {
                const draft = drafts[0];
                setOriginal(draft);

                setTitle(draft.title);
                setContent(draft.content);
                setCoordinate(draft.coordinate);
                setFileList(
                    draft.assets.map((asset) => {
                        return {
                            key: `asset-${asset.asset_uid}`,
                            url: uid2path(asset.asset_uid),
                            extra: {
                                uploaded: true,
                                uid: asset.asset_uid,
                                index: asset.index,
                            },
                        };
                    }),
                );
            }
        } catch (error) {
            handleError(error);
        }
    }

    /**
     * 初始化
     */
    function init() {
        setId(null);
        setTitle("");
        setContent("");
        setCoordinate(null);
        setFileList([]);
        setOriginal(null);
        changed.current.clear();
    }

    return (
        <SubmitInfoContext.Provider
            value={{
                client,
                changed,
                original,

                id,
                title,
                content,
                coordinate,

                fileList,
                fileListMaxCount,

                init,
                queryDraft,

                setId,
                setFileList,

                updateTitle,
                updateContent,
                uploadTravelNote,

                addDraw,
                addPhoto,
                addFiles,

                addImage,
                delImage,

                updateCoordinate,
                deleteCoordinate,
            }}
        >
            {children}
        </SubmitInfoContext.Provider>
    );
}
