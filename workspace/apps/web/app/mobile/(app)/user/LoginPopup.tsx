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
    Tabs,
    Toast,
    Checkbox,
    type InputRef,
} from "antd-mobile";
import {
    //
    EyeInvisibleOutline,
    EyeOutline,
} from "antd-mobile-icons";

import { ClientContext } from "@/contexts/client";
import { useStore } from "@/contexts/store";
import {
    //
    login,
    signup,
} from "@/utils/account";
import { handleError } from "@/utils/message";

/**
 * 选项卡键值
 */
export enum TabKey {
    login = "login",
    signup = "signup",
}

/**
 * 用户名正则表达式
 * 支持大小写英文字母, 数字, 短横线与下划线
 */
const USERNAME_PATTERN = /^[0-9a-zA-Z\-\_]+$/;

/**
 * 用户口令正则表达式
 * 支持所有可视的 ASCII 字符
 */
const PASSPHRASE_PATTERN = /^[\x21-\x7E]+$/;

/**
 * 用户 登录/注册 弹出层
 * @param visible 是否显示弹出层
 * @param onClose 弹出层关闭回调函数
 */
export function LoginPopup({
    //
    visible,
    onClose,
}: {
    visible: boolean;
    onClose: () => any;
}): JSX.Element {
    const { t } = useTranslation();
    const { trpc } = useContext(ClientContext);
    const updateUser = useStore((state) => state.updateUser);

    const [loading, setLoading] = useState<boolean>(false);
    const [activeTabKey, setActiveTabKey] = useState(TabKey.login);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const username = useRef<InputRef>(null);
    const passphrase1 = useRef<InputRef>(null);
    const passphrase2 = useRef<InputRef>(null);

    useEffect(() => {
        // console.debug(visible);

        // if (visible) {
        //     username.current?.focus();
        // }

        passphrase1.current?.clear();
        passphrase1.current?.clear();
    }, [visible]);

    async function onFinish(values: {
        //
        username: string;
        password: string;
        keep?: boolean;
        passwordVerify?: string;
    }) {
        // console.debug(values);
        setLoading(true);

        try {
            switch (activeTabKey) {
                case TabKey.login: {
                    const response = await login(
                        {
                            username: values.username,
                            passphrase: values.password,
                            keep: values.keep,
                        },
                        trpc,
                    );
                    switch (response.code) {
                        case 0:
                            /* 保存用户信息 */
                            updateUser({
                                loggedIn: true,
                                ...response.data!.account,
                            });

                            Toast.show({
                                icon: "success",
                                content: t("actions.login.prompt.success.content"),
                            });
                            onClose();
                            break;

                        case 20:
                            throw new Error(t("actions.login.prompt.incorrect.content"));

                        default:
                            console.error(response);
                            throw new Error(response.message);
                    }
                    break;
                }

                case TabKey.signup: {
                    /* 校验第二次输入的密码 */
                    if (values.password !== values.passwordVerify) {
                        throw new Error(t("input.confirm-password.rules.inconsistent.message"));
                    }

                    /* 注册用户 */
                    const response = await signup(
                        {
                            username: values.username,
                            passphrase: values.password,
                        },
                        trpc,
                    );
                    switch (response.code) {
                        case 0:
                            Toast.show({
                                icon: "success",
                                content: t("actions.signup.prompt.success.content"),
                            });
                            setActiveTabKey(TabKey.login);
                            break;

                        case 20:
                            throw new Error(t("actions.login.prompt.incorrect.content"));

                        default:
                            console.error(response);
                            throw new Error(response.message);
                    }
                    break;
                }

                default:
                    throw new Error("Invalid tab key");
            }
        } catch (error) {
            handleError(error);
        }

        setLoading(false);
    }

    return (
        <Popup
            visible={visible}
            showCloseButton={true}
            closeOnSwipe={true}
            onClose={onClose}
            onMaskClick={onClose}
        >
            <Tabs
                activeKey={activeTabKey}
                onChange={(key) => setActiveTabKey(key as TabKey)}
            >
                <Tabs.Tab
                    title={t("login")}
                    key={TabKey.login}
                />
                <Tabs.Tab
                    title={t("signup")}
                    key={TabKey.signup}
                />
            </Tabs>
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
                        {activeTabKey === TabKey.login ? t("login") : t("signup")}
                    </Button>
                }
            >
                <Form.Header />
                <Form.Item
                    label={t("username")}
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: t("input.username.rules.required.message"),
                        },
                        {
                            min: 2,
                            max: 32,
                            message: t("input.username.rules.length.message"),
                        },
                        {
                            pattern: USERNAME_PATTERN,
                            message: t("input.username.rules.pattern.message"),
                        },
                    ]}
                >
                    <Input
                        ref={username}
                        placeholder={t("input.username.placeholder")}
                    />
                </Form.Item>
                <Form.Item
                    label={t("password")}
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: t("input.password.rules.required.message"),
                        },
                        {
                            min: 8,
                            message: t("input.password.rules.length.message"),
                        },
                    ]}
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
                        ref={passphrase1}
                        className="flex-auto"
                        placeholder={t("input.password.placeholder")}
                        type={passwordVisible ? "text" : "password"}
                    />
                </Form.Item>
                {activeTabKey === TabKey.login && (
                    <Form.Item name="keep">
                        <Checkbox>{t("keep-login")}</Checkbox>
                    </Form.Item>
                )}
                {activeTabKey === TabKey.signup && (
                    <Form.Item
                        label={t("input.confirm-password.label")}
                        name="passwordVerify"
                        rules={[
                            {
                                required: true,
                                message: t("input.password.rules.required.message"),
                            },
                            {
                                min: 8,
                                message: t("input.password.rules.length.message"),
                            },
                        ]}
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
                            ref={passphrase2}
                            className="flex-auto"
                            placeholder={t("input.confirm-password.placeholder")}
                            type={passwordVisible ? "text" : "password"}
                        />
                    </Form.Item>
                )}
                <Form.Header />
            </Form>
        </Popup>
    );
}
export default LoginPopup;
