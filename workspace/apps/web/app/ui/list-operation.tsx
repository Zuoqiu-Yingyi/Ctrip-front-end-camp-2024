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
import React from "react";
import { Input, Flex, Radio, Select } from "antd";
import { CheckCircleFilled, ExclamationCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { useTranslation } from "@/app/i18n/client";

const { Search } = Input;


export default function ListOperationBar({ lng } : { lng: string }): JSX.Element {

    const { t } = useTranslation(lng);

    return (
        <Flex
            justify="space-between"
            align="center"
            className="px-6"
        >
            <Radio.Group
                defaultValue={"waiting"}
            >
                <Radio.Button value="waiting">
                    <ExclamationCircleFilled className="mr-2" />
                    {t('toBeAudited')}
                </Radio.Button>
                <Radio.Button value="success">
                    <CheckCircleFilled className="mr-2" />
                    {t('passed')}
                </Radio.Button>
                <Radio.Button value="fail">
                    <CloseCircleFilled className="mr-2" />
                    {t('failed')}
                </Radio.Button>
            </Radio.Group>

            <Search
                addonBefore={
                    <Select
                        defaultValue="title"
                        style={{ width: 80 }}
                        options={[
                            { value: "title", label: t('itemTitle') },
                            { value: "content", label: t('itemContent') },
                            { value: "userName", label: t('itemTime') },
                            { value: "time", label: t('itemUser') },
                        ]}
                    />
                }
                placeholder="input search loading default"
                size="large"
                style={{ width: "300px" }}
            />
        </Flex>
    );
}
