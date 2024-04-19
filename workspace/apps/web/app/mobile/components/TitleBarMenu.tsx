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

import { Space } from "antd-mobile";

export function TitleBarMenu({
    //
    children,
}: {
    children: React.ReactNode;
}): JSX.Element {
    return (
        <div style={{ fontSize: 24 }}>
            <Space style={{ "--gap": "16px" }}>{children}</Space>
        </div>
    );
}
export default TitleBarMenu;
