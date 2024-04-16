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

import { Space } from "antd";
import { FileTextOutlined, FileSyncOutlined, FileDoneOutlined } from "@ant-design/icons";
import { TimeMessage } from "@/types/definitions";
import dayjs from "dayjs";

export default function TimeList(state: "success" | "fail" | "waiting", submissionTime: string, modificationTime: string, approvalTime: string): JSX.Element[] {
    let timeBar = [
        <Space>
            <FileTextOutlined />
            {`提交时间:${dayjs(submissionTime).format("YYYY-MM-DD HH:mm")}`}
        </Space>,
        <Space>
            <FileSyncOutlined />
            {`更改时间:${dayjs(modificationTime).format("YYYY-MM-DD HH:mm")}`}
        </Space>,
    ];

    if (state != "waiting") {
        timeBar.push(
            <Space>
                <FileDoneOutlined />
                {`审核时间:${dayjs(approvalTime).format("YYYY-MM-DD HH:mm")}`}
            </Space>,
        );
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
