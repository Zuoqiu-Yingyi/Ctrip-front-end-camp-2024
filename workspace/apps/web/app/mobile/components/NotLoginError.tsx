/**
 * Copyright (C) 2024 Zuoqiu Yingyi
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

import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

import {
    //
    Button,
    Space,
    createErrorBlock,
} from "antd-mobile";
import { UserContactOutline } from "antd-mobile-icons";
import { PATHNAME } from "@/utils/pathname";

const ErrorBlock = createErrorBlock({
    default: "/icons/not-login.svg",
    empty: "/icons/not-login.svg",
});

export function NotLoginError({
    //
    title,
    description,
    children,
}: {
    title?: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
}): JSX.Element {
    const { t } = useTranslation();
    const router = useRouter();

    return (
        <ErrorBlock
            title={title ?? t("status.not-login.title")}
            description={
                description ?? (
                    <Button
                        size="mini"
                        color="primary"
                        fill="outline"
                        onClick={() => router.replace(PATHNAME.mobile.user)}
                    >
                        <Space>
                            <UserContactOutline />
                            <span>{t("status.not-login.description")}</span>
                        </Space>
                    </Button>
                )
            }
            style={{
                color: "var(--adm-color-primary)",
            }}
        >
            {children}
        </ErrorBlock>
    );
}
export default NotLoginError;
