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
    useRef,
    useState,
    useEffect,
    useContext,
} from "react";
import { useTranslation } from "react-i18next";

import {
    //
    Button,
    Form,
    Input,
    Popup,
    Toast,
    Dialog,
    type InputRef,
} from "antd-mobile";
import {
    //
    EyeInvisibleOutline,
    EyeOutline,
} from "antd-mobile-icons";

import { ClientContext } from "@/contexts/client";
import { useStore } from "@/contexts/store";
import { closeAccount } from "@/utils/account";
import { handleError } from "@/utils/message";
import {
    //
    createPassphraseRules,
    createUsernameRules,
} from "./input-rules";

/**
 * 用户 删除账户 弹出层
 * @param accountName 当前用户的账户名
 * @param visible 是否显示弹出层
 * @param onSuccess 更改密码成功的回调函数
 * @param onClose 弹出层关闭回调函数
 */
export function DeleteAccountPopup({
    //
    accountName,
    visible,
    onSuccess,
    onClose,
}: {
    accountName: string;
    visible: boolean;
    onSuccess: () => any;
    onClose: () => any;
}): JSX.Element {
    const { t } = useTranslation();
    const { trpc } = useContext(ClientContext);

    const [loading, setLoading] = useState<boolean>(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const username = useRef<InputRef>(null);
    const passphrase = useRef<InputRef>(null);

    useEffect(() => {
        username.current?.clear();
        passphrase.current?.clear();

        setPasswordVisible(false);
    }, [visible]);

    async function onFinish(values: {
        //
        username: string;
        passphrase: string;
    }) {
        // console.debug(values);
        setLoading(true);

        try {
            // 二次确认
            const confirm1 = await new Promise<boolean>((resolve) => {
                // REF: https://mobile.ant.design/zh/components/dialog#dialogshow
                const handler = Dialog.show({
                    title: "(1/2) " + t("actions.delete-account.actions.confirm1.title", { name: accountName }),
                    content: t("actions.delete-account.actions.confirm1.content"),
                    actions: [
                        [
                            {
                                key: "cancel",
                                text: t("cancel"),
                                onClick: () => {
                                    handler.close();
                                    resolve(false);
                                },
                            },
                            {
                                key: "confirm",
                                text: t("confirm"),
                                onClick: () => {
                                    handler.close();
                                    resolve(true);
                                },
                                bold: true,
                                danger: true,
                            },
                        ],
                    ],
                });
            });
            if (!confirm1) {
                setLoading(false);
                onClose();
                return;
            }

            // 三次确认
            const confirm2 = await new Promise<boolean>((resolve) => {
                const handler = Dialog.show({
                    title: "(2/2) " + t("actions.delete-account.actions.confirm1.title", { name: accountName }),
                    content: t("actions.delete-account.actions.confirm2.content"),
                    actions: [
                        [
                            {
                                key: "cancel",
                                text: t("cancel"),
                                onClick: () => {
                                    handler.close();
                                    resolve(false);
                                },
                            },
                            {
                                key: "delete",
                                text: t("delete"),
                                onClick: () => {
                                    handler.close();
                                    resolve(true);
                                },
                                bold: true,
                                danger: true,
                            },
                        ],
                    ],
                });
            });
            if (!confirm2) {
                setLoading(false);
                onClose();
                return;
            }

            /* 删除账户 */
            const response = await closeAccount(values, trpc);
            switch (response.code) {
                case 0:
                    Toast.show({
                        icon: "success",
                        content: t("actions.delete-account.prompt.success.content"),
                    });
                    onSuccess();
                    onClose();
                    break;

                case 20:
                    throw new Error(t("actions.delete-account.prompt.username-incorrect.content"));

                case 30:
                    throw new Error(t("actions.delete-account.prompt.password-incorrect.content"));

                default:
                    console.error(response);
                    throw new Error(response.message);
            }
        } catch (error) {
            handleError(error);
        }

        setLoading(false);
    }

    const username_rules = createUsernameRules(t);
    const passphrase_rules = createPassphraseRules(t);

    return (
        <Popup
            visible={visible}
            showCloseButton={true}
            closeOnSwipe={true}
            bodyStyle={{
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
            }}
            onClose={onClose}
            onMaskClick={onClose}
        >
            <Form
                layout="horizontal"
                mode="card"
                onFinish={onFinish}
                footer={
                    <Button
                        block
                        type="submit"
                        color="danger"
                        loading={loading}
                    >
                        {t("actions.delete-account.text")}
                    </Button>
                }
            >
                <Form.Header>{t("input.current-account.label")}</Form.Header>
                <Form.Item
                    label={t("username")}
                    name="username"
                    // @ts-ignore
                    rules={username_rules}
                >
                    <Input
                        ref={username}
                        placeholder={t("input.username.placeholder")}
                    />
                </Form.Item>
                <Form.Item
                    label={t("password")}
                    name="passphrase"
                    // @ts-ignore
                    rules={passphrase_rules}
                    extra={
                        <div className="flex-none ml-8 cursor-pointer">
                            {passwordVisible ? ( //
                                <EyeOutline onClick={() => setPasswordVisible(false)} />
                            ) : (
                                <EyeInvisibleOutline onClick={() => setPasswordVisible(true)} />
                            )}
                        </div>
                    }
                >
                    <Input
                        ref={passphrase}
                        className="flex-auto"
                        placeholder={t("input.password.placeholder")}
                        type={passwordVisible ? "text" : "password"}
                    />
                </Form.Item>
            </Form>
        </Popup>
    );
}
export default DeleteAccountPopup;
