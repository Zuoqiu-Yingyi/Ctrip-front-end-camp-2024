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

"use client";
import { Flex } from "antd";
import CardWrapper from "@/ui/number-card";
import { Line } from "@ant-design/charts";
import dayjs from "dayjs";
import Title from "antd/es/typography/Title";
import { useTranslation } from "react-i18next";

export default function OverviewPage() {
    const { t } = useTranslation();

    var dateTime = new Date();

    dateTime = new Date(dateTime.setDate(dateTime.getDate() - 5));

    const data = Array.from({ length: 5 }, (_, index) => ({
        date: dayjs(new Date(dateTime.setDate(dateTime.getDate() + 1))).format("MM-DD"),
        value: index,
    }));

    const config = {
        data,
        height: 400,
        xField: "date",
        yField: "value",
    };

    return (
        <Flex>
            <CardWrapper />
            <div className="flex flex-1 flex-col justify-end items-center">
                <Title level={4}>{t("recent-submission-number")}</Title>
                <Line {...config} />
            </div>
        </Flex>
    );
}
