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
    type InputRef,
} from "antd-mobile";
import {
    //
    EyeInvisibleOutline,
    EyeOutline,
} from "antd-mobile-icons";

import { ClientContext } from "@/contexts/client";
import { changePassword } from "@/utils/account";
import { handleError } from "@/utils/message";
import { createPassphraseRules } from "./input-rules";

/**
 * 用户更改密码弹出层
 * @param accountName 当前用户的账户名
 * @param visible 是否显示弹出层
 * @param onSuccess 更改密码成功的回调函数
 * @param onClose 弹出层关闭回调函数
 */
export function ChangePasswordPopup({
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
    const [oldPassphraseVisible, setOldPassphraseVisible] = useState(false);
    const [newPassphraseVisible, setNewPassphraseVisible] = useState(false);

    const passphrase_old = useRef<InputRef>(null);
    const passphrase_new1 = useRef<InputRef>(null);
    const passphrase_new2 = useRef<InputRef>(null);

    useEffect(() => {
        passphrase_old.current?.clear();
        passphrase_new1.current?.clear();
        passphrase_new1.current?.clear();

        setOldPassphraseVisible(false);
        setNewPassphraseVisible(false);
    }, [visible]);

    async function onFinish(values: {
        //
        oldPassphrase: string;
        newPassphrase1: string;
        newPassphrase2: string;
    }) {
        // console.debug(values);
        setLoading(true);

        try {
            /* 校验第二次输入的密码 */
            if (values.newPassphrase1 !== values.newPassphrase2) {
                throw new Error(t("input.confirm-password.rules.inconsistent.message"));
            }

            const response = await changePassword(
                {
                    username: accountName,
                    oldPassphrase: values.oldPassphrase,
                    newPassphrase: values.newPassphrase1,
                },
                trpc,
            );
            switch (response.code) {
                case 0:
                    Toast.show({
                        icon: "success",
                        content: t("actions.confirm-password.prompt.success.content"),
                    });
                    onSuccess();
                    onClose();
                    break;
                case 20:
                    throw new Error(t("actions.confirm-password.prompt.username-incorrect.content"));
                case 30:
                    throw new Error(t("actions.confirm-password.prompt.password-incorrect.content"));
                default:
                    console.error(response);
                    throw new Error(response.message);
            }
        } catch (error) {
            handleError(error);
        }

        setLoading(false);
    }

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
                        color="primary"
                        loading={loading}
                    >
                        {t("actions.change-password.text")}
                    </Button>
                }
            >
                <Form.Header>{t("input.old-password.label")}</Form.Header>
                <Form.Item
                    label={t("input.old-password.label")}
                    name="oldPassphrase"
                    // @ts-ignore
                    rules={passphrase_rules}
                    extra={
                        <div className="flex-none ml-8 cursor-pointer">
                            {oldPassphraseVisible ? ( //
                                <EyeOutline onClick={() => setOldPassphraseVisible(false)} />
                            ) : (
                                <EyeInvisibleOutline onClick={() => setOldPassphraseVisible(true)} />
                            )}
                        </div>
                    }
                >
                    <Input
                        ref={passphrase_old}
                        className="flex-auto"
                        placeholder={t("input.old-password.placeholder")}
                        type={oldPassphraseVisible ? "text" : "password"}
                    />
                </Form.Item>
                <Form.Header>{t("input.new-password.label")}</Form.Header>
                <Form.Item
                    label={t("input.new-password.label")}
                    name="newPassphrase1"
                    // @ts-ignore
                    rules={passphrase_rules}
                    extra={
                        <div className="flex-none ml-8 cursor-pointer">
                            {newPassphraseVisible ? ( //
                                <EyeOutline onClick={() => setNewPassphraseVisible(false)} />
                            ) : (
                                <EyeInvisibleOutline onClick={() => setNewPassphraseVisible(true)} />
                            )}
                        </div>
                    }
                >
                    <Input
                        ref={passphrase_new1}
                        className="flex-auto"
                        placeholder={t("input.new-password.placeholder")}
                        type={newPassphraseVisible ? "text" : "password"}
                    />
                </Form.Item>
                <Form.Item
                    label={t("input.confirm-password.label")}
                    name="newPassphrase2"
                    // @ts-ignore
                    rules={passphrase_rules}
                    extra={
                        <div className="flex-none ml-8 cursor-pointer">
                            {newPassphraseVisible ? ( //
                                <EyeOutline onClick={() => setNewPassphraseVisible(false)} />
                            ) : (
                                <EyeInvisibleOutline onClick={() => setNewPassphraseVisible(true)} />
                            )}
                        </div>
                    }
                >
                    <Input
                        ref={passphrase_new2}
                        className="flex-auto"
                        placeholder={t("input.confirm-password.placeholder")}
                        type={newPassphraseVisible ? "text" : "password"}
                    />
                </Form.Item>
            </Form>
        </Popup>
    );
}
export default ChangePasswordPopup;
