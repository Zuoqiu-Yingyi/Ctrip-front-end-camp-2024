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

import { Mask, Image, ImageUploader, Button, Space, Toast } from "antd-mobile";
import { UserCircleOutline } from "antd-mobile-icons";
import { useContext, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { upload } from "@/utils/assets";
import { useTranslation } from "react-i18next";
import { handleError, handleResponse } from "@/utils/message";
import { ClientContext } from "@/contexts/client";
import { useStore } from "@/contexts/store";

export default function AvaterEditor({ avatar }: { avatar: string }): JSX.Element {
    const { t } = useTranslation();

    const { trpc } = useContext(ClientContext);    

    const [onEditing, setOnEditing] = useState(true);

    const [editingAvatar, setEditingAvatar] = useState<File>();

    const editor = useRef<AvatarEditor>(null);

    const {
        //
        user,
        updateUser,
    } = useStore.getState();

    /**
     * 用户头像更换
     */
    async function saveImg() {
        if (editor) {
            const canvas = editor.current?.getImage();

            const blob = await new Promise((resolve) => canvas?.toBlob(resolve));

            try {
                if (blob) {
                    const formData = new FormData();

                    formData.append("file[]", blob);

                    const assets_upload = await upload(formData);

                    const avatars = assets_upload.data.successes.map((success: { uid: string }) => success.uid);

                    for (const avatar of avatars) {
                        const response_update_info = await trpc.account.update_info.mutate({
                            avatar,
                        });
                    }

                    updateUser({ ...user, avatar: canvas?.toDataURL() ?? null });

                    Toast.show({
                        icon: "success",
                        content: t("actions.logout.prompt.success.content"),
                    });
                } else {
                    handleError(t("actions.login.prompt.incorrect.content"));
                }
            } catch (error) {
                handleError(t("actions.login.prompt.incorrect.content"));
            }
        }
    }

    return (
        <Mask
            // onMaskClick={() => setVisible(false)}
            opacity="thick"
            className="flex flex-col justify-center items-center"
            style={{
                display: "flex",
            }}
        >
            {onEditing ? (
                <div className="flex flex-col">
                    <AvatarEditor
                        ref={editor}
                        image={editingAvatar as File}
                        width={250}
                        height={250}
                        border={50}
                        color={[0, 0, 0, 0.5]} // RGBA
                        scale={2}
                        rotate={0}
                    />
                    <Space className="flex items-center justify-center mt-12">
                        <Button
                            color="primary"
                            fill="none"
                            onClick={() => {
                                setOnEditing(false);
                            }}
                        >
                            {t("cancel")}
                        </Button>
                        <Button
                            color="primary"
                            fill="none"
                            onClick={() => {
                                saveImg();
                            }}
                        >
                            {t("confirm")}
                        </Button>
                    </Space>
                </div>
            ) : (
                <div className="flex flex-col">
                    <Image
                        src={avatar ?? ""}
                        fit="fill"
                    />
                    <ImageUploader
                        upload={(file) => {
                            setEditingAvatar(file);

                            setOnEditing(true);

                            return new Promise(() => {});
                        }}
                        className="flex items-center justify-center mt-12"
                    >
                        <Button
                            block
                            fill="outline"
                            size="large"
                        >
                            <Space
                                style={{
                                    color: "white",
                                }}
                            >
                                <UserCircleOutline />
                                <span>更换头像</span>
                            </Space>
                        </Button>
                    </ImageUploader>
                </div>
            )}
        </Mask>
    );
}
