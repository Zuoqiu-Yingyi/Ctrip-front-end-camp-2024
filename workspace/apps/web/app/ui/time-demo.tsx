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
import { Space } from "antd";
import { FileTextOutlined, FileSyncOutlined, FileDoneOutlined } from "@ant-design/icons";
import { TimeMessage } from "@/app/lib/definitions";

const TIME_PRE: TimeMessage[] = [
    { name: "publish-time", icon: <FileTextOutlined />, text: "发布时间：" },
    { name: "change-time", icon: <FileSyncOutlined />, text: "更改时间：" },
    { name: "examine-time", icon: <FileDoneOutlined />, text: "审核时间：" },
];

export default function TimeList(): JSX.Element[] {
    return TIME_PRE.map((pre) => (
        <TimeDemo
            icon={pre.icon}
            text={pre.text}
            time="12:00"
            key={pre.name}
        />
    ));
}

export function TimeDemo({ icon, text, time }: TimeMessage): JSX.Element {
    return (
        <Space>
            {icon}
            {text}
            {time}
        </Space>
    );
}
