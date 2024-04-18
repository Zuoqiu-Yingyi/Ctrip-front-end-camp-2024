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

import {
    //
    List,
    Popup,
} from "antd-mobile";
import { ICoordinate } from "@/types/response";

/**
 * 定位信息弹出层
 * @param visible 是否显示弹出层
 * @param onClose 弹出层关闭回调函数
 */
export function CoordinateInfoPopup({
    //
    coordinate,
    visible,
    onClose,
}: {
    coordinate: ICoordinate | null;
    visible: boolean;
    onClose: () => any;
}): JSX.Element {
    const { t } = useTranslation();

    return (
        <Popup
            visible={visible}
            showCloseButton={true}
            closeOnSwipe={true}
            bodyStyle={{
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
            }}
            onClose={onClose}
            onMaskClick={onClose}
        >
            {coordinate && (
                <List header={t("labels.coordinate.title")}>
                    <List.Item
                        extra={coordinate.longitude}
                        arrow="°"
                    >
                        {t("labels.coordinate.longitude")}
                    </List.Item>
                    <List.Item
                        extra={coordinate.latitude}
                        arrow="°"
                    >
                        {t("labels.coordinate.latitude")}
                    </List.Item>
                    <List.Item
                        extra={coordinate.accuracy}
                        arrow="m"
                    >
                        {t("labels.coordinate.accuracy")}
                    </List.Item>
                    {coordinate.altitude && (
                        <List.Item
                            extra={coordinate.altitude}
                            arrow="m"
                        >
                            {t("labels.coordinate.altitude")}
                        </List.Item>
                    )}
                    {coordinate.altitude_accuracy && (
                        <List.Item
                            extra={coordinate.altitude_accuracy}
                            arrow="m"
                        >
                            {t("labels.coordinate.altitude_accuracy")}
                        </List.Item>
                    )}
                    {coordinate.heading && (
                        <List.Item
                            extra={coordinate.heading}
                            arrow="°"
                        >
                            {t("labels.coordinate.heading")}
                        </List.Item>
                    )}
                    {coordinate.speed && (
                        <List.Item
                            extra={coordinate.speed}
                            arrow="m/s"
                        >
                            {t("labels.coordinate.speed")}
                        </List.Item>
                    )}
                </List>
            )}
        </Popup>
    );
}
export default CoordinateInfoPopup;
