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
    CSSProperties,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
    //
    Layout,
    FloatButton,
} from "antd";
import { ActionSheet, Popover } from "antd-mobile";
import {
    //
    CameraOutline,
    CheckOutline,
    DeleteOutline,
    MoreOutline,
    PictureOutline,
    PlayOutline,
    StopOutline,
    UserCircleOutline,
} from "antd-mobile-icons";
import {
    //
    openCamera,
    getPicture,
    closeCamera,
} from "@/utils/camera";
import { SubmitInfoContext } from "@/contexts/mobileEditContext";
import { useStore } from "@/contexts/store";

export default function EditCameraTab(): JSX.Element {
    const { t } = useTranslation();
    const { mode } = useStore.getState();
    const {
        //
        addPhoto,
        addFiles,
    } = useContext(SubmitInfoContext);

    const cameraVideoRef = useRef<HTMLVideoElement>(null);
    const cameraReviewRef = useRef<HTMLCanvasElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const [onVideo, setOnVideo] = useState<boolean>(true);
    const [viewfinderOpened, setViewfinderOpened] = useState<boolean>(false);

    useEffect(() => {
        switchViewfinder(true);

        return () => {
            switchViewfinder(false);
        };
    }, []);

    function switchViewfinder(open: boolean) {
        if (open) {
            openCamera(cameraVideoRef, cameraReviewRef);
            setViewfinderOpened(true);
        } else {
            closeCamera(cameraVideoRef);
            setViewfinderOpened(false);
        }
    }

    /**
     * 拍摄照片
     */
    function photograph() {
        getPicture(cameraVideoRef, cameraReviewRef);
        setOnVideo(false);
    }

    /**
     * 调用系统相机
     */
    function callSystemCamera(capture: "user" | "environment") {
        const input = cameraInputRef.current;
        if (input) {
            input.capture = capture;
            input.onchange = async () => {
                if (input.files) {
                    await addFiles(input.files);
                }
            };
            input.click();
        }
    }

    const bottom_style: CSSProperties = {
        bottom: "64px",
        height: "16vw",
        width: "16vw",
    }; // 按钮样式
    const bottom_icon_style: CSSProperties = {
        height: "7vw",
        width: "7vw",
        marginLeft: "-1vw",
    }; // 按钮图标样式

    return (
        <Layout style={{ flex: 1 }}>
            <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                style={{
                    display: "none",
                }}
            />
            <video
                ref={cameraVideoRef}
                style={{
                    display: onVideo ? "block" : "none",
                }}
            />
            <canvas
                ref={cameraReviewRef}
                style={{
                    margin: "0.5em",
                    border: "1px solid var(--adm-color-text)",
                    display: !onVideo ? "block" : "none",
                }}
            />

            {/* 开启/关闭 取景器 */}
            {viewfinderOpened ? (
                <FloatButton
                    style={{
                        ...bottom_style,
                        left: "16vw",
                    }}
                    icon={<StopOutline style={bottom_icon_style} />}
                    onClick={() => {
                        switchViewfinder(false);
                    }}
                    aria-label={t("aria.close")}
                />
            ) : (
                <FloatButton
                    style={{
                        ...bottom_style,
                        left: "16vw",
                    }}
                    icon={<PlayOutline style={bottom_icon_style} />}
                    onClick={() => {
                        switchViewfinder(true);
                    }}
                    aria-label={t("aria.open")}
                />
            )}

            {onVideo ? (
                <>
                    {/* 拍摄按钮 */}
                    <FloatButton
                        style={{
                            ...bottom_style,
                            right: "42vw",
                        }}
                        icon={<CameraOutline style={bottom_icon_style} />}
                        onClick={photograph}
                        aria-label={t("aria.take-photo")}
                    />

                    {/* 菜单按钮 */}
                    <Popover.Menu
                        actions={[]}
                        mode={mode}
                        trigger="click"
                        placement="top-end"
                    >
                        <FloatButton
                            style={{
                                ...bottom_style,
                                right: "16vw",
                            }}
                            icon={<MoreOutline style={bottom_icon_style} />}
                            aria-label={t("aria.menu")}
                            onClick={() => {
                                ActionSheet.show({
                                    actions: [
                                        {
                                            key: "rear",
                                            text: (
                                                <>
                                                    <PictureOutline />
                                                    &ensp;
                                                    {t("labels.cameras.rear")}
                                                </>
                                            ),
                                            description: t("labels.cameras.system"),
                                            onClick: () => callSystemCamera("environment"),
                                        },
                                        {
                                            key: "front",
                                            text: (
                                                <>
                                                    <UserCircleOutline />
                                                    &ensp;
                                                    {t("labels.cameras.front")}
                                                </>
                                            ),
                                            description: t("labels.cameras.system"),
                                            onClick: () => callSystemCamera("user"),
                                        },
                                    ],
                                });
                            }}
                        />
                    </Popover.Menu>
                </>
            ) : (
                <>
                    {/* 确认按钮 */}
                    <FloatButton
                        style={{
                            ...bottom_style,
                            right: "42vw",
                        }}
                        icon={<CheckOutline style={bottom_icon_style} />}
                        onClick={() => {
                            if (cameraReviewRef.current) {
                                addPhoto(cameraReviewRef.current);
                            }
                            setOnVideo(true);
                        }}
                        aria-label={t("aria.confirm")}
                    />

                    {/* 取消按钮 */}
                    <FloatButton
                        style={{
                            right: "16vw",
                            bottom: "64px",
                            height: "16vw",
                            width: "16vw",
                        }}
                        icon={<DeleteOutline style={bottom_icon_style} />}
                        onClick={() => {
                            setOnVideo(true);
                        }}
                        aria-label={t("aria.cancel")}
                    />
                </>
            )}
        </Layout>
    );
}
