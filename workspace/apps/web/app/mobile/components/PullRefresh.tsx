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

import { PullToRefresh } from "antd-mobile";
import { useTranslation } from "react-i18next";

/**
 * 下拉刷新
 * @param onRefresh 刷新回调
 */
export function PullRefresh({
    //
    onRefresh,
    children,
}: {
    onRefresh?: () => Promise<any>;
    children: React.ReactNode;
}): JSX.Element {
    const { t } = useTranslation();

    return (
        <PullToRefresh
            onRefresh={onRefresh}
            renderText={(status) => {
                switch (status) {
                    case "pulling":
                        return t("pull-status.pulling");
                    case "canRelease":
                        return t("pull-status.canRelease");
                    case "refreshing":
                        return t("pull-status.refreshing");
                    case "complete":
                        return t("pull-status.complete");
                }
            }}
        >
            {children}
        </PullToRefresh>
    );
}
export default PullRefresh;
