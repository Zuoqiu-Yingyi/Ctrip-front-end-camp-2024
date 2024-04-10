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

export default function TimeList(state: "success" | "fail" | "waiting"): JSX.Element[] {

    let timeBar = [
            <Space>
                <FileTextOutlined />
                提交时间： 12:00
            </Space>,
            <Space>
                <FileSyncOutlined />
                更改时间： 12:00
            </Space>             
    ]

    if (state != "waiting") {
        timeBar.push(
            <Space>
                <FileDoneOutlined />
                审核时间： 12:00
            </Space>  
        )
    }

    return timeBar;

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
