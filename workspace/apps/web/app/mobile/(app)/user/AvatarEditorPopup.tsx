// Copyright 2024 fenduf
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

import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    //
    Popup,
    Image,
    ImageUploader,
    Button,
    Space,
    Toast,
    Divider,
    Slider,
} from "antd-mobile";
import {
    //
    ArrowsAltOutline,
    UndoOutline,
    UserCircleOutline,
} from "antd-mobile-icons";
import AvatarEditor from "react-avatar-editor";
import { upload } from "@/utils/assets";
import {
    //
    handleError,
    handleResponse,
} from "@/utils/message";
import { ClientContext } from "@/contexts/client";
import { type TCuid } from "@/types/response";
import { uid2path } from "@/utils/image";

export default function AvatarEditorPopup({
    //
    avatar,
    visible,
    updateAvatar,
    onClose,
}: {
    avatar: TCuid | null;
    visible: boolean;
    updateAvatar: (avatar: TCuid | null) => any;
    onClose: () => any;
}): JSX.Element {
    const { t } = useTranslation();

    const { trpc } = useContext(ClientContext);

    const [scale, setScale] = useState(1);
    const [rotate, setRotate] = useState(0);
    const [onEditing, setOnEditing] = useState(false);
    const [editingAvatar, setEditingAvatar] = useState<File>();

    const editor = useRef<AvatarEditor>(null);

    /**
     * 用户头像更换
     */
    async function saveImg() {
        if (editor) {
            const canvas = editor.current?.getImage();

            const blob = await new Promise<Blob | null>((resolve) => canvas?.toBlob(resolve));

            try {
                if (blob) {
                    const formData = new FormData();

                    formData.append("file[]", blob);

                    const assets_upload = await upload(formData);

                    const avatars = assets_upload.data.successes.map((success: { uid: string }) => success.uid);
                    const avatar = avatars.at(0);
                    if (avatar) {
                        const response_update_info = await trpc.account.update_info.mutate({
                            avatar,
                        });
                        handleResponse(response_update_info);
                        updateAvatar(avatar);

                        Toast.show({
                            icon: "success",
                            content: t("actions.update-avatar.prompt.success.content"),
                        });
                    }
                }
            } catch (error) {
                handleError(error);
            }
        }
    }

    return (
        <Popup
            showCloseButton={true}
            closeOnSwipe={true}
            bodyStyle={{
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
            }}
            visible={visible}
            onClose={onClose}
            onMaskClick={onClose}
        >
            {onEditing ? (
                <div className="flex flex-col items-center">
                    {/* REF: https://www.npmjs.com/package/react-avatar-editor */}
                    <AvatarEditor
                        ref={editor}
                        image={editingAvatar as File}
                        width={256}
                        height={256}
                        border={16}
                        borderRadius={128}
                        scale={scale}
                        rotate={rotate}
                    />
                    <Slider
                        style={{
                            width: "85vw",
                        }}
                        min={10}
                        max={200}
                        step={5}
                        defaultValue={scale * 100}
                        icon={<ArrowsAltOutline />}
                        ticks
                        popover={(value) => {
                            return `${value}%`;
                        }}
                        onChange={(value) => {
                            if (Array.isArray(value)) {
                                setScale(value[0] / 100);
                            } else {
                                setScale(value / 100);
                            }
                        }}
                    />
                    <Slider
                        style={{
                            width: "85vw",
                        }}
                        min={0}
                        max={360}
                        step={1}
                        defaultValue={rotate}
                        icon={<UndoOutline />}
                        popover={(value) => {
                            return `${value}°`;
                        }}
                        onChange={(value) => {
                            if (Array.isArray(value)) {
                                setRotate(value[0]);
                            } else {
                                setRotate(value);
                            }
                        }}
                    />
                    <Space className="flex items-center justify-center mt-12">
                        <Button
                            color="primary"
                            fill="none"
                            onClick={() => {
                                setOnEditing(false);
                                onClose();
                            }}
                        >
                            {t("cancel")}
                        </Button>
                        <Button
                            color="primary"
                            fill="none"
                            onClick={() => {
                                saveImg();
                                onClose();
                            }}
                        >
                            {t("confirm")}
                        </Button>
                    </Space>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <Image
                        src={avatar ? uid2path(avatar) : "/static/avatar.png"}
                        width="50vw"
                        fit="fill"
                    />
                    <Divider />
                    <ImageUploader
                        upload={async (file) => {
                            setEditingAvatar(file);
                            setOnEditing(true);
                            return {
                                url: "",
                            };
                        }}
                    >
                        <Button
                            color="primary"
                            fill="outline"
                        >
                            <UserCircleOutline />
                            {t("actions.upload-avatar.text")}
                        </Button>
                    </ImageUploader>
                </div>
            )}
        </Popup>
    );
}
