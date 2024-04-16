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

import React, { useContext } from "react";
import { Input, Flex, Radio, Select, RadioChangeEvent } from "antd";
import { CheckCircleFilled, ExclamationCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { MessageContext } from "@/contexts/messageContext";
import { useTranslation } from "react-i18next";

const { Search } = Input;

export default function ListOperationBar(): JSX.Element {
    const { t, i18n } = useTranslation();

    const { setPageState, togglePageState, searchItem } = useContext(MessageContext);

    return (
        <Flex
            justify="space-between"
            align="center"
            className="px-6"
        >
            <Radio.Group
                defaultValue={"waiting"}
                onChange={async (e: RadioChangeEvent) => {
                    setPageState(e.target.value);
                    await togglePageState(e.target.value);
                }}
            >
                <Radio.Button value="waiting">
                    <ExclamationCircleFilled className="mr-2" />
                    {t("pending")}
                </Radio.Button>
                <Radio.Button value="success">
                    <CheckCircleFilled className="mr-2" />
                    {t("approved")}
                </Radio.Button>
                <Radio.Button value="fail">
                    <CloseCircleFilled className="mr-2" />
                    {t("rejected")}
                </Radio.Button>
            </Radio.Group>

            <Search
                addonBefore={
                    <Select
                        defaultValue="title"
                        style={{ width: 80 }}
                        options={[
                            { value: "title", label: t("item-title") },
                            { value: "content", label: t("item-content") },
                            { value: "userName", label: t("item-time") },
                            { value: "time", label: t("item-user") },
                        ]}
                    />
                }
                placeholder="input search loading default"
                size="large"
                style={{ width: "300px" }}
                onSearch={(value) => {
                    searchItem("title", value);
                }}
            />
        </Flex>
    );
}
