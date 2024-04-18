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

import { useContext, useEffect, useState } from "react";
import { Card, Typography, Col, Row } from "antd";
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, MinusCircleOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { CardMessage, TravelNote } from "@/types/definitions";
import { ClientContext } from "@/contexts/client";
import { getReviewCount } from "@/utils/review";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export default function CardWrapper(): JSX.Element {
    const { trpc } = useContext(ClientContext);
    
    const { t } = useTranslation();

    const CARD_MESSAGES: CardMessage[] = [
        {
            type: "success",
            icon: <CheckCircleOutlined className="mr-3" />,
            text: t("approved"),
            numberName: "success",
        },
        {
            type: "danger",
            icon: <CloseCircleOutlined className="mr-3" />,
            text: t("rejected"),
            numberName: "fail",
        },
        {
            type: "warning",
            icon: <ExclamationCircleOutlined className="mr-3" />,
            text: t("pending"),
            numberName: "waiting",
        },
        {
            type: "secondary",
            icon: <MinusCircleOutlined className="mr-3" />,
            text: t("total"),
            numberName: "total",
        },
    ];

    const [loading, setLoading] = useState(true);

    const [updateTime, setUpdateTime] = useState<Date>();

    const [cardNumbers, setCardNumbers] = useState({
        success: 0,
        fail: 0,
        waiting: 0,
        total: 0,
    });

    async function upadteNumbers() {
        let temp = {
            success: 0,
            fail: 0,
            waiting: 0,
            total: 0,
        };

        await Promise.all(
            ["success" as TravelNote["state"], "fail" as TravelNote["state"], "waiting" as TravelNote["state"]].map((state) =>
                getReviewCount(state, trpc).then((vaule) => {
                    temp[state] = vaule as number;

                    temp.total += vaule as number;
                }),
            ),
        );

        setCardNumbers(temp);

        setUpdateTime(new Date());

        setLoading(false);
    }

    useEffect(() => {
        upadteNumbers();

        const timer = setInterval(() => {
            // await upadteNumbers();

            (async () => {
                await upadteNumbers();
                // let temp = {
                //     success: 0,
                //     fail: 0,
                //     waiting: 0,
                //     total: 0,
                // };

                // await Promise.all(
                //     ["success" as TravelNote["state"], "fail" as TravelNote["state"], "waiting" as TravelNote["state"]].map((state) =>
                //         getReviewCount(state, trpc).then((vaule) => {
                //             temp[state] = vaule as number;

                //             temp.total += vaule as number;
                //         }),
                //     ),
                // );
                // setCardNumbers(temp);

                // setLoading(false);
            })();
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div>
            <Title
                level={5}
                className="mt-0"
            >
                <FieldTimeOutlined />
                {t("update-time") + dayjs(updateTime).format("YYYY-MM-DD HH:mm")}
            </Title>

            <Row
                gutter={[32, 32]}
                style={{ flex: 1 }}
            >
                {CARD_MESSAGES.map((cardMessage, index) => (
                    <Col
                        span={12}
                        key={`card_${index}`}
                    >
                        <NumberCard
                            type={cardMessage.type}
                            icon={cardMessage.icon}
                            text={cardMessage.text}
                            number={cardNumbers[cardMessage.numberName || "fail"]}
                            loading={loading}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
}

export function NumberCard({ type, icon, text, loading, number }: CardMessage): JSX.Element {
    return (
        <Card
            className="h-56"
            title={
                <Title
                    level={5}
                    type={type}
                    style={{ margin: 0 }}
                >
                    {icon}
                    {text}
                </Title>
            }
            loading={loading}
        >
            <Title
                className="text-center"
                level={2}
            >
                {number}
            </Title>
        </Card>
    );
}
