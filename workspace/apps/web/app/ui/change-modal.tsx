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

import { Button, Modal, Form, Input, Toast } from "antd-mobile";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons";
import { changePassword } from "@/utils/account";
import { AuthContext } from "@/contexts/authContext";
import { handleResponse } from "@/utils/help";

export default function ChangeModal({ isModalOpen, setIsModalOpen }: { isModalOpen: boolean; setIsModalOpen: Function }): JSX.Element {
    const { t, i18n } = useTranslation();

    const [passwordVisible, setPasswordVisible] = useState(false);

    // const [visible, setVisible] = useState(true);

    const [loading, setLoading] = useState<boolean>(false);

    const { user, userInfo } = useContext(AuthContext);

    const onFinish = async (values: { orgPassword: string; newPassword: string }) => {
        setLoading(true);

        if (values.orgPassword === values.newPassword) {
            Toast.show({
                icon: "fail",
                content: "密码不能一样",
            });

            setLoading(false);

            return;
        }

        let response = await changePassword({ username: userInfo.current?.username, passphrase1: values.orgPassword, passphrase2: values.newPassword }, user.current);

        if (handleResponse(response).state === "success") {
            Toast.show({
                icon: "success",
                content: "修改成功",
            });

            setIsModalOpen(false);
        } else {
            Toast.show({
                icon: "fail",
                content: "修改失败",
            });
        }

        setLoading(false);
    };

    return (
        <Modal
            title="修改密码"
            visible={isModalOpen}
            closeOnMaskClick={true}
            showCloseButton={true}
            content={
                <Form
                    layout="horizontal"
                    mode="card"
                    onFinish={onFinish}
                    footer={
                        <Button
                            block
                            type="submit"
                            color="primary"
                            loading={loading}
                        ></Button>
                    }
                >
                    <Form.Item
                        label="原密码"
                        name="orgPassword"
                        rules={[
                            { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/, message: "密码必须必须包含数字、字母,且6-10位" },
                            { required: true, message: "请输入密码" },
                        ]}
                        className="flex justify-items-center"
                    >
                        <div className="flex items-center">
                            <Input
                                className="flex-auto"
                                placeholder="请输入密码"
                                type={passwordVisible ? "text" : "password"}
                            />
                            <div className="flex-none ml-8 cursor-pointer">{!passwordVisible ? <EyeInvisibleOutline onClick={() => setPasswordVisible(true)} /> : <EyeOutline onClick={() => setPasswordVisible(false)} />}</div>
                        </div>
                    </Form.Item>

                    <Form.Item
                        label="新密码"
                        name="newPassword"
                        rules={[
                            { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,10}$/, message: "密码必须必须包含数字、字母,且6-10位" },
                            { required: true, message: "请输入密码" },
                        ]}
                        className="flex justify-items-center"
                    >
                        <div className="flex items-center">
                            <Input
                                className="flex-auto"
                                placeholder="请输入密码"
                                type={passwordVisible ? "text" : "password"}
                            />
                            <div className="flex-none ml-8 cursor-pointer">{!passwordVisible ? <EyeInvisibleOutline onClick={() => setPasswordVisible(true)} /> : <EyeOutline onClick={() => setPasswordVisible(false)} />}</div>
                        </div>
                    </Form.Item>
                </Form>
            }
        ></Modal>
    );
}
