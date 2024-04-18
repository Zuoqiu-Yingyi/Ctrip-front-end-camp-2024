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
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { CardMessage, TravelNote } from "@/types/definitions";
import { AuthContext } from "@/contexts/authContext";
import { getReviewCount } from "@/utils/review";

const { Title } = Typography;

const CARD_MESSAGES: CardMessage[] = [
    {
        type: "success",
        icon: <CheckCircleOutlined className="mr-3" />,
        text: "已通过",
        numberName: "success",
    },
    {
        type: "danger",
        icon: <CloseCircleOutlined className="mr-3" />,
        text: "未通过",
        numberName: "fail",
    },
    {
        type: "warning",
        icon: <ExclamationCircleOutlined className="mr-3" />,
        text: "待审核",
        numberName: "waiting",
    },
    {
        type: "secondary",
        icon: <MinusCircleOutlined className="mr-3" />,
        text: "总数",
        numberName: "total",
    },
];

export default function CardWrapper(): JSX.Element {
    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);

    const [cardNumbers, setCardNumbers] = useState({
        success: 0,
        fail: 0,
        waiting: 0,
        total: 0,
    });

    useEffect(() => {
        (async () => {
            let temp = {
                success: 0,
                fail: 0,
                waiting: 0,
                total: 0,
            };

            await Promise.all(
                ["success" as TravelNote["state"], "fail" as TravelNote["state"], "waiting" as TravelNote["state"]].map((state) =>
                    getReviewCount(state, user.current).then((value) => {
                        temp[state] = value as number;

                        temp.total += value as number;
                    }),
                ),
            );
            setCardNumbers(temp);

            setLoading(false);
        })();
    }, []);

    return (
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
