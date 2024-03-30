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
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Input, Flex, Radio, Divider, RadioChangeEvent, Select } from "antd";
import ExamineList from "../../../ui/examine-list";
import { fetchItemData } from "../../../lib/data";
import { TravelNote } from "../../../lib/definitions";
import { CheckCircleFilled, ExclamationCircleFilled, CloseCircleFilled } from "@ant-design/icons";

const { Search } = Input;

export default function ContentPage() {
    const [loading, setLoading] = useState<boolean>(true);

    const allItems = useRef<TravelNote[]>([]);

    const [displayItems, setDisplayItems] = useState<TravelNote[]>(new Array(5).fill({}));

    useEffect(() => {
        (async () => {
            allItems.current = await fetchItemData();
            fliterItems(allItems.current, "waiting");
            setLoading(false);
        })();
    }, []);

    function fliterItems(items: TravelNote[], state: "success" | "waiting" | "fail") {
        setDisplayItems(items.filter((value) => value.state === state));
    }

    return (
        <>
            <Flex
                justify="space-between"
                align="center"
                className="px-6"
            >
                <Radio.Group
                    defaultValue={"waiting"}
                    onChange={(e: RadioChangeEvent) => {
                        fliterItems(allItems.current, e.target.value);
                    }}
                >
                    <Radio.Button value="waiting">
                        <ExclamationCircleFilled className="mr-2" />
                        待审核
                    </Radio.Button>
                    <Radio.Button value="success">
                        <CheckCircleFilled className="mr-2" />
                        已通过
                    </Radio.Button>
                    <Radio.Button value="fail">
                        <CloseCircleFilled className="mr-2" />
                        未通过
                    </Radio.Button>
                </Radio.Group>

                <Search
                    addonBefore={
                        <Select
                        defaultValue="lucy"
                        style={{ width: 80 }}
                        options={[
                          { value: 'title', label: '标题' },
                          { value: 'content', label: '内容' },
                          { value: 'userName', label: '用户' },
                          { value: 'time', label: '时间' },
                        ]}
                      />
                    }
                    placeholder="input search loading default"
                    size="large"
                    style={{ width: "300px" }}
                />
            </Flex>
            <Divider />
            <ExamineList
                data={displayItems}
                loading={loading}
            />
        </>
    );
}
