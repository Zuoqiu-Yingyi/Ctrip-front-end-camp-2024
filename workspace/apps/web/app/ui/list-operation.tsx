// Copyright 2024 wu
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
import React, { useContext } from "react";
import { Input, Flex, Radio, Select, RadioChangeEvent } from "antd";
import { CheckCircleFilled, ExclamationCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { MessageContext } from "@/context/messageContext";
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
